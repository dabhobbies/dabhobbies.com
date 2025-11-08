import { client } from "@/sanity/client";
import ShopClientComponent from "../../ShopClientComponent";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Product } from "@/lib/data";

export async function generateStaticParams() {
  const categories = await client.fetch< {slug: {current: string}}[] >(`*[_type == "productCategory" && defined(slug.current)]{ "slug": slug }`, {}, { next: { tags: ['categories'] } });
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
      sizes,
      colors
    }`;

    const category = await client.fetch<{title: string} | null>(categoryQuery, { categoryName }, { next: { tags: ['categories'] } });
    if (!category) return { category: null, products: [], allBrands: [], allCategories: [] };
    
    const products = await client.fetch<Product[]>(productsQuery, { categoryName }, { next: { tags: ['products'] } });

    // Extract unique brands from the fetched products for this category
    const allBrands = [...new Set(products.map(p => p.brand.title).filter(Boolean))].sort();

    return { category, products, allBrands, allCategories: [category.title] };
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
  const { category, products, allBrands, allCategories } = await getCategoryData(params.categoryName);

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
      <ShopClientComponent products={products} allCategories={allCategories} allBrands={allBrands} />
    </>
  );
}
