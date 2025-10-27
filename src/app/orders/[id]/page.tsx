// This page is no longer used in the new checkout flow.
// You can delete this file if you want.

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function OrderThankYouPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-12 md:py-16">
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <CardTitle className="text-3xl">Pemesanan sedang diproses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Terima kasih! Pesanan Anda telah kami terima dan akan segera kami proses melalui WhatsApp.
          </p>
          <Button asChild>
            <Link href="/">Kembali ke Toko</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
