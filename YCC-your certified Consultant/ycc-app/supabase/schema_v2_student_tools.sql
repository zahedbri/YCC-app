-- ============================================================
-- YCC — Student Tools add-on (Resume Builder, Learning Progress,
-- Visa Compliance Checklist)
-- Run this in the Supabase SQL editor AFTER schema.sql.
-- Safe to re-run — uses "if not exists" throughout.
-- ============================================================

-- 1. RESUMES — one simple resume per student, editable any time
create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  location text,
  summary text,
  education jsonb not null default '[]',   -- [{institution, qualification, start, end}]
  experience jsonb not null default '[]',  -- [{employer, role, start, end, description}]
  skills text,
  updated_at timestamptz not null default now()
);

-- 2. LEARNING PROGRESS — which free IELTS/English resources a student has ticked off
create table if not exists learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles (id) on delete cascade,
  completed_resources jsonb not null default '[]', -- ["resource-id-1", "resource-id-2", ...]
  updated_at timestamptz not null default now()
);

-- 3. VISA CHECKLIST PROGRESS — which generic compliance items a student has ticked off
create table if not exists visa_checklist_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles (id) on delete cascade,
  checked_items jsonb not null default '[]', -- ["item-id-1", "item-id-2", ...]
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security — same pattern as the rest of the app:
-- a student only ever sees their own row; admins (via the
-- existing is_admin() helper from schema.sql) can see everyone's,
-- e.g. to help a student with their resume during an appointment.
-- ============================================================
alter table resumes enable row level security;
alter table learning_progress enable row level security;
alter table visa_checklist_progress enable row level security;

create policy "resumes_select_own_or_admin" on resumes
  for select using (auth.uid() = user_id or is_admin());
create policy "resumes_insert_own" on resumes
  for insert with check (auth.uid() = user_id);
create policy "resumes_update_own" on resumes
  for update using (auth.uid() = user_id);

create policy "learning_progress_select_own_or_admin" on learning_progress
  for select using (auth.uid() = user_id or is_admin());
create policy "learning_progress_insert_own" on learning_progress
  for insert with check (auth.uid() = user_id);
create policy "learning_progress_update_own" on learning_progress
  for update using (auth.uid() = user_id);

create policy "visa_checklist_select_own_or_admin" on visa_checklist_progress
  for select using (auth.uid() = user_id or is_admin());
create policy "visa_checklist_insert_own" on visa_checklist_progress
  for insert with check (auth.uid() = user_id);
create policy "visa_checklist_update_own" on visa_checklist_progress
  for update using (auth.uid() = user_id);
