import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];
const COLORS = ['Black', 'White', 'Ivory', 'Cream', 'Navy', 'Grey', 'Camel', 'Burgundy', 'Charcoal', 'Sand', 'Tan', 'Cognac'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Alphabetical' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categorySlug = searchParams.get('category') || undefined;
  const sortBy = (searchParams.get('sort') as 'name' | 'price-asc' | 'price-desc' | 'newest') || 'newest';
  
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);

  const { data: categories } = useCategories();
  const { data: products, isLoading } = useProducts({
    category: categorySlug,
    sortBy,
    sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
    colors: selectedColors.length > 0 ? selectedColors : undefined,
    inStock: inStock || undefined,
  });

  const currentCategory = useMemo(() => {
    return categories?.find((c) => c.slug === categorySlug);
  }, [categories, categorySlug]);

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };

  const handleCategoryChange = (slug: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setInStock(false);
    handleCategoryChange(null);
  };

  const hasActiveFilters = selectedSizes.length > 0 || selectedColors.length > 0 || inStock || categorySlug;

  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryChange(null)}
            className={cn(
              'block w-full text-left text-sm transition-colors',
              !categorySlug ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            All Products
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={cn(
                'block w-full text-left text-sm transition-colors',
                categorySlug === cat.slug ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                'flex h-10 w-10 items-center justify-center border text-xs font-medium transition-colors',
                selectedSizes.includes(size)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:border-primary'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Color</h3>
        <div className="space-y-2">
          {COLORS.map((color) => (
            <label key={color} className="flex cursor-pointer items-center gap-3">
              <Checkbox
                checked={selectedColors.includes(color)}
                onCheckedChange={() => toggleColor(color)}
              />
              <span className="text-sm">{color}</span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex cursor-pointer items-center gap-3">
          <Checkbox checked={inStock} onCheckedChange={() => setInStock(!inStock)} />
          <span className="text-sm font-medium">In Stock Only</span>
        </label>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-wide">
          {/* Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="font-display text-4xl font-light sm:text-5xl">
              {currentCategory?.name || 'All Products'}
            </h1>
            {products && (
              <p className="mt-2 text-muted-foreground">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
            )}
          </div>

          <div className="lg:grid lg:grid-cols-4 lg:gap-12">
            {/* Desktop Filters */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <FiltersContent />
              </div>
            </aside>

            {/* Products */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="mb-8 flex items-center justify-between">
                {/* Mobile filter button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          !
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full max-w-xs overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="hidden lg:block" />

                {/* Sort */}
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product Grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="aspect-[3/4] w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <ProductGrid products={products} columns={3} />
              ) : (
                <div className="py-24 text-center">
                  <p className="text-lg text-muted-foreground">No products found.</p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;

