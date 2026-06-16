-- ============================================================
-- Migration: Add image column to universities table
-- ============================================================
-- Run this in the Supabase SQL Editor if you already ran the
-- original migration (supabase_migration.sql) before this column existed.
-- ============================================================

ALTER TABLE universities ADD COLUMN IF NOT EXISTS image TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'universities' AND column_name IN ('logo_image', 'image');
