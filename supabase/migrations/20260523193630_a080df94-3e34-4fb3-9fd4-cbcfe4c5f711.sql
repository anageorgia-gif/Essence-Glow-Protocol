
create table public.ecobag_reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  items_count integer not null default 0,
  total_amount numeric(10,2),
  is_free boolean not null default false
);

alter table public.ecobag_reservations enable row level security;

-- Anyone (anon + authenticated) can read so the public counter works
create policy "Anyone can read ecobag reservations"
on public.ecobag_reservations
for select
to anon, authenticated
using (true);

-- No client-side inserts; only the server (service role) writes
-- Service role bypasses RLS automatically, so no insert policy is needed.
