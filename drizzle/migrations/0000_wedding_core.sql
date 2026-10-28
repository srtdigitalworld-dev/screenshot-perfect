CREATE TABLE public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  slug text NOT NULL UNIQUE,
  template text NOT NULL DEFAULT 'royal',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.invitations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invitations TO authenticated;
GRANT ALL ON public.invitations TO service_role;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads published" ON public.invitations FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "owner reads" ON public.invitations FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "owner inserts" ON public.invitations FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owner updates" ON public.invitations FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owner deletes" ON public.invitations FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER invitations_touch BEFORE UPDATE ON public.invitations FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.is_published_invitation(_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.invitations WHERE id = _id AND published = true) $$;
CREATE OR REPLACE FUNCTION public.owns_invitation(_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.invitations WHERE id = _id AND owner_id = auth.uid()) $$;

CREATE TABLE public.rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name text NOT NULL CHECK (char_length(guest_name) BETWEEN 1 AND 120),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 30),
  guest_count int NOT NULL DEFAULT 1 CHECK (guest_count BETWEEN 1 AND 50),
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  message text CHECK (message IS NULL OR char_length(message) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.rsvps TO anon;
GRANT SELECT, INSERT, DELETE ON public.rsvps TO authenticated;
GRANT ALL ON public.rsvps TO service_role;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "guests rsvp to published" ON public.rsvps FOR INSERT TO anon, authenticated WITH CHECK (public.is_published_invitation(invitation_id));
CREATE POLICY "owner reads rsvps" ON public.rsvps FOR SELECT TO authenticated USING (public.owns_invitation(invitation_id));
CREATE POLICY "owner deletes rsvps" ON public.rsvps FOR DELETE TO authenticated USING (public.owns_invitation(invitation_id));

CREATE TABLE public.wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  author text NOT NULL CHECK (char_length(author) BETWEEN 1 AND 80),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.wishes TO anon;
GRANT SELECT, INSERT, DELETE ON public.wishes TO authenticated;
GRANT ALL ON public.wishes TO service_role;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read wishes of published" ON public.wishes FOR SELECT TO anon, authenticated USING (public.is_published_invitation(invitation_id) OR public.owns_invitation(invitation_id));
CREATE POLICY "post wishes to published" ON public.wishes FOR INSERT TO anon, authenticated WITH CHECK (public.is_published_invitation(invitation_id));
CREATE POLICY "owner deletes wishes" ON public.wishes FOR DELETE TO authenticated USING (public.owns_invitation(invitation_id));

CREATE POLICY "users upload own photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'invite-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "users delete own photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'invite-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "public reads photos" ON storage.objects FOR SELECT USING (bucket_id = 'invite-photos');