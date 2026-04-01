
-- Allow public insert and update on strains for admin usage
CREATE POLICY "Anyone can insert strains" ON public.strains FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update strains" ON public.strains FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete strains" ON public.strains FOR DELETE TO public USING (true);

-- Create a public storage bucket for strain images
INSERT INTO storage.buckets (id, name, public) VALUES ('strain-images', 'strain-images', true);

-- Allow public uploads to strain-images bucket
CREATE POLICY "Anyone can upload strain images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'strain-images');
CREATE POLICY "Anyone can read strain images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'strain-images');
