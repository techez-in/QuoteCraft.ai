'use server';

/**
 * @fileOverview Adjusts the tone of a quotation based on user preference.
 *
 * - adjustTone - A function that adjusts the tone of the quotation.
 * - AdjustToneInput - The input type for the adjustTone function.
 * - AdjustToneOutput - The return type for the adjustTone function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustToneInputSchema = z.object({
  quotation: z.string().describe('The quotation text to adjust.'),
  tone: z.enum([
    'Professional',
    'Friendly',
    'Formal',
    'Creative',
  ]).describe('The desired tone of the quotation.'),
});
export type AdjustToneInput = z.infer<typeof AdjustToneInputSchema>;

const AdjustToneOutputSchema = z.object({
  adjustedQuotation: z.string().describe('The quotation with the adjusted tone.'),
});
export type AdjustToneOutput = z.infer<typeof AdjustToneOutputSchema>;

export async function adjustTone(input: AdjustToneInput): Promise<AdjustToneOutput> {
  return adjustToneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustTonePrompt',
  input: {schema: AdjustToneInputSchema},
  output: {schema: AdjustToneOutputSchema},
  prompt: `You are a business communication expert. Adjust the following quotation to match the specified tone.

Quotation: {{{quotation}}}

Tone: {{{tone}}}

Adjusted Quotation:`,
});

const adjustToneFlow = ai.defineFlow(
  {
    name: 'adjustToneFlow',
    inputSchema: AdjustToneInputSchema,
    outputSchema: AdjustToneOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
