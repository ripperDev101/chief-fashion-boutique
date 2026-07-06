import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { SearchDialog } from '@/components/search/SearchDialog';

const navigation = [
  { name: 'Shop', href: '/shop' },
  { name: 'New Arrivals', href: '/shop?category=new-arrivals' },
  { name: 'Collections', href: '/shop' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { openCart, getItemCount } = useCartStore();
  const { isAuthenticated } = useAuth();
  const itemCount = getItemCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <nav className="container-wide" aria-label="Top">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Logo - centered on mobile, left on desktop */}
          <div className="pointer-events-none absolute left-1/2 max-w-[calc(100%-220px)] -translate-x-1/2 lg:static lg:max-w-none lg:translate-x-0 lg:flex-1 lg:pointer-events-auto">
            <Link to="/" className="p-1.5 pointer-events-auto">
              <span className="block truncate font-display text-lg font-semibold tracking-wide sm:text-xl lg:text-3xl">
                Chief Fashion
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium tracking-wide uppercase text-foreground/80 transition-colors duration-base hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="relative z-10 flex flex-1 items-center justify-end gap-1 sm:gap-2 lg:gap-4">
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 text-foreground/80 transition-colors hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to={isAuthenticated ? '/account' : '/auth'}
              className="p-2 text-foreground/80 transition-colors hover:text-foreground"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={openCart}
              className="relative p-2 text-foreground/80 transition-colors hover:text-foreground"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            'fixed inset-0 z-50 lg:hidden',
            mobileMenuOpen ? 'visible' : 'invisible'
          )}
        >
          <div
            className={cn(
              'fixed inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-base',
              mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            )}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className={cn(
              'fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-background p-6 shadow-elegant transition-transform duration-base',
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="font-display text-xl font-semibold">Chief Fashion</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-10 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="-mx-3 block rounded-lg px-3 py-3 text-base font-medium tracking-wide uppercase text-foreground hover:bg-secondary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    to={isAuthenticated ? '/account' : '/auth'}
                    className="-mx-3 block rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {isAuthenticated ? 'My Account' : 'Sign In'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};
