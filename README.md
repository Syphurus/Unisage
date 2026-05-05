# UNISAGE Landing Page

A Next.js App Router landing page for the UNISAGE exam success platform.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Local development notes

- This project uses Prisma (SQLite by default for local dev). The local DB file is `prisma/dev.db` and is ignored by `.gitignore`.
- The admin password used by the `/waitlist` admin view is read from the `WAITLIST_ADMIN_PASSWORD` environment variable. See `.env.example`.

## Deploy to GitHub + Vercel (what I can do for you)

I can prepare the repo and code for deployment (I've already updated the codebase to use an env-based admin password, added `.gitignore`, and included a `.env.example`). To complete the full automated flow (create a GitHub repo, push the code, create a Vercel project, and set environment variables) I need credentials or tokens from you — see the `What I need` section below.

If you prefer to deploy yourself, follow the guidance in the earlier conversation or use the quick checklist below.

## Quick checklist to deploy yourself

1. Create a GitHub repo and push this project. Example (local):

```bash
git init
git add .
git commit -m "Initial landing page + waitlist"
git branch -M main
git remote add origin git@github.com:<you>/<repo>.git
git push -u origin main
```

2. Provision a production database and obtain `DATABASE_URL`.
   - Recommended: Vercel Postgres, Supabase, Neon, or PlanetScale.
   - Do NOT use `file:./prisma/dev.db` in production.

3. In Vercel project settings (after you import the GitHub repo), set environment variables:
   - `DATABASE_URL` = your production DB connection string
   - `WAITLIST_ADMIN_PASSWORD` = strong admin password

4. Connect GitHub repo to Vercel and deploy. Vercel will run `npm install` and `prisma generate` (postinstall).

## What I can do for you (if you provide access)

I can fully automate the following:

- Create a GitHub repository and push this workspace.
- Create a Vercel project and connect it to the repo.
- Set Vercel environment variables (`DATABASE_URL`, `WAITLIST_ADMIN_PASSWORD`).
- Optionally provision a managed Postgres database (Supabase/Neon) and set its connection string.

To perform those actions on your behalf I need one of the following options (pick one):

Option A — Provide tokens (fastest, I can do everything remotely):

- GitHub personal access token with `repo` scope (or `public_repo` for public repos).
- Vercel token with project creation permissions.
- Choice of database provider OR an existing DB connection string.

Option B — You run authenticated CLI commands on your machine and I guide you (safer):

- I provide a sequence of `gh`/`vercel` commands to run locally. I will prepare the repo and files; you run `gh repo create` and `vercel` commands so credentials remain on your machine.

## What I need from you now to proceed automatically

- Which option above do you prefer (A or B)?
- If Option A: provide GitHub token, Vercel token, repo name and visibility (public/private), and your DB preference or DB connection string.
- If Option B: confirm and I'll give the exact CLI commands to run locally (I can also create a small shell script for you).

If you'd like me to just prepare everything but not push or configure Vercel, I already did most prep: `.gitignore`, `.env.example`, `postinstall` in `package.json`, and switched the admin password to `WAITLIST_ADMIN_PASSWORD` env var.

Tell me which option you want and provide the values you consent to share, and I'll proceed with the automated steps.

## Using Supabase for the production database (recommended)

This project uses Prisma and is now configured for PostgreSQL. Supabase is a managed Postgres provider that works well with Prisma and Vercel.

Quick Supabase setup

1. Create a Supabase project at https://app.supabase.com/.
2. In the Supabase dashboard go to Settings → Database → Connection string and copy the `Connection string (URI)`.
3. In your development environment set `DATABASE_URL` to that connection string and run migrations locally:

```bash
export DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<db>"
npx prisma migrate dev --name init
npx prisma generate
```

4. Commit the generated migration files under `prisma/migrations` and push to GitHub.

Deploying and running migrations

- Add the Supabase connection string as `DATABASE_URL` in Vercel (Production & Preview).
- Add the same connection string as `PROD_DATABASE_URL` in GitHub repository Secrets if you use the included GitHub Actions workflow to run migrations on push to `main`.
- When deploying, run `npx prisma migrate deploy` (the included GitHub Action will run this) so your production DB schema is up to date.

Notes and local development

- The Prisma schema has been updated to use `provider = "postgresql"` and `url = env("DATABASE_URL")` in `prisma/schema.prisma`.
- For local development you can run a local Postgres (Docker) or use a Supabase project dev DB. Using local SQLite is possible but requires switching the Prisma schema back to `sqlite`.
- Do not commit `.env` — use `.env.example` as a template.

If you want me to provision Supabase and create the initial migration for you, provide Supabase access or tell me to prepare the migration steps and I'll guide you through running them locally.
