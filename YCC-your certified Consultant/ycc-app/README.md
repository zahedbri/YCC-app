# YCC — Your Certified Consultant

Full website with **real** student / agent / admin accounts and a real database,
built with React + Vite, styled with Bootstrap, and backed by
[Supabase](https://supabase.com) (free tier covers this comfortably).

Why Supabase instead of a Netlify function like the Compliance Ledger app: logins and
registrations need to work for the public, and a serverless function proxy is the
right shape for a secret API key — but auth + a database is better handled by a
managed service. Supabase's public "anon" key is *designed* to be exposed in the
browser; access is controlled by the row-level-security rules in `supabase/schema.sql`,
not by hiding the key.

## 1. Create your Supabase project

1. Go to https://supabase.com → sign up (free) → **New project**.
2. Pick a name, a database password (save it somewhere), and a region close to your users.
3. Wait ~2 minutes for it to provision.

## 2. Run the database schema

1. In your Supabase project, open **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this folder, paste its full contents in, and click **Run**.
   This creates the `profiles`, `student_registrations`, `agent_registrations`, and
   `institution_enquiries` tables, the trigger that creates a profile automatically on
   sign-up, and the row-level-security rules that keep each user's data private (and
   let admins see everything).

## 3. Turn off email confirmation (optional, for faster testing)

By default Supabase requires users to confirm their email before they can log in.
For a live site, leave this on. For quick local testing: **Authentication → Providers
→ Email → toggle off "Confirm email"**.

## 4. Get your API keys

**Project Settings → API**. You need:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`

(Never use the `service_role` key here — that one must never reach the browser.)

## 5. Make yourself an admin

1. Deploy or run the site locally and sign up once through the **Admin Login** button
   using your own email (role tabs default to student/agent for sign-up; admin accounts
   are promoted manually, on purpose — see below).
   - Actually easiest: sign up through the **Student** tab first with your own email,
     just to create the account.
2. Back in Supabase **SQL Editor**, run:
   ```sql
   update profiles set role = 'admin' where email = 'you@example.com';
   ```
3. Log out and back in on the site — you'll now land on the admin dashboard, which
   lists every student, agent, and institution registration and lets you change their
   status.

## 6. Deploy to Netlify

### Option A — Git-connected (recommended)

1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. Netlify → **Add new site → Import an existing project** → pick the repo.
3. Build settings (already set via `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Site configuration → Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy.

### Option B — Netlify CLI

```bash
npm install -g netlify-cli
cd ycc-website
npm install
netlify login
netlify init
netlify env:set VITE_SUPABASE_URL https://your-project-ref.supabase.co
netlify env:set VITE_SUPABASE_ANON_KEY your-anon-key
netlify deploy --prod
```

## Local development

```bash
cp .env.example .env      # then fill in your real Supabase URL + anon key
npm install
npm run dev
```

## What's real vs. what's still simple

- **Real**: sign-up, login, logout, sessions, role-based dashboards, registration
  data stored in Postgres, row-level security, admin approve/reject workflow.
- **Still simple, on purpose**: no password reset UI yet (Supabase supports it —
  ask if you want it added), no file uploads for documents, institution enquiries
  don't require an account (by design, so institutions can reach you with zero
  friction) and are visible only to admins.
- The **contact form** at the bottom of the homepage still uses
  [FormSubmit](https://formsubmit.co) to email `mzhbd@gmx.co.uk` directly — no
  database needed for a one-off "get in touch" message.

## Project structure

```
src/
  supabaseClient.js       Supabase client (reads env vars)
  AuthContext.jsx          Tracks the logged-in user + their role
  App.jsx                  Shell: navbar, home/dashboard routing, auth modal
  components/
    Navbar.jsx, Footer.jsx
    AuthModal.jsx           Login / sign-up, role-aware
    RegistrationForms.jsx   Student / agent / institution forms (write to Supabase)
  pages/
    Home.jsx                Marketing site: hero, destinations, about, get started
    Dashboard.jsx            Role-based: student/agent see their own record,
                              admin sees & manages everyone's
supabase/
  schema.sql               Run once in the Supabase SQL editor
```
