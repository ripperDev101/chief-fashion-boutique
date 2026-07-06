import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: 'Newsletter Subscriber',
        email,
        message: 'Newsletter subscription request from the website.',
      });

      if (error) throw error;

      setEmail('');
      toast.success('Thank you for subscribing!');
    } catch (error) {
      console.error('Newsletter error:', error);
      toast.error('Subscription failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-padding bg-charcoal">
      <div className="container-narrow text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
          Stay Connected
        </p>
        <h2 className="mt-4 font-display text-4xl font-light text-primary-foreground sm:text-5xl">
          Join Our World
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70">
          Be the first to know about new collections, exclusive offers, and styling inspiration.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-primary-foreground/20 bg-transparent text-primary-foreground placeholder:text-primary-foreground/50 focus:border-gold"
            required
          />
          <Button
            type="submit"
            variant="gold"
            size="lg"
            disabled={isLoading}
            className="whitespace-nowrap"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>

        <p className="mt-4 text-xs text-primary-foreground/50">
          By subscribing, you agree to our{' '}
          <Link to="/privacy-policy" className="underline hover:text-primary-foreground">
            Privacy Policy
          </Link>{' '}
          and consent to receive updates.
        </p>
      </div>
    </section>
  );
};
