'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuotation } from '@/context/quotation-context';
import { useToast } from '@/hooks/use-toast';
import { adjustToneAction, suggestAddOnsAction, formatQuotationForPdfAction } from '@/app/actions';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Sparkles, Wand2, Loader2, Info, Send } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TiptapEditor from '@/components/tiptap-editor';

type Tone = 'Professional' | 'Friendly' | 'Formal' | 'Creative';

export default function ResultPage() {
  const router = useRouter();
  const { generatedQuote, setGeneratedQuote, formData, isLoading, setIsLoading } = useQuotation();
  const { toast } = useToast();
  const [editorContent, setEditorContent] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>('Professional');
  const [suggestedAddOns, setSuggestedAddOns] = useState<string[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    if (!generatedQuote) {
      router.replace('/quotation/form');
    } else {
      setEditorContent(generatedQuote);
    }
  }, [generatedQuote, router]);

  const handleAdjustTone = async () => {
    setIsLoading(true);
    const result = await adjustToneAction({
      quotation: editorContent,
      tone: selectedTone,
    });
    setIsLoading(false);

    if (result.success && result.data) {
        const newQuotation = result.data.adjustedQuotation;
        setEditorContent(newQuotation);
        setGeneratedQuote(newQuotation); // Also update the context
        toast({ title: 'Tone adjusted successfully!' });
    } else {
      toast({ variant: 'destructive', title: 'Error adjusting tone', description: result.error });
    }
  };

  const handleSuggestAddOns = async () => {
    if (!formData?.projectDescription) {
      toast({ variant: 'destructive', title: 'Error', description: 'Project description is not available.' });
      return;
    }
    setIsLoading(true);
    const result = await suggestAddOnsAction({
      projectDescription: formData.projectDescription,
    });
    setIsLoading(false);

    if (result.success && result.data) {
      setSuggestedAddOns(result.data.addOnSuggestions);
    } else {
      toast({ variant: 'destructive', title: 'Error suggesting add-ons', description: result.error });
    }
  };

  const generatePdfBlob = async (): Promise<Blob | null> => {
     if (!formData) {
      toast({ variant: 'destructive', title: 'Error', description: 'Form data is missing.' });
      return null;
    }
  
    setIsLoading(true);
    const formatResult = await formatQuotationForPdfAction({
      quotationHtml: editorContent,
      clientName: formData.clientName,
      companyName: formData.clientCompanyName,
    });
    setIsLoading(false);
  
    if (!formatResult.success || !formatResult.data) {
      toast({ variant: 'destructive', title: 'PDF Formatting Failed', description: formatResult.error });
      return null;
    }
  
    const formattedHtml = formatResult.data.formattedHtml;
  
    const html2pdf = (await import('html2pdf.js')).default;
  
    const content = `
      <style>
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; font-size: 0.8rem; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; color: #111; margin-top: 1.5rem; margin-bottom: 0.5rem; page-break-after: avoid; }
        h1 { font-size: 1.6rem; color: #2E3192; }
        h2 { font-size: 1.3rem; border-bottom: 1px solid #eee; padding-bottom: 0.4rem; }
        h3 { font-size: 1.0rem; }
        p, ul, ol { margin-bottom: 1rem; page-break-inside: avoid; }
        ul, ol { padding-left: 1.25rem; }
        li { margin-bottom: 0.25rem; page-break-inside: avoid; }
        strong { font-weight: 600; }
        .pdf-header { text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #2E3192; padding-bottom: 1rem; }
        .pdf-header h1 { margin-bottom: 0.5rem; }
        .pdf-footer { text-align: center; margin-top: 2rem; font-size: 0.7rem; color: #777; border-top: 1px solid #eee; padding-top: 1rem; }
      </style>
      <div class="pdf-header">
        <h1>Quotation</h1>
        <p><strong>For:</strong> ${formData?.clientName} (${formData?.clientCompanyName})</p>
        <p><strong>From:</strong> ${formData?.yourCompanyName}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <div>${formattedHtml}</div>
      <div class="pdf-footer">
        <p>Thank you for considering our services.</p>
      </div>
    `;
    
    const opt = {
      margin: [0.75, 0.5, 0.75, 0.5],
      filename: `Quotation_${formData?.clientCompanyName || 'Quote'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css'] }
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    return html2pdf().from(tempDiv).set(opt).output('blob');
  }

  const handleDownloadPdf = async () => {
    const blob = await generatePdfBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quotation_${formData?.clientCompanyName || 'Quote'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a recipient email.' });
      return;
    }
    if (!formData) {
        toast({ variant: 'destructive', title: 'Error', description: 'Form data is missing.' });
        return;
    }

    setIsSendingEmail(true);

    try {
      const pdfBlob = await generatePdfBlob();
      if (!pdfBlob) {
        throw new Error('Failed to generate PDF.');
      }

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = async () => {
          const base64data = (reader.result as string)?.split(',')[1];

          const response = await fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  to: recipientEmail,
                  quotationData: formData,
                  pdfBase64: base64data,
              }),
          });

          const result = await response.json();
    
          if (response.ok) {
            toast({ title: 'Success!', description: 'The quotation has been sent.' });
            document.getElementById('close-dialog')?.click();
          } else {
            throw new Error(result.error || 'Failed to send email.');
          }
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error Sending Email', description: error.message });
    } finally {
      setIsSendingEmail(false);
    }
  };


  if (!generatedQuote) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Your Generated Quote</CardTitle>
              <CardDescription>Review, edit, and export your quotation. Use the AI tools to refine it further.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex flex-wrap items-center gap-4">
                    <Select onValueChange={(value) => setSelectedTone(value as Tone)} defaultValue={selectedTone}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Adjust Tone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Friendly">Friendly</SelectItem>
                            <SelectItem value="Formal">Formal</SelectItem>
                            <SelectItem value="Creative">Creative</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleAdjustTone} disabled={isLoading} variant="secondary">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Adjust Tone
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button onClick={handleSuggestAddOns} variant="secondary" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Suggest Add-ons
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Suggested Add-ons</AlertDialogTitle>
                            <AlertDialogDescription>
                                Based on the project description, here are some relevant add-ons you might consider.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-2">
                                {suggestedAddOns.length > 0 ? (
                                    <ul className="list-disc pl-5 space-y-1">
                                    {suggestedAddOns.map((addon, index) => (
                                        <li key={index}>{addon}</li>
                                    ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No suggestions available. Try generating again with a more detailed project description.</p>
                                )}
                            </div>
                            <AlertDialogFooter>
                            <AlertDialogAction>Close</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Send className="mr-2 h-4 w-4" />
                                Send Email
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Send Quotation</DialogTitle>
                                <DialogDescription>
                                    Enter the client's email address to send the quotation.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        To
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="client@example.com"
                                        className="col-span-3"
                                        value={recipientEmail}
                                        onChange={(e) => setRecipientEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary" id="close-dialog">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button onClick={handleSendEmail} disabled={isSendingEmail}>
                                    {isSendingEmail ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Email'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button onClick={handleDownloadPdf} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        Download as PDF
                    </Button>
                </div>
              </div>

              <div ref={quoteRef}>
                <TiptapEditor value={editorContent} onChange={setEditorContent} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
