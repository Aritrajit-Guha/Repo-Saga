// src/ai/flows/suggest-first-contributor-tasks.ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestFirstContributorTasksInputSchema = z.object({
  repoDescription: z
    .string()
    .describe('A comprehensive description of the repository including dependencies and readme summary.'),
  // We make this optional or generic now since we run in parallel
  modulePurposes: z
    .string()
    .describe('Context about modules (optional).'),
  fileList: z.string().describe('A list of file paths in the repository.'),
  targetAudience: z
    .string()
    .default('new contributor (general)')
    .describe('The target audience for the suggested tasks.'),
});
export type SuggestFirstContributorTasksInput = z.infer<
  typeof SuggestFirstContributorTasksInputSchema
>;

const SuggestFirstContributorTasksOutputSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string().describe('The title of the task.'),
      description: z.string().describe('A short description of the task.'),
      difficulty: z
        .number()
        .int()
        .min(1)
        .max(5)
        .describe('The difficulty level of the task (1-5).'),
      filesToEdit: z.array(z.string()).describe('A list of relevant existing files to check or edit.'),
      testsToRun: z
        .string()
        .optional()
        .describe('The command to run tests for the task, if any.'),
      expectedOutcome: z.string().describe('The expected outcome of completing the task.'),
      learningGoals: z
        .string()
        .optional()
        .describe('The Learning Goals for the task, if any.'),
    })
  ).describe('A list of 5-6 suggested starter tasks.'),
});
export type SuggestFirstContributorTasksOutput = z.infer<
  typeof SuggestFirstContributorTasksOutputSchema
>;

export async function suggestFirstContributorTasks(
  input: SuggestFirstContributorTasksInput
): Promise<SuggestFirstContributorTasksOutput> {
  return suggestFirstContributorTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFirstContributorTasksPrompt',
  input: { schema: SuggestFirstContributorTasksInputSchema },
  output: { schema: SuggestFirstContributorTasksOutputSchema },
  prompt: `You are an Open Source Maintainer. Your goal is to onboard new contributors by creating "Good First Issues".

  **Context:**
  - Description & Tech Stack: {{{repoDescription}}}
  - File Structure: {{{fileList}}}
  
  **Instructions:**
  1. Analyze the file structure to understand the project architecture (e.g., is it Next.js? Python/Django? Go?).
  2. Suggest 6 starter tasks. These should NOT be generic "Fix Typo" tasks. They should be structural but simple, such as:
     - "Add a loading state to the X component"
     - "Create a unit test for the Y utility"
     - "Add input validation to the Z form"
  3. You MUST reference **real files** from the provided File List in the 'filesToEdit' field. Do not invent filenames.
  4. Estimate difficulty from 1 (trivial) to 5 (requires understanding logic).

  Return a JSON object with the list of tasks.`,
});

const suggestFirstContributorTasksFlow = ai.defineFlow(
  {
    name: 'suggestFirstContributorTasksFlow',
    inputSchema: SuggestFirstContributorTasksInputSchema,
    outputSchema: SuggestFirstContributorTasksOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);