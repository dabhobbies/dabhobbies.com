
"use client";

import type { Product } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart.tsx";
import { useToast } from "@/hooks/use-toast";
import { formatRupiah } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        product,
        quantity: 1,
        size: product.sizes[0],
        color: product.colors[0],
      },
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="p-0">
        <div className="relative group">
          <Link href={`/shop/${product.slug}`}>
            <Image
              src={product.image.imageUrl}
              alt={product.name}
              width={600}
              height={600}
              className="object-cover w-full aspect-square"
              data-ai-hint={product.image.imageHint}
            />
          </Link>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%]">
            <Button 
              className="w-full bg-background/70 backdrop-blur-sm text-foreground hover:bg-background/90 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        </div>
        <div className="p-4">
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-semibold text-lg uppercase h-14 line-clamp-2">{product.name}</h3>
          </Link>
          <p className="text-muted-foreground text-sm">{product.category}</p>
          <p className="font-bold text-lg mt-2">{formatRupiah(product.price)}</p>
        </div>
      </div>
    </div>
  );
}
