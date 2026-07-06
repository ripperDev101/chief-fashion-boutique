import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCartStore, CartItem } from '@/stores/cartStore';
import { cn } from '@/lib/utils';

const CartItemCard = ({ item }: { item: CartItem }) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4">
      <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded bg-secondary">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="text-sm font-medium text-foreground">{item.name}</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {item.size} / {item.color}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <p className="text-sm font-medium">R {(item.price * item.quantity).toFixed(2)} ZAR</p>
        </div>
      </div>
      <button
        onClick={() => removeItem(item.id)}
        className="self-start p-1 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const CartDrawer = () => {
  const { items, isOpen, closeCart, getTotal } = useCartStore();
  const total = getTotal();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm transition-opacity duration-base',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-elegant transition-transform duration-base',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-xl font-semibold">Shopping Bag</h2>
            <button
              onClick={closeCart}
              className="rounded p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto px-6">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
                <div>
                  <p className="font-display text-lg text-foreground">Your bag is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add items to get started
                  </p>
                </div>
                <Button variant="outline" onClick={closeCart} asChild>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-6">
              <div className="flex items-center justify-between text-base font-medium">
                <span>Subtotal</span>
                <span>R {total.toFixed(2)} ZAR</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="mt-6 space-y-3">
                <Button className="w-full" size="lg" asChild onClick={closeCart}>
                  <Link to="/checkout">Checkout</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={closeCart}
                  asChild
                >
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
