import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { createOzowCheckoutRequest, OzowCheckoutRequest } from '@/integrations/ozow';

const shippingSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'Province is required'),
  zipCode: z.string().min(4, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

type ShippingForm = z.infer<typeof shippingSchema>;

const saveGuestPendingOrder = (
  orderId: string,
  items: unknown[],
  total: number,
  shippingAddress: ShippingForm
) => {
  localStorage.setItem(
    `chief-fashion-pending-order-${orderId}`,
    JSON.stringify({
      id: orderId,
      items,
      total,
      shippingAddress,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});
  const [paymentRequest, setPaymentRequest] = useState<OzowCheckoutRequest | null>(null);

  const [form, setForm] = useState<ShippingForm>({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'South Africa',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const orderId = params.get('orderId');

    if (paymentStatus === 'success' && orderId) {
      clearCart();
      toast.success('Payment submitted. Order confirmation will follow after Ozow verification.');
      navigate('/order-confirmation', { replace: true });
    } else if (paymentStatus === 'cancelled') {
      toast.error('Payment was cancelled');
      navigate('/checkout', { replace: true });
    } else if (paymentStatus === 'error') {
      toast.error('Payment could not be processed. Please try again.');
      navigate('/checkout', { replace: true });
    }
  }, [navigate, clearCart]);

  useEffect(() => {
    if (paymentRequest) {
      const form = document.getElementById('ozow-form') as HTMLFormElement;
      if (form) {
        form.submit();
      }
    }
  }, [paymentRequest]);

  const total = getTotal();
  const shipping = total >= 1500 ? 0 : 100;
  const tax = 0;
  const grandTotal = total + shipping + tax;

  const updateForm = (field: keyof ShippingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = shippingSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<ShippingForm> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ShippingForm;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image,
      }));

      const orderId = crypto.randomUUID();
      const baseUrl = window.location.origin;

      if (user?.id) {
        const { error: orderError } = await supabase.from('orders').insert({
          id: orderId,
          user_id: user.id,
          items: orderItems,
          total: grandTotal,
          status: 'pending',
          shipping_address: form,
        });

        if (orderError) throw orderError;
      } else {
        saveGuestPendingOrder(orderId, orderItems, grandTotal, form);
      }

      const request = await createOzowCheckoutRequest(
        orderId,
        items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        form.fullName,
        form.email,
        baseUrl
      );
      setPaymentRequest(request);

    } catch (error) {
      console.error('Order error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to process payment. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-narrow text-center">
            <h1 className="font-display text-3xl">Your bag is empty</h1>
            <p className="mt-4 text-muted-foreground">Add some items to checkout.</p>
            <Button asChild className="mt-8">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-wide">
          <h1 className="font-display text-4xl font-light">Checkout</h1>

          <form onSubmit={handleSubmit} className="mt-12 grid gap-12 lg:grid-cols-2">
            {/* Shipping Form */}
            <div>
              <h2 className="text-lg font-semibold">Shipping Information</h2>

              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => updateForm('fullName', e.target.value)}
                      className={cn(errors.fullName && 'border-destructive')}
                    />
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className={cn(errors.email && 'border-destructive')}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    className={cn(errors.phone && 'border-destructive')}
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    className={cn(errors.address && 'border-destructive')}
                  />
                  {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => updateForm('city', e.target.value)}
                      className={cn(errors.city && 'border-destructive')}
                    />
                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Province</Label>
                    <Input
                      id="state"
                      value={form.state}
                      onChange={(e) => updateForm('state', e.target.value)}
                      className={cn(errors.state && 'border-destructive')}
                    />
                    {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={form.zipCode}
                      onChange={(e) => updateForm('zipCode', e.target.value)}
                      className={cn(errors.zipCode && 'border-destructive')}
                    />
                    {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) => updateForm('country', e.target.value)}
                    className={cn(errors.country && 'border-destructive')}
                  />
                  {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="rounded-lg border border-border bg-secondary/30 p-6">
                <h2 className="text-lg font-semibold">Order Summary</h2>

                <div className="mt-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-20 w-16 flex-shrink-0 overflow-hidden bg-secondary">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {item.size} / {item.color} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium">R {(item.price * item.quantity).toFixed(2)} ZAR</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2 border-t border-border pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R {total.toFixed(2)} ZAR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping (The Courier Guy)</span>
                    <span className="text-gold">
                      {shipping === 0 ? 'Free' : `R ${shipping.toFixed(2)} ZAR`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>R {tax.toFixed(2)} ZAR</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold">
                    <span>Total</span>
                    <span>R {grandTotal.toFixed(2)} ZAR</span>
                  </div>
                </div>

                <Button type="submit" className="mt-6 w-full" size="lg" disabled={isLoading}>
                  {isLoading ? 'Redirecting to Payment...' : 'Proceed to Payment'}
                </Button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Secure payment powered by Ozow
                </p>
                <p className="mt-1 text-center text-xs text-muted-foreground">
                  Delivery nationwide by The Courier Guy · Free delivery on orders of R1500 or more
                </p>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  By placing your order, you agree to our{' '}
                  <Link to="/terms" className="underline hover:text-foreground">
                    Terms of Service
                  </Link>
                  ,{' '}
                  <Link to="/privacy-policy" className="underline hover:text-foreground">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link to="/refund-policy" className="underline hover:text-foreground">
                    Refund Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </form>

          {paymentRequest && (
            <form
              id="ozow-form"
              action={paymentRequest.actionUrl}
              method="post"
              className="hidden"
            >
              {Object.entries(paymentRequest.fields).map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))}
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
