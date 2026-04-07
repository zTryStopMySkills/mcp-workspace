-- =============================================================
-- Agentalia-webs — Tables for public landing
-- Run in: Supabase Dashboard > SQL Editor
-- =============================================================

-- Leads from public landing page
CREATE TABLE IF NOT EXISTS public_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  sector TEXT,
  plan_interest TEXT,
  has_web BOOLEAN DEFAULT FALSE,
  location TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','converted','lost')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_public_leads_status ON public_leads(status);
CREATE INDEX IF NOT EXISTS idx_public_leads_created_at ON public_leads(created_at DESC);

-- Public reviews / testimonials
CREATE TABLE IF NOT EXISTS public_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  business_name TEXT,
  location TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5) DEFAULT 5,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_public_reviews_approved ON public_reviews(approved, created_at DESC);
