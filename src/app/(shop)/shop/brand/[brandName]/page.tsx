
import { client } from "@/sanity/client";
import { ProductCard } from "@/components/ProductCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Product } from "@/lib/data";

export async function generateStaticParams() {
  const brands = await client.fetch< {slug: {current: string}}[] >(`*[_type == "productBrand" && defined(slug.current)]{ "slug": slug }`);
  return brands.map((brand) => ({
    brandName: brand.slug.current,
  }));
}

async function getBrandData(brandName: string) {
    const brandQuery = `*[_type == "productBrand" && slug.current == $brandName][0]{ title }`;
    const productsQuery = `*[_type == "product" && brand->slug.current == $brandName]{
      _id,
      name,
      slug,
      price,
      images,
      brand->{title},
      category->{title},
      rating,
      reviewCount
    }`;

    const brand = await client.fetch<{title: string} | null>(brandQuery, { brandName });
    if (!brand) return { brand: null, products: [] };
    
    const products = await client.fetch<Product[]>(productsQuery, { brandName });
    return { brand, products };
}


export async function generateMetadata({ params }: { params: { brandName: string } }): Promise<Metadata> {
    const { brand } = await getBrandData(params.brandName);
    if (!brand) {
        return {
            title: "Brand not found"
        }
    }
    return {
        title: `${brand.title} | Dab Hobbies`
    }
}


export default async function BrandPage({ params }: { params: { brandName: string } }) {
  const { brand, products: filteredProducts } = await getBrandData(params.brandName);

  if (!brand) {
    notFound();
  }
  
  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    { label: brand.title, href: `/shop/brand/${params.brandName}` }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container mx-auto py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12 uppercase">
          {brand.title}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
