import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

const deliverySteps = [
  'Once your order is placed and payment is confirmed, your garments go into production or are prepared for dispatch.',
  'Standard dresses take 5-7 working days to make. Umbaco dresses take 7-10 working days.',
  'As soon as your parcel is handed to The Courier Guy, you will receive a waybill (tracking) number by email or WhatsApp.',
  'The Courier Guy delivers door-to-door on weekdays. Please provide an address where someone is available to receive the parcel.',
];

const deliveryTimes = [
  { area: 'Johannesburg / Pretoria (main centres)', time: '1-2 working days after dispatch' },
  { area: 'Cape Town, Durban & other main centres', time: '2-3 working days after dispatch' },
  { area: 'Regional & outlying areas', time: '3-5 working days after dispatch' },
];

const importantNotes = [
  'Delivery times are estimates from the day your parcel is dispatched, not from the day you place your order. Please allow for the production time above.',
  'A physical street address is required. The Courier Guy cannot deliver to P.O. Box addresses.',
  'Please make sure your phone number is correct at checkout — the courier may call to arrange delivery.',
  'If you are not available at the time of delivery, The Courier Guy will attempt redelivery or contact you to arrange a suitable time.',
  'Once your parcel is with the courier, you can track it at any time using your waybill number.',
];

const ShippingPolicy = () => {
  return (
    <Layout>
      <div className="section-padding">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">Support</p>
            <h1 className="mt-4 font-display text-4xl font-light sm:text-5xl">Delivery Policy</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              All Chief Fashion orders are delivered nationwide across South Africa by our courier
              partner, <span className="font-medium text-foreground">The Courier Guy</span>. You
              can also collect your order in person from Chief Fashion House at 102 Helen Joseph
              Street, Johannesburg CBD.
            </p>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Delivery Fees</h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <div className="flex gap-3 leading-relaxed">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                  <span>
                    A flat delivery fee of <span className="font-medium text-foreground">R100</span>{' '}
                    applies to all orders under R1500.
                  </span>
                </div>
                <div className="flex gap-3 leading-relaxed">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                  <span>
                    Delivery is <span className="font-medium text-foreground">free</span> for all
                    orders of R1500 or more.
                  </span>
                </div>
                <div className="flex gap-3 leading-relaxed">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                  <span>Collection from our store in Johannesburg CBD is always free.</span>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">How Delivery Works</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {deliverySteps.map((step) => (
                  <li key={step} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Estimated Delivery Times</h2>
              <div className="mt-6 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Area</th>
                      <th className="px-4 py-3 font-semibold">Estimated Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-muted-foreground">
                    {deliveryTimes.map((row) => (
                      <tr key={row.area}>
                        <td className="px-4 py-3">{row.area}</td>
                        <td className="px-4 py-3">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Tracking Your Order</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Every parcel is fully trackable. Once you receive your waybill number, you can
                follow your delivery on The Courier Guy tracking page at{' '}
                <a
                  href="https://portal.thecourierguy.co.za/track"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gold hover:underline"
                >
                  portal.thecourierguy.co.za/track
                </a>
                . If you have any trouble tracking your parcel, email us at{' '}
                <a
                  href="mailto:chieffashion333@gmail.com"
                  className="font-medium text-gold hover:underline"
                >
                  chieffashion333@gmail.com
                </a>{' '}
                with your order reference and we will follow up with the courier for you.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Important Notes</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {importantNotes.map((note) => (
                  <li key={note} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Returns</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                If you need to exchange an item or request store credit, collection of the return
                parcel is also arranged through The Courier Guy. Please read our{' '}
                <Link to="/refund-policy" className="font-medium text-gold hover:underline">
                  Refund Policy
                </Link>{' '}
                for the full returns procedure and who is responsible for courier costs.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingPolicy;
