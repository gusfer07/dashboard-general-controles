-- Create the contacto table
CREATE TABLE public.contacto (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  correo1 TEXT,
  correo2 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Grant privileges
GRANT SELECT ON public.contacto TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contacto TO authenticated;
GRANT ALL ON public.contacto TO service_role;

-- Enable Row Level Security (RLS)
ALTER TABLE public.contacto ENABLE ROW LEVEL SECURITY;

-- Create policies (matching the existing clients/responsibles pattern)
CREATE POLICY "Public can read contacto" ON public.contacto FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert contacto" ON public.contacto FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update contacto" ON public.contacto FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete contacto" ON public.contacto FOR DELETE TO authenticated USING (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contacto_updated_at BEFORE UPDATE ON public.contacto FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
