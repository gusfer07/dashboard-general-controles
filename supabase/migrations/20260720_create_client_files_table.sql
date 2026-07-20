CREATE TABLE public.client_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.client_files TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_files TO authenticated;
GRANT ALL ON public.client_files TO service_role;

ALTER TABLE public.client_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read client_files"
  ON public.client_files FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert client_files"
  ON public.client_files FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update client_files"
  ON public.client_files FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete client_files"
  ON public.client_files FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('client-files', 'client-files', true, false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read client-files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'client-files');

CREATE POLICY "Authenticated can upload to client-files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'client-files');

CREATE POLICY "Authenticated can update client-files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'client-files')
  WITH CHECK (bucket_id = 'client-files');

CREATE POLICY "Authenticated can delete from client-files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'client-files');
