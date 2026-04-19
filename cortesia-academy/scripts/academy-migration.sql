-- =============================================================
-- CortesIA Academy · schema (tabla independiente en Supabase compartida)
-- Ejecutar en SQL Editor de Supabase pnzdequwgjdcjvqdxfqr
-- =============================================================

CREATE TABLE IF NOT EXISTS academy_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nick TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free','premium','admin')),
  is_active BOOLEAN DEFAULT TRUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS academy_users_nick_idx ON academy_users(nick);
CREATE INDEX IF NOT EXISTS academy_users_email_idx ON academy_users(email);
CREATE INDEX IF NOT EXISTS academy_users_tier_active_idx ON academy_users(tier, is_active);

-- Trigger updated_at
DROP TRIGGER IF EXISTS academy_users_touch ON academy_users;
CREATE OR REPLACE FUNCTION academy_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER academy_users_touch
  BEFORE UPDATE ON academy_users
  FOR EACH ROW EXECUTE FUNCTION academy_touch_updated_at();

-- Verificación
SELECT COUNT(*) AS total FROM academy_users;
