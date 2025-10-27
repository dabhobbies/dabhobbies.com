

import { products } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function generateStaticParams() {
  const categories = [...new Set(products.map((p) => p.category))];
  return categories.map((category) => ({
    categoryName: category.toLowerCase(),
  }));
}

export function generateMetadata({ params }: { params: { categoryName: string } }): Metadata {
    const categoryName = params.categoryName;
    const category = products.find(p => p.category.toLowerCase() === categoryName.toLowerCase())?.category;

    if (!category) {
        return {
            title: "Category not found"
        }
    }

    return {
        title: `${category} | Dab Hobbies`
    }
}


export default function CategoryPage({ params }: { params: { categoryName: string } }) {
  const categoryName = params.categoryName;
  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === categoryName.toLowerCase()
  );

  if (filteredProducts.length === 0) {
    notFound();
  }

  const categoryTitle = filteredProducts[0].category;

  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    { label: categoryTitle, href: `/shop/category/${categoryName}` }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container mx-auto py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12 uppercase">
          {categoryTitle}
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
