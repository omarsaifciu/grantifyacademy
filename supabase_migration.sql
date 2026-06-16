-- ============================================================
-- Supabase Migration: Per-Language Content Blocks (20 languages)
-- ============================================================
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)
-- ============================================================

-- 1. Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- UNIVERSITIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL CHECK (country IN ('China', 'Cyprus', 'Georgia', 'Malaysia', 'Germany', 'UK', 'Italy', 'Rwanda')),
  city TEXT,
  university_type TEXT NOT NULL CHECK (university_type IN ('public', 'private')),
  accreditation_status TEXT NOT NULL CHECK (accreditation_status IN ('accredited', 'unaccredited')),
  accreditations JSONB DEFAULT '[]'::jsonb,
  logo_image TEXT,
  description TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  content TEXT,                     -- HTML fallback (Arabic/English)
  seo_title TEXT,
  seo_description TEXT,
  translations JSONB DEFAULT '{}'::jsonb,   -- Per-locale data including contentBlocks
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SCHOLARSHIPS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT,
  university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
  value TEXT,
  deadline DATE,
  image TEXT,
  description TEXT,
  requirements TEXT[],
  content TEXT,                     -- HTML fallback (Arabic/English)
  seo_title TEXT,
  seo_description TEXT,
  translations JSONB DEFAULT '{}'::jsonb,   -- Per-locale data including contentBlocks
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- BLOG POSTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  author TEXT,
  date TEXT,
  image TEXT,
  content TEXT,                     -- HTML fallback (Arabic/English)
  seo_title TEXT,
  seo_description TEXT,
  translations JSONB DEFAULT '{}'::jsonb,   -- Per-locale data including contentBlocks
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- OTHER TABLES (unchanged from original)
-- ============================================================
CREATE TABLE IF NOT EXISTS application_intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  semester_name TEXT NOT NULL CHECK (semester_name IN ('fall', 'spring', 'summer')),
  application_open_date DATE NOT NULL,
  application_close_date DATE NOT NULL,
  expected_admission_result_date DATE,
  semester_start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  degree_level TEXT NOT NULL CHECK (degree_level IN ('diploma', 'bachelor', 'master', 'phd')),
  study_language TEXT NOT NULL CHECK (study_language IN ('english', 'chinese', 'german', 'italian', 'turkish', 'other')),
  duration_years NUMERIC,
  tuition_fee_original NUMERIC,
  tuition_fee_after_discount NUMERIC,
  scholarship_type TEXT NOT NULL CHECK (scholarship_type IN ('none', '25', '50', '75', 'full')),
  min_gpa_percentage NUMERIC,
  language_requirement TEXT NOT NULL CHECK (language_requirement IN ('none', 'ielts_toefl', 'preparatory_year', 'internal_test')),
  is_active BOOLEAN DEFAULT TRUE,
  translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS required_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  translations JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS program_required_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  required_document_id UUID NOT NULL REFERENCES required_documents(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(program_id, required_document_id)
);

CREATE TABLE IF NOT EXISTS nationality_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  student_nationality TEXT NOT NULL,
  applies_to_destination TEXT NOT NULL,
  condition_text TEXT,
  extra_document_required TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('warning', 'mandatory')),
  translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  can_post BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  hero_background_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Skills table (persistent instructions for AI generation)
CREATE TABLE IF NOT EXISTS ai_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- UPDATED TRIGGER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['universities', 'scholarships', 'blog_posts', 'application_intakes', 'programs', 'required_documents', 'program_required_documents', 'nationality_requirements', 'users', 'settings', 'ai_skills'])
  LOOP
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = tbl) THEN
      EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON %s', tbl, tbl);
      EXECUTE format('CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at()', tbl, tbl);
    END IF;
  END LOOP;
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE required_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_required_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE nationality_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access for all content tables
DROP POLICY IF EXISTS "public_read" ON universities;
CREATE POLICY "public_read" ON universities FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read" ON scholarships;
CREATE POLICY "public_read" ON scholarships FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read" ON blog_posts;
CREATE POLICY "public_read" ON blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read" ON application_intakes;
CREATE POLICY "public_read" ON application_intakes FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read" ON programs;
CREATE POLICY "public_read" ON programs FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read" ON required_documents;
CREATE POLICY "public_read" ON required_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read" ON program_required_documents;
CREATE POLICY "public_read" ON program_required_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read" ON nationality_requirements;
CREATE POLICY "public_read" ON nationality_requirements FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read" ON settings;
CREATE POLICY "public_read" ON settings FOR SELECT USING (true);

-- Authenticated users (admins) can insert/update/delete
DROP POLICY IF EXISTS "admin_all" ON universities;
CREATE POLICY "admin_all" ON universities FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_all" ON scholarships;
CREATE POLICY "admin_all" ON scholarships FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_all" ON blog_posts;
CREATE POLICY "admin_all" ON blog_posts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_all" ON application_intakes;
CREATE POLICY "admin_all" ON application_intakes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_all" ON programs;
CREATE POLICY "admin_all" ON programs FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_all" ON required_documents;
CREATE POLICY "admin_all" ON required_documents FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_all" ON program_required_documents;
CREATE POLICY "admin_all" ON program_required_documents FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_all" ON nationality_requirements;
CREATE POLICY "admin_all" ON nationality_requirements FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_all" ON users;
CREATE POLICY "admin_all" ON users FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_all" ON settings;
CREATE POLICY "admin_all" ON settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET for image uploads
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read on storage
DROP POLICY IF EXISTS "public_read" ON storage.objects;
CREATE POLICY "public_read" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');

