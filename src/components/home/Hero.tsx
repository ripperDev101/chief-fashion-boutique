import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-charcoal">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/logo.png"
          alt="Chief Fashion hero"
          className="h-full w-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-wide relative flex min-h-[90vh] items-center">
        <div className="max-w-xl py-24 lg:py-32">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold opacity-0 animate-fade-in-up">
            New Collection
          </p>
          <h1 className="mt-6 font-display text-5xl font-light leading-tight text-primary-foreground opacity-0 animate-fade-in-up animation-delay-100 sm:text-6xl lg:text-7xl">
            Timeless
            <br />
            <span className="font-medium italic">Elegance</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-primary-foreground/80 opacity-0 animate-fade-in-up animation-delay-200">
            Discover our curated collection of sophisticated pieces designed for the modern wardrobe. 
            Crafted with care, made to last.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 opacity-0 animate-fade-in-up animation-delay-300">
            <Button variant="hero" size="xl" asChild>
              <Link to="/shop">Shop Collection</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="xl" 
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link to="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animation-delay-500">
        <div className="flex flex-col items-center gap-2 text-primary-foreground/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="h-12 w-px bg-gradient-to-b from-primary-foreground/60 to-transparent" />
        </div>
      </div>
    </section>
  );
};
