-- ============================================================
-- Supabase Migration: AI Content Generator Table
-- ============================================================
-- Run this in the Supabase SQL Editor
-- ============================================================

-- AI Generated Content table
CREATE TABLE IF NOT EXISTS ai_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('post', 'story', 'reel', 'carousel')),
  caption TEXT NOT NULL,
  hashtags TEXT DEFAULT '',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_ai_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ai_content_updated_at
  BEFORE UPDATE ON ai_content
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_content_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_content_status ON ai_content(status);
CREATE INDEX IF NOT EXISTS idx_ai_content_scheduled ON ai_content(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_ai_content_topic ON ai_content(topic);
