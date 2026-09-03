-- ============================================================
-- YCC — Courses add-on (IELTS Prep enrolments)
-- Run this in the Supabase SQL editor AFTER schema.sql.
-- Safe to re-run — uses "if not exists" throughout.
-- ============================================================

create table if not exists course_enrolments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  course_slug text not null default 'ielts-prep',
  plan text not null check (plan in ('self-study', 'premium')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

alter table course_enrolments enable row level security;

create policy "enrolments_select_own_or_admin" on course_enrolments
  for select using (auth.uid() = user_id or is_admin());
create policy "enrolments_insert_own" on course_enrolments
  for insert with check (auth.uid() = user_id);
create policy "enrolments_update_own_or_admin" on course_enrolments
  for update using (auth.uid() = user_id or is_admin());
