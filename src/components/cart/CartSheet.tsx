"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export function CartSheet() {
  const { state, dispatch } = useCart();
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
              <div className="flex flex-col gap-4">
                {state.items.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4">
                    <Image
                      src={item.product.image.imageUrl}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <div className="flex flex-col justify-between text-sm flex-grow">
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-muted-foreground">
                          {item.size} / {item.color}
                        </p>
                        <p className="font-semibold">{formatRupiah(item.product.price)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              dispatch({
                                type: "UPDATE_QUANTITY",
                                payload: { ...item, productId: item.product.id, quantity: item.quantity - 1 },
                              })
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                             onClick={() =>
                              dispatch({
                                type: "UPDATE_QUANTITY",
                                payload: { ...item, productId: item.product.id, quantity: item.quantity + 1 },
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
                              payload: { ...item, productId: item.product.id },
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
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
                <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
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
            <SheetTrigger asChild>
                <Button asChild variant="link" className="mt-4 text-primary">
                    <Link href="/">Start Shopping</Link>
                </Button>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
