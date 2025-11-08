// src/app/api/revalidate/route.ts

import { type NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

// This file is based on the example from the Next.js App Router documentation:
// https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#on-demand-revalidation

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
 
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }
 
  const { _type } = await request.json();

  if (!_type) {
    return new Response('Bad Request: Missing _type in body', { status: 400 });
  }

  // Define tags to revalidate based on the document type
  const tagsToRevalidate: { [key: string]: string[] } = {
    product: ['products', 'categories', 'brands'],
    productCategory: ['categories'],
    productBrand: ['brands'],
  };

  const tags = tagsToRevalidate[_type];

  if (!tags) {
     return new Response(`No tags to revalidate for type: ${_type}`, { status: 200 });
  }

  // Revalidate the tags
  tags.forEach(tag => revalidateTag(tag));
  
  console.log(`Revalidated tags: ${tags.join(', ')} for type: ${_type}`);

  return new Response(JSON.stringify({ revalidated: true, now: Date.now(), revalidatedTags: tags }), { status: 200 });
}
