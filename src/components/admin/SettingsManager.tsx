import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Globe, Phone, Mail, Share2, MapPin, Check, RefreshCw } from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [siteTitle, setSiteTitle] = useState(settings.site_title || '');
  const [siteDescription, setSiteDescription] = useState(settings.site_description || '');

  // Contact info
  const [phone, setPhone] = useState(settings.contact.phone || '');
  const [email, setEmail] = useState(settings.contact.email || '');
  const [twitterX, setTwitterX] = useState(settings.contact.twitter_x || '');
  const [whatsapp, setWhatsapp] = useState(settings.contact.whatsapp || '');
  const [location, setLocation] = useState(settings.contact.location || '');

  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateSettings({
      site_title: siteTitle,
      site_description: siteDescription,
      contact: {
        ...settings.contact,
        phone,
        email,
        twitter_x: twitterX,
        whatsapp,
        location,
      },
    });
    setSaving(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">هـ. إدارة إعدادات الموقع والتواصل</h2>
        <p className="text-xs text-slate-500 mt-1">
          إدارة عنوان الموقع الرقمي، الوصف التعريفي لمحركات البحث، وقنوات التواصل المدرسية.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Site Identity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>هوية الموقع العامة وSEO</span>
          </h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              عنوان الموقع (Site Title)
            </label>
            <input
              type="text"
              required
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="بوابة المدرسة الإلكترونية والسجلات الإدارية"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-slate-400">
              يظهر في شريط علامات تبويب المتصفح ومحركات البحث.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              وصف الموقع (Meta Description)
            </label>
            <textarea
              rows={2}
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              placeholder="المنصة الرقمية الموحدة للسجلات المدرسية والإشرافية والإدارية..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>قنوات التواصل ومعلومات المدرسة</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>رقم الهاتف المكتبي</span>
              </label>
              <input
                type="text"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0112345678"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono text-left"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>البريد الإلكتروني الرسمي</span>
              </label>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@school.edu.sa"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono text-left"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                رقم الواتساب للتواصل
              </label>
              <input
                type="text"
                dir="ltr"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="966500000000"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono text-left"
              />
            </div>

            {/* Twitter / X */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                رابط حساب إكس (تويتر)
              </label>
              <input
                type="url"
                dir="ltr"
                value={twitterX}
                onChange={(e) => setTwitterX(e.target.value)}
                placeholder="https://x.com/school_account"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono text-left"
              />
            </div>

            {/* Location */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>المدينة والمنطقة التعليمية</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="مثال: الرياض - الإدارة العامة للتعليم بمنطقة الرياض"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>حفظ إعدادات الموقع</span>
          </button>
        </div>
      </form>
    </div>
  );
};
