import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

const Terms = () => {
  return (
    <Layout>
      <div className="section-padding">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">Legal</p>
            <h1 className="mt-4 font-display text-4xl font-light sm:text-5xl">Terms of Service</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              These Terms of Service ("Terms") govern your use of the Chief Fashion website and
              your purchase of any products from Chief Fashion House ("Chief Fashion", "we", "us").
              By browsing this website, creating an account, or placing an order, you agree to
              these Terms. If you do not agree, please do not use this website.
            </p>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">1. About Us</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Chief Fashion House is a South African fashion house located at 102 Helen Joseph
                Street, Johannesburg CBD, South Africa. You can contact us at{' '}
                <a
                  href="mailto:chieffashion333@gmail.com"
                  className="font-medium text-gold hover:underline"
                >
                  chieffashion333@gmail.com
                </a>{' '}
                or on WhatsApp at +27 78 957 6675.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">2. Orders</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {[
                  'An order placed on this website is an offer by you to purchase the selected products. An order is only accepted by us once payment has been received and confirmed.',
                  'We reserve the right to refuse or cancel any order, for example where a product is out of stock, where there is an obvious pricing or product description error, or where we suspect fraud. If we cancel a paid order, you will be refunded in full for that order.',
                  'Many of our garments are made to order. Standard dresses take 5-7 working days to make and Umbaco dresses take 7-10 working days before dispatch.',
                  'You are responsible for providing accurate delivery and contact information at checkout. We are not liable for failed or delayed deliveries caused by incorrect information you supplied.',
                ].map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">3. Prices & Payment</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {[
                  'All prices are displayed in South African Rand (ZAR) and are inclusive of applicable taxes unless stated otherwise.',
                  'Payment is processed securely by Ozow, an independent, PCI-compliant instant EFT payment provider. Chief Fashion does not receive or store your banking credentials.',
                  'A delivery fee of R100 is added to orders under R1500. Delivery is free for orders of R1500 or more.',
                  'We may correct pricing errors on the website at any time. If a pricing error affects an order you have already placed, we will contact you with the option to confirm the order at the correct price or cancel it for a full refund of the amount paid.',
                ].map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">4. Delivery</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                All deliveries are made nationwide within South Africa by our courier partner,{' '}
                <span className="font-medium text-foreground">The Courier Guy</span>. Delivery
                timeframes, fees, tracking, and collection options are set out in our{' '}
                <Link to="/shipping" className="font-medium text-gold hover:underline">
                  Delivery Policy
                </Link>
                , which forms part of these Terms. Risk in the products passes to you on delivery
                to the address you provided, or on collection from our store.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">5. Returns, Exchanges & Store Credit</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Returns and exchanges are governed by our{' '}
                <Link to="/refund-policy" className="font-medium text-gold hover:underline">
                  Refund Policy
                </Link>
                , which forms part of these Terms. In summary: eligible products may be returned
                within 15 days of delivery for an exchange or store credit. Chief Fashion does not
                offer cash refunds, except where required by law. Nothing in these Terms limits
                your rights under the Consumer Protection Act 68 of 2008, including your rights in
                respect of defective goods.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">6. Accounts</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                You may create an account to track your orders. You are responsible for keeping
                your login details confidential and for all activity under your account. Notify us
                immediately if you suspect unauthorised use of your account. We may suspend or
                close accounts used in breach of these Terms.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">7. Products & Website Content</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {[
                  'We take care to display our garments as accurately as possible. However, colours may vary slightly depending on your screen, and handmade items may have minor variations — this is part of their character and is not a defect.',
                  'All content on this website, including images, logos, designs, and text, is the property of Chief Fashion or its licensors and may not be copied or used commercially without our written permission.',
                  'Product availability is not guaranteed until your order is confirmed.',
                ].map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">8. Liability</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                To the maximum extent permitted by law, Chief Fashion is not liable for any
                indirect or consequential loss arising from your use of this website or the
                purchase of products. Our total liability for any claim relating to an order is
                limited to the amount you paid for that order. Nothing in these Terms excludes
                liability that cannot be excluded under South African law.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">9. Privacy</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                We process your personal information in accordance with our{' '}
                <Link to="/privacy-policy" className="font-medium text-gold hover:underline">
                  Privacy Policy
                </Link>{' '}
                and the Protection of Personal Information Act 4 of 2013 (POPIA).
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">10. General</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {[
                  'These Terms are governed by the laws of the Republic of South Africa.',
                  'We may update these Terms from time to time. The version published on this website at the time you place an order applies to that order.',
                  'If any provision of these Terms is found to be unenforceable, the remaining provisions remain in full force.',
                ].map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <p className="mt-12 text-sm text-muted-foreground">
              Questions about these Terms? Contact us at{' '}
              <a
                href="mailto:chieffashion333@gmail.com"
                className="font-medium text-gold hover:underline"
              >
                chieffashion333@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
