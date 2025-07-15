
'use client';

import * as React from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { PenSquare, Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <PenSquare className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">
              QuoteCraft AI
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/quotation/form">
              <Button>Create a Quote</Button>
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-6 pt-10">
                    <Link href="/quotation/form">
                        <SheetClose asChild>
                            <Button className="w-full">Create a Quote</Button>
                        </SheetClose>
                    </Link>
                  <div className='flex items-center justify-center'>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
