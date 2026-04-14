-- Enable RLS on all saved tables
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → paste and run

ALTER TABLE csy_saved_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE csy_saved_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE csy_saved_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE csy_thumbnail_jobs ENABLE ROW LEVEL SECURITY;

-- Allow all operations from service_role (the backend uses supabaseAdmin which uses service_role key)
-- The anon key is blocked by default when no policy grants access
-- NOTE: When user auth is added later, replace these policies with:
-- USING (auth.uid() = user_id)

CREATE POLICY "service_role_all_saved_videos"
  ON csy_saved_videos FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_saved_channels"
  ON csy_saved_channels FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_saved_keywords"
  ON csy_saved_keywords FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_thumbnail_jobs"
  ON csy_thumbnail_jobs FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- Quota usage table (for server-side quota tracking)
CREATE TABLE IF NOT EXISTS csy_quota_usage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL DEFAULT CURRENT_DATE,
  units_used integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date)
);

ALTER TABLE csy_quota_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_quota"
  ON csy_quota_usage FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