-- Allow authenticated users to upload/delete
DROP POLICY IF EXISTS "admin_upload" ON storage.objects;
CREATE POLICY "admin_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_delete" ON storage.objects;
CREATE POLICY "admin_delete" ON storage.objects FOR DELETE USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- ============================================================
-- USEFUL QUERIES: Inserting/Querying Content Blocks
-- ============================================================

-- EXAMPLE: Insert a university with per-language content blocks
-- (Use the Supabase JS SDK or the REST API for this; example below is raw SQL)

-- INSERT INTO universities (name, country, city, university_type, accreditation_status, content, translations)
-- VALUES (
--   'Example University',
--   'Cyprus',
--   'Nicosia',
--   'private',
--   'accredited',
--   '<h3 class="text-2xl font-bold mb-4 text-foreground">العنوان التجريبي</h3><p class="text-muted-foreground mb-6">نص تجريبي</p>',
--   '{
--     "en": {
--       "name": "Example University",
--       "description": "An example description",
--       "seoTitle": "Example University | Scholarships",
--       "seoDescription": "Learn about Example University",
--       "contentBlocks": [
--         { "type": "h3", "text": "Why Choose Example University?" },
--         { "type": "p", "text": "Example University offers world-class education in Cyprus." }
--       ]
--     },
--     "ar": {
--       "name": "الجامعة النموذجية",
--       "description": "وصف نموذجي",
--       "seoTitle": "الجامعة النموذجية | منح دراسية",
--       "seoDescription": "تعرف على الجامعة النموذجية",
--       "contentBlocks": [
--         { "type": "h3", "text": "لماذا تختار الجامعة النموذجية؟" },
--         { "type": "p", "text": "تقدم الجامعة النموذجية تعليماً عالمياً في قبرص." }
--       ]
--     },
--     "zh": {
--       "name": "示例大学",
--       "contentBlocks": [
--         { "type": "h3", "text": "为什么选择示例大学？" },
--         { "type": "p", "text": "示例大学在塞浦路斯提供世界一流的教育。" }
--       ]
--     },
--     "es": { "name": "Universidad Ejemplo", "contentBlocks": [] },
--     "hi": { "name": "उदाहरण विश्वविद्यालय", "contentBlocks": [] },
--     "fr": { "name": "Université Exemple", "contentBlocks": [] },
--     "bn": { "name": "উদাহরণ বিশ্ববিদ্যালয়", "contentBlocks": [] },
--     "pt": { "name": "Universidade Exemplo", "contentBlocks": [] },
--     "ru": { "name": "Пример университета", "contentBlocks": [] },
--     "ja": { "name": "示例大学", "contentBlocks": [] },
--     "de": { "name": "Beispieluniversität", "contentBlocks": [] },
--     "ko": { "name": "예시 대학교", "contentBlocks": [] },
--     "tr": { "name": "Örnek Üniversite", "contentBlocks": [] },
--     "vi": { "name": "Đại học Mẫu", "contentBlocks": [] },
--     "it": { "name": "Università Esempio", "contentBlocks": [] },
--     "th": { "name": "มหาวิทยาลัยตัวอย่าง", "contentBlocks": [] },
--     "fa": { "name": "دانشگاه نمونه", "contentBlocks": [] },
--     "sw": { "name": "Chuo Kikuu cha Mfano", "contentBlocks": [] },
--     "id": { "name": "Universitas Contoh", "contentBlocks": [] },
--     "nl": { "name": "Voorbeeld Universiteit", "contentBlocks": [] }
--   }'::jsonb
-- );

-- EXAMPLE: Query content blocks for a specific locale
-- SELECT
--   id,
--   name,
--   translations->'en'->>'name' AS name_en,
--   translations->'en'->'contentBlocks' AS content_blocks_en,
--   translations->'ar'->'contentBlocks' AS content_blocks_ar
-- FROM universities
-- WHERE id = 'some-uuid';

-- EXAMPLE: Get all content blocks for a locale as rows
-- SELECT
--   id,
--   jsonb_array_elements(translations->'en'->'contentBlocks') AS block
-- FROM universities
-- WHERE id = 'some-uuid';

-- EXAMPLE: Check if a university has content blocks for a specific locale
-- SELECT
--   id,
--   name,
--   translations->'en'->'contentBlocks' IS NOT NULL
--   AND jsonb_array_length(translations->'en'->'contentBlocks') > 0 AS has_blocks
-- FROM universities;

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_universities_active ON universities(is_active);
CREATE INDEX IF NOT EXISTS idx_universities_country ON universities(country);
CREATE INDEX IF NOT EXISTS idx_universities_translations ON universities USING GIN(translations);
CREATE INDEX IF NOT EXISTS idx_scholarships_translations ON scholarships USING GIN(translations);
CREATE INDEX IF NOT EXISTS idx_blog_posts_translations ON blog_posts USING GIN(translations);
CREATE INDEX IF NOT EXISTS idx_programs_university ON programs(university_id);
CREATE INDEX IF NOT EXISTS idx_intakes_university ON application_intakes(university_id);
