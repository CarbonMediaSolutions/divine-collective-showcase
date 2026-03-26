
CREATE TABLE public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  id_number text,
  birthday date,
  status text DEFAULT 'Pending',
  joined_date date DEFAULT CURRENT_DATE,
  expiration_date date,
  id_front_url text,
  id_back_url text,
  referral_source text,
  terms_accepted boolean DEFAULT false,
  marketing_consent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert members"
  ON public.members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can check membership"
  ON public.members FOR SELECT
  USING (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('id-documents', 'id-documents', false);

CREATE POLICY "Anyone can upload id documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'id-documents');

CREATE POLICY "Anyone can read own id documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'id-documents');
