
import Link from 'next/link';
import { client } from '@/sanity/client';

type Category = {
  title: string;
  slug: {
    current: string;
  };
};

export async function CategoryNav() {
  const categories = await client.fetch<Category[]>(`*[_type == "productCategory"] | order(title asc)`);

  return (
    <div className="bg-card/30 backdrop-blur-xl border-b border-white/10">
      <div className="container">
        <nav aria-label="Categories">
          <div className="flex items-center gap-6 h-12 text-sm text-muted-foreground whitespace-nowrap overflow-x-auto">
            <Link href="/shop" className="hover:text-primary transition-colors font-semibold flex-shrink-0" prefetch={true}>
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug.current}
                href={`/shop/category/${category.slug.current}`}
                className="hover:text-primary transition-colors flex-shrink-0"
                prefetch={true}
              >
                {category.title}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
