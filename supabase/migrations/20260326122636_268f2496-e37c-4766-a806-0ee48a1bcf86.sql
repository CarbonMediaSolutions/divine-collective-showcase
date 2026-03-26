
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'completed',
  payment_ref text,
  payment_type text DEFAULT 'order',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can read orders" ON public.orders FOR SELECT TO public USING (true);
