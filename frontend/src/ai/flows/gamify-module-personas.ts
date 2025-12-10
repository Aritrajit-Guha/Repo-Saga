'use server';

/**
 * @fileOverview A flow for gamifying codebase modules by mapping them to personas.
 *
 * - gamifyModulePersonas - A function that handles the module to persona mapping.
 * - GamifyModulePersonasInput - The input type for the gamifyModulePersonas function.
 * - GamifyModulePersonasOutput - The return type for the gamifyModulePersonas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GamifyModulePersonasInputSchema = z.object({
  moduleName: z.string().describe('The name of the module.'),
  modulePurpose: z.string().describe('A one-sentence description of the module\'s purpose.'),
  moduleComplexity: z.number().describe('A numerical value indicating the module\'s complexity.'),
});
export type GamifyModulePersonasInput = z.infer<typeof GamifyModulePersonasInputSchema>;

const GamifyModulePersonasOutputSchema = z.object({
  personaName: z.string().describe('The name of the gamified persona assigned to the module.'),
  personaDescription: z
    .string()
    .describe('A short description of the persona and its role in the codebase.'),
  reasoning: z
    .string()
    .describe('Explanation of why the module was mapped to the particular persona.'),
});
export type GamifyModulePersonasOutput = z.infer<typeof GamifyModulePersonasOutputSchema>;

export async function gamifyModulePersonas(input: GamifyModulePersonasInput): Promise<GamifyModulePersonasOutput> {
  return gamifyModulePersonasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gamifyModulePersonasPrompt',
  input: {schema: GamifyModulePersonasInputSchema},
  output: {schema: GamifyModulePersonasOutputSchema},
  prompt: `You are a "Codebase Storyteller" that converts a software module into a gamified persona for onboarding new developers.

Given the following module information, create a gamified persona name, a short description, and reasoning for the mapping:

Module Name: {{{moduleName}}}
Module Purpose: {{{modulePurpose}}}
Module Complexity: {{{moduleComplexity}}}

Consider these example mappings:

Auth -> Gatekeeper
Database/Storage -> Library of Infinite Knowledge
Complex function/class -> Dragon/Minotaur (if complexity is high)
UI components -> Town Square / Market stalls
`,
});

const gamifyModulePersonasFlow = ai.defineFlow(
  {
    name: 'gamifyModulePersonasFlow',
    inputSchema: GamifyModulePersonasInputSchema,
    outputSchema: GamifyModulePersonasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
