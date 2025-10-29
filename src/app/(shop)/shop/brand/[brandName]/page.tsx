
import { products } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function generateStaticParams() {
  const brands = [...new Set(products.map((p) => p.brand))];
  return brands.map((brand) => ({
    brandName: brand.toLowerCase(),
  }));
}

export function generateMetadata({ params }: { params: { brandName: string } }): Metadata {
    const brandName = params.brandName;
    const brand = products.find(p => p.brand.toLowerCase() === brandName.toLowerCase())?.brand;

    if (!brand) {
        return {
            title: "Brand not found"
        }
    }

    return {
        title: `${brand} | Dab Hobbies`
    }
}


export default function BrandPage({ params }: { params: { brandName: string } }) {
  const brandName = params.brandName;
  const filteredProducts = products.filter(
    (product) => product.brand.toLowerCase() === brandName.toLowerCase()
  );

  if (filteredProducts.length === 0) {
    notFound();
  }

  const brandTitle = filteredProducts[0].brand;
  
  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    { label: brandTitle, href: `/shop/brand/${brandName}` }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container mx-auto py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12 uppercase">
          {brandTitle}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
