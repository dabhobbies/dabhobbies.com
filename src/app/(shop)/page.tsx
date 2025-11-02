import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/sanity/client";
import type { Product } from "@/lib/data";

async function getFeaturedData() {
    const featuredProductsQuery = `*[_type == "product"] | order(rating desc)[0...4]{
      _id,
      name,
      slug,
      price,
      "images": images[].asset->url,
      brand->{title},
      category->{title}
    }`;
    const categoriesQuery = `*[_type == "productCategory"]{
      title,
      slug,
      "imageUrl": image.asset->url
    }`;
     const brandsQuery = `*[_type == "productBrand"]{
      title,
      slug,
      "imageUrl": image.asset->url
    }`;

    const [featuredProducts, categories, brands] = await Promise.all([
      client.fetch<Product[]>(featuredProductsQuery),
      client.fetch<{title: string, slug: {current: string}, imageUrl: string}[]>(categoriesQuery),
      client.fetch<{title: string, slug: {current: string}, imageUrl: string}[]>(brandsQuery)
    ]);
    
    return { featuredProducts, categories, brands };
}

export default async function Home() {
  const { featuredProducts, categories, brands } = await getFeaturedData();
  const heroImage = {
      imageUrl: "https://images.unsplash.com/photo-1542227844-5e56c7c2687d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxtb3RvcmN5Y2xlJTIwcm9hZHxlbnwwfHx8fDE3NjEyMDQ0Njh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "A scenic motorcycle ride on a winding road.",
      imageHint: "motorcycle road"
  }

  return (
    <div>
      <div className="fixed inset-0 -z-10">
        <Image 
          src="https://www.transparenttextures.com/patterns/dark-denim.png"
          alt="Background texture"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a0a0a] to-background opacity-90"/>
      </div>
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
              <ProductCard key={product._id} product={product} />
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
                  {categories.map(c => (
                      <Link href={`/shop/category/${c.slug.current}`} key={c.slug.current} className="group block text-center" prefetch={true}>
                          <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg">
                              {c.imageUrl && <Image src={c.imageUrl} alt={c.title} width={400} height={400} className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105" />}
                              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300"/>
                          </div>
                          <h3 className="mt-4 text-xl font-semibold text-foreground group-hover:text-primary transition-colors uppercase">{c.title}</h3>
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
                  {brands.map(b => (
                       <Link href={`/shop/brand/${b.slug.current}`} key={b.slug.current} className="group block text-center" prefetch={true}>
                           <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg">
                              {b.imageUrl && <Image src={b.imageUrl} alt={b.title} width={400} height={400} className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"/>}
                              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300"/>
                          </div>
                          <h3 className="mt-4 text-xl font-semibold text-foreground group-hover:text-primary transition-colors uppercase">{b.title}</h3>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

    </div>
  );
}
