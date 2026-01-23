
// This is a server component
import { notFound } from "next/navigation";
import ProductClientComponent from "./ProductClientComponent";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { client, urlFor } from "@/sanity/client";
import type { Product } from "@/lib/data";
import type { Metadata } from 'next';
import { SanityDocument } from "next-sanity";
import { toPlainText } from "@portabletext/react";

async function getProductData(slug: string) {
    const productQuery = `*[_type == "product" && slug.current == $slug][0]{
        ...,
        brand->,
        category->
    }`;
    const product = await client.fetch<Product | null>(productQuery, { slug }, { next: { tags: ['products'] } });

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
    }, { next: { tags: ['products'] } });

    return { product, relatedProducts };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { product } = await getProductData(slug);
    if (!product) {
        return {
            title: "Product not found"
        }
    }
    const description = product.description ? toPlainText(product.description) : 'No description available.';
    return {
        title: `${product.name} | Dab Hobbies`,
        description: description,
        openGraph: {
            title: `${product.name} | Dab Hobbies`,
            description: description,
            images: [
                {
                    url: urlFor(product.images[0]).width(1200).height(630).url(),
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
        },
    }
}


export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { product, relatedProducts } = await getProductData(slug);

    if (!product) {
        notFound();
    }

    const breadcrumbItems = [
        { label: "Shop", href: "/shop" },
        { label: product.category.title, href: `/shop/category/${product.category.slug.current}` },
        { label: product.name, href: `/shop/${product.slug.current}` }
    ];

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description ? toPlainText(product.description) : undefined,
        image: urlFor(product.images[0]).url(),
        sku: product._id,
        brand: {
            '@type': 'Brand',
            name: product.brand.title,
        },
        offers: {
            '@type': 'Offer',
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/${product.slug.current}`,
            priceCurrency: 'IDR',
            price: product.price,
            availability: 'https://schema.org/InStock',
        },
        ...(product.rating && product.reviewCount && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviewCount,
            },
        })
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}`
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <Breadcrumbs items={breadcrumbItems} />
            <div className="container mx-auto py-12 md:py-16">
                <ProductClientComponent product={product} relatedProducts={relatedProducts} />
            </div>
        </>
    );
}

export async function generateStaticParams() {
    const products = await client.fetch<{ slug: { current: string } }[]>(`*[_type == "product" && defined(slug.current)]{ "slug": slug }`);
    return products.map(product => ({
        slug: product.slug.current
    }));
}
