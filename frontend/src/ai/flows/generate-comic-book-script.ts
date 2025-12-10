// src/ai/flows/generate-comic-book-script.ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema stays the same
const GenerateComicBookScriptInputSchema = z.object({
  repoDescription: z.string(),
  modulePersonas: z.string(),
  numPanels: z.number().int().min(3).max(8).default(5),
  codeSnippets: z.string(),
});
export type GenerateComicBookScriptInput = z.infer<typeof GenerateComicBookScriptInputSchema>;

// Output is now just a raw string because we are using TOON
const GenerateComicBookScriptOutputSchema = z.string(); 
export type GenerateComicBookScriptOutput = string;

export async function generateComicBookScript(
  input: GenerateComicBookScriptInput
): Promise<GenerateComicBookScriptOutput> {
  return generateComicBookScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateComicBookScriptPrompt',
  input: { schema: GenerateComicBookScriptInputSchema },
  output: { schema: GenerateComicBookScriptOutputSchema }, // Expecting raw string
  prompt: `You are a Codebase Storyteller.
  
  **Context:**
  {{{repoDescription}}}
  {{{modulePersonas}}}
  {{{codeSnippets}}}
  
  **Task:**
  Create a {{{numPanels}}}-panel comic script.
  
  **Output Format (TOON - Token-Oriented Object Notation):**
  Do NOT use JSON. Use this specific pipe-delimited format, one panel per line:
  ID | TITLE | NARRATION | DIALOG_1; DIALOG_2 | FILE_NAME | CODE_SNIPPET

  **Rules:**
  1. Use "|" as the delimiter.
  2. Use ";" to separate multiple dialog lines.
  3. No markdown blocks, just raw text.
  4. Ensure the CODE_SNIPPET is short (one line).
  
  **Example Output:**
  1 | The Gatekeeper | A guard stands watch. | Halt!; Who goes there? | src/auth.ts | if (!user) return;
`,
});

const generateComicBookScriptFlow = ai.defineFlow(
  {
    name: 'generateComicBookScriptFlow',
    inputSchema: GenerateComicBookScriptInputSchema,
    outputSchema: GenerateComicBookScriptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error("Failed to generate TOON script.");
    return output;
  }
);