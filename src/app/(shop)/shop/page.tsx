
import { client } from "@/sanity/client";
import ShopClientComponent from "./ShopClientComponent";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Product } from "@/lib/data";

async function getShopData() {
    const productsQuery = `*[_type == "product"]{
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
    const categoriesQuery = `*[_type == "productCategory"] | order(title asc){ title }`;
    const brandsQuery = `*[_type == "productBrand"] | order(title asc){ title }`;

    const [products, categories, brands] = await Promise.all([
      client.fetch<Product[]>(productsQuery),
      client.fetch<{title: string}[]>(categoriesQuery),
      client.fetch<{title: string}[]>(brandsQuery)
    ]);
    
    return { 
        products, 
        categories: categories.map(c => c.title), 
        brands: brands.map(b => b.title)
    };
}


export default async function AllProductsPage() {
  const { products, categories, brands } = await getShopData();

  return (
    <>
      <Breadcrumbs items={[{ label: "Shop", href: "/shop" }]} />
      <ShopClientComponent products={products} allCategories={categories} allBrands={brands} />
    </>
  );
}
