
"use client";

import { useState } from "react";
import type { Product } from "@/lib/data";
import { useCart } from "@/hooks/use-cart.tsx";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { formatRupiah } from "@/lib/utils";
import { urlFor } from "@/sanity/client";


type QuickAddDialogProps = {
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm?: () => void;
};

export function QuickAddDialog({ product, isOpen, onOpenChange, onConfirm }: QuickAddDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');

  const { dispatch } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity, size: selectedSize, color: selectedColor },
    });
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} (${selectedSize}, ${selectedColor}) has been added.`,
    });
    onOpenChange(false);
    onConfirm?.();
    // Reset state for next time
    setTimeout(() => {
        setQuantity(1);
        setSelectedSize(product.sizes?.[0] || '');
        setSelectedColor(product.colors?.[0] || '');
    }, 300)
  };

  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasColors = product.colors && product.colors.length > 0;


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-card">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Select your preferred options before adding to cart.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-4 items-start">
            <Image 
                src={urlFor(product.images[0]).width(100).height(100).url()}
                alt={product.name}
                width={100}
                height={100}
                className="rounded-md object-cover aspect-square"
            />
            <div className="flex-grow">
                <p className="text-xl font-bold">{formatRupiah(product.price)}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {hasSizes && (
                      <div>
                        <label htmlFor="size" className="font-medium text-sm">Size</label>
                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                            <SelectTrigger id="size" className="mt-1 bg-transparent">
                            <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                            {product.sizes.map((size) => (
                                <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                      </div>
                    )}
                    {hasColors && (
                      <div>
                        <label htmlFor="color" className="font-medium text-sm">Color</label>
                        <Select value={selectedColor} onValueChange={setSelectedColor}>
                            <SelectTrigger id="color" className="mt-1 bg-transparent">
                            <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                            {product.colors.map((color) => (
                                <SelectItem key={color} value={color}>{color}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                      </div>
                    )}
                </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <p className="font-medium text-sm">Quantity</p>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold w-10 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" size="lg" className="w-full" onClick={handleAddToCart}>
             <ShoppingCart className="mr-2 h-5 w-5" /> Add {quantity} to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
