-- Drop existing tables (to recreate with new structure)
DROP TABLE IF EXISTS program_required_documents CASCADE;
DROP TABLE IF EXISTS required_documents CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS application_intakes CASCADE;
DROP TABLE IF EXISTS nationality_requirements CASCADE;
DROP TABLE IF EXISTS scholarships CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS ai_skills CASCADE;
DROP TABLE IF EXISTS universities CASCADE;

-- Create universities table
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL CHECK (country IN ('China', 'Cyprus', 'Georgia', 'Malaysia', 'Germany', 'UK', 'Italy', 'Rwanda')),
  city TEXT,
  university_type TEXT NOT NULL CHECK (university_type IN ('public', 'private')),
  accreditation_status TEXT NOT NULL CHECK (accreditation_status IN ('accredited', 'unaccredited')),
  logo_image TEXT,
  description TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  content TEXT,
  seo_title TEXT,
  seo_description TEXT,
  translations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create application_intakes table
CREATE TABLE application_intakes (
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

-- Create programs table (updated with new fields)
CREATE TABLE programs (
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
  translations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create required_documents table (now per-university)
CREATE TABLE required_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  translations JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create program_required_documents junction table
CREATE TABLE program_required_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  required_document_id UUID NOT NULL REFERENCES required_documents(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(program_id, required_document_id)
);

-- Create nationality_requirements table
CREATE TABLE nationality_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  student_nationality TEXT NOT NULL,
  applies_to_destination TEXT NOT NULL,
  condition_text TEXT,
  extra_document_required TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('warning', 'mandatory')),
  translations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scholarships table (updated to reference university_id)
CREATE TABLE scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT,
  university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
  value TEXT,
  deadline DATE,
  image TEXT,
  description TEXT,
  requirements TEXT[],
  content TEXT,
  seo_title TEXT,
  seo_description TEXT,
  translations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  author TEXT,
  date TEXT,
  image TEXT,
  content TEXT,
  seo_title TEXT,
  seo_description TEXT,
  translations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  can_post BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE settings (
  id TEXT PRIMARY KEY,
  hero_background_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_skills table (persistent AI instructions)
CREATE TABLE ai_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for required_documents (uses university IDs from the sample universities above)
INSERT INTO required_documents (university_id, name, description)
SELECT id, 'جواز السفر', 'صلاحية لا تقل عن 6 أشهر' FROM universities WHERE name = 'جامعة شرق البحر المتوسط'
UNION ALL
SELECT id, 'شهادة الثانوية العامة + كشف الدرجات', NULL FROM universities WHERE name = 'جامعة شرق البحر المتوسط'
UNION ALL
SELECT id, 'شهادة الميلاد', NULL FROM universities WHERE name = 'جامعة شرق البحر المتوسط'
UNION ALL
SELECT id, 'صور شخصية', 'خلفية بيضاء' FROM universities WHERE name = 'جامعة شرق البحر المتوسط';

-- Insert sample data
INSERT INTO universities (name, country, city, university_type, accreditation_status, logo_image, description, website_url, is_active) VALUES
('جامعة شرق البحر المتوسط', 'Cyprus', 'فاماغوستا', 'private', 'accredited', 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop', 'واحدة من أكبر وأعرق الجامعات، تقدم برامج دراسية متنوعة باللغة الإنجليزية', 'https://example.com', TRUE),
('جامعة دولية', 'Cyprus', 'نيقوسيا', 'private', 'accredited', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop', 'جامعة حديثة تركز على التميز الأكاديمي والبحث العلمي', 'https://example.com', TRUE),
('جامعة الشرق الأدنى', 'Cyprus', 'نيقوسيا', 'private', 'accredited', 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=600&fit=crop', 'أكبر جامعة مع حرم جامعي حديث ومرافق متطورة', 'https://example.com', TRUE);

INSERT INTO users (email, role, can_post) VALUES
('admin@example.com', 'admin', TRUE);

INSERT INTO settings (id, hero_background_image) VALUES
('site', 'https://imagedelivery.net/LqiWLm-3MGbYHtFuUbcBtA/119580eb-abd9-4191-b93a-f01938786700/public');
