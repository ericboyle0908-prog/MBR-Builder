-- MBR Hub starter schema
-- Run in Supabase SQL editor after enabling Auth.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'viewer' check (role in ('geo_poc','mbr_owner','viewer')),
  geo_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.mbr_periods (
  id uuid primary key default gen_random_uuid(),
  month date not null unique,
  title text,
  locked boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.geo_submissions (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references public.mbr_periods(id) on delete cascade,
  geo_id text not null,
  geo_name text not null,
  owner_id uuid references public.profiles(id),
  status text not null default 'not_started' check (status in ('not_started','draft','submitted','approved')),
  previous_kpis jsonb not null default '{}'::jsonb,
  current_kpis jsonb not null default '{}'::jsonb,
  people_metrics jsonb not null default '{}'::jsonb,
  digital_metrics jsonb,
  narrative jsonb not null default '{}'::jsonb,
  recognition_image_url text,
  updated_at timestamptz not null default now(),
  unique(period_id, geo_id)
);

alter table public.profiles enable row level security;
alter table public.mbr_periods enable row level security;
alter table public.geo_submissions enable row level security;

create policy "profiles self read" on public.profiles for select using (auth.uid() = id);
create policy "periods authenticated read" on public.mbr_periods for select to authenticated using (true);
create policy "submissions authenticated read" on public.geo_submissions for select to authenticated using (true);

-- Geo POCs can edit their own geo; MBR owners can edit all geos.
create policy "submission update by owner or mbr owner" on public.geo_submissions
for update to authenticated
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and (p.role = 'mbr_owner' or (p.role = 'geo_poc' and p.geo_id = geo_submissions.geo_id)))
)
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and (p.role = 'mbr_owner' or (p.role = 'geo_poc' and p.geo_id = geo_submissions.geo_id)))
);
