
import { client } from "@/sanity/client";
import { ProductCard } from "@/components/ProductCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Product } from "@/lib/data";

export async function generateStaticParams() {
  const categories = await client.fetch< {slug: {current: string}}[] >(`*[_type == "productCategory" && defined(slug.current)]{ "slug": slug }`);
  return categories.map((category) => ({
    categoryName: category.slug.current,
  }));
}

async function getCategoryData(categoryName: string) {
    const categoryQuery = `*[_type == "productCategory" && slug.current == $categoryName][0]{ title }`;
    const productsQuery = `*[_type == "product" && category->slug.current == $categoryName]{
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

    const category = await client.fetch<{title: string} | null>(categoryQuery, { categoryName });
    if (!category) return { category: null, products: [] };
    
    const products = await client.fetch<Product[]>(productsQuery, { categoryName });
    return { category, products };
}

export async function generateMetadata({ params }: { params: { categoryName: string } }): Promise<Metadata> {
    const { category } = await getCategoryData(params.categoryName);

    if (!category) {
        return {
            title: "Category not found"
        }
    }

    return {
        title: `${category.title} | Dab Hobbies`
    }
}


export default async function CategoryPage({ params }: { params: { categoryName: string } }) {
  const { category, products: filteredProducts } = await getCategoryData(params.categoryName);

  if (!category) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    { label: category.title, href: `/shop/category/${params.categoryName}` }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container mx-auto py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12 uppercase">
          {category.title}
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
