
import { MetadataRoute } from 'next'
import { client } from '@/sanity/client';

type SanitySlug = {
    slug: {
        current: string;
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    // Get static pages
    const staticRoutes = [
        '',
        '/shop',
        '/about',
        '/contact'
    ].map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Get dynamic pages from Sanity
    const productSlugs: SanitySlug[] = await client.fetch(`*[_type == "product" && defined(slug.current)]{slug}`);
    const productRoutes = productSlugs.map(({ slug }) => ({
        url: `${siteUrl}/shop/${slug.current}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9
    }));
    
    const categorySlugs: SanitySlug[] = await client.fetch(`*[_type == "productCategory" && defined(slug.current)]{slug}`);
    const categoryRoutes = categorySlugs.map(({ slug }) => ({
        url: `${siteUrl}/shop/category/${slug.current}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7
    }));

    const brandSlugs: SanitySlug[] = await client.fetch(`*[_type == "productBrand" && defined(slug.current)]{slug}`);
    const brandRoutes = brandSlugs.map(({ slug }) => ({
        url: `${siteUrl}/shop/brand/${slug.current}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6
    }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...brandRoutes
  ];
}
