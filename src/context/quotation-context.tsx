'use client';
import type { QuotationInput } from '@/ai/flows/generate-quotation';
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface QuotationContextType {
  formData: QuotationInput | null;
  setFormData: (data: QuotationInput | null) => void;
  generatedQuote: string;
  setGeneratedQuote: (quote: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export const QuotationProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<QuotationInput | null>(null);
  const [generatedQuote, setGeneratedQuote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const contextValue = useMemo(() => ({
    formData,
    setFormData,
    generatedQuote,
    setGeneratedQuote,
    isLoading,
    setIsLoading,
    error,
    setError
  }), [formData, generatedQuote, isLoading, error]);

  return (
    <QuotationContext.Provider value={contextValue}>
      {children}
    </QuotationContext.Provider>
  );
};

export const useQuotation = () => {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error('useQuotation must be used within a QuotationProvider');
  }
  return context;
};
