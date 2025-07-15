import { QuotationProvider } from '@/context/quotation-context';

export default function QuotationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QuotationProvider>{children}</QuotationProvider>;
}
