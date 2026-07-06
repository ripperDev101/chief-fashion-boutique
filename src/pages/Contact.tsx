import { useState } from 'react';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Mail, MapPin } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

type ContactForm = z.infer<typeof contactSchema>;

const socials = [
  { label: 'Facebook', value: 'CHIEF FASHION' },
  { label: 'TikTok', value: 'CHIEF FASHION' },
  { label: 'Instagram', value: 'w_chieffashionzone' },
];

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
  });

  const updateForm = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<ContactForm> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactForm;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name,
        email: form.email,
        message: form.message,
      });

      if (error) throw error;

      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-light sm:text-5xl">Get in Touch</h1>
            <p className="mt-4 text-muted-foreground">
              Visit Chief Fashion in Johannesburg CBD or reach out online.
            </p>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <p className="mt-2 text-muted-foreground">
                Reach out to us through email, social media, or visit our store.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <Mail className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:chieffashion333@gmail.com"
                      className="mt-1 text-muted-foreground hover:text-foreground"
                    >
                      chieffashion333@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <MapPin className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="mt-1 text-muted-foreground">
                      102 Helen Joseph Street
                      <br />
                      Johannesburg CBD
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 rounded-lg border border-border bg-secondary/30 p-6">
                <h3 className="font-medium">Follow Chief Fashion</h3>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {socials.map((social) => (
                    <p key={social.label}>
                      <span className="font-medium text-foreground">{social.label}:</span> {social.value}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    placeholder="Your name"
                    className={cn(errors.name && 'border-destructive')}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="your@email.com"
                    className={cn(errors.email && 'border-destructive')}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => updateForm('message', e.target.value)}
                    placeholder="How can we help you?"
                    rows={6}
                    className={cn(errors.message && 'border-destructive')}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
