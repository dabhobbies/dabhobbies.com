
import { products } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === "hero-image")!;
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover brightness-50"
          priority
          data-ai-hint={heroImage.imageHint}
        />
        <div className="relative z-10 p-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase">
            Ride in Style. Ride with Confidence.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90">
            Discover our collection of premium motorcycle apparel, designed for the modern rider.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg uppercase">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12 uppercase">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="uppercase">
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="bg-secondary py-16 md:py-24">
          <div className="container">
              <h2 className="text-3xl font-bold tracking-tight text-center mb-12 uppercase">Shop by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {products.filter((p, i, a) => a.findIndex(t => t.category === p.category) === i).slice(0,4).map(p => (
                      <Link href={`/shop/category/${p.category.toLowerCase()}`} key={p.category} className="group block text-center">
                          <div className="relative overflow-hidden rounded-lg">
                              <Image src={p.image.imageUrl} alt={p.category} width={400} height={400} className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={p.image.imageHint}/>
                              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors"/>
                          </div>
                          <h3 className="mt-4 text-xl font-semibold text-foreground group-hover:text-primary transition-colors uppercase">{p.category}</h3>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

    </div>
  );
}
