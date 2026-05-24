
CREATE TABLE public.pedidos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  patient_name text NOT NULL,
  patient_cpf text NOT NULL,
  patient_phone text NOT NULL,
  patient_email text,
  formulas jsonb NOT NULL DEFAULT '[]'::jsonb,
  formula_ids text[] NOT NULL DEFAULT '{}',
  subtotal numeric NOT NULL DEFAULT 0,
  ecobag_included boolean NOT NULL DEFAULT false,
  ecobag_free boolean NOT NULL DEFAULT false,
  ecobag_price numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  observations text,
  pdf_path text,
  whatsapp_sent boolean NOT NULL DEFAULT false,
  whatsapp_error text,
  client_ip text
);

ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
-- No policies: only service role (server) can read/write.

CREATE INDEX idx_pedidos_created_at ON public.pedidos (created_at DESC);

CREATE TABLE public.rate_limits (
  id bigserial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  ip text NOT NULL,
  route text NOT NULL
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
-- No policies: only service role.

CREATE INDEX idx_rate_limits_lookup ON public.rate_limits (ip, route, created_at DESC);
