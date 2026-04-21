-- Lightspeed tokens table (single row)
CREATE TABLE public.lightspeed_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_prefix text NOT NULL,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  scope text,
  last_sync_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lightspeed_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read lightspeed tokens"
  ON public.lightspeed_tokens FOR SELECT USING (true);
CREATE POLICY "Anyone can insert lightspeed tokens"
  ON public.lightspeed_tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update lightspeed tokens"
  ON public.lightspeed_tokens FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete lightspeed tokens"
  ON public.lightspeed_tokens FOR DELETE USING (true);

CREATE TRIGGER update_lightspeed_tokens_updated_at
  BEFORE UPDATE ON public.lightspeed_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add lightspeed_id to products
ALTER TABLE public.products
  ADD COLUMN lightspeed_id text;

CREATE UNIQUE INDEX products_lightspeed_id_key
  ON public.products (lightspeed_id)
  WHERE lightspeed_id IS NOT NULL;