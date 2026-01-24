
import { client } from "@/sanity/client";
import ShopClientComponent from "../../ShopClientComponent";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Product } from "@/lib/data";

// Allow dynamic params for new categories that weren't generated at build time
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await client.fetch<{ slug: { current: string } }[]>(`*[_type == "productCategory" && defined(slug.current)]{ "slug": slug }`, {}, { next: { tags: ['categories'] } });
  return categories.map((category) => ({
    categoryName: category.slug.current,
  }));
}

async function getCategoryData(categoryName: string) {
  const categoryQuery = `*[_type == "productCategory" && slug.current == $categoryName][0]{ title, "slug": slug.current }`;

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

  const category = await client.fetch<{ title: string, slug: string } | null>(categoryQuery, { categoryName }, { next: { tags: ['categories'] } });
  if (!category) return { category: null, products: [], allBrands: [], allCategories: [] };

  const products = await client.fetch<Product[]>(productsQuery, { categoryName }, { next: { tags: ['products'] } });

  // Extract unique brands from the fetched products for this category
  const allBrands = [...new Set(products.map(p => p.brand.title).filter(Boolean))].sort();

  return { category, products, allBrands, allCategories: [category.title] };
}

export async function generateMetadata({ params }: { params: Promise<{ categoryName: string }> }): Promise<Metadata> {
  const { categoryName } = await params;
  const { category } = await getCategoryData(categoryName);

  if (!category) {
    return {
      title: "Category not found"
    }
  }

  const description = `Jelajahi koleksi ${category.title} terbaik di Dab Hobbies. Temukan helm, jaket, dan perlengkapan lainnya dengan kualitas terjamin.`;

  return {
    title: `${category.title} | Dab Hobbies`,
    description: description,
    openGraph: {
      title: `${category.title} | Dab Hobbies`,
      description: description,
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ categoryName: string }> }) {
  const { categoryName } = await params;
  const { category, products, allBrands, allCategories } = await getCategoryData(categoryName);

  if (!category) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    { label: category.title, href: `/shop/category/${categoryName}` }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container text-center pt-12">
        <h1 className="text-4xl font-bold uppercase">{category.title}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Jelajahi semua produk dalam kategori {category.title}. Gunakan filter di samping untuk menemukan perlengkapan yang paling sesuai untuk Anda.
        </p>
      </div>
      <ShopClientComponent products={products} allCategories={allCategories} allBrands={allBrands} />
    </>
  );
}
