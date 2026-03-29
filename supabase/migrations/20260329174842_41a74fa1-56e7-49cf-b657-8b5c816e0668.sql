CREATE POLICY "Anyone can update members"
ON public.members FOR UPDATE
TO public
USING (true)
WITH CHECK (true);