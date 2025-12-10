// src/ai/flows/generate-codebase-map.ts
'use server';

/**
 * @fileOverview Generates an interactive D&D-style map of the codebase for new developers.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input now takes fileList and description instead of just URL
const GenerateCodebaseMapInputSchema = z.object({
  repoName: z.string().describe('The name of the repository.'),
  description: z.string().describe('Description of the repository.'),
  fileList: z.string().describe('A comma-separated list of file paths in the repository.'),
});
export type GenerateCodebaseMapInput = z.infer<typeof GenerateCodebaseMapInputSchema>;

const GenerateCodebaseMapOutputSchema = z.object({
  meta: z.object({
    repo: z.string(),
    generated_at: z.string(),
  }),
  nodes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.string(),
      files: z.array(z.string()),
      x: z.number(),
      y: z.number(),
      size: z.number(),
      tooltip: z.string(),
    })
  ),
  edges: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      weight: z.number(),
      reason: z.string(),
    })
  ),
  highlights: z.object({
    complex_dragon: z
      .object({
        node_id: z.string(),
        file: z.string(),
        complexity_score: z.number(),
      })
      .optional(),
  }),
});
export type GenerateCodebaseMapOutput = z.infer<typeof GenerateCodebaseMapOutputSchema>;

export async function generateCodebaseMap(input: GenerateCodebaseMapInput): Promise<GenerateCodebaseMapOutput> {
  return generateCodebaseMapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodebaseMapPrompt',
  input: { schema: GenerateCodebaseMapInputSchema },
  output: { schema: GenerateCodebaseMapOutputSchema },
  prompt: `You are a Senior Software Architect analyzing a codebase to create a visual map for a new developer.

  Repo Name: {{{repoName}}}
  Description: {{{description}}}
  File List: {{{fileList}}}

  **Instructions:**
  1.  Group the provided files into 4-6 logical "Modules" or "Zones" (Nodes).
  2.  Assign meaningful "Fantasy/RPG" labels to these modules (e.g., "The Gatekeeper" for Auth, "The Treasury" for Payments, "The Library" for Database, "The Town Square" for UI).
  3.  Assign coordinates (x, y) between 0 and 100 for a 2D map layout. Try to spread them out logically.
  4.  Create edges to show likely dependencies (e.g., UI depends on API).
  5.  Identify ONE file that looks the most complex or critical as the "complex_dragon".

  Return a valid JSON object matching the output schema.
  `,
});

const generateCodebaseMapFlow = ai.defineFlow(
  {
    name: 'generateCodebaseMapFlow',
    inputSchema: GenerateCodebaseMapInputSchema,
    outputSchema: GenerateCodebaseMapOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    // Ensure meta data is present if the LLM missed it
    if (output && !output.meta) {
      output.meta = {
        repo: input.repoName,
        generated_at: new Date().toISOString(),
      };
    } else if (output) {
       output.meta.repo = input.repoName;
       output.meta.generated_at = new Date().toISOString();
    }

    return output!;
  }
);