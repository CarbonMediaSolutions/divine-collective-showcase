CREATE TABLE public.strains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Hybrid',
  thc_min numeric DEFAULT 0,
  thc_max numeric DEFAULT 0,
  cbd_min numeric DEFAULT 0,
  cbd_max numeric DEFAULT 0,
  parents text,
  flavours text[] DEFAULT '{}',
  effects text[] DEFAULT '{}',
  feelings text[] DEFAULT '{}',
  terpenes text[] DEFAULT '{}',
  description text DEFAULT '',
  grow_info text DEFAULT '',
  grow_difficulty text DEFAULT 'Intermediate',
  image_url text DEFAULT '',
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.strains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read strains"
ON public.strains FOR SELECT TO public
USING (true);