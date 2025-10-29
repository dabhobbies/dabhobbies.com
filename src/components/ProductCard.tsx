
"use client";

import type { Product } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { QuickAddDialog } from "./QuickAddDialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
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
          <Badge variant="default" className="absolute bottom-3 left-3 bg-primary/80 backdrop-blur-sm text-primary-foreground border-none text-[9px] md:text-[10px] px-1.5 py-0.5">
            {product.category}
          </Badge>
          <div className="absolute bottom-3 right-3">
            <Button
              size="icon"
              className="bg-background/70 backdrop-blur-sm text-foreground hover:bg-background/90 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setIsDialogOpen(true);
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Add to Cart</span>
            </Button>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-muted-foreground text-sm">{product.brand}</p>
          <div className="flex-grow min-h-[3rem]">
            <Link href={`/shop/${product.slug}`}>
              <h3 className="font-semibold uppercase line-clamp-2 mt-1">{product.name}</h3>
            </Link>
          </div>
          <p className="font-bold text-base mt-auto pt-2">{formatRupiah(product.price)}</p>
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
