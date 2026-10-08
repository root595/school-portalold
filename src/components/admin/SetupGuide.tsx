import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPABASE_SQL_SCHEMA } from '../../lib/sqlScript';
import { Database, Copy, Check, ExternalLink, ShieldAlert, Key, Server, GitBranch, Terminal } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const { isSupabaseConnected, supabaseUrl, configureSupabase, showToast } = useApp();

  const [copied, setCopied] = useState(false);
  const [inputUrl, setInputUrl] = useState(supabaseUrl || '');
  const [inputKey, setInputKey] = useState('');
  const [savingKeys, setSavingKeys] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    showToast('تم نسخ كود SQL بالكامل إلى الحافظة', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConnectSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || !inputKey.trim()) {
      showToast('يرجى إدخال الرابط والمفتاح معًا', 'error');
      return;
    }
    setSavingKeys(true);
    const success = await configureSupabase(inputUrl, inputKey);
    setSavingKeys(false);
    if (!success) {
      showToast('يرجى التحقق من صحة رابط Supabase ومفتاح anon key', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          دليل إعداد Supabase وقواعد البيانات والنشر على Vercel و GitHub
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          خطوات واضحة لتفعيل التخزين الدائم لجميع البيانات وسياسات الأمان RLS ونشر الموقع أونلاين.
        </p>
      </div>

      {/* Live Status Card */}
      <div className={`p-5 rounded-2xl border ${
        isSupabaseConnected ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl ${isSupabaseConnected ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {isSupabaseConnected ? 'قاعدة بيانات Supabase متصلة وجاهزة للعمل' : 'النظام يعمل حاليًا في الوضع المحلي (Local Demo Mode)'}
              </h3>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {isSupabaseConnected
                  ? `المشروع متصل بالخادم: ${supabaseUrl}`
                  : 'جميع التعديلات والإضافات تُحفظ محليًا داخل متصفحك. لربطها بقاعدة بيانات سحابية وتخزين دائم على السحابة، اتبع الخطوات أدناه.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick In-App Supabase Connector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-600" />
          <span>ربط مشروع Supabase مباشرة من المتصفح (أو عبر .env)</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          يمكنك إدخال مفاتيح مشروعك هنا لاختبار الاتصال فورًا، أو إضافتها في ملف <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">.env</code> أو في متغيرات بيئة Vercel.
        </p>

        <form onSubmit={handleConnectSupabase} className="space-y-3 pt-1">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Project URL (رابط المشروع)</label>
            <input
              type="url"
              dir="ltr"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://xyzabcdefg.supabase.co"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono text-left"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Anon Public Key (المفتاح العام)</label>
            <input
              type="password"
              dir="ltr"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono text-left"
            />
          </div>

          <button
            type="submit"
            disabled={savingKeys}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
          >
            {savingKeys ? 'جاري التحقق...' : 'تحديث والاتصال بـ Supabase'}
          </button>
        </form>
      </div>

      {/* Step 1: SQL Script */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>الخطوة 1: تنفيذ كود SQL لإنشاء الجداول وسياسات RLS ومخزن الصور</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              انسخ هذا الكود والصقه في لوحة تحكم Supabase في قائمة <span className="font-semibold text-slate-700">SQL Editor</span> ثم اضغط <span className="font-semibold text-emerald-700">Run</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopySql}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ كود SQL كاملًا'}</span>
          </button>
        </div>

        <div className="relative">
          <pre className="max-h-72 overflow-y-auto p-4 bg-slate-900 text-emerald-300 rounded-xl text-xs font-mono text-left dir-ltr selection:bg-emerald-700 selection:text-white border border-slate-800">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>
      </div>

      {/* Step 2: First Admin User */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>الخطوة 2: إنشاء حساب المدير الأول بأمان (Supabase Auth)</span>
        </h3>
        <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
          <p>
            للحفاظ على أمان الموقع ومنع أي شخص غريب من إنشاء حساب مدير، أنشئ حساب المدير الأول يدويًا ومباشرة من لوحة تحكم Supabase:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pr-2 font-medium">
            <li>توجه إلى مشروعك في <strong>Supabase</strong>.</li>
            <li>من القائمة الجانبية، اختر <strong>Authentication</strong> ثم اضغط على <strong>Users</strong>.</li>
            <li>اضغط على زر <strong>Add user</strong> ثم اختر <strong>Create user</strong>.</li>
            <li>أدخل البريد الإلكتروني الخاص بمدير المدرسة (مثل: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">admin@school.edu.sa</code>) وكلمة مرور قوية.</li>
            <li>تأكد من تفعيل خيار <strong>Auto Confirm User</strong> حتى يصبح الحساب جاهزًا للدخول فورًا.</li>
            <li>يمكنك الآن استخدام هذا الحساب لتسجيل الدخول إلى لوحة التحكم!</li>
          </ol>
        </div>
      </div>

      {/* Step 3: Vercel & GitHub Deployment */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-600" />
          <span>الخطوة 3: النشر على Vercel وربط GitHub</span>
        </h3>
        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p>
            المشروع مهيأ بالكامل للنشر الفوري على منصة <strong>Vercel</strong> عبر الخطوات التالية:
          </p>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-mono text-left dir-ltr text-xs text-slate-800">
            <p className="font-sans font-bold text-slate-900 text-right dir-rtl">
              متغيرات البيئة المطلوبة في Vercel Project Settings → Environment Variables:
            </p>
            <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
            <div>VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key</div>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 pr-2 font-medium">
            <li>ارفع الكود إلى مستودع جديد على حسابك في <strong>GitHub</strong>.</li>
            <li>توجه إلى موقع <strong>Vercel.com</strong> واضغط <strong>Add New Project</strong>.</li>
            <li>اختر مستودع GitHub الخاص بالمشروع ثم اضغط <strong>Import</strong>.</li>
            <li>في قسم <strong>Environment Variables</strong> أضف المتغيرين أعلاه.</li>
            <li>اضغط <strong>Deploy</strong>، وخلال دقيقة واحدة سيكون موقع مدرستك متاحًا للعالم برابط احترافي!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
