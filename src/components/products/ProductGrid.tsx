import { Product } from '@/types/database';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export const ProductGrid = ({ products, className, columns = 4 }: ProductGridProps) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6 lg:gap-8', gridCols[columns], className)}>
      {products.map((product, index) => (
        <div
          key={product.id}
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};
