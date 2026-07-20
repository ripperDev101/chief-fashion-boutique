import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Package, MapPin, Phone, Mail } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { OrderItem, ShippingAddress } from '@/types/database';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const;

const statusStyles: Record<string, string> = {
  pending: 'bg-gold/10 text-gold',
  paid: 'bg-emerald-500/10 text-emerald-600',
  shipped: 'bg-blue-500/10 text-blue-600',
  delivered: 'bg-emerald-500/10 text-emerald-600',
  cancelled: 'bg-destructive/10 text-destructive',
};

type StatusFilter = 'all' | (typeof ORDER_STATUSES)[number];

const Admin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [filter, setFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    enabled: !!isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) {
      toast.error('Could not update the order status.');
      return;
    }
    toast.success(`Order marked as ${status}`);
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
  };

  if (authLoading || adminLoading) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-narrow text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isAuthenticated && isAdmin === false) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-narrow text-center">
            <h1 className="font-display text-3xl">Not Authorised</h1>
            <p className="mt-4 text-muted-foreground">
              This page is only available to store administrators.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const filteredOrders = (orders ?? []).filter(
    (order) => filter === 'all' || (order.status || 'pending') === filter
  );

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-wide">
          <h1 className="font-display text-4xl font-light">Orders</h1>
          <p className="mt-2 text-muted-foreground">
            Every order with its delivery details. Update the status as you pack, ship with The
            Courier Guy, and deliver.
          </p>

          {/* Status filter */}
          <div className="mt-8 flex flex-wrap gap-2">
            {(['all', ...ORDER_STATUSES] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm capitalize transition-colors',
                  filter === status
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-foreground'
                )}
              >
                {status}
              </button>
            ))}
          </div>

          {ordersLoading ? (
            <p className="mt-12 text-center text-muted-foreground">Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <div className="mt-12 rounded-lg border border-border p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">
                {filter === 'all' ? 'No orders yet.' : `No ${filter} orders.`}
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {filteredOrders.map((order) => {
                const items = (order.items as unknown as OrderItem[]) || [];
                const address = order.shipping_address as unknown as ShippingAddress & {
                  email?: string;
                };
                const status = order.status || 'pending';

                return (
                  <div key={order.id} className="rounded-lg border border-border p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                          <span className="ml-3 text-xs font-normal text-muted-foreground">
                            Ozow ref: CF-{order.id.slice(0, 8)}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleString('en-ZA', {
                                dateStyle: 'long',
                                timeStyle: 'short',
                              })
                            : ''}
                          {' · '}
                          {order.user_id ? 'Account customer' : 'Guest checkout'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium capitalize',
                            statusStyles[status] || 'bg-secondary text-foreground'
                          )}
                        >
                          {status}
                        </span>
                        <Select value={status} onValueChange={(v) => updateStatus(order.id, v)}>
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((s) => (
                              <SelectItem key={s} value={s} className="capitalize">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      {/* Items */}
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Items</h3>
                        <div className="mt-3 space-y-3">
                          {items.map((item, index) => (
                            <div key={index} className="flex gap-3">
                              {item.image && (
                                <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-secondary">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>
                              )}
                              <div className="text-sm">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-muted-foreground">
                                  {item.size} / {item.color} × {item.quantity}
                                </p>
                                <p className="text-muted-foreground">
                                  R {(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 border-t border-border pt-3 text-sm font-semibold">
                          Total: R {Number(order.total).toFixed(2)} ZAR
                        </p>
                      </div>

                      {/* Shipping */}
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">
                          {(address as { deliveryMethod?: string })?.deliveryMethod === 'pickup'
                            ? 'Customer Collection (Pickup — Free)'
                            : 'Ship To (The Courier Guy)'}
                        </h3>
                        {address ? (
                          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <p className="font-medium text-foreground">{address.fullName}</p>
                            <p className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                              <span>
                                {address.address}
                                <br />
                                {address.city}, {address.state} {address.zipCode}
                                <br />
                                {address.country}
                              </span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4 flex-shrink-0" />
                              <a href={`tel:${address.phone}`} className="hover:text-foreground">
                                {address.phone}
                              </a>
                            </p>
                            {address.email && (
                              <p className="flex items-center gap-2">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <a
                                  href={`mailto:${address.email}`}
                                  className="hover:text-foreground"
                                >
                                  {address.email}
                                </a>
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-muted-foreground">
                            No shipping address recorded.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
