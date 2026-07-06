import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

const collectedInfo = [
  'Account information: your name, email address, and password (stored in encrypted form) when you create an account.',
  'Order information: your name, email address, phone number, and delivery address when you place an order.',
  'Payment confirmation: payments are processed by Ozow. We never see or store your banking login details or card numbers — we only receive confirmation that a payment succeeded or failed.',
  'Messages: your name, email address, and message content when you contact us through the website.',
  'Device data: basic technical data (such as browser type) needed to keep the website working and secure.',
];

const usagePurposes = [
  'To process and deliver your orders, including sharing your delivery details with our courier partner, The Courier Guy.',
  'To contact you about your order — confirmations, production updates, and tracking information.',
  'To manage your account and show you your order history.',
  'To respond to your questions and support requests.',
  'To send you marketing updates only if you have opted in (for example, by subscribing to our newsletter). You can unsubscribe at any time.',
  'To prevent fraud and comply with our legal obligations.',
];

const sharedWith = [
  'The Courier Guy — receives your name, delivery address, and phone number to deliver your parcel.',
  'Ozow — processes your payment on their own secure platform.',
  'Supabase — our secure database and authentication provider, which stores account, order, and message data on our behalf.',
  'We never sell or rent your personal information to anyone.',
];

const yourRights = [
  'Access: you may ask what personal information we hold about you.',
  'Correction: you may ask us to correct inaccurate or outdated information.',
  'Deletion: you may ask us to delete your account and personal information, subject to records we must keep by law (such as financial records).',
  'Objection: you may object to processing for direct marketing at any time.',
  'Complaint: you may lodge a complaint with the Information Regulator of South Africa (inforeg.org.za).',
];

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="section-padding">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">Legal</p>
            <h1 className="mt-4 font-display text-4xl font-light sm:text-5xl">Privacy Policy</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Chief Fashion House ("Chief Fashion", "we", "us") respects your privacy. This policy
              explains what personal information we collect, why we collect it, and how we protect
              it, in line with the Protection of Personal Information Act 4 of 2013 (POPIA).
            </p>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Information We Collect</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {collectedInfo.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">How We Use Your Information</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {usagePurposes.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Who We Share It With</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {sharedWith.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12" id="cookies">
              <h2 className="font-display text-3xl font-light">Cookies & Local Storage</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                This website uses browser local storage for essential functionality only: to
                remember the contents of your shopping bag and to keep you signed in to your
                account. We do not use third-party advertising or tracking cookies. If you clear
                your browser storage, your bag will be emptied and you will be signed out.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">How Long We Keep Your Information</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                We keep your account information for as long as your account is active. Order
                records are kept for as long as required for tax and accounting purposes under
                South African law. Contact messages are kept only as long as needed to resolve
                your enquiry.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Security</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Your data is stored with access controls that restrict each customer to their own
                records, and all traffic to the website is encrypted with SSL/TLS. Payments happen
                entirely on Ozow's secure platform.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Your Rights</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {yourRights.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                To exercise any of these rights, email us at{' '}
                <a
                  href="mailto:chieffashion333@gmail.com"
                  className="font-medium text-gold hover:underline"
                >
                  chieffashion333@gmail.com
                </a>
                .
              </p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">Changes to This Policy</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                We may update this policy from time to time. The latest version will always be
                available on this page. See also our{' '}
                <Link to="/terms" className="font-medium text-gold hover:underline">
                  Terms of Service
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
