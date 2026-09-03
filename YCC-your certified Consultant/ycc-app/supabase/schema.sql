-- ============================================================
-- YCC — Your Certified Consultant
-- Run this once in your Supabase project's SQL editor
-- (Supabase dashboard → SQL Editor → New query → paste → Run)
-- ============================================================

-- 1. PROFILES — one row per signed-up user, holds their role
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'student' check (role in ('student', 'agent', 'admin')),
  created_at timestamptz not null default now()
);

-- 2. STUDENT REGISTRATIONS
create table if not exists student_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles (id) on delete cascade,
  preferred_destination text,
  level_of_study text,
  target_intake text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. AGENT REGISTRATIONS
create table if not exists agent_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles (id) on delete cascade,
  agency_name text,
  country text,
  years_experience text,
  students_per_year text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. INSTITUTION ENQUIRIES — no login required to submit
create table if not exists institution_enquiries (
  id uuid primary key default gen_random_uuid(),
  institution_name text,
  contact_person text,
  email text,
  phone text,
  country text,
  enquiry_type text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'partnered', 'declined')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- Helper: is the current user an admin? (SECURITY DEFINER so it
-- can read `profiles` without recursing through profiles' own RLS)
-- ============================================================
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- New-user trigger: creates the profile row automatically,
-- reading the requested role from signup metadata.
-- ============================================================
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, full_name, email, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    coalesce(new.raw_user_meta_data ->> 'requested_role', 'student')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table profiles enable row level security;
alter table student_registrations enable row level security;
alter table agent_registrations enable row level security;
alter table institution_enquiries enable row level security;

-- profiles
create policy "profiles_select_own_or_admin" on profiles
  for select using (auth.uid() = id or is_admin());
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- student_registrations
create policy "student_reg_select_own_or_admin" on student_registrations
  for select using (auth.uid() = user_id or is_admin());
create policy "student_reg_insert_own" on student_registrations
  for insert with check (auth.uid() = user_id);
create policy "student_reg_update_own_or_admin" on student_registrations
  for update using (auth.uid() = user_id or is_admin());

-- agent_registrations
create policy "agent_reg_select_own_or_admin" on agent_registrations
  for select using (auth.uid() = user_id or is_admin());
create policy "agent_reg_insert_own" on agent_registrations
  for insert with check (auth.uid() = user_id);
create policy "agent_reg_update_own_or_admin" on agent_registrations
  for update using (auth.uid() = user_id or is_admin());

-- institution_enquiries — public can submit, only admins can read/manage
create policy "institution_insert_public" on institution_enquiries
  for insert with check (true);
create policy "institution_select_admin" on institution_enquiries
  for select using (is_admin());
create policy "institution_update_admin" on institution_enquiries
  for update using (is_admin());

-- ============================================================
-- Making yourself an admin (do this once, after you sign up
-- through the site with your own email):
--
--   update profiles set role = 'admin' where email = 'you@example.com';
-- ============================================================
