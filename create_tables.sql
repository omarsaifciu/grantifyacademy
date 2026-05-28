
-- Create universities table
CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  students TEXT,
  image TEXT,
  description TEXT,
  programs TEXT[],
  content TEXT,
  seo_title TEXT,
  seo_description TEXT,
  translations JSONB,
  programs_translations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT,
  university TEXT,
  value TEXT,
  deadline TEXT,
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
CREATE TABLE IF NOT EXISTS blog_posts (
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
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  can_post BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  hero_background_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO universities (name, location, students, image, description, programs) VALUES
('جامعة شرق البحر المتوسط', 'فاماغوستا', '20,000+', 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop', 'واحدة من أكبر وأعرق الجامعات، تقدم برامج دراسية متنوعة باللغة الإنجليزية', ARRAY['الهندسة', 'الطب', 'إدارة الأعمال', 'علوم الحاسوب', 'العمارة']),
('جامعة دولية', 'نيقوسيا', '15,000+', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop', 'جامعة حديثة تركز على التميز الأكاديمي والبحث العلمي', ARRAY['القانون', 'الاقتصاد', 'الإعلام', 'السياحة', 'التمريض']),
('جامعة الشرق الأدنى', 'نيقوسيا', '25,000+', 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=600&fit=crop', 'أكبر جامعة مع حرم جامعي حديث ومرافق متطورة', ARRAY['طب الأسنان', 'الصيدلة', 'الفنون الجميلة', 'التربية', 'الهندسة المعمارية']);

INSERT INTO scholarships (title, type, university, value, deadline, image, description, requirements) VALUES
('منحة التميز الأكاديمي الكاملة', 'منحة كاملة', 'جامعة شرق البحر المتوسط', '100% من الرسوم الدراسية', '30 يونيو 2024', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop', 'منحة دراسية كاملة تغطي جميع الرسوم الدراسية للطلاب المتفوقين أكاديمياً', ARRAY['معدل تراكمي لا يقل عن 90%', 'شهادة إتقان اللغة الإنجليزية', 'خطاب توصية من معلمين', 'بيان شخصي']),
('منحة الطلاب الدوليين', 'منحة جزئية', 'جامعة دولية', '50% من الرسوم الدراسية', '15 يوليو 2024', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop', 'منحة مخصصة للطلاب الدوليين المتميزين', ARRAY['معدل تراكمي لا يقل عن 85%', 'اختبار TOEFL أو IELTS', 'سيرة ذاتية محدثة']),
('منحة البحث العلمي', 'منحة دراسات عليا', 'جامعة الشرق الأدنى', 'رسوم دراسية + راتب شهري', '1 أغسطس 2024', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop', 'منحة للطلاب الراغبين في متابعة الدراسات العليا والبحث العلمي', ARRAY['درجة البكالوريوس بتقدير جيد جداً', 'مقترح بحثي', 'خبرة بحثية سابقة']);

INSERT INTO blog_posts (title, excerpt, author, date, image, content) VALUES
('دليل شامل للدراسة 2024', 'كل ما تحتاج معرفته عن الدراسة من التقديم حتى التخرج', 'فريق التحرير', '15 مايو 2024', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop', 'محتوى المقالة الكامل...'),
('أفضل 10 تخصصات دراسية', 'تعرف على التخصصات الأكثر طلباً وفرص العمل المتاحة بعد التخرج', 'د. أحمد محمود', '10 مايو 2024', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop', 'محتوى المقالة الكامل...'),
('تكاليف المعيشة للطلاب', 'دليل تفصيلي عن تكاليف السكن، الطعام، والمواصلات للطلاب', 'سارة علي', '5 مايو 2024', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop', 'محتوى المقالة الكامل...');

INSERT INTO users (email, role, can_post) VALUES
('admin@example.com', 'admin', TRUE);

INSERT INTO settings (id, hero_background_image) VALUES
('site', 'https://imagedelivery.net/LqiWLm-3MGbYHtFuUbcBtA/119580eb-abd9-4191-b93a-f01938786700/public');
