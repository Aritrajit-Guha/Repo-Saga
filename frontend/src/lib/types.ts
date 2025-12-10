import type { generateCodebaseMap } from '@/ai/flows/generate-codebase-map';
import type { generateComicBookScript } from '@/ai/flows/generate-comic-book-script';
import type { suggestFirstContributorTasks } from '@/ai/flows/suggest-first-contributor-tasks';
import { z } from 'zod';

// Types from AI flows
export type CodebaseMap = Awaited<ReturnType<typeof generateCodebaseMap>>;
export type ComicScript = Awaited<ReturnType<typeof generateComicBookScript>>;
export type StarterTasks = Awaited<ReturnType<typeof suggestFirstContributorTasks>>;

// Node and Edge types from the Zod schema in generate-codebase-map.ts
const MapNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.string(),
  files: z.array(z.string()),
  x: z.number(),
  y: z.number(),
  size: z.number(),
  tooltip: z.string(),
});
export type MapNode = z.infer<typeof MapNodeSchema>;

const MapEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  weight: z.number(),
  reason: z.string(),
});
export type MapEdge = z.infer<typeof MapEdgeSchema>;


export interface SagaData {
  map: CodebaseMap;
  comic: ComicScript;
  tasks: StarterTasks;
  readme: string;
}
