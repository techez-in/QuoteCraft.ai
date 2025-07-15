'use server';

/**
 * @fileOverview Formats a quotation for PDF output using AI.
 *
 * - formatQuotationForPdf - A function that formats a quotation for a PDF document.
 * - FormatQuotationInput - The input type for the formatQuotationForPdf function.
 * - FormatQuotationOutput - The return type for the formatQuotationForPdf function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormatQuotationInputSchema = z.object({
  quotationHtml: z.string().describe('The raw HTML content of the quotation to be formatted.'),
  clientName: z.string().describe('The name of the client.'),
  companyName: z.string().describe('The name of the client company.'),
});
export type FormatQuotationInput = z.infer<typeof FormatQuotationInputSchema>;

const FormatQuotationOutputSchema = z.object({
  formattedHtml: z.string().describe('The formatted HTML content, ready for PDF generation.'),
});
export type FormatQuotationOutput = z.infer<typeof FormatQuotationOutputSchema>;

export async function formatQuotationForPdf(input: FormatQuotationInput): Promise<FormatQuotationOutput> {
  return formatQuotationPdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formatQuotationPdfPrompt',
  input: {schema: FormatQuotationInputSchema},
  output: {schema: FormatQuotationOutputSchema},
  prompt: `You are a professional document designer. Your task is to take the following raw quotation HTML content and reformat it into a clean, well-structured, and professional HTML document suitable for converting to a PDF.

The output should be a single block of HTML content. Do NOT include <html>, <head>, or <body> tags.

Use clear headings (e.g., <h2>, <h3>), paragraphs (<p>), lists (<ul>, <li>), and bold text (<strong>) to improve readability. Ensure all the original information is present. The structure should be logical, flowing from introduction to services, timeline, pricing, and conclusion.

Client Name: {{{clientName}}}
Company Name: {{{companyName}}}

Raw Quotation Content:
{{{quotationHtml}}}
`,
});

const formatQuotationPdfFlow = ai.defineFlow(
  {
    name: 'formatQuotationPdfFlow',
    inputSchema: FormatQuotationInputSchema,
    outputSchema: FormatQuotationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
