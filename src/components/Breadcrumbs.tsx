
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  href: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="bg-card/30 backdrop-blur-xl border-b border-white/10">
        <div className="container">
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 h-14 text-sm text-muted-foreground">
                    <li>
                    <Link href="/" className="hover:text-primary transition-colors">
                        Home
                    </Link>
                    </li>
                    {items.map((item, index) => (
                    <li key={item.href} className="flex items-center gap-1.5">
                        <ChevronRight className="h-3.5 w-3.5" />
                        {index === items.length - 1 ? (
                        <span className="font-semibold text-foreground">{item.label}</span>
                        ) : (
                        <Link href={item.href} className="hover:text-primary transition-colors">
                            {item.label}
                        </Link>
                        )}
                    </li>
                    ))}
                </ol>
            </nav>
        </div>
    </div>
  );
}
