-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Uncategorized',
  subcategory TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  sale_price NUMERIC,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  in_stock BOOLEAN DEFAULT true,
  visible BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public access policies (matches strains table pattern; admin gated at UI layer)
CREATE POLICY "Anyone can read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON public.products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete products" ON public.products FOR DELETE USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for common filters
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_visible ON public.products(visible);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (public read + public write, matches strain-images pattern)
CREATE POLICY "Public can read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Public can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

CREATE POLICY "Public can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');