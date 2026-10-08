import React from 'react';
import {
  GraduationCap,
  Award,
  Users,
  HeartHandshake,
  FileText,
  ClipboardCheck,
  Briefcase,
  CalendarCheck,
  IdCard,
  PackageCheck,
  Receipt,
  ShieldCheck,
  Mic,
  LayoutTemplate,
  Handshake,
  TrendingUp,
  FileCheck,
  Folder,
  Bookmark,
  Star,
  BookOpen,
  School,
  Settings,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

export const AVAILABLE_ICONS: Record<string, { label: string; component: React.ComponentType<LucideProps> }> = {
  GraduationCap: { label: 'قبعة التخرج / التحصيل', component: GraduationCap },
  Award: { label: 'جائزة / التميز', component: Award },
  Users: { label: 'مجتمع / معلمات / فرق', component: Users },
  HeartHandshake: { label: 'إرشاد / توجيه', component: HeartHandshake },
  FileText: { label: 'مستند / نشرات', component: FileText },
  ClipboardCheck: { label: 'متابعة / تقييم', component: ClipboardCheck },
  Briefcase: { label: 'حقيبة / اجتماعات', component: Briefcase },
  CalendarCheck: { label: 'تقويم / استعداد', component: CalendarCheck },
  IdCard: { label: 'بطاقة تعريفية', component: IdCard },
  PackageCheck: { label: 'عُهد / تجهيزات', component: PackageCheck },
  Receipt: { label: 'ميزانية / فواتير', component: Receipt },
  ShieldCheck: { label: 'انضباط / أمان', component: ShieldCheck },
  Mic: { label: 'إذاعة مدرسية', component: Mic },
  LayoutTemplate: { label: 'قالب / خطة', component: LayoutTemplate },
  Handshake: { label: 'شراكة مجتمعية', component: Handshake },
  TrendingUp: { label: 'تطوير / مؤشرات', component: TrendingUp },
  FileCheck: { label: 'قرارات وتكليفات', component: FileCheck },
  Folder: { label: 'مجلد عام', component: Folder },
  Bookmark: { label: 'مرجع / لائحة', component: Bookmark },
  Star: { label: 'نجمة تفوق', component: Star },
  BookOpen: { label: 'كتاب / مناهج', component: BookOpen },
  School: { label: 'مبنى المدرسة', component: School },
};

export function renderRecordIcon(iconName: string, className = 'w-6 h-6'): React.ReactNode {
  const item = AVAILABLE_ICONS[iconName];
  if (item) {
    const Component = item.component;
    return <Component className={className} />;
  }
  return <FileText className={className} />;
}
