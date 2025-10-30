

// This is a server component
import { notFound } from "next/navigation";
import ProductClientComponent from "./ProductClientComponent";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { client } from "@/sanity/client";
import type { Product } from "@/lib/data";

async function getProductData(slug: string) {
    const productQuery = `*[_type == "product" && slug.current == $slug][0]{
        ...,
        brand->,
        category->
    }`;
    const product = await client.fetch<Product | null>(productQuery, { slug });

    if (!product) return { product: null, relatedProducts: [] };

    const relatedProductsQuery = `*[_type == "product" && category->slug.current == $categorySlug && slug.current != $slug][0...4]{
        _id,
        name,
        slug,
        price,
        images,
        brand->{title},
        category->{title}
    }`;
    const relatedProducts = await client.fetch<Product[]>(relatedProductsQuery, { 
        categorySlug: product.category.slug.current,
        slug: product.slug.current
    });
    
    return { product, relatedProducts };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { product, relatedProducts } = await getProductData(params.slug);

  if (!product) {
    notFound();
  }

  const breadcrumbItems = [
      { label: "Shop", href: "/shop" },
      { label: product.category.title, href: `/shop/category/${product.category.slug.current}`},
      { label: product.name, href: `/shop/${product.slug.current}` }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container mx-auto py-12 md:py-16">
         <ProductClientComponent product={product} relatedProducts={relatedProducts} />
      </div>
    </>
  );
}

export async function generateStaticParams() {
    const products = await client.fetch< {slug: {current: string}}[] >(`*[_type == "product" && defined(slug.current)]{ "slug": slug }`);
    return products.map(product => ({
        slug: product.slug.current
    }));
}

