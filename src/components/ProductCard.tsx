
"use client";

import type { Product } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { QuickAddDialog } from "./QuickAddDialog";
import { useState } from "react";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
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
                onClick={() => setIsDialogOpen(true)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </div>
          <div className="p-4">
            <p className="text-muted-foreground text-sm">{product.category}</p>
            <Link href={`/shop/${product.slug}`}>
              <h3 className="font-semibold uppercase h-14 line-clamp-2 mt-1">{product.name}</h3>
            </Link>
            <p className="font-bold text-base mt-2">{formatRupiah(product.price)}</p>
          </div>
        </div>
      </div>
      <QuickAddDialog
        product={product}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
