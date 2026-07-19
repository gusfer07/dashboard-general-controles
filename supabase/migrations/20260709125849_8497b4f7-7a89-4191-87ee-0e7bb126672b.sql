
-- ENUMS
CREATE TYPE public.obligation_type AS ENUM ('tributaria', 'parafiscal', 'libro');
CREATE TYPE public.obligation_status AS ENUM ('al_dia', 'pendiente', 'en_proceso', 'vencido', 'na');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- CLIENTS
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rif TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clients TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read clients" ON public.clients FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert clients" ON public.clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update clients" ON public.clients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete clients" ON public.clients FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RESPONSIBLES
CREATE TABLE public.responsibles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  initials TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.responsibles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.responsibles TO authenticated;
GRANT ALL ON public.responsibles TO service_role;
ALTER TABLE public.responsibles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read responsibles" ON public.responsibles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert responsibles" ON public.responsibles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update responsibles" ON public.responsibles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete responsibles" ON public.responsibles FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_responsibles_updated_at BEFORE UPDATE ON public.responsibles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- OBLIGATIONS
CREATE TABLE public.obligations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  type public.obligation_type NOT NULL,
  concept TEXT NOT NULL,
  status public.obligation_status NOT NULL DEFAULT 'pendiente',
  due_date TEXT,
  amount TEXT,
  responsible_id UUID REFERENCES public.responsibles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.obligations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.obligations TO authenticated;
GRANT ALL ON public.obligations TO service_role;
ALTER TABLE public.obligations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read obligations" ON public.obligations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert obligations" ON public.obligations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update obligations" ON public.obligations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete obligations" ON public.obligations FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_obligations_updated_at BEFORE UPDATE ON public.obligations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_obligations_client ON public.obligations(client_id);
CREATE INDEX idx_obligations_type ON public.obligations(type);
CREATE INDEX idx_obligations_status ON public.obligations(status);
