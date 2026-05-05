# Vercel Deployment Setup

This guide explains how to deploy the UNISAGE landing page to Vercel with the Supabase database.

## Prerequisites

- GitHub repository pushed (already done at `https://github.com/Syphurus/Unisage`)
- Supabase project created at `https://app.supabase.com`
- Supabase connection string obtained

## Step 1: Create a Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"** or **"Add New"** → **"Project"**
3. Import from GitHub → select the `Syphurus/Unisage` repository
4. Click **"Import"** (Next.js will be auto-detected)

## Step 2: Set Environment Variables in Vercel

Before deploying, set these environment variables in Vercel:

1. In your project dashboard, go to **Settings** → **Environment Variables**
2. Add the following (for **Production** and **Preview** environments):

   | Name                      | Value                           | Example                                                             |
   | ------------------------- | ------------------------------- | ------------------------------------------------------------------- |
   | `DATABASE_URL`            | Your Supabase connection string | `postgresql://postgres:PASSWORD@db.XXXXX.supabase.co:5432/postgres` |
   | `WAITLIST_ADMIN_PASSWORD` | A strong admin password         | `YourSecurePassword123!`                                            |

3. Click **"Save"** for each variable

## Step 3: Deploy

1. After setting env vars, click **"Deploy"** (or let Vercel auto-deploy from GitHub)
2. Wait for the build to complete (should take ~1-2 minutes)
3. Once deployed, visit your app URL (e.g., `https://unisage-XXXXX.vercel.app`)

## Step 4: Verify the Deployment

- Visit `/api/health` to check if the database is connected
- Try submitting the waitlist form on the home page
- Visit `/waitlist` and log in with your `WAITLIST_ADMIN_PASSWORD`

## Troubleshooting

### "getaddrinfo ENOTFOUND db.dqvtfhavvcjvglzqetyz.supabase.co"

- `DATABASE_URL` is not set or missing in Vercel
- **Fix:** Go to Vercel project Settings → Environment Variables and add `DATABASE_URL`

### "Unable to save your waitlist entry"

- Check `/api/health` to see the exact error
- Verify `DATABASE_URL` is correct (copy it from Supabase dashboard)

### "Invalid password" on `/waitlist`

- The password you're entering doesn't match `WAITLIST_ADMIN_PASSWORD` set in Vercel
- **Fix:** Reset `WAITLIST_ADMIN_PASSWORD` in Vercel and try again

## Getting Your Supabase Connection String

1. Go to your Supabase project: `https://app.supabase.com`
2. Click **Settings** → **Database**
3. Under **Connection string**, copy the **URI** (PostgreSQL section)
4. Replace `[YOUR-PASSWORD]` with your database password
5. Use this as your Vercel `DATABASE_URL`

## Environment Variables Reference

- `DATABASE_URL`: Supabase Postgres connection string (required for production)
- `WAITLIST_ADMIN_PASSWORD`: Password to access `/waitlist` admin page (optional, defaults to "Escapethematrix101")
- `NODE_ENV`: Automatically set by Vercel to "production"

## Health Check Endpoint

Visit `/api/health` on your deployed app to check database connectivity and configuration status.
