// src/app/api/revalidate/route.ts

import { type NextRequest } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

// This file is based on the example from the Next.js App Router documentation:
// https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#on-demand-revalidation

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    console.log('Revalidation failed: Invalid secret');
    return new Response('Invalid secret', { status: 401 })
  }

  const body = await request.json();
  // Extract all relevant fields from the webhook payload
  const { _type, slug, category } = body;

  console.log('Revalidation request received:', JSON.stringify(body, null, 2));

  if (!_type) {
    return new Response('Bad Request: Missing _type in body', { status: 400 });
  }

  // Define tags to revalidate based on the document type
  const tagsToRevalidate: { [key: string]: string[] } = {
    product: ['products', 'categories', 'brands'],
    productCategory: ['categories', 'products'],
    productBrand: ['brands', 'products'],
  };

  // Define paths to revalidate based on the document type
  const pathsToRevalidate: { [key: string]: string[] } = {
    product: ['/', '/shop'],
    productCategory: ['/', '/shop'],
    productBrand: ['/', '/shop'],
  };

  const tags = tagsToRevalidate[_type] || [];
  const paths = [...(pathsToRevalidate[_type] || [])];

  // For products, also revalidate the category page
  if (_type === 'product' && category?.slug?.current) {
    const categoryPath = `/shop/category/${category.slug.current}`;
    paths.push(categoryPath);
    console.log(`Adding category path to revalidate: ${categoryPath}`);
  }

  // Revalidate the tags
  tags.forEach(tag => {
    console.log(`Revalidating tag: ${tag}`);
    revalidateTag(tag);
  });

  // Revalidate specific paths
  paths.forEach(path => {
    console.log(`Revalidating path: ${path}`);
    revalidatePath(path, 'page');
  });

  // If a specific slug is provided, revalidate that specific page
  if (slug?.current) {
    if (_type === 'product') {
      const productPath = `/shop/${slug.current}`;
      console.log(`Revalidating product path: ${productPath}`);
      revalidatePath(productPath, 'page');
    } else if (_type === 'productCategory') {
      const categoryPath = `/shop/category/${slug.current}`;
      console.log(`Revalidating category path: ${categoryPath}`);
      revalidatePath(categoryPath, 'page');
    } else if (_type === 'productBrand') {
      const brandPath = `/shop/brand/${slug.current}`;
      console.log(`Revalidating brand path: ${brandPath}`);
      revalidatePath(brandPath, 'page');
    }
  }

  console.log(`Revalidation complete for type: ${_type}. Tags: ${tags.join(', ')}. Paths: ${paths.join(', ')}`);

  return new Response(JSON.stringify({
    revalidated: true,
    now: Date.now(),
    revalidatedTags: tags,
    revalidatedPaths: paths
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

