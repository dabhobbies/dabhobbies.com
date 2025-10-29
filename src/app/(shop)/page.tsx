

import { products } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === "hero-image")!;
  const featuredProducts = products.slice(0, 4);
  const uniqueCategories = products.filter((p, i, a) => a.findIndex(t => t.category === p.category) === i).slice(0,4)
  const uniqueBrands = products.filter((p, i, a) => a.findIndex(t => t.brand === p.brand) === i).slice(0,4)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-8 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase drop-shadow-lg">
            Ride in Style. Ride with Confidence.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-md">
            Discover our collection of premium motorcycle apparel, designed for the modern rider.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg uppercase">
            <Link href="/shop" prefetch={true}>Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12 uppercase">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="uppercase bg-transparent hover:bg-primary/10">
              <Link href="/shop" prefetch={true}>View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="bg-secondary/50 py-16 md:py-24">
          <div className="container">
              <h2 className="text-3xl font-bold tracking-tight text-center mb-12 uppercase">Shop by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {uniqueCategories.map(p => (
                      <Link href={`/shop/category/${p.category.toLowerCase()}`} key={p.category} className="group block text-center" prefetch={true}>
                          <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg">
                              <Image src={p.image.imageUrl} alt={p.category} width={400} height={400} className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={p.image.imageHint}/>
                              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300"/>
                          </div>
                          <h3 className="mt-4 text-xl font-semibold text-foreground group-hover:text-primary transition-colors uppercase">{p.category}</h3>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 md:py-24">
          <div className="container">
              <h2 className="text-3xl font-bold tracking-tight text-center mb-12 uppercase">Shop by Brand</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {uniqueBrands.map(p => (
                      <Link href={`/shop/brand/${p.brand.toLowerCase()}`} key={p.brand} className="group block text-center" prefetch={true}>
                           <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg">
                              <Image src={p.image.imageUrl} alt={p.brand} width={400} height={400} className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={p.image.imageHint}/>
                              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300"/>
                          </div>
                          <h3 className="mt-4 text-xl font-semibold text-foreground group-hover:text-primary transition-colors uppercase">{p.brand}</h3>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

    </div>
  );
}
