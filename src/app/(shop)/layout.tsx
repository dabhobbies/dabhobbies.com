
import type {Metadata} from 'next';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {Toaster} from '@/components/ui/toaster';
import {CartProvider} from '@/hooks/use-cart.tsx';
import Image from 'next/image';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Dab Hobbies',
  description: 'Your one-stop shop for premium motorcycle apparel.',
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <CartProvider>
          <div className="relative flex min-h-dvh flex-col bg-background">
            <div className="fixed inset-0 -z-10">
              <Image 
                src="https://www.transparenttextures.com/patterns/dark-denim.png"
                alt="Background texture"
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a0a0a] to-background opacity-90"/>
            </div>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <WhatsAppButton phoneNumber="6281386865559" />
        </CartProvider>
  );
}
