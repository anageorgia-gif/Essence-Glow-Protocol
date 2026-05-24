CREATE TABLE public.protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  patient_name text NOT NULL,
  patient_cpf text NOT NULL,
  patient_phone text NOT NULL,
  patient_email text,
  formulas jsonb NOT NULL DEFAULT '[]'::jsonb,
  observations text,
  total_amount numeric,
  payment_method text
);

ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a protocol"
ON public.protocols
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(patient_name) BETWEEN 2 AND 200
  AND length(patient_cpf) BETWEEN 6 AND 32
  AND length(patient_phone) BETWEEN 6 AND 32
);