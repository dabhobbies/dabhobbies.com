
"use client";

import { useCart, type CartItem } from "@/hooks/use-cart.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageCircle, Plus, Minus, Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { urlFor } from "@/sanity/client";


const CHECKOUT_FORM_STORAGE_KEY = 'dab-hobbies-checkout-form';

type ShippingInfo = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

function OrderSummaryItem({ item }: { item: CartItem }) {
    const { dispatch } = useCart();
    const imageUrl = item.product.images?.[0] ? urlFor(item.product.images[0]).width(100).height(100).url() : "https://placehold.co/100x100";

    const handleVariantChange = (type: 'size' | 'color', value: string) => {
        const newItem: CartItem = { ...item, [type]: value };
        dispatch({
            type: 'UPDATE_VARIANT',
            payload: { oldSize: item.size, oldColor: item.color, newItem: newItem }
        });
    };

    return (
        <div className="flex gap-4">
            <Image src={imageUrl} alt={item.product.name} width={80} height={80} className="rounded-md object-cover" />
            <div className="flex flex-col text-sm flex-grow gap-2">
                <p className="font-medium line-clamp-2">{item.product.name}</p>
                <p className="font-semibold text-sm">{formatRupiah(item.product.price)}</p>
                
                <div className="grid grid-cols-2 gap-2">
                    {item.product.sizes && item.product.sizes.length > 0 && (
                        <Select value={item.size} onValueChange={(value) => handleVariantChange('size', value)}>
                            <SelectTrigger className="h-8 text-xs bg-transparent">
                                <SelectValue placeholder="Size" />
                            </SelectTrigger>
                            <SelectContent>
                                {item.product.sizes.map((size) => (
                                    <SelectItem key={size} value={size} className="text-xs">{size}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {item.product.colors && item.product.colors.length > 0 && (
                        <Select value={item.color} onValueChange={(value) => handleVariantChange('color', value)}>
                            <SelectTrigger className="h-8 text-xs bg-transparent">
                                <SelectValue placeholder="Color" />
                            </SelectTrigger>
                            <SelectContent>
                                {item.product.colors.map((color) => (
                                    <SelectItem key={color} value={color} className="text-xs">{color}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { ...item, productId: item.product._id, quantity: item.quantity - 1 } })}>
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { ...item, productId: item.product._id, quantity: item.quantity + 1 } })}>
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-6 w-6" onClick={() => dispatch({ type: "REMOVE_ITEM", payload: { ...item, productId: item.product._id } })}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

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
  
  const total = subtotal;

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
*Total:* *${formatRupiah(total)}*

*Alamat Pengiriman:*
${shippingInfo.firstName} ${shippingInfo.lastName}
${shippingInfo.address}
${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}

*Metode Pembayaran:*
${paymentMethod.toUpperCase()}

Mohon konfirmasi pesanannya. Terima kasih!
    `;

    const whatsappNumber = "6281386865559"; // Ganti dengan nomor WhatsApp Anda
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
    <>
      <Breadcrumbs items={[{ label: "Checkout", href: "/checkout" }]} />
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
            <div className="space-y-6">
              {state.items.map(item => (
                <OrderSummaryItem key={`${item.product._id}-${item.size}-${item.color}`} item={item} />
              ))}
            </div>
            <Separator className="my-4 bg-white/20" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal</p>
                <p>{formatRupiah(subtotal)}</p>
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
    </>
  );
}
