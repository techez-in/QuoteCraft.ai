'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useQuotation } from '@/context/quotation-context';
import { generateQuotationAction } from '@/app/actions';
import { quotationFormSchema } from '@/lib/schemas';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/header';

export default function QuotationFormPage() {
  const router = useRouter();
  const { setFormData, setGeneratedQuote, setIsLoading, isLoading } = useQuotation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof quotationFormSchema>>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      clientName: '',
      clientCompanyName: '',
      yourCompanyName: '',
      projectDescription: '',
      servicesRequired: '',
      timeline: '',
      budgetRange: '',
      specialRequirements: '',
      preferredTone: 'Professional',
      addOns: '',
    },
  });

  async function onSubmit(values: z.infer<typeof quotationFormSchema>) {
    setIsLoading(true);
    setFormData(values);

    const result = await generateQuotationAction({
        ...values,
        addOns: values.addOns || 'None',
        specialRequirements: values.specialRequirements || 'None',
    });

    setIsLoading(false);

    if (result.success && result.data) {
      setGeneratedQuote(result.data.quotation);
      toast({
        title: 'Success!',
        description: 'Your quotation has been generated.',
      });
      router.push('/quotation/result');
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: result.error || 'There was a problem with your request.',
      });
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Create a New Quote</CardTitle>
              <CardDescription>Fill in the details below to generate a professional quotation with AI.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="yourCompanyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Your Awesome Agency" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientCompanyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client's Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Acme Inc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="projectDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the project in detail..."
                            className="resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="servicesRequired"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Services Required</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List the services needed, e.g., Web Design, SEO, Content Creation..."
                            className="resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timeline</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 4-6 weeks" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="budgetRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Range</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. $5,000 - $8,000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="specialRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special needs or considerations (optional)"
                            className="resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                    <div className="grid md:grid-cols-2 gap-8">
                        <FormField
                        control={form.control}
                        name="preferredTone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Preferred Tone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a tone" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="Professional">Professional</SelectItem>
                                <SelectItem value="Friendly">Friendly</SelectItem>
                                <SelectItem value="Formal">Formal</SelectItem>
                                <SelectItem value="Creative">Creative</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="addOns"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Add-ons</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Ongoing Support, Maintenance" {...field} />
                            </FormControl>
                            <FormDescription>Optional add-on services.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>

                  <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Quotation'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
