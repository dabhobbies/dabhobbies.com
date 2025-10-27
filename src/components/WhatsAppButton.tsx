// src/components/WhatsAppButton.tsx
'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export function WhatsAppButton({ phoneNumber }: { phoneNumber: string }) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Halo Dab Hobbies, saya mau bertanya...")}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md p-3 shadow-lg transition-transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageSquare className="h-6 w-6" />
    </Link>
  );
}
