import { Layout } from '@/components/layout/Layout';
import { Newsletter } from '@/components/home/Newsletter';

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[60vh] overflow-hidden bg-charcoal">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80"
            alt="Fashion atelier"
            className="h-full w-full object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        </div>

        <div className="container-wide relative flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="font-display text-5xl font-light text-primary-foreground sm:text-6xl">
            About Chief Fashion House
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-primary-foreground/80">
            Where African heritage meets contemporary elegance
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="prose prose-lg mx-auto max-w-none">
            <h2 className="text-center font-display text-4xl font-light">Our Story</h2>
            
            <p className="mt-8 text-xl leading-relaxed text-muted-foreground">
              Founded in the vibrant heart of Johannesburg CBD, Chief Fashion House represents the 
              perfect fusion of traditional African tailoring heritage and modern sophistication. 
              Our journey began with a simple vision: to create garments that celebrate African 
              culture while embracing contemporary fashion trends.
            </p>

            <p className="mt-6 text-muted-foreground leading-relaxed">
              Located at 102 Helen Joseph Street in Johannesburg CBD, our atelier has become a destination for 
              discerning clients who appreciate the art of bespoke tailoring. Each piece we create 
              is more than just clothing — it's a statement of identity, pride, and timeless elegance.
            </p>

            <p className="mt-6 text-muted-foreground leading-relaxed">
              Our master tailors bring decades of combined experience, having honed their craft 
              through years of dedication to the art of tailoring. We specialize in African-inspired 
              designs, from elegant evening wear to traditional ceremonial attire, ensuring each 
              creation reflects both cultural authenticity and modern refinement.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Vision */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                  <span className="font-display text-xl text-gold">✦</span>
                </div>
                <h2 className="font-display text-3xl font-light">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To be the premier destination for African-inspired luxury tailoring, recognized 
                globally for our commitment to excellence, cultural authenticity, and innovative 
                design. We aspire to preserve traditional craftsmanship while pushing the 
                boundaries of contemporary fashion.
              </p>
            </div>

            {/* Mission */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                  <span className="font-display text-xl text-gold">◆</span>
                </div>
                <h2 className="font-display text-3xl font-light">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We are dedicated to creating exceptional bespoke garments that honor African 
                heritage and empower our clients through fashion. Every stitch, every fabric 
                choice, and every design detail reflects our commitment to quality, cultural 
                pride, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-wide">
          <h2 className="text-center font-display text-4xl font-light">Our Values</h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                <span className="font-display text-2xl text-gold">01</span>
              </div>
              <h3 className="mt-6 font-display text-xl">Cultural Authenticity</h3>
              <p className="mt-2 text-muted-foreground">
                We honor and celebrate African heritage in every design, preserving traditional 
                craftsmanship for future generations.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                <span className="font-display text-2xl text-gold">02</span>
              </div>
              <h3 className="mt-6 font-display text-xl">Excellence in Craft</h3>
              <p className="mt-2 text-muted-foreground">
                Every stitch reflects our dedication to quality, with master tailors ensuring 
                impeccable construction in each garment.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                <span className="font-display text-2xl text-gold">03</span>
              </div>
              <h3 className="mt-6 font-display text-xl">Client Empowerment</h3>
              <p className="mt-2 text-muted-foreground">
                We believe fashion should inspire confidence and pride, empowering every client 
                who wears our creations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </Layout>
  );
};

export default About;

