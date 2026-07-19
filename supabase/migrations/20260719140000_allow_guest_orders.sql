-- Allow guest orders: user_id becomes optional. Guest orders (user_id IS NULL)
-- are created by the ozow-checkout edge function using the service role and are
-- visible only to admins / via the Supabase dashboard.
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;
