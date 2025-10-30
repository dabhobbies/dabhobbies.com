
"use client";

import { useCart, type CartItem } from "@/hooks/use-cart.tsx";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { urlFor } from "@/sanity/client";


function CartItem({ item }: { item: CartItem }) {
  const { dispatch } = useCart();
  const imageUrl = item.product.images?.[0] ? urlFor(item.product.images[0]).width(100).height(100).url() : "https://placehold.co/100x100";


  const handleVariantChange = (type: 'size' | 'color', value: string) => {
    const newItem: CartItem = {
      ...item,
      [type]: value,
    };

    dispatch({
      type: 'UPDATE_VARIANT',
      payload: {
        oldSize: item.size,
        oldColor: item.color,
        newItem: newItem,
      }
    });
  };

  return (
    <div className="flex gap-4">
      <Image
        src={imageUrl}
        alt={item.product.name}
        width={80}
        height={80}
        className="rounded-md object-cover"
      />
      <div className="flex flex-col text-sm flex-grow gap-2">
        <div>
          <h3 className="font-medium line-clamp-2">{item.product.name}</h3>
          <p className="font-semibold mt-1">{formatRupiah(item.product.price)}</p>
        </div>
        
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
             <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                dispatch({
                  type: "UPDATE_QUANTITY",
                  payload: { ...item, productId: item.product._id, quantity: item.quantity - 1 },
                })
              }
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
               onClick={() =>
                dispatch({
                  type: "UPDATE_QUANTITY",
                  payload: { ...item, productId: item.product._id, quantity: item.quantity + 1 },
                })
              }
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive h-6 w-6"
            onClick={() =>
              dispatch({
                type: "REMOVE_ITEM",
                payload: { ...item, productId: item.product._id },
              })
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>                      
        </div>
      </div>
    </div>
  );
}

export function CartSheet() {
  const { state } = useCart();
  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = state.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4">
              <div className="flex flex-col gap-6">
                {state.items.map((item) => (
                  <CartItem key={`${item.product._id}-${item.size}-${item.color}`} item={item} />
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-4">
              <div className="w-full space-y-4">
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <SheetClose asChild>
                    <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </p>
            <SheetClose asChild>
                <Button asChild variant="link" className="mt-4 text-primary">
                    <Link href="/shop">Start Shopping</Link>
                </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

