import React from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, Target, Compass, Award, Shield, Users, Lightbulb } from 'lucide-react';
import { CardRadius } from '../../types';

export const VisionPage: React.FC = () => {
  const { settings } = useApp();

  const getRadiusClass = (radius: CardRadius) => {
    switch (radius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-md';
      case 'md': return 'rounded-lg';
      case 'lg': return 'rounded-xl';
      case 'xl': return 'rounded-2xl';
      case '2xl': return 'rounded-3xl';
      default: return 'rounded-3xl';
    }
  };

  const cardRadiusClass = getRadiusClass(settings.theme.card_radius);

  return (
    <div className="w-full flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
          <Compass className="w-4 h-4 text-emerald-700" />
          <span>التوجه الإستراتيجي للمدرسة</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {settings.navigation.vision_title || 'الرؤية والرسالة'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          نستلهم مسيرتنا التعليمية من تطلعات وزارة التعليم ومستهدفات رؤية المملكة العربية السعودية 2030 لبناء أجيال واعدة ومبدعة.
        </p>
      </div>

      {/* Dual Core Cards: Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vision Card */}
        <div className={`relative bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-8 md:p-10 ${cardRadiusClass} shadow-xl shadow-emerald-950/20 overflow-hidden flex flex-col justify-between`}>
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-emerald-300 flex items-center justify-center">
              <Eye className="w-7 h-7" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                رؤيتنا المستقبلية
              </span>
              <h2 className="text-2xl font-bold text-white">الرؤية</h2>
            </div>

            <blockquote className="text-sm sm:text-base text-emerald-100/90 leading-loose border-r-2 border-emerald-400 pr-4 italic">
              {settings.vision_text}
            </blockquote>
          </div>

          <div className="pt-8 border-t border-white/10 flex items-center justify-between text-xs text-emerald-300/80">
            <span>رؤية المملكة 2030</span>
            <span>الريادة والتميز المدرسي</span>
          </div>
        </div>

        {/* Mission Card */}
        <div className={`relative bg-white border border-slate-200/90 p-8 md:p-10 ${cardRadiusClass} shadow-lg shadow-slate-200/40 overflow-hidden flex flex-col justify-between`}>
          <div className="relative space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
              <Target className="w-7 h-7" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                منهج عملنا ورسالتنا
              </span>
              <h2 className="text-2xl font-bold text-slate-900">الرسالة</h2>
            </div>

            <blockquote className="text-sm sm:text-base text-slate-700 leading-loose border-r-2 border-emerald-600 pr-4 italic">
              {settings.mission_text}
            </blockquote>
          </div>

          <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>جودة نواتج التعلم</span>
            <span>بيئة مدرسية جاذبة ومحفزة</span>
          </div>
        </div>
      </div>

      {/* Core Institutional Values Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">القيم الجوهرية لمدرستنا</h3>
          <p className="text-xs text-slate-500 mt-1">الركائز الأساسية التي تنطلق منها جميع برامجنا وأنشطتنا المدرسية</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-center space-y-2">
            <Award className="w-6 h-6 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">التميز والإتقان</h4>
            <p className="text-xs text-slate-500">تحقيق أعلى معايير الجودة في كافة العمليات التعليمية.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-center space-y-2">
            <Shield className="w-6 h-6 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">الانضباط والمسؤولية</h4>
            <p className="text-xs text-slate-500">ترسيخ السلوك الإيجابي والالتزام بالمواعيد والمهام.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-center space-y-2">
            <Lightbulb className="w-6 h-6 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">الابتكار والإبداع</h4>
            <p className="text-xs text-slate-500">تشجيع الأفكار الإبداعية وتطوير المهارات الحياتية.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-center space-y-2">
            <Users className="w-6 h-6 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">الشراكة المجتمعية</h4>
            <p className="text-xs text-slate-500">تكامل الدور بين الأسرة والمدرسة والمجتمع المحلي.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
