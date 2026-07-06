import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How long does it take to receive my order?',
    answer:
      'Most of our garments are made to order. Standard dresses take 5-7 working days to make and Umbaco dresses take 7-10 working days. Once your parcel is dispatched, The Courier Guy delivers within 1-3 working days to main centres and 3-5 working days to regional areas.',
  },
  {
    question: 'Who delivers my order?',
    answer:
      'All orders are delivered nationwide across South Africa by The Courier Guy, door-to-door. You will receive a waybill (tracking) number as soon as your parcel is dispatched. You can also collect your order for free from Chief Fashion House at 102 Helen Joseph Street, Johannesburg CBD.',
  },
  {
    question: 'How much is delivery?',
    answer:
      'Delivery costs a flat R100 for orders under R1500. Delivery is free for all orders of R1500 or more.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'Once your parcel is handed to The Courier Guy, we send you a waybill number. Enter it on The Courier Guy tracking page (portal.thecourierguy.co.za/track) to see exactly where your parcel is. If you need help, email chieffashion333@gmail.com with your order reference.',
  },
  {
    question: 'How do I pay?',
    answer:
      'We accept secure instant EFT payments through Ozow. You pay directly from your South African bank account — no card needed. Chief Fashion never sees or stores your banking details.',
  },
  {
    question: 'Can I exchange an item or get a refund?',
    answer:
      'You may return eligible items within 15 days of delivery for an exchange or store credit, provided they are unworn, with labels attached, and in resalable condition. Chief Fashion does not offer cash refunds. Store credit is valid for 6 months. See our Refund Policy for the full procedure.',
  },
  {
    question: 'Who pays for return courier costs?',
    answer:
      'If you ordered the wrong size or changed your mind, you are responsible for the courier costs to return the item and to have the replacement shipped to you. If the item has a factory fault or we sent you the wrong product, we cover all courier costs.',
  },
  {
    question: 'How do I know which size to order?',
    answer:
      'Every product page has a Size Chart link with detailed measurements for ladies and men, from XS to 2XL. You can also visit our Size Guide page. If you are still unsure, message us on WhatsApp (+27 78 957 6675) and we will help you choose.',
  },
  {
    question: 'Do I need an account to order?',
    answer:
      'No — you can check out as a guest. Creating an account lets you view your order history and makes future checkouts faster.',
  },
  {
    question: 'Can I visit your store?',
    answer:
      'Yes! Chief Fashion House is located at 102 Helen Joseph Street, Johannesburg CBD. Come try on garments, arrange a fitting, or collect your online order.',
  },
];

const FAQ = () => {
  return (
    <Layout>
      <div className="section-padding">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">Support</p>
            <h1 className="mt-4 font-display text-4xl font-light sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Everything you need to know about ordering, delivery, and returns. Can't find your
              answer?{' '}
              <Link to="/contact" className="font-medium text-gold hover:underline">
                Contact us
              </Link>{' '}
              — we're happy to help.
            </p>

            <Accordion type="single" collapsible className="mt-12">
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 rounded-lg border border-border bg-secondary/30 p-6">
              <h2 className="font-medium">Helpful links</h2>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Link to="/shipping" className="text-gold hover:underline">
                  Delivery Policy
                </Link>
                <Link to="/refund-policy" className="text-gold hover:underline">
                  Refund Policy
                </Link>
                <Link to="/size-guide" className="text-gold hover:underline">
                  Size Guide
                </Link>
                <Link to="/terms" className="text-gold hover:underline">
                  Terms of Service
                </Link>
                <Link to="/privacy-policy" className="text-gold hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
