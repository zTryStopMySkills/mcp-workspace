-- bot/db/nexus-schema.sql
-- Run once in your Supabase SQL editor to create all Nexus tables.

-- pipeline runs
CREATE TABLE IF NOT EXISTS nexus_pipeline_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  triggered_by TEXT NOT NULL,
  source_item JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  urgency TEXT,
  topic TEXT,
  tool_detected TEXT,
  research_output JSONB,
  draft_output JSONB,
  discord_message_id TEXT,
  discord_channel_id TEXT,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  exported_at TIMESTAMPTZ,
  export_url TEXT,
  duration_ms INTEGER
);

-- event bus (polling-based)
CREATE TABLE IF NOT EXISTS nexus_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_type TEXT NOT NULL,
  pipeline_run_id UUID REFERENCES nexus_pipeline_runs(id),
  payload JSONB NOT NULL DEFAULT '{}',
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  source TEXT
);

-- long-term memory
CREATE TABLE IF NOT EXISTS nexus_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  memory_type TEXT NOT NULL,
  topic_cluster TEXT,
  content JSONB NOT NULL,
  confidence FLOAT DEFAULT 0.5,
  confirmation_count INTEGER DEFAULT 0,
  last_confirmed_at TIMESTAMPTZ,
  source_run_ids UUID[]
);

-- user feedback
CREATE TABLE IF NOT EXISTS nexus_user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pipeline_run_id UUID NOT NULL REFERENCES nexus_pipeline_runs(id),
  feedback_type TEXT NOT NULL,
  original_value JSONB,
  user_value JSONB,
  discord_user_id TEXT,
  notes TEXT
);

-- detected patterns
CREATE TABLE IF NOT EXISTS nexus_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pattern_type TEXT NOT NULL,
  description TEXT NOT NULL,
  trigger_data JSONB,
  action_data JSONB,
  occurrence_count INTEGER DEFAULT 1,
  last_seen_at TIMESTAMPTZ,
  suggested_to_user BOOLEAN DEFAULT false,
  user_accepted BOOLEAN
);

-- error log for self-improvement
CREATE TABLE IF NOT EXISTS nexus_error_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pipeline_run_id UUID REFERENCES nexus_pipeline_runs(id),
  error_type TEXT NOT NULL,
  error_detail JSONB,
  context JSONB,
  resolved BOOLEAN DEFAULT false,
  resolution TEXT,
  avoidance_rule TEXT
);

-- indexes
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON nexus_pipeline_runs(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_created ON nexus_pipeline_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_unprocessed ON nexus_events(processed, created_at) WHERE processed = false;
CREATE INDEX IF NOT EXISTS idx_memory_type_cluster ON nexus_memory(memory_type, topic_cluster);
