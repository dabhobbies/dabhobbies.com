"use client";

import { useCart } from "@/hooks/use-cart.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { useRouter } from "next/navigation";

const CHECKOUT_FORM_STORAGE_KEY = 'dab-hobbies-checkout-form';

type ShippingInfo = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(CHECKOUT_FORM_STORAGE_KEY);
      if (storedData) {
        setShippingInfo(JSON.parse(storedData));
      }
    } catch (e) {
      console.error("Failed to load checkout form data from local storage", e);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(CHECKOUT_FORM_STORAGE_KEY, JSON.stringify(shippingInfo));
    } catch (e) {
      console.error("Failed to save checkout form data to local storage", e);
    }
  }, [shippingInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({...prev, [name]: value}));
  }
  
  if (state.items.length === 0) {
    return (
        <div className="container mx-auto py-24 text-center">
            <div className="max-w-md mx-auto p-8 glass-card">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <p className="text-muted-foreground mb-8">Add some products to your cart before checking out.</p>
                <Button asChild>
                    <Link href="/">Return to Shop</Link>
                </Button>
            </div>
        </div>
    )
  }

  const subtotal = state.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shipping = 50000;
  const tax = subtotal * 0.11; // 11% PPN
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const itemsDetails = state.items.map(item => 
        `- ${item.product.name} (${item.size}, ${item.color}) x ${item.quantity} = ${formatRupiah(item.product.price * item.quantity)}`
    ).join('\n');

    const message = `
Halo Dab Hobbies, saya mau pesan:

*Detail Pesanan:*
${itemsDetails}

*Subtotal:* ${formatRupiah(subtotal)}
*Pengiriman:* ${formatRupiah(shipping)}
*Pajak (11%):* ${formatRupiah(tax)}
*Total:* *${formatRupiah(total)}*

*Alamat Pengiriman:*
${shippingInfo.firstName} ${shippingInfo.lastName}
${shippingInfo.address}
${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}

*Metode Pembayaran:*
${paymentMethod.toUpperCase()}

Mohon konfirmasi pesanannya. Terima kasih!
    `;

    const whatsappNumber = "6281234567890"; // Ganti dengan nomor WhatsApp Anda
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message.trim())}`;
    
    // Buka di tab baru
    window.open(whatsappUrl, '_blank');

    // Kosongkan keranjang dan form setelah beberapa saat
    setTimeout(() => {
        dispatch({ type: "CLEAR_CART" });
        localStorage.removeItem(CHECKOUT_FORM_STORAGE_KEY);
        router.push('/');
    }, 3000);
  }

  return (
    <div className="container mx-auto py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase font-headline">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <form onSubmit={handlePlaceOrder} className="md:col-span-2 space-y-8 p-8 glass-card">
          <div>
            <h2 className="text-2xl font-semibold mb-4 font-headline uppercase">Informasi Pengiriman</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nama Depan</Label>
                <Input name="firstName" id="firstName" placeholder="John" required value={shippingInfo.firstName} onChange={handleInputChange} className="bg-transparent"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nama Belakang</Label>
                <Input name="lastName" id="lastName" placeholder="Doe" required value={shippingInfo.lastName} onChange={handleInputChange} className="bg-transparent"/>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input name="address" id="address" placeholder="Jl. Jend. Sudirman No. 123" required value={shippingInfo.address} onChange={handleInputChange} className="bg-transparent"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Kota</Label>
                <Input name="city" id="city" placeholder="Jakarta" required value={shippingInfo.city} onChange={handleInputChange} className="bg-transparent"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Provinsi</Label>
                <Input name="state" id="state" placeholder="DKI Jakarta" required value={shippingInfo.state} onChange={handleInputChange} className="bg-transparent"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">Kode Pos</Label>
                <Input name="zip" id="zip" placeholder="12345" required value={shippingInfo.zip} onChange={handleInputChange} className="bg-transparent"/>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 font-headline uppercase">Metode Pembayaran</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
              <div className="flex items-center space-x-3 rounded-md border border-input p-3 has-[:checked]:bg-primary/20 has-[:checked]:border-primary transition-all bg-background/30">
                <RadioGroupItem value="qris" id="qris" />
                <Label htmlFor="qris" className="font-medium cursor-pointer flex-grow">QRIS</Label>
              </div>
              <div className="flex items-center space-x-3 rounded-md border border-input p-3 has-[:checked]:bg-primary/20 has-[:checked]:border-primary transition-all bg-background/30">
                <RadioGroupItem value="bca" id="bca" />
                <Label htmlFor="bca" className="font-medium cursor-pointer flex-grow">Bank BCA</Label>
              </div>
              <div className="flex items-center space-x-3 rounded-md border border-input p-3 has-[:checked]:bg-primary/20 has-[:checked]:border-primary transition-all bg-background/30">
                <RadioGroupItem value="bri" id="bri" />
                <Label htmlFor="bri" className="font-medium cursor-pointer flex-grow">Bank BRI</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold uppercase">
             <MessageCircle className="mr-2 h-5 w-5" /> Lanjutkan di WhatsApp
          </Button>
        </form>

        <div className="glass-card p-6 h-fit sticky top-24">
          <h2 className="text-2xl font-semibold mb-4 font-headline uppercase">Ringkasan Pesanan</h2>
          <div className="space-y-3">
            {state.items.map(item => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                    <Image src={item.product.image.imageUrl} alt={item.product.name} width={50} height={50} className="rounded-md" />
                    <div>
                        <p className="font-medium">{item.product.name} <span className="text-muted-foreground">x{item.quantity}</span></p>
                        <p className="text-muted-foreground text-xs">{item.size} / {item.color}</p>
                    </div>
                </div>
                <p>{formatRupiah(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <Separator className="my-4 bg-white/20" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Subtotal</p>
              <p>{formatRupiah(subtotal)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Pengiriman</p>
              <p>{formatRupiah(shipping)}</p>
            </div>
             <div className="flex justify-between">
              <p className="text-muted-foreground">Pajak (PPN 11%)</p>
              <p>{formatRupiah(tax)}</p>
            </div>
          </div>
          <Separator className="my-4 bg-white/20" />
          <div className="flex justify-between font-bold text-lg">
            <p>Total</p>
            <p>{formatRupiah(total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
