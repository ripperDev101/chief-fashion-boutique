import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, Truck, RefreshCw, Shield } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SizeChartDialog } from '@/components/products/SizeChartDialog';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id || '');
  const { data: allProducts } = useProducts();
  const { addItem, closeCart } = useCartStore();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info(
        '• Standard dresses take 5-7 working days\n• Umbaco dresses take 7-10 working days.\n\nThank you for your patience and support.',
        {
          duration: 8000,
        }
      );
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const relatedProducts = allProducts
    ?.filter((p) => p.id !== id && p.category_id === product?.category_id)
    .slice(0, 4);

  const addToCart = () => {
    if (!product) return false;

    if (product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return false;
    }

    if (product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return false;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      size: selectedSize || 'One Size',
      color: selectedColor || 'Default',
      quantity,
    });

    return true;
  };

  const handleAddToCart = () => {
    if (addToCart()) {
      toast.success('Added to cart');
    }
  };

  const handleBuyNow = () => {
    if (addToCart()) {
      closeCart();
      navigate('/checkout');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-wide">
            <div className="grid gap-12 lg:grid-cols-2">
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-narrow text-center">
            <h1 className="font-display text-3xl">Product Not Found</h1>
            <p className="mt-4 text-muted-foreground">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="mt-8">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const mainImage = product.images[selectedImageIndex] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800';

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-wide">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              to="/shop"
              className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Shop
            </Link>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden bg-secondary">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        'h-20 w-16 flex-shrink-0 overflow-hidden border-2 transition-colors',
                        selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {product.category && (
                <Link
                  to={`/shop?category=${product.category.slug}`}
                  className="text-sm uppercase tracking-wider text-gold hover:underline"
                >
                  {product.category.name}
                </Link>
              )}

              <h1 className="mt-2 font-display text-3xl font-light sm:text-4xl">{product.name}</h1>

              <p className="mt-4 text-2xl font-light">R {product.price.toFixed(2)} ZAR</p>

              <p className="mt-6 whitespace-pre-line leading-relaxed text-muted-foreground">{product.description}</p>

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider">Size</h3>
                    <SizeChartDialog />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          'flex h-12 min-w-[48px] items-center justify-center border px-4 text-sm font-medium transition-colors',
                          selectedSize === size
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-foreground hover:border-primary'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          'flex h-12 items-center justify-center border px-4 text-sm font-medium transition-colors',
                          selectedColor === color
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-foreground hover:border-primary'
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-8">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="flex h-12 w-12 items-center justify-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {product.stock > 0 && product.stock <= 10 && (
                    <span className="text-sm text-gold">Only {product.stock} left</span>
                  )}
                </div>
              </div>

              {/* Add to Cart & Buy */}
              <div className="mt-10 space-y-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                </Button>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Sold Out' : 'Buy It Now'}
                </Button>
              </div>

              {/* Benefits */}
              <div className="mt-10 space-y-4 border-t border-border pt-10">
                <div className="flex items-start gap-4">
                  <Truck className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Delivery via The Courier Guy — R100</p>
                    <p className="text-xs text-muted-foreground">
                      Nationwide, door-to-door. Free delivery on orders of R1500 or more.
                    </p>
                    <Link
                      to="/shipping"
                      className="mt-2 inline-block text-xs font-medium uppercase tracking-wider text-gold hover:underline"
                    >
                      Read delivery policy
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <RefreshCw className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Refund Policy</p>
                    <p className="text-xs text-muted-foreground">
                      Exchanges and store credits are available subject to stock and return
                      condition. Chief Fashion does not offer cash refunds.
                    </p>
                    <Link
                      to="/refund-policy"
                      className="mt-2 inline-block text-xs font-medium uppercase tracking-wider text-gold hover:underline"
                    >
                      Read full refund policy
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Secure Checkout</p>
                    <p className="text-xs text-muted-foreground">SSL encrypted payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-24">
              <h2 className="mb-8 font-display text-3xl font-light">You May Also Like</h2>
              <ProductGrid products={relatedProducts} columns={4} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;


