// src/app/saga/page.tsx
import { Suspense } from 'react';
import { SagaDashboard } from '@/components/saga-dashboard'; // Import the new client component
import { SagaLoading } from '@/components/saga-loading';
import { SagaData } from '@/lib/types';

// AI Flows & Utils
import { generateCodebaseMap } from '@/ai/flows/generate-codebase-map';
import { generateComicBookScript } from '@/ai/flows/generate-comic-book-script';
import { suggestFirstContributorTasks } from '@/ai/flows/suggest-first-contributor-tasks';
import { fetchRepoContext } from '@/lib/github-loader';
import { parseTOON } from '@/lib/toon-parser';

// --- FALLBACK MOCK DATA ---
const FALLBACK_SAGA: SagaData = {
  map: {
    meta: { repo: "Fallback/Demo-Mode", generated_at: new Date().toISOString() },
    nodes: [
      { id: 'auth', label: 'The Gatekeeper', type: 'module', files: ['src/auth.ts'], x: 50, y: 80, size: 5, tooltip: 'Guards the entrance.' },
      { id: 'core', label: 'The Citadel', type: 'module', files: ['src/app.ts'], x: 50, y: 50, size: 8, tooltip: 'The central logic.' },
      { id: 'db', label: 'Library of Knowledge', type: 'module', files: ['src/db.ts'], x: 20, y: 30, size: 6, tooltip: 'Stores ancient scrolls.' },
      { id: 'ui', label: 'The Village', type: 'module', files: ['src/components'], x: 80, y: 30, size: 6, tooltip: 'Where the people live.' },
    ],
    edges: [
      { from: 'auth', to: 'core', weight: 1, reason: 'Auth protects Core' },
      { from: 'core', to: 'db', weight: 1, reason: 'Core reads DB' },
      { from: 'core', to: 'ui', weight: 1, reason: 'Core feeds UI' },
    ],
    highlights: { complex_dragon: { node_id: 'core', file: 'src/app.ts', complexity_score: 99 } }
  },
  comic: {
    panels: [
      { id: 1, title: "The Arrival", narration: "Our hero arrives at the repository gates.", dialog: ["Hero: What is this place?", "System: Welcome to the codebase."], file: "README.md", snippet: "npm install", panel_goal: "Clone the repo." },
      { id: 2, title: "The Gatekeeper", narration: "A large figure blocks the path.", dialog: ["Gatekeeper: HALT! Do you have a token?", "Hero: I just wanted to fix a typo..."], file: "src/auth.ts", snippet: "if (!token) throw Error()", panel_goal: "Check auth logic." }
    ]
  },
  tasks: {
    tasks: [
      { title: "Fix the broken shield", description: "The auth module has a typo.", difficulty: 1, filesToEdit: ["src/auth.ts"], expectedOutcome: "Login works again." },
      { title: "Expand the village", description: "Add a new button component.", difficulty: 2, filesToEdit: ["src/ui/Button.tsx"], expectedOutcome: "New UI element." }
    ]
  },
  readme: "# Demo Mode Active\n\nWe switched to demo mode because the AI token limit was reached. This is simulated data."
};

async function getSagaData(repoUrl: string): Promise<SagaData> {
  console.log('Starting Saga analysis for:', repoUrl);

  try {
    const repoData = await fetchRepoContext(repoUrl);

    const [map, tasks] = await Promise.all([
      generateCodebaseMap({ 
        repoName: repoData.name, 
        description: repoData.description,
        fileList: repoData.fileList 
      }),
      suggestFirstContributorTasks({
        repoDescription: repoData.description,
        modulePurposes: "General Architecture",
        fileList: repoData.fileList,
        targetAudience: "New Contributor"
      })
    ]);

    const modulePersonas = map.nodes.map(n => `${n.label}: ${n.tooltip}`).join('\n');

    const toonOutput = await generateComicBookScript({
      repoDescription: repoData.description,
      modulePersonas,
      codeSnippets: repoData.readme.slice(0, 500),
    });

    const comic = parseTOON(toonOutput);

    return { map, comic, tasks, readme: repoData.readme };

  } catch (error) {
    console.error("AI/GitHub Exhausted, switching to Fallback:", error);
    return { 
      ...FALLBACK_SAGA, 
      map: { ...FALLBACK_SAGA.map, meta: { ...FALLBACK_SAGA.map.meta, repo: repoUrl + " (Demo)" } }
    };
  }
}

// Next.js 15 Async Props Pattern
interface SagaPageProps {
  searchParams: Promise<{
    repoUrl?: string;
  }>;
}

export default async function SagaPage(props: SagaPageProps) {
  const searchParams = await props.searchParams;
  const repoUrl = searchParams.repoUrl;

  if (!repoUrl) {
    // Basic error state if no URL
    return <div className="p-8 text-center">No Repo URL provided.</div>;
  }

  return (
    <Suspense fallback={<SagaLoading repoUrl={repoUrl} />}>
      {/* We wrap the data fetching in a server component wrapper 
         to allow Suspense to handle the async loading state 
      */}
      <SagaDataWrapper repoUrl={repoUrl} />
    </Suspense>
  );
}

// Inner component to perform the async fetch
async function SagaDataWrapper({ repoUrl }: { repoUrl: string }) {
  const data = await getSagaData(repoUrl);
  return <SagaDashboard data={data} repoUrl={repoUrl} />;
}