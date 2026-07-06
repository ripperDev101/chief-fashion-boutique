import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LogOut, User, Package, Settings } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { OrderItem } from '@/types/database';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  pending: 'bg-gold/10 text-gold',
  paid: 'bg-emerald-500/10 text-emerald-600',
  shipped: 'bg-blue-500/10 text-blue-600',
  delivered: 'bg-emerald-500/10 text-emerald-600',
  cancelled: 'bg-destructive/10 text-destructive',
};

const Account = () => {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-narrow text-center">
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-narrow">
          <h1 className="font-display text-4xl font-light">My Account</h1>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Sidebar */}
            <div className="space-y-2">
              <button className="flex w-full items-center gap-3 rounded-lg bg-secondary p-4 text-left text-sm font-medium">
                <User className="h-5 w-5" />
                Profile
              </button>
              <button className="flex w-full items-center gap-3 p-4 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Package className="h-5 w-5" />
                Orders
              </button>
              <button className="flex w-full items-center gap-3 p-4 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Settings className="h-5 w-5" />
                Settings
              </button>
              <button
                onClick={signOut}
                className="flex w-full items-center gap-3 p-4 text-left text-sm text-destructive transition-colors hover:bg-secondary"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <div className="rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="mt-1 font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="mt-1 font-medium">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                {ordersLoading ? (
                  <p className="mt-6 py-8 text-center text-muted-foreground">Loading orders...</p>
                ) : !orders || orders.length === 0 ? (
                  <div className="mt-6 text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <p className="mt-4 text-muted-foreground">No orders yet</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link to="/shop">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {orders.map((order) => {
                      const items = (order.items as unknown as OrderItem[]) || [];
                      const status = order.status || 'pending';
                      return (
                        <div key={order.id} className="rounded-lg border border-border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium">
                                Order #{order.id.slice(0, 8).toUpperCase()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.created_at
                                  ? new Date(order.created_at).toLocaleDateString('en-ZA', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })
                                  : ''}
                              </p>
                            </div>
                            <span
                              className={cn(
                                'rounded-full px-3 py-1 text-xs font-medium capitalize',
                                statusStyles[status] || 'bg-secondary text-foreground'
                              )}
                            >
                              {status}
                            </span>
                          </div>
                          <div className="mt-3 space-y-1">
                            {items.map((item, index) => (
                              <p key={index} className="text-sm text-muted-foreground">
                                {item.name} ({item.size} / {item.color}) × {item.quantity}
                              </p>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                            <p className="text-xs text-muted-foreground">
                              Delivery by The Courier Guy
                            </p>
                            <p className="text-sm font-semibold">
                              R {Number(order.total).toFixed(2)} ZAR
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
