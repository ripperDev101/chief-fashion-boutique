import { Link } from 'react-router-dom';
import { Product } from '@/types/database';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const mainImage = product.images[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800';

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn('group block', className)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={mainImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-slow group-hover:scale-105"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <span className="text-sm font-medium uppercase tracking-wider text-foreground">
              Sold Out
            </span>
          </div>
        )}
        {product.featured && product.stock > 0 && (
          <div className="absolute left-4 top-4">
            <span className="bg-primary px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary-foreground">
              Featured
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium text-foreground transition-colors group-hover:text-muted-foreground">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">R {product.price.toFixed(2)} ZAR</p>
      </div>
    </Link>
  );
};
