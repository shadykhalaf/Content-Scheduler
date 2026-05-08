# Setup Instructions: Scheduler Platform

Your Next.js Scheduler platform is built! Before deploying, you must configure the database and the environment variables.

## Step 1: Supabase Database Setup

1. Go to your Supabase Project dashboard.
2. Navigate to **SQL Editor**.
3. Paste and run the following SQL commands to create your database tables:

```sql
-- Create users table (optional, as Supabase Auth manages this, but good for profiles)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text
);

-- Create social accounts table
create table public.social_accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  platform text not null,
  account_name text not null,
  access_token text not null,
  refresh_token text,
  expires_at timestamp with time zone
);

-- Create scheduled posts table
create table public.scheduled_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  caption text not null,
  media_url text,
  scheduled_time timestamp with time zone not null,
  type text not null, -- 'post' or 'story'
  platforms text[] not null, -- array of platform names e.g., ['facebook', 'instagram']
  status text default 'scheduled' -- 'scheduled', 'published', 'failed'
);
```

## Step 2: Supabase Authentication (OAuth)

To make "Sign in with TikTok / Facebook" work:

1. Go to **Authentication** -> **Providers** in Supabase.
2. Enable the providers you want (Facebook, TikTok, LinkedIn, etc.).
3. You will be prompted for a `Client ID` and `Client Secret`.
4. You must go to the respective Developer Portals to get these:
   - **Facebook**: Meta for Developers -> Create App
   - **TikTok**: TikTok for Developers -> Create App
   - **LinkedIn**: LinkedIn Developers -> Create App
5. **CRITICAL**: Each developer portal will ask you for a "Redirect URI" or "OAuth Redirect URL". You MUST provide your Supabase callback URL. You can find this URL in Supabase under Authentication -> Configuration -> URL Configuration (it looks like `https://<project-ref>.supabase.co/auth/v1/callback`).

## Step 3: Vercel Deployment

Deploying the app is very simple with Vercel:

1. Push your code to a GitHub repository.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com/) and create an account or log in.
3. Click **Add New** -> **Project**.
4. Import your GitHub repository.
5. In the "Environment Variables" section before deploying, you MUST add:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
6. Click **Deploy**.

Within 2 minutes, Vercel will give you a live URL (e.g., `https://your-scheduler.vercel.app`).

## Step 4: Finalizing OAuth Redirects
Once deployed on Vercel, go back to your **Supabase Dashboard**:
1. Go to **Authentication** -> **URL Configuration**.
2. Add your Vercel URL (e.g., `https://your-scheduler.vercel.app`) to the **Site URL** and **Redirect URLs** so that Supabase allows logins from your live site.
