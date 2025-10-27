import type {Metadata} from 'next';
import './globals.css';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {Toaster} from '@/components/ui/toaster';
import {CartProvider} from '@/hooks/use-cart.tsx';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Dab Hobbies',
  description: 'Your one-stop shop for premium motorcycle apparel.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,700;1,700&family=Roboto:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <CartProvider>
          <div className="relative flex min-h-dvh flex-col bg-background">
            <div className="fixed inset-0 -z-10">
              <Image 
                src="https://www.transparenttextures.com/patterns/dark-denim.png"
                alt="Background texture"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a0a0a] to-background opacity-95"/>
            </div>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
