import { Layout } from '@/components/layout/Layout';

const exchangeNotes = [
  'We reserve the right not to accept an exchange if the product is not returned in the exact condition in which it was received, with labels attached, in resalable condition, and securely sealed.',
  'In certain instances, we reserve the right to charge an additional delivery fee should you later change your mind and wish to exchange the item for a different item altogether from what you originally ordered.',
  'If you order the incorrect size or later decide that you do not like the garment, you will be liable for courier costs to return the item to us and to have the correct size or item shipped back to you.',
  'If there is a factory fault on any item, you will not be liable for courier costs.',
];

const returnableProducts = [
  'Except for certain cases, you may return any product purchased within 15 days of product delivery.',
  'Please do not wear the product except to try it on to see if it fits. All products must be returned in the exact condition in which they were received.',
  'If the incorrect product is delivered to you by mistake, please do not try the product on at all. Promptly contact Chief-fashion at chieffashion333@gmail.com so that we can collect it from you and deliver the correct product as quickly as possible.',
];

const returnsProcedure = [
  'Send an email to chieffashion333@gmail.com with your name and surname, plus the product details: name, color, and size.',
  'State clearly whether you would like an exchange or store credit.',
  'Pack the item or items in their original packaging.',
  'Our courier partner, The Courier Guy, will arrange to collect the package from the address you supplied within 3 working days.',
];

const RefundPolicy = () => {
  return (
    <Layout>
      <div className="section-padding">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">Support</p>
            <h1 className="mt-4 font-display text-4xl font-light sm:text-5xl">Refund Policy</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We will at all times, where possible, provide you with a size chart and as much
              product information as possible before you purchase a garment. If you wish to
              exchange a garment for another size, different colour, or similar option, you may do
              so provided that we still have stock of the new garment available. If we do not have
              stock, you will be provided with store credit to the rand value, excluding the
              delivery cost.
            </p>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Exchanges</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {exchangeNotes.map((note) => (
                  <li key={note} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Store Credits</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                If you prefer not to exchange, you will receive a store credit to purchase an
                alternative product of the same value at another time. The store credit is valid
                for a period of 6 months.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Refunds & Discounts</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                If you are returning a product, you will be eligible for a store credit or an
                exchange only. Chief-fashion does not offer refunds.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Products That May Be Returned</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {returnableProducts.map((note) => (
                  <li key={note} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Products That May Not Be Returned</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Products that you or any other person has altered, repaired, incorporated, or added
                to may not be returned.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Returns Procedure</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Should you wish to return a product for an exchange or store credit within 15 days
                of the date of delivery, please follow the steps below.
              </p>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {returnsProcedure.map((note) => (
                  <li key={note} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RefundPolicy;
