
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
import { urlFor } from "@/sanity/client";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
        <div className="relative group">
          <Link href={`/shop/${product.slug.current}`} prefetch={true}>
            <Image
              src={urlFor(product.images[0]).width(600).height(600).url()}
              alt={product.name}
              width={600}
              height={600}
              className="object-cover w-full aspect-square"
            />
          </Link>
          <Badge variant="default" className="absolute bottom-3 left-3 bg-primary/80 backdrop-blur-sm text-primary-foreground border-none text-[9px] md:text-[10px] px-1.5 py-0.5">
            {product.category.title}
          </Badge>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-muted-foreground text-sm">{product.brand.title}</p>
          <div className="flex-grow min-h-[3rem]">
            <Link href={`/shop/${product.slug.current}`} prefetch={true}>
              <h3 className="font-semibold uppercase line-clamp-2 mt-1">{product.name}</h3>
            </Link>
          </div>
          <div className="flex justify-between items-center mt-auto pt-2">
            <p className="font-bold text-base">{formatRupiah(product.price)}</p>
            <Button
              size="icon"
              variant="outline"
              className="bg-transparent hover:bg-primary/20 hidden md:inline-flex"
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
      </div>
      <QuickAddDialog
        product={product}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
