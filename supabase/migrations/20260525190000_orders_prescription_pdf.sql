-- Prescription PDF metadata for admin-managed orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS prescription_pdf_path text,
  ADD COLUMN IF NOT EXISTS prescription_pdf_filename text;
