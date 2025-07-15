'use server';

/**
 * @fileOverview Generates a quotation from project details using AI.
 *
 * - generateQuotation - A function that generates a quotation based on input details.
 * - QuotationInput - The input type for the generateQuotation function.
 * - QuotationOutput - The return type for the generateQuotation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuotationInputSchema = z.object({
  clientName: z.string().describe('The name of the client.'),
  clientCompanyName: z.string().describe("The name of the client's company."),
  yourCompanyName: z.string().describe('The name of the company providing the quotation.'),
  projectDescription: z.string().describe('A description of the project.'),
  servicesRequired: z.string().describe('The services required for the project.'),
  timeline: z.string().describe('The project timeline.'),
  budgetRange: z.string().describe('The budget range for the project.'),
  specialRequirements: z.string().describe('Any special requirements for the project.'),
  preferredTone: z
    .enum(['Professional', 'Friendly', 'Formal', 'Creative'])
    .describe('The preferred tone of the quotation.'),
  addOns: z.string().describe('Any add-ons such as support or maintenance.'),
});
export type QuotationInput = z.infer<typeof QuotationInputSchema>;

const QuotationOutputSchema = z.object({
  quotation: z.string().describe('The generated quotation.'),
});
export type QuotationOutput = z.infer<typeof QuotationOutputSchema>;

export async function generateQuotation(input: QuotationInput): Promise<QuotationOutput> {
  return generateQuotationFlow(input);
}

const quotationPrompt = ai.definePrompt({
  name: 'quotationPrompt',
  input: {schema: QuotationInputSchema},
  output: {schema: QuotationOutputSchema},
  prompt: `On behalf of {{{yourCompanyName}}}, generate a detailed and human-sounding quotation based on the following client input. Include:\n\n- A warm introduction\n- Service Breakdown\n- Deliverables\n- Timeline\n- Pricing Estimate\n- Terms & Conditions\n- Conclusion\n\nUse proper formatting, headings, and a human tone. Avoid sounding like an AI. Do not invent data.\n\nClient Name: {{{clientName}}}\nClient's Company Name: {{{clientCompanyName}}}\nProject Description: {{{projectDescription}}}\nServices Required: {{{servicesRequired}}}\nTimeline: {{{timeline}}}\nBudget Range: {{{budgetRange}}}\nSpecial Requirements: {{{specialRequirements}}}\nPreferred Tone: {{{preferredTone}}}\nAdd-ons: {{{addOns}}}`,
});

const generateQuotationFlow = ai.defineFlow(
  {
    name: 'generateQuotationFlow',
    inputSchema: QuotationInputSchema,
    outputSchema: QuotationOutputSchema,
  },
  async input => {
    const {output} = await quotationPrompt(input);
    return output!;
  }
);
