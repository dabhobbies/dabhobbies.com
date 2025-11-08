
'use client'

import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/sanity/client";
import type { Product } from "@/lib/data";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState }from "react";

const heroSlides = [
    {
        title: "Koleksi Terbaru 2025",
        description: "Temukan perlengkapan berkendara terbaru dengan teknologi dan gaya terdepan.",
        imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxtb3RvcmN5Y2xlfGVufDB8fHx8MTc2MTU4MTkyNnww&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "new motorcycle gear",
        buttonText: "Jelajahi Sekarang",
        buttonLink: "/shop"
    },
    {
        title: "Safety is Priority",
        description: "Berkendara dengan percaya diri menggunakan helm dan protektor berstandar internasional.",
        imageUrl: "https://images.unsplash.com/photo-1591260035149-2829f11fdefe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxtb3RvcmN5Y2xlJTIwaGVsbWV0fGVufDB8fHx8MTc2MTIwMzQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "motorcycle helmet",
        buttonText: "Lihat Koleksi Helm",
        buttonLink: "/shop/category/helmets"
    },
    {
        title: "Diskon Spesial Akhir Pekan",
        description: "Dapatkan diskon hingga 30% untuk item-item pilihan. Terbatas!",
        imageUrl: "https://images.unsplash.com/photo-1592158249887-ac6ae7921691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxsZWF0aGVyJTIwamFja2V0fGVufDB8fHx8MTc2MTI3Nzg2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "leather jacket sale",
        buttonText: "Belanja Diskon",
        buttonLink: "/shop"
    }
];

export default function Home() {
  const [data, setData] = useState<{ featuredProducts: Product[], categories: any[], brands: any[] } | null>(null);

  useEffect(() => {
    async function getFeaturedData() {
        const featuredProductsQuery = `*[_type == "product" && category->slug.current == "helmets"] | order(rating desc)[0...20]{
          _id,
          name,
          slug,
          price,
          "images": images[].asset->url,
          brand->{title},
          category->{title}
        }`;
        const categoriesQuery = `*[_type == "productCategory"] | order(title asc){
          title,
          slug,
          "imageUrl": image.asset->url
        }`;
        const brandsQuery = `*[_type == "productBrand"] | order(title asc){
          title,
          slug,
          "imageUrl": image.asset->url
        }`;

        const [featuredProducts, categories, brands] = await Promise.all([
          client.fetch<Product[]>(featuredProductsQuery),
          client.fetch<{title: string, slug: {current: string}, imageUrl: string}[]>(categoriesQuery),
          client.fetch<{title: string, slug: {current: string}, imageUrl: string}[]>(brandsQuery)
        ]);
        
        setData({ featuredProducts, categories, brands });
    }
    getFeaturedData();
  }, []);

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
      <section className="relative h-[85vh] w-full text-white">
        <Carousel
            plugins={[
                Autoplay({
                delay: 5000,
                stopOnInteraction: true,
                }),
            ]}
            className="w-full h-full"
            >
            <CarouselContent>
                {heroSlides.map((slide, index) => (
                <CarouselItem key={index}>
                    <div className="relative w-full h-[85vh]">
                        <Image
                            src={slide.imageUrl}
                            alt={slide.description}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            data-ai-hint={slide.imageHint}
                        />
                        <div className="absolute inset-0 bg-black/50" />
                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8 max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase drop-shadow-lg">
                                {slide.title}
                            </h1>
                            <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-md">
                                {slide.description}
                            </p>
                            <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg uppercase">
                                <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                            </Button>
                        </div>
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12 uppercase">
            Featured Products
          </h2>
          {data && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {data.featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Button asChild variant="outline" size="lg" className="uppercase bg-transparent hover:bg-primary/10">
                  <Link href="/shop" prefetch={true}>View All Products</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="bg-secondary/50 py-16 md:py-24">
          <div className="container">
              <h2 className="text-3xl font-bold tracking-tight text-center mb-12 uppercase">Shop by Category</h2>
              {data && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {data.categories.map(c => (
                        <Link href={`/shop/category/${c.slug.current}`} key={c.slug.current} className="group block text-center" prefetch={true}>
                            <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg">
                                {c.imageUrl && <Image src={c.imageUrl} alt={c.title} width={400} height={400} className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105" />}
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300"/>
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-foreground group-hover:text-primary transition-colors uppercase">{c.title}</h3>
                        </Link>
                    ))}
                </div>
              )}
          </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 md:py-24">
          <div className="container">
              <h2 className="text-3xl font-bold tracking-tight text-center mb-12 uppercase">Shop by Brand</h2>
              {data && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {data.brands.map(b => (
                         <Link href={`/shop/brand/${b.slug.current}`} key={b.slug.current} className="group block text-center" prefetch={true}>
                             <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg">
                                {b.imageUrl && <Image src={b.imageUrl} alt={b.title} width={400} height={400} className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"/>}
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300"/>
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-foreground group-hover:text-primary transition-colors uppercase">{b.title}</h3>
                        </Link>
                    ))}
                </div>
              )}
          </div>
      </section>

    </div>
  );
}
