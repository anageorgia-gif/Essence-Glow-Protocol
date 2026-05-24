
ALTER TABLE public.protocols ADD COLUMN IF NOT EXISTS pdf_path text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('protocols', 'protocols', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload a protocol PDF"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'protocols');
