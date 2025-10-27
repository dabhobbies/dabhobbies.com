
"use client";

import type { Product } from "@/lib/data";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Minus, Plus, ShoppingCart, ShieldCheck, Wrench, Award, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart.tsx";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/data";
import { formatRupiah } from "@/lib/utils";

const DetailSection = ({ title, icon, items }: { title: string, icon: React.ReactNode, items: string[] | null | undefined }) => {
    if (!items || items.length === 0) return null;
    return (
        <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                {icon} {title}
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
                {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </div>
    );
};


export default function ProductClientComponent({ product, relatedProducts }: { product: Product, relatedProducts: Product[] }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const { dispatch } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity, size: selectedSize, color: selectedColor },
    });
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <Carousel className="w-full">
          <CarouselContent>
            {[product.image, ...products.slice(0,2).map(p=>p.image)].map((img, index) => (
              <CarouselItem key={index}>
                <Image
                  src={img.imageUrl}
                  alt={`${product.name} image ${index + 1}`}
                  width={800}
                  height={800}
                  className="w-full aspect-square object-cover rounded-lg"
                  data-ai-hint={img.imageHint}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-primary font-semibold">{product.brand}</p>
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? 'text-primary fill-primary' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">
              ({product.reviewCount} reviews)
            </span>
          </div>
          <p className="text-3xl font-bold">{formatRupiah(product.price)}</p>
          <Separator />
          <p className="text-muted-foreground">{product.description}</p>
          
          <div className="space-y-4 text-sm">
              <DetailSection title="Materials" icon={<Wrench className="h-5 w-5 text-primary" />} items={product.materials} />
              <DetailSection title="Protection" icon={<ShieldCheck className="h-5 w-5 text-primary" />} items={product.protection} />
              <DetailSection title="Special Features" icon={<Sparkles className="h-5 w-5 text-primary" />} items={product.specialFeatures} />
              
              {product.certification && (
                  <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                          <Award className="h-5 w-5 text-primary" /> Certification
                      </h3>
                      <p className="text-muted-foreground pl-2">{product.certification}</p>
                  </div>
              )}
               <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <User className="h-5 w-5 text-primary" /> Gender
                    </h3>
                    <p className="text-muted-foreground pl-2">{product.gender}</p>
                </div>
          </div>

          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="size" className="font-medium text-sm">Size</label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger id="size" className="mt-1">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="color" className="font-medium text-sm">Color</label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger id="color" className="mt-1">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {product.colors.map((color) => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold w-10 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-24">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </div>
    </>
  );
}

    