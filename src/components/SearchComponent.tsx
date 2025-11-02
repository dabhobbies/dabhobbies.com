
"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { client, urlFor } from "@/sanity/client";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/lib/data";

export function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function fetchResults() {
      if (debouncedQuery.length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const searchQuery = `
        *[_type == "product" && (
          name match $query || 
          brand->title match $query || 
          category->title match $query
        )] {
          _id,
          name,
          slug,
          price,
          "images": images[].asset->url,
          brand->{title},
          category->{title}
        }[0...5]`;
      
      try {
        const data = await client.fetch<Product[]>(searchQuery, { query: `*${debouncedQuery}*` });
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, [debouncedQuery]);

  const handleFocus = () => setIsFocused(true);

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for products..."
          className="pl-9 h-9 w-full bg-transparent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>
      {isFocused && (query.length > 0) && (
        <div className="absolute top-full mt-2 w-full glass-card p-2 space-y-1 z-50">
          {isLoading ? (
            <div className="text-center p-4 text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <>
              {results.map((product) => (
                <Link
                  href={`/shop/${product.slug.current}`}
                  key={product._id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10"
                  onClick={() => setIsFocused(false)}
                >
                  <Image
                    src={urlFor(product.images[0]).width(50).height(50).url()}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="object-cover rounded-sm"
                  />
                  <div className="flex-grow">
                    <p className="text-sm font-semibold line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.brand.title}</p>
                  </div>
                  <p className="text-sm font-bold">{formatRupiah(product.price)}</p>
                </Link>
              ))}
            </>
          ) : (
            debouncedQuery.length >= 2 && <div className="text-center p-4 text-muted-foreground">No results found.</div>
          )}
        </div>
      )}
    </div>
  );
}

