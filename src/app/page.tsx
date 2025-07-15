
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import Link from 'next/link';
import { ArrowRight, Bot, Mail, FileDown, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: 'Save Precious Time',
    description: 'Stop spending hours on tedious quotations. Let our AI handle the heavy lifting so you can focus on what matters most.',
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: 'AI-Powered Precision',
    description: 'QuoteCraft AI intelligently drafts professional, human-like quotes tailored to your clients, ensuring accuracy and the perfect tone.',
  },
  {
    icon: <FileDown className="h-10 w-10 text-primary" />,
    title: 'Send Professional PDFs',
    description: 'Generate stunning, professional PDF quotations in minutes and email them directly to your clients to close deals faster.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              Create Flawless Quotations with AI
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
              QuoteCraft AI streamlines your entire workflow. Let our AI handle the tedious work of writing quotations so you can get back to what matters.
            </p>
            <Link href="/quotation/form">
              <Button size="lg" className="font-bold text-lg">
                Create a Quote for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl md:text-5xl font-bold">The Smartest Way to Quote</h2>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
                QuoteCraft AI handles your whole workflow, so you can win more business.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Techez.in. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
