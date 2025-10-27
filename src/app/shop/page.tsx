"use client";

import { useState, useMemo } from "react";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, ListFilter, X } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

const allCategories = [...new Set(products.map((p) => p.category))];
const allSizes = [...new Set(products.flatMap((p) => p.sizes))];
const allColors = [...new Set(products.flatMap((p) => p.colors))];
const maxPrice = Math.max(...products.map(p => p.price));


export default function AllProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("relevance");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };
  
  const resetFilters = () => {
    setSearchTerm("");
    setSortOrder("relevance");
    setPriceRange([0, maxPrice]);
    setSelectedCategories([]);
    setSelectedRating(0);
    setSelectedSizes([]);
    setSelectedColors([]);
  }

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= selectedRating;
      const matchesSize = 
        selectedSizes.length === 0 || product.sizes.some(s => selectedSizes.includes(s));
      const matchesColor =
        selectedColors.length === 0 || product.colors.some(c => selectedColors.includes(c));

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesSize && matchesColor;
    });

    switch (sortOrder) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // relevance - no specific sort needed if not sorted by user
        break;
    }

    return filtered;
  }, [debouncedSearchTerm, selectedCategories, priceRange, selectedRating, selectedSizes, selectedColors, sortOrder]);
  
  const Filters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2 uppercase">Search</h3>
        <Input
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent"
        />
      </div>
      <Accordion type="multiple" defaultValue={['category', 'price', 'rating']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="font-semibold uppercase">Category</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {allCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <label htmlFor={`cat-${category}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {category}
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="font-semibold uppercase">Price</AccordionTrigger>
          <AccordionContent className="pt-4">
            <Slider
              min={0}
              max={maxPrice}
              step={100000}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{formatRupiah(priceRange[0])}</span>
              <span>{formatRupiah(priceRange[1])}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="rating">
          <AccordionTrigger className="font-semibold uppercase">Rating</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={selectedRating === rating}
                  onCheckedChange={() => setSelectedRating(prev => prev === rating ? 0 : rating)}
                />
                <label htmlFor={`rating-${rating}`} className="flex items-center cursor-pointer">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-primary fill-primary' : 'text-gray-400'}`} />
                  ))}
                  <span className="ml-2 text-sm">& up</span>
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="size">
          <AccordionTrigger className="font-semibold uppercase">Size</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 pt-2">
            {allSizes.map((size) => (
              <Button
                key={size}
                variant={selectedSizes.includes(size) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSizeChange(size)}
                className="bg-transparent hover:bg-primary/20"
              >
                {size}
              </Button>
            ))}
          </AccordionContent>
        </AccordionItem>
         <AccordionItem value="color">
          <AccordionTrigger className="font-semibold uppercase">Color</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 pt-2">
             {allColors.map((color) => (
              <Button
                key={color}
                variant={selectedColors.includes(color) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleColorChange(color)}
                className="capitalize bg-transparent hover:bg-primary/20"
              >
                {color}
              </Button>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button variant="outline" className="w-full bg-transparent hover:bg-primary/20" onClick={resetFilters}>Reset Filters</Button>
    </div>
  );

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold uppercase">All Products</h1>
        <p className="text-muted-foreground mt-2">Find your perfect gear with our advanced filters.</p>
      </div>
      <div className="flex gap-8">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:block w-1/4 xl:w-1/5">
          <div className="sticky top-24 glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 uppercase">Filters</h2>
            <Filters />
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4 xl:w-4/5">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <p className="text-sm text-muted-foreground">{filteredProducts.length} products found</p>
            <div className="flex items-center gap-4">
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px] bg-transparent">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating-desc">Highest Rating</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="lg:hidden bg-transparent" onClick={() => setIsSidebarOpen(true)}>
                <ListFilter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 glass-card">
                <p className="text-lg text-muted-foreground">No products match your criteria.</p>
                <Button variant="link" onClick={resetFilters} className="mt-2">Clear all filters</Button>
            </div>
          )}
        </main>
      </div>

      {/* Sidebar for Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
      <div className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-background/80 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Filters</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                </Button>
            </div>
            <div className="overflow-y-auto flex-grow pr-4 -mr-4">
                <Filters />
            </div>
          </div>
      </div>
    </div>
  );
}
