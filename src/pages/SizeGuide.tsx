import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import sizeChartImage from '@/assets/size-chart.png';
import sizeChartMenImage from '@/assets/size-chart-men.png';

const measuringTips = [
  'Chest: measure around the fullest part of your chest, keeping the tape level under your arms.',
  'Waist: measure around your natural waistline, at the narrowest part of your torso.',
  'Hips: measure around the fullest part of your hips, keeping the tape level.',
  'Body length: measure from the highest point of your shoulder straight down.',
  'Keep the measuring tape snug but not tight, and measure over light clothing or underwear.',
];

const SizeGuide = () => {
  return (
    <Layout>
      <div className="section-padding">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">Support</p>
            <h1 className="mt-4 font-display text-4xl font-light sm:text-5xl">Size Guide</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              All measurements are in centimeters. If you fall between two sizes, we recommend
              taking the larger size. Still unsure? Message us on{' '}
              <a
                href="https://wa.me/27789576675"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gold hover:underline"
              >
                WhatsApp
              </a>{' '}
              and we'll help you find your perfect fit.
            </p>

            <Tabs defaultValue="ladies" className="mt-12">
              <TabsList className="w-full">
                <TabsTrigger value="ladies" className="flex-1">
                  Ladies
                </TabsTrigger>
                <TabsTrigger value="men" className="flex-1">
                  Men
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ladies">
                <img
                  src={sizeChartImage}
                  alt="Ladies size chart showing measurements for chest, waist, hips and body length across sizes XS to 2XL in centimeters"
                  className="w-full h-auto rounded-md"
                />
              </TabsContent>
              <TabsContent value="men">
                <img
                  src={sizeChartMenImage}
                  alt="Men size chart showing measurements for chest, waist, hips and body length across sizes XS to 3XL in centimeters"
                  className="w-full h-auto rounded-md"
                />
              </TabsContent>
            </Tabs>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-light">How to Measure</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {measuringTips.map((tip) => (
                  <li key={tip} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>

            <p className="mt-12 text-sm text-muted-foreground">
              Ordered the wrong size? No stress — see our{' '}
              <Link to="/refund-policy" className="font-medium text-gold hover:underline">
                Refund Policy
              </Link>{' '}
              for exchanges.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SizeGuide;
