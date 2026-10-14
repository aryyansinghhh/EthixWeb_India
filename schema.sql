create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 254),
  phone text,
  service text not null,
  message text,
  status text not null default 'new' check (status in ('new','contacted','qualified','closed')),
  ip_hash text,
  user_agent text
);
create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_ip_idx on public.leads (ip_hash, created_at desc);
-- RLS on with NO policies: the public anon key can read/write nothing.
-- Only the server (service-role key, kept in Vercel env vars) can access this table.
alter table public.leads enable row level security;
