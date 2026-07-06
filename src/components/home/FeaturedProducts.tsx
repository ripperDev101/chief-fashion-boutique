import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

export const FeaturedProducts = () => {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        <div className="flex flex-col items-center text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
            Curated Selection
          </p>
          <h2 className="mt-4 font-display text-4xl font-light sm:text-5xl">
            Featured Pieces
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Our most coveted items, carefully selected for their exceptional quality and timeless design.
          </p>
        </div>

        <div className="mt-12 lg:mt-16">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <p className="text-center text-muted-foreground">No featured products available.</p>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/shop" className="group">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
