import { Link } from 'react-router-dom';

const footerNavigation = {
  shop: [
    { name: 'New Arrivals', href: '/shop?category=new-arrivals' },
    { name: 'Dresses', href: '/shop?category=dresses' },
    { name: 'Tops', href: '/shop?category=tops' },
    { name: 'Bottoms', href: '/shop?category=bottoms' },
    { name: 'Outerwear', href: '/shop?category=outerwear' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  support: [
    { name: 'Delivery (The Courier Guy)', href: '/shipping' },
    { name: 'Returns & Exchanges', href: '/refund-policy' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'FAQ', href: '/faq' },
    {
      name: 'Track Order',
      href: 'https://portal.thecourierguy.co.za/track',
      external: true,
    },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Refund Policy', href: '/refund-policy' },
  ],
};

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Shop
            </h3>
            <ul className="mt-6 space-y-4">
              {footerNavigation.shop.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="mt-6 space-y-4">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Support
            </h3>
            <ul className="mt-6 space-y-4">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  {'external' in item && item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="mt-6 space-y-4">
              {footerNavigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Link to="/" className="font-display text-2xl font-semibold tracking-wide">
              Chief Fashion
            </Link>
            <p className="text-sm text-muted-foreground">
              Nationwide delivery via The Courier Guy · Secure payments by Ozow
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Chief Fashion. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
