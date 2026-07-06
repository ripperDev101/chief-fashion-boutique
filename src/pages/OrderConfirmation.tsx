import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';

const OrderConfirmation = () => {
  const { clearCart } = useCartStore();
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');
  const paymentStatus = params.get('payment');

  useEffect(() => {
    if (paymentStatus === 'success') {
      clearCart();
    }
  }, [clearCart, paymentStatus]);

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-narrow text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
            <CheckCircle className="h-10 w-10 text-gold" />
          </div>

          <h1 className="mt-8 font-display text-4xl font-light">Thank You!</h1>

          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Your order has been placed successfully. We'll send you a confirmation email with your
            order details and your Courier Guy tracking number once your parcel is dispatched.
          </p>

          {orderId && (
            <p className="mt-4 text-sm text-muted-foreground">
              Order reference: <span className="font-medium text-foreground">{orderId}</span>
            </p>
          )}

          <div className="mt-8 rounded-lg border border-border bg-secondary/30 p-6">
            <p className="text-sm text-muted-foreground">Estimated Delivery</p>
            <p className="mt-2 text-xl font-medium">5-10 Working Days</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Standard dresses take 5-7 working days to make and Umbaco dresses 7-10, after which
              The Courier Guy delivers door-to-door within 1-3 working days. Track your parcel any
              time at{' '}
              <a
                href="https://portal.thecourierguy.co.za/track"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gold hover:underline"
              >
                portal.thecourierguy.co.za/track
              </a>
              .
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/account">View Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
