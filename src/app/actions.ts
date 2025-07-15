'use server';

import { generateQuotation as generateQuotationFlow, type QuotationInput } from '@/ai/flows/generate-quotation';
import { adjustTone as adjustToneFlow, type AdjustToneInput } from '@/ai/flows/tone-adjustment';
import { suggestAddOns as suggestAddOnsFlow, type SuggestAddOnsInput } from '@/ai/flows/suggest-add-ons';
import { formatQuotationForPdf as formatQuotationForPdfFlow, type FormatQuotationInput } from '@/ai/flows/format-quotation-pdf';


export async function generateQuotationAction(input: QuotationInput) {
  try {
    const result = await generateQuotationFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating quotation:', error);
    return { success: false, error: 'Failed to generate quotation.' };
  }
}

export async function adjustToneAction(input: AdjustToneInput) {
    try {
      const result = await adjustToneFlow(input);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error adjusting tone:', error);
      return { success: false, error: 'Failed to adjust tone.' };
    }
}

export async function suggestAddOnsAction(input: SuggestAddOnsInput) {
    try {
        const result = await suggestAddOnsFlow(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error suggesting add-ons:', error);
        return { success: false, error: 'Failed to suggest add-ons.' };
    }
}

export async function formatQuotationForPdfAction(input: FormatQuotationInput) {
  try {
    const result = await formatQuotationForPdfFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error formatting quotation for PDF:', error);
    return { success: false, error: 'Failed to format quotation for PDF.' };
  }
}
