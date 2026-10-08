import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { uploadToSupabaseStorage } from '../../lib/supabase';
import { Image as ImageIcon, Upload, Trash2, Check, RefreshCw, Link as LinkIcon, ExternalLink } from 'lucide-react';

export const HomeManager: React.FC = () => {
  const { settings, updateSettings, isSupabaseConnected } = useApp();

  const [imageUrl, setImageUrl] = useState(settings.hero_image_url || '');
  const [imageAlt, setImageAlt] = useState(settings.hero_image_alt || '');
  const [uploading, setUploading] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [saving, setSaving] = useState(false);

  // Suggested high quality school facades
  const PRESET_SCHOOL_IMAGES = [
    {
      title: 'واجهة مدرسة معاصرة وحديثة',
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=80',
    },
    {
      title: 'مبنى تعليمي ومجمع أكاديمي راقٍ',
      url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80',
    },
    {
      title: 'فناء مدرسي مع مرافق وأشجار خضراء',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80',
    },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreviewError(false);

    // If Supabase storage is live, upload to bucket
    if (isSupabaseConnected) {
      const { url, error } = await uploadToSupabaseStorage(file);
      if (url) {
        setImageUrl(url);
      } else {
        // Fallback to FileReader base64 preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      // Local preview via FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSettings({
      hero_image_url: imageUrl,
      hero_image_alt: imageAlt,
    });
    setSaving(false);
  };

  const handleDeleteImage = () => {
    setImageUrl('');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">أ. إدارة الصفحة الرئيسية</h2>
        <p className="text-xs text-slate-500 mt-1">
          الصفحة الرئيسية مخصصة فقط لعرض صورة المدرسة الرئيسية بشكل بارز ومتجاوب مع جميع الشاشات.
        </p>
      </div>

      {/* Main Image Preview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">معاينة صورة المدرسة الحالية</span>
          {imageUrl && (
            <button
              type="button"
              onClick={handleDeleteImage}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف الصورة</span>
            </button>
          )}
        </div>

        {/* Live Image Box */}
        <div className="relative w-full aspect-16/9 md:aspect-21/9 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
          {imageUrl && !previewError ? (
            <img
              src={imageUrl}
              alt={imageAlt || 'معاينة'}
              onError={() => setPreviewError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
              <ImageIcon className="w-12 h-12 stroke-1" />
              <p className="text-xs text-slate-500">
                {previewError ? 'فشل تحميل الرابط المدخل، يرجى التحقق منه' : 'لم يتم تحديد صورة حاليًا'}
              </p>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              <span>جاري رفع الصورة إلى التخزين...</span>
            </div>
          )}
        </div>

        {/* Controls: URL and Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Option 1: Direct URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              رابط الصورة المباشر (URL)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                dir="ltr"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewError(false);
                }}
                placeholder="https://example.com/school-building.jpg"
                className="w-full pr-9 pl-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 font-mono text-left"
              />
            </div>
          </div>

          {/* Option 2: Upload File */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              أو رفع صورة من جهازك {isSupabaseConnected ? '(مخزن Supabase)' : ''}
            </label>
            <label className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-semibold text-slate-700 transition-colors">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>اختيار ملف من الحاسوب أو الجوال</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Alt text input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            النص البديل للصورة (Alt Text)
          </label>
          <input
            type="text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="مثال: المبنى الرئيسي للمدرسة والفناء الخارجي"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-[11px] text-slate-400">
            يساعد محركات البحث وضعاف البصر ويزيد من جودة معايير إمكانية الوصول للموقع.
          </p>
        </div>

        {/* Preset suggestions */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-600">نماذج صور عالية الدقة جاهزة للاختيار:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_SCHOOL_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setImageUrl(preset.url);
                  setImageAlt(preset.title);
                  setPreviewError(false);
                }}
                className="p-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-right transition-all cursor-pointer group"
              >
                <div className="w-full h-16 rounded-md overflow-hidden mb-1.5 bg-slate-200">
                  <img src={preset.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 block truncate">
                  {preset.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>حفظ صورة الصفحة الرئيسية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
