
// This is a server component
import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import ProductClientComponent from "./ProductClientComponent";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const breadcrumbItems = [
      { label: "Shop", href: "/shop" },
      { label: product.category, href: `/shop/category/${product.category.toLowerCase()}`},
      { label: product.name, href: `/shop/${product.slug}` }
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
