import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { ChevronDown, Truck, MapPin, ShoppingBag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { createOzowCheckoutRequest, OzowCheckoutRequest } from '@/integrations/ozow';

type DeliveryMethod = 'ship' | 'pickup';

const baseSchema = {
  email: z.string().email('Enter a valid email'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Enter a valid phone number'),
};

const shipSchema = z.object({
  ...baseSchema,
  address: z.string().min(1, 'Address is required'),
  apartment: z.string().optional(),
  company: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'Province is required'),
  zipCode: z.string().min(4, 'Postal code is required'),
});

const pickupSchema = z.object({
  ...baseSchema,
  address: z.string().optional(),
  apartment: z.string().optional(),
  company: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
}

const PICKUP_LOCATION = 'Chief Fashion House, 102 Helen Joseph Street, Johannesburg CBD';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart, removeItem } = useCartStore();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [paymentRequest, setPaymentRequest] = useState<OzowCheckoutRequest | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('ship');
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const [form, setForm] = useState<CheckoutForm>({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
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
      const ozowForm = document.getElementById('ozow-form') as HTMLFormElement;
      if (ozowForm) {
        ozowForm.submit();
      }
    }
  }, [paymentRequest]);

  // Remove cart items whose products no longer exist (e.g. stale carts saved
  // in the browser before a catalogue change).
  useEffect(() => {
    const validateCart = async () => {
      const currentItems = useCartStore.getState().items;
      if (currentItems.length === 0) return;

      const ids = [...new Set(currentItems.map((i) => i.productId))];
      const { data, error } = await supabase.from('products').select('id').in('id', ids);
      if (error || !data) return;

      const validIds = new Set(data.map((p) => p.id));
      const staleItems = currentItems.filter((i) => !validIds.has(i.productId));

      if (staleItems.length > 0) {
        staleItems.forEach((i) => removeItem(i.id));
        toast.error(
          'Some items in your bag are no longer available and were removed. Please re-add them from the shop.'
        );
      }
    };
    validateCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = getTotal();
  const shipping = deliveryMethod === 'pickup' ? 0 : total >= 1500 ? 0 : 100;
  const grandTotal = total + shipping;

  const updateForm = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const schema = deliveryMethod === 'ship' ? shipSchema : pickupSchema;
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof CheckoutForm;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const orderId = crypto.randomUUID();
      const baseUrl = window.location.origin;
      const fullName = `${form.firstName} ${form.lastName}`.trim();

      if (newsletterOptIn) {
        // Best effort — never block checkout on this.
        supabase
          .from('contact_messages')
          .insert({
            name: fullName || 'Newsletter Subscriber',
            email: form.email,
            message: 'Newsletter opt-in from checkout.',
          })
          .then(() => {});
      }

      const shippingAddress = {
        fullName,
        email: form.email,
        phone: form.phone,
        deliveryMethod,
        company: form.company || undefined,
        address:
          deliveryMethod === 'pickup'
            ? PICKUP_LOCATION
            : `${form.address}${form.apartment ? `, ${form.apartment}` : ''}`,
        city: deliveryMethod === 'pickup' ? 'Johannesburg' : form.city,
        state: deliveryMethod === 'pickup' ? 'Gauteng' : form.state,
        zipCode: deliveryMethod === 'pickup' ? '2000' : form.zipCode,
        country: 'South Africa',
      };

      // The ozow-checkout edge function stores the order (guest or account)
      // with the delivery details and returns the signed payment form.
      const request = await createOzowCheckoutRequest(
        orderId,
        items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress,
        baseUrl,
        deliveryMethod
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

  const summaryItems = (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4">
          <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-secondary">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover object-center"
            />
            <span className="absolute -right-0 -top-0 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/80 text-[10px] font-medium text-background">
              {item.quantity}
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <h4 className="text-sm font-medium">{item.name}</h4>
            <p className="text-xs text-muted-foreground">
              {item.size} / {item.color}
            </p>
          </div>
          <p className="self-center text-sm font-medium">
            R {(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );

  const summaryTotals = (
    <div className="space-y-2 border-t border-border pt-4">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>R {total.toFixed(2)} ZAR</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          {deliveryMethod === 'pickup' ? 'Pickup (Chief Fashion House)' : 'Shipping (The Courier Guy)'}
        </span>
        <span className="text-gold">
          {shipping === 0 ? 'Free' : `R ${shipping.toFixed(2)} ZAR`}
        </span>
      </div>
      <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold">
        <span>Total</span>
        <span>
          <span className="mr-2 text-xs font-normal text-muted-foreground">ZAR</span>
          R {grandTotal.toFixed(2)}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">Tax included.</p>
    </div>
  );

  return (
    <Layout>
      {/* Mobile collapsible order summary — Shopify style */}
      <div className="border-b border-border bg-secondary/30 lg:hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen(!summaryOpen)}
          className="container-wide flex w-full items-center justify-between py-4"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-gold">
            <ShoppingBag className="h-4 w-4" />
            Order summary
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', summaryOpen && 'rotate-180')}
            />
          </span>
          <span className="text-lg font-semibold">R {grandTotal.toFixed(2)}</span>
        </button>
        {summaryOpen && (
          <div className="container-wide space-y-4 pb-6">
            {summaryItems}
            {summaryTotals}
          </div>
        )}
      </div>

      <div className="section-padding">
        <div className="container-wide">
          <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-2">
            {/* Left column — contact, delivery, payment */}
            <div className="space-y-10">
              {/* Contact */}
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-light">Contact</h2>
                  {!isAuthenticated && (
                    <Link to="/auth" className="text-sm text-gold underline hover:no-underline">
                      Sign in
                    </Link>
                  )}
                </div>
                <div className="mt-4 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      placeholder="you@example.com"
                      className={cn(errors.email && 'border-destructive')}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Checkbox
                      checked={newsletterOptIn}
                      onCheckedChange={(v) => setNewsletterOptIn(v === true)}
                    />
                    Email me with news and offers
                  </label>
                </div>
              </section>

              {/* Delivery */}
              <section>
                <h2 className="font-display text-2xl font-light">Delivery</h2>

                {/* Ship / Pickup toggle */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-secondary p-1.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('ship')}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-md py-3 text-sm font-medium transition-colors',
                      deliveryMethod === 'ship'
                        ? 'bg-background shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Truck className="h-4 w-4" />
                    Ship
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-md py-3 text-sm font-medium transition-colors',
                      deliveryMethod === 'pickup'
                        ? 'bg-background shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <MapPin className="h-4 w-4" />
                    Pickup
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Country/Region</Label>
                    <Input value="South Africa" disabled />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) => updateForm('firstName', e.target.value)}
                        className={cn(errors.firstName && 'border-destructive')}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) => updateForm('lastName', e.target.value)}
                        className={cn(errors.lastName && 'border-destructive')}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {deliveryMethod === 'ship' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company (optional)</Label>
                        <Input
                          id="company"
                          value={form.company}
                          onChange={(e) => updateForm('company', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={form.address}
                          onChange={(e) => updateForm('address', e.target.value)}
                          className={cn(errors.address && 'border-destructive')}
                        />
                        {errors.address && (
                          <p className="text-sm text-destructive">{errors.address}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                        <Input
                          id="apartment"
                          value={form.apartment}
                          onChange={(e) => updateForm('apartment', e.target.value)}
                        />
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
                          {errors.state && (
                            <p className="text-sm text-destructive">{errors.state}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">Postal code</Label>
                          <Input
                            id="zipCode"
                            value={form.zipCode}
                            onChange={(e) => updateForm('zipCode', e.target.value)}
                            className={cn(errors.zipCode && 'border-destructive')}
                          />
                          {errors.zipCode && (
                            <p className="text-sm text-destructive">{errors.zipCode}</p>
                          )}
                        </div>
                      </div>

                      {/* Shipping method */}
                      <div className="rounded-lg border border-border p-4">
                        <p className="text-sm font-medium">Shipping method</p>
                        <div className="mt-2 flex items-center justify-between rounded-md bg-secondary/50 p-3 text-sm">
                          <span className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            The Courier Guy — door-to-door
                          </span>
                          <span className="font-medium text-gold">
                            {shipping === 0 ? 'Free' : `R ${shipping.toFixed(2)}`}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Free delivery on orders of R1500 or more.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium">Chief Fashion House</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            102 Helen Joseph Street, Johannesburg CBD
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            Usually ready in 5–7 working days (Umbaco pieces 7–10). We'll contact
                            you on the number below when your order is ready for collection.
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gold">Free</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      placeholder="e.g. 078 957 6675"
                      className={cn(errors.phone && 'border-destructive')}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="font-display text-2xl font-light">Payment</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  All transactions are secure and encrypted.
                </p>
                <div className="mt-4 rounded-lg border border-border p-4 text-sm">
                  <p className="font-medium">Ozow — Instant EFT (pay by bank)</p>
                  <p className="mt-1 text-muted-foreground">
                    You'll be redirected to Ozow to approve the payment securely from your bank.
                    No card needed.
                  </p>
                </div>

                <Button type="submit" className="mt-6 w-full" size="lg" disabled={isLoading}>
                  {isLoading
                    ? 'Redirecting to Payment...'
                    : deliveryMethod === 'pickup'
                      ? 'Pay Now — Collect In Store'
                      : 'Pay Now'}
                </Button>

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
              </section>
            </div>

            {/* Right column — order summary (desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-28 rounded-lg border border-border bg-secondary/30 p-6">
                <h2 className="text-lg font-semibold">Order summary</h2>
                <div className="mt-6">{summaryItems}</div>
                <div className="mt-6">{summaryTotals}</div>
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