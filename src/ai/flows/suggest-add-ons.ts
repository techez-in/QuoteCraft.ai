'use server';

/**
 * @fileOverview AI agent to suggest relevant add-ons for a quotation based on the project description.
 *
 * - suggestAddOns - A function that suggests relevant add-ons.
 * - SuggestAddOnsInput - The input type for the suggestAddOns function.
 * - SuggestAddOnsOutput - The return type for the suggestAddOns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAddOnsInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('The description of the project for which the quotation is being prepared.'),
});
export type SuggestAddOnsInput = z.infer<typeof SuggestAddOnsInputSchema>;

const SuggestAddOnsOutputSchema = z.object({
  addOnSuggestions: z
    .array(z.string())
    .describe('An array of add-on service suggestions relevant to the project description.'),
});
export type SuggestAddOnsOutput = z.infer<typeof SuggestAddOnsOutputSchema>;

export async function suggestAddOns(input: SuggestAddOnsInput): Promise<SuggestAddOnsOutput> {
  return suggestAddOnsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAddOnsPrompt',
  input: {schema: SuggestAddOnsInputSchema},
  output: {schema: SuggestAddOnsOutputSchema},
  prompt: `Based on the following project description, suggest relevant add-on services that could enhance the quotation. Provide a list of add-ons that would benefit the client, formatted as a JSON array.

Project Description: {{{projectDescription}}}

Consider add-ons like:
- Ongoing Support
- Maintenance
- Training
- Premium Features
- Expedited Delivery
- Custom Design
`,
});

const suggestAddOnsFlow = ai.defineFlow(
  {
    name: 'suggestAddOnsFlow',
    inputSchema: SuggestAddOnsInputSchema,
    outputSchema: SuggestAddOnsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
