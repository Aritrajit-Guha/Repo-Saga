// src/lib/github-loader.ts
import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || undefined,
});

export interface RepoContext {
  name: string;
  description: string;
  fileList: string;
  readme: string;
  packageJson: string;
}

export async function fetchRepoContext(repoUrl: string): Promise<RepoContext> {
  const cleanUrl = repoUrl.replace('https://github.com/', '');
  const [owner, repo] = cleanUrl.split('/');

  if (!owner || !repo) throw new Error('Invalid URL');

  // 1. Get Basic Info
  const { data: repoData } = await octokit.rest.repos.get({ owner, repo });

  // 2. LIGHTWEIGHT File Fetch (Non-recursive or limited)
  // We only get the top-level or depth-1 files to save massive token usage
  const { data: treeData } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: repoData.default_branch,
    recursive: '1', // Still recursive but we slice heavily below
  });

  // STRICT LIMIT: Only top 60 relevant files
  const relevantFiles = treeData.tree
    .filter((item) => item.type === 'blob' && item.path)
    .filter((item) => {
      const p = item.path!;
      // Filter out deep nested non-code files
      return !p.includes('test/') && !p.includes('__tests__') && !p.endsWith('.json') && !p.endsWith('.md');
    })
    .map((item) => item.path)
    .slice(0, 60); // <--- DRASTIC REDUCTION (was 300)

  // 3. Tiny README
  let readmeContent = '';
  try {
    const { data: readme } = await octokit.rest.repos.getReadme({
      owner,
      repo,
      mediaType: { format: 'raw' },
    });
    // Limit to 1000 chars (approx 250 tokens) instead of 8000
    readmeContent = String(readme).slice(0, 1000); 
  } catch (e) { /* ignore */ }

  return {
    name: repoData.full_name,
    description: repoData.description || `A repo named ${repo}`,
    fileList: relevantFiles.join('\n'), // Use newline to save comma tokens
    readme: readmeContent,
    packageJson: "Dependency analysis skipped for token savings.",
  };
}