import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Eye, Check, RefreshCw } from 'lucide-react';

export const PagesManager: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [schoolName, setSchoolName] = useState(settings.school_name);
  const [recordsIntro, setRecordsIntro] = useState(settings.records_intro);
  const [visionText, setVisionText] = useState(settings.vision_text);
  const [missionText, setMissionText] = useState(settings.mission_text);

  // Navigation settings
  const [navigation, setNavigation] = useState({ ...settings.navigation });

  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateSettings({
      school_name: schoolName,
      records_intro: recordsIntro,
      vision_text: visionText,
      mission_text: missionText,
      navigation,
    });
    setSaving(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">ج. إدارة محتوى الصفحات</h2>
        <p className="text-xs text-slate-500 mt-1">
          تعديل نصوص المقدمة، الرؤية، الرسالة، اسم المدرسة، وعناوين وظهور صفحات الموقع.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* School Name Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>البيانات الأساسية للمدرسة</span>
          </h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              اسم المدرسة المعروض في الترويسة والفوتر
            </label>
            <input
              type="text"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="مثال: مدرسة التميز والإبداع"
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>
        </div>

        {/* Records Portal Intro Text */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>مقدمة صفحة السجلات الإدارية</span>
          </h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              نص المقدمة والترحيب
            </label>
            <textarea
              rows={4}
              required
              value={recordsIntro}
              onChange={(e) => setRecordsIntro(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400">
              يظهر هذا النص أعلى شبكة السجلات لتوضيح أهداف البوابة ومستهدفات التوثيق الإداري.
            </p>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>نصوص الرؤية والرسالة</span>
          </h3>

          {/* Vision */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              نص الرؤية المؤسسية للمدرسة
            </label>
            <textarea
              rows={3}
              required
              value={visionText}
              onChange={(e) => setVisionText(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          {/* Mission */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              نص الرسالة التربوية
            </label>
            <textarea
              rows={3}
              required
              value={missionText}
              onChange={(e) => setMissionText(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Navigation & Visibility */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">
            عناوين وظهور صفحات الموقع في شريط التنقل
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Home */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">الصفحة 1: الرئيسية</span>
                <input
                  type="checkbox"
                  checked={navigation.home_visible}
                  onChange={(e) => setNavigation({ ...navigation, home_visible: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>
              <input
                type="text"
                value={navigation.home_title}
                onChange={(e) => setNavigation({ ...navigation, home_title: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
              />
            </div>

            {/* Records */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">الصفحة 2: السجلات</span>
                <input
                  type="checkbox"
                  checked={navigation.records_visible}
                  onChange={(e) => setNavigation({ ...navigation, records_visible: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>
              <input
                type="text"
                value={navigation.records_title}
                onChange={(e) => setNavigation({ ...navigation, records_title: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
              />
            </div>

            {/* Vision */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">الصفحة 3: الرؤية والرسالة</span>
                <input
                  type="checkbox"
                  checked={navigation.vision_visible}
                  onChange={(e) => setNavigation({ ...navigation, vision_visible: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>
              <input
                type="text"
                value={navigation.vision_title}
                onChange={(e) => setNavigation({ ...navigation, vision_title: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>حفظ تعديلات المحتوى والصفحات</span>
          </button>
        </div>
      </form>
    </div>
  );
};
