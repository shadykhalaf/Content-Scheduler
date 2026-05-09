-- ============================================================
-- Social Media Scheduler — Supabase Database Schema
-- Run this entire script in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste → Run)
-- ============================================================

-- 1. Social Accounts Table
-- Stores connected platform accounts with their access tokens
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,               -- 'facebook', 'instagram', 'linkedin'
  provider_account_id TEXT NOT NULL,     -- The user's ID on that platform
  account_name TEXT,                     -- Display name (e.g., "Ecommerce Guru Page")
  access_token TEXT NOT NULL,            -- OAuth access token for API calls
  refresh_token TEXT,                    -- Some providers give refresh tokens
  token_expires_at TIMESTAMPTZ,         -- When the token expires
  avatar_url TEXT,                       -- Profile picture URL
  metadata JSONB DEFAULT '{}'::jsonb,   -- Extra platform-specific data (page_id, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider, provider_account_id)
);

-- 2. Scheduled Posts Table
-- Stores every post created by the user
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caption TEXT NOT NULL,
  media_url TEXT,                        -- URL to the media in Supabase Storage
  media_type TEXT DEFAULT 'image',       -- 'image', 'video'
  platforms TEXT[] NOT NULL DEFAULT '{}', -- Array of platform names
  post_type TEXT DEFAULT 'post',         -- 'post', 'story', 'reel'
  status TEXT DEFAULT 'scheduled',       -- 'draft', 'scheduled', 'publishing', 'published', 'failed'
  scheduled_at TIMESTAMPTZ NOT NULL,     -- When to publish
  published_at TIMESTAMPTZ,             -- When it was actually published
  error_message TEXT,                    -- If status = 'failed', the reason
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Publish Logs Table
-- Logs every publish attempt for debugging and audit
CREATE TABLE IF NOT EXISTS publish_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES scheduled_posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,                -- Which platform was attempted
  status TEXT NOT NULL,                  -- 'success', 'failed'
  response_code INTEGER,                -- HTTP status code from the platform API
  response_body TEXT,                    -- Raw response from the platform API
  error_message TEXT,                    -- Human-readable error message
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS) Policies
-- Users can only see/edit their own data
-- ============================================================

ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE publish_logs ENABLE ROW LEVEL SECURITY;

-- Social Accounts policies
CREATE POLICY "Users can view own social accounts"
  ON social_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social accounts"
  ON social_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social accounts"
  ON social_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own social accounts"
  ON social_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Scheduled Posts policies
CREATE POLICY "Users can view own posts"
  ON scheduled_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts"
  ON scheduled_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON scheduled_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON scheduled_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Publish Logs policies (users can view logs for their own posts)
CREATE POLICY "Users can view own publish logs"
  ON publish_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM scheduled_posts
      WHERE scheduled_posts.id = publish_logs.post_id
      AND scheduled_posts.user_id = auth.uid()
    )
  );

-- Service role can do everything (needed for cron job)
CREATE POLICY "Service role full access on social_accounts"
  ON social_accounts FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on scheduled_posts"
  ON scheduled_posts FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on publish_logs"
  ON publish_logs FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- Storage Bucket for Media
-- ============================================================
-- NOTE: You also need to create a storage bucket named "media"
-- in the Supabase Dashboard → Storage → New Bucket
-- Set it to PUBLIC so media URLs can be accessed by the social APIs
-- ============================================================

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user_status ON scheduled_posts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_at ON scheduled_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_social_accounts_user ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_publish_logs_post ON publish_logs(post_id);
