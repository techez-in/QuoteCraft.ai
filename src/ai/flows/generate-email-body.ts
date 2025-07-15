
'use server';

/**
 * @fileOverview Generates a short, friendly email body to accompany a quotation.
 *
 * - generateEmailBody - A function that generates a short email message.
 * - GenerateEmailBodyInput - The input type for the generateEmailBody function.
 * - GenerateEmailBodyOutput - The return type for the generateEmailBody function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmailBodyInputSchema = z.object({
  clientName: z.string().describe('The name of the client.'),
  yourCompanyName: z.string().describe('The name of your company.'),
  projectDescription: z.string().describe('A brief description of the project.'),
});
export type GenerateEmailBodyInput = z.infer<typeof GenerateEmailBodyInputSchema>;

const GenerateEmailBodyOutputSchema = z.object({
  emailBody: z.string().describe('A short, friendly, and professional email message.'),
});
export type GenerateEmailBodyOutput = z.infer<typeof GenerateEmailBodyOutputSchema>;

export async function generateEmailBody(input: GenerateEmailBodyInput): Promise<GenerateEmailBodyOutput> {
  return generateEmailBodyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailBodyPrompt',
  input: {schema: GenerateEmailBodyInputSchema},
  output: {schema: GenerateEmailBodyOutputSchema},
  prompt: `Generate a short, friendly and professional message to accompany a business quotation for a client.
  
Address the client, {{{clientName}}}, by name. Mention that the quotation from {{{yourCompanyName}}} is attached and that you’re looking forward to their response. Keep it under 100 words.

Project Description: {{{projectDescription}}}
`,
});

const generateEmailBodyFlow = ai.defineFlow(
  {
    name: 'generateEmailBodyFlow',
    inputSchema: GenerateEmailBodyInputSchema,
    outputSchema: GenerateEmailBodyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
