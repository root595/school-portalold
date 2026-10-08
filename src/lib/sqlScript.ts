export const SUPABASE_SQL_SCHEMA = `-- =====================================================
-- إعداد قاعدة بيانات منصة المدرسة والسجلات الإدارية
-- قم بنسخ هذا الكود بالكامل ولصقه في Supabase -> SQL Editor ثم اضغط Run
-- =====================================================

-- 1. إنشاء جدول السجلات الإدارية
CREATE TABLE IF NOT EXISTS public.school_records (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    drive_url TEXT DEFAULT '',
    icon TEXT DEFAULT 'FileText',
    order_index INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. إنشاء جدول إعدادات الموقع
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    school_name TEXT NOT NULL DEFAULT 'مدرسة التميز والإبداع',
    site_title TEXT NOT NULL DEFAULT 'بوابة المدرسة الإلكترونية والسجلات الإدارية',
    site_description TEXT DEFAULT 'المنصة الرقمية الموحدة للسجلات المدرسية والإشرافية والإدارية',
    hero_image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=80',
    hero_image_alt TEXT DEFAULT 'المبنى الرئيسي للمدرسة والفناء الخارجي',
    records_intro TEXT NOT NULL DEFAULT '«أهلًا بكم في بوابة السجلات الإدارية والمدرسية...»',
    vision_text TEXT NOT NULL DEFAULT '«أن تكون المدرسة بيئة تعليمية رائدة ومحفزة...»',
    mission_text TEXT NOT NULL DEFAULT '«تقديم تعليم نوعي في بيئة مدرسية آمنة ومحفزة...»',
    theme JSONB NOT NULL DEFAULT '{"primary_color": "#0d9488", "secondary_color": "#0f172a", "background_color": "#f8fafc", "card_radius": "xl", "font_size": "base", "show_icons": true}'::jsonb,
    navigation JSONB NOT NULL DEFAULT '{"home_title": "الرئيسية", "records_title": "السجلات الإدارية", "vision_title": "الرؤية والرسالة", "home_visible": true, "records_visible": true, "vision_visible": true}'::jsonb,
    contact JSONB NOT NULL DEFAULT '{"phone": "0112345678", "email": "info@school.edu.sa", "twitter_x": "", "whatsapp": "", "telegram": "", "location": "المملكة العربية السعودية"}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. تفعيل أمان مستوى الصفوف (Row Level Security - RLS)
ALTER TABLE public.school_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 4. سياسات الحماية لجدول السجلات (school_records)
-- السماح للعامة بقراءة السجلات المنشورة فقط
CREATE POLICY "Public can view published school records"
ON public.school_records
FOR SELECT
TO public
USING (is_published = true);

-- السماح للمدير المسجل بقراءة جميع السجلات (حتى المخفية)
CREATE POLICY "Authenticated users can view all school records"
ON public.school_records
FOR SELECT
TO authenticated
USING (true);

-- السماح للمدير بإضافة سجلات جديدة
CREATE POLICY "Authenticated users can insert school records"
ON public.school_records
FOR INSERT
TO authenticated
WITH CHECK (true);

-- السماح للمدير بتعديل أي سجل
CREATE POLICY "Authenticated users can update school records"
ON public.school_records
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- السماح للمدير بحذف أي سجل
CREATE POLICY "Authenticated users can delete school records"
ON public.school_records
FOR DELETE
TO authenticated
USING (true);

-- 5. سياسات الحماية لجدول الإعدادات (site_settings)
-- السماح للجميع بقراءة إعدادات الموقع
CREATE POLICY "Public can view site settings"
ON public.site_settings
FOR SELECT
TO public
USING (true);

-- السماح للمدير فقط بتحديث إعدادات الموقع
CREATE POLICY "Authenticated users can update site settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can insert site settings"
ON public.site_settings
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 6. إنشاء مخزن الصور في Supabase Storage (school-assets)
INSERT INTO storage.buckets (id, name, public)
VALUES ('school-assets', 'school-assets', true)
ON CONFLICT (id) DO NOTHING;

-- سياسات مخزن الصور: قراءة للعامة، رفع وحذف للمدير فقط
CREATE POLICY "Public can view school assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'school-assets');

CREATE POLICY "Authenticated users can upload school assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'school-assets');

CREATE POLICY "Authenticated users can update school assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'school-assets');

CREATE POLICY "Authenticated users can delete school assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'school-assets');

-- 7. إدراج السجلات الإدارية السبعة عشر الافتراضية
INSERT INTO public.school_records (id, name, description, drive_url, icon, order_index, is_published)
VALUES
('rec-1', 'سجل لجنة التحصيل الدراسي', 'خطط ومؤشرات رفع نواتج التعلم وتحليل نتائج الاختبارات التشخيصية والمركزية.', '', 'GraduationCap', 1, true),
('rec-2', 'سجل لجنة التميز', 'معايير التميز المؤسسي والمدرسي وملفات الترشح لجوائز الأداء التعليمي.', '', 'Award', 2, true),
('rec-3', 'سجل النمو والمجتمعات المهنية', 'ورش العمل وبرامج التطوير المهني المستمر ومجتمعات التعلم التخصصية.', '', 'Users', 3, true),
('rec-4', 'سجل لجنة التوجيه والإرشاد', 'برامج الرعاية التربوية والإرشاد النفسي والاجتماعي ومتابعة الحالات الخاصة.', '', 'HeartHandshake', 4, true),
('rec-5', 'سجل النشرات والتوجيهات', 'التعاميم الرسمية واللوائح التنظيمية والنشرات التربوية الصادرة عن الإدارة.', '', 'FileText', 5, true),
('rec-6', 'سجل متابعة الموظفات', 'سجلات الحضور والغياب، الأداء الوظيفي، والزيارات الإشرافية الدورية.', '', 'ClipboardCheck', 6, true),
('rec-7', 'سجل اجتماعات اللجان والفرق', 'محاضر الاجتماعات الدورية وتوزيع المهام والتوصيات ومتابعة الإنجاز.', '', 'Briefcase', 7, true),
('rec-8', 'خطة الاستعداد لكل فصل دراسي', 'استعدادات بداية الفصول الدراسية وتجهيز البيئة المدرسية والمقررات.', '', 'CalendarCheck', 8, true),
('rec-9', 'البطاقة التعريفية للمدرسة', 'البيانات الأساسية للمدرسة، الهيكل التنظيمي، الطاقة الاستيعابية والإحصائيات.', '', 'IdCard', 9, true),
('rec-10', 'سجل العهد المدرسية', 'توثيق العهد العينية والتجهيزات المدرسية والمختبرات وأجهزة التقنية.', '', 'PackageCheck', 10, true),
('rec-11', 'سجل الميزانية التشغيلية', 'بنود الصرف والميزانية التشغيلية وفواتير المشتريات المعتمدة.', '', 'Receipt', 11, true),
('rec-12', 'سجل الانضباط المدرسي', 'متابعة انتظام الطالبات، إجراءات الحد من الغياب، وحوافز الالتزام.', '', 'ShieldCheck', 12, true),
('rec-13', 'سجل الإذاعة المدرسية', 'جدول الفعاليات الصباحية والبرامج الإذاعية المثرية ومشاركات الفصول.', '', 'Mic', 13, true),
('rec-14', 'قالب الخطة الفصلية', 'نماذج توزيع المناهج والجداول والخطط الزمنية للفصول الدراسية.', '', 'LayoutTemplate', 14, true),
('rec-15', 'سجل الشراكات المجتمعية', 'اتفاقيات التعاون مع المجتمع المحلي ومبادرات مجلس أولياء الأمور.', '', 'Handshake', 15, true),
('rec-16', 'سجل الخطة التشغيلية', 'الأهداف الإستراتيجية للمدرسة والمشاريع التطويرية ومؤشرات قياس الأداء.', '', 'TrendingUp', 16, true),
('rec-17', 'سجل القرارات والتكليفات', 'القرارات الإدارية الداخلية وتكليفات فرق العمل واللجان المتخصصة.', '', 'FileCheck', 17, true)
ON CONFLICT (id) DO NOTHING;

-- 8. إدراج الإعدادات الأولية للموقع
INSERT INTO public.site_settings (id, school_name, site_title, site_description, hero_image_url, hero_image_alt, records_intro, vision_text, mission_text)
VALUES (
    'primary',
    'مدرسة التميز والإبداع',
    'بوابة المدرسة الإلكترونية والسجلات الإدارية',
    'المنصة الرقمية الموحدة للسجلات المدرسية والإشرافية والإدارية',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=80',
    'المبنى الرئيسي للمدرسة والفناء الخارجي',
    '«أهلًا بكم في بوابة السجلات الإدارية والمدرسية، التي تهدف إلى تنظيم السجلات والوثائق المدرسية وتيسير الوصول إليها إلكترونيًا، بما يسهم في رفع كفاءة العمل الإداري، وتعزيز جودة الأداء، وتسهيل متابعة الخطط والبرامج واللجان المدرسية. وقد خُصصت هذه البوابة لتجميع السجلات الإدارية في مكان واحد، بما يحقق سهولة الوصول إليها والاستفادة منها، ويدعم التنظيم والتوثيق والمتابعة المستمرة».',
    '«أن تكون المدرسة بيئة تعليمية رائدة ومحفزة، تحقق التميز في الأداء المدرسي، وترتقي بمستوى التحصيل الدراسي، وتنمي مهارات الطالبات، وتعزز الإبداع والمسؤولية والشراكة المجتمعية، وفق مستهدفات التعليم ورؤية المملكة العربية السعودية 2030».',
    '«تقديم تعليم نوعي في بيئة مدرسية آمنة ومحفزة، من خلال تطبيق الممارسات التعليمية الفاعلة، وتطوير الأداء المهني، وتعزيز الانضباط المدرسي، وتفعيل الشراكة مع الأسرة والمجتمع، بما يسهم في بناء شخصية متوازنة ومتميزة، وتحقيق نواتج تعلم عالية الجودة».'
)
ON CONFLICT (id) DO NOTHING;
`;
