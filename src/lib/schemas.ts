import { z } from 'zod';

export const quotationFormSchema = z.object({
  clientName: z.string().min(2, {
    message: 'Client name must be at least 2 characters.',
  }),
  clientCompanyName: z.string().min(2, {
    message: "Client's company name must be at least 2 characters.",
  }),
  yourCompanyName: z.string().min(2, {
    message: 'Your company name must be at least 2 characters.',
  }),
  projectDescription: z.string().min(10, {
    message: 'Project description must be at least 10 characters.',
  }),
  servicesRequired: z.string().min(5, {
    message: 'Services required must be at least 5 characters.',
  }),
  timeline: z.string().min(2, {
    message: 'Timeline must be at least 2 characters.',
  }),
  budgetRange: z.string().min(2, {
    message: 'Budget range must be at least 2 characters.',
  }),
  specialRequirements: z.string().optional(),
  preferredTone: z.enum(['Professional', 'Friendly', 'Formal', 'Creative']),
  addOns: z.string().optional(),
});
