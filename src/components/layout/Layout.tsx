import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WhatsAppFloat } from './WhatsAppFloat';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
    </div>
  );
};
