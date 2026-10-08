import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CardRadius, FontSize } from '../../types';
import { DEFAULT_SETTINGS } from '../../lib/defaultData';
import { Palette, RotateCcw, Check, RefreshCw } from 'lucide-react';

export const ThemeManager: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp();

  const [primaryColor, setPrimaryColor] = useState(settings.theme.primary_color || '#0d9488');
  const [secondaryColor, setSecondaryColor] = useState(settings.theme.secondary_color || '#0f172a');
  const [backgroundColor, setBackgroundColor] = useState(settings.theme.background_color || '#f8fafc');
  const [cardRadius, setCardRadius] = useState<CardRadius>(settings.theme.card_radius || 'xl');
  const [fontSize, setFontSize] = useState<FontSize>(settings.theme.font_size || 'base');
  const [showIcons, setShowIcons] = useState<boolean>(settings.theme.show_icons !== false);

  const [saving, setSaving] = useState(false);

  // Suggested Education Color Palettes
  const PRESET_PALETTES = [
    {
      name: 'الأخضر السعودي الملكي (افتراضي)',
      primary: '#0d9488',
      secondary: '#0f172a',
      bg: '#f8fafc',
    },
    {
      name: 'الأزرق الأكاديمي الرصين',
      primary: '#1d4ed8',
      secondary: '#0f172a',
      bg: '#f8fafc',
    },
    {
      name: 'العنابي والذهبي القيادي',
      primary: '#881337',
      secondary: '#1c1917',
      bg: '#fafaf9',
    },
    {
      name: 'الكحلي والزمردي الماسي',
      primary: '#047857',
      secondary: '#1e1b4b',
      bg: '#f1f5f9',
    },
  ];

  const handleApplyPalette = (palette: typeof PRESET_PALETTES[0]) => {
    setPrimaryColor(palette.primary);
    setSecondaryColor(palette.secondary);
    setBackgroundColor(palette.bg);
  };

  const handleResetDefaults = async () => {
    const defTheme = DEFAULT_SETTINGS.theme;
    setPrimaryColor(defTheme.primary_color);
    setSecondaryColor(defTheme.secondary_color);
    setBackgroundColor(defTheme.background_color);
    setCardRadius(defTheme.card_radius);
    setFontSize(defTheme.font_size);
    setShowIcons(defTheme.show_icons);

    await updateSettings({ theme: defTheme });
    showToast('تمت استعادة التصميم الافتراضي للموقع بنجاح', 'info');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateSettings({
      theme: {
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        background_color: backgroundColor,
        card_radius: cardRadius,
        font_size: fontSize,
        show_icons: showIcons,
      },
    });
    setSaving(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">د. تخصيص التصميم والمظهر</h2>
          <p className="text-xs text-slate-500 mt-1">
            التحكم بالألوان، انحناء الزوايا، مقاس الخطوط، وظهور الأيقونات مع استعادة فورية للإعدادات الافتراضية.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>استعادة التصميم الافتراضي</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Colors Palette */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-600" />
            <span>لوحة الألوان الرئيسية</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Primary Color */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700">
                اللون الأساسي (أزرار / هوية)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  dir="ltr"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono text-center"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700">
                اللون الثانوي (العناوين الداكنة)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  dir="ltr"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono text-center"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700">
                خلفية صفحات الموقع
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  dir="ltr"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono text-center"
                />
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-600 block mb-2">
              نماذج ألوان جاهزة ومختارة:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_PALETTES.map((pal, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPalette(pal)}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-right cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: pal.primary }}></span>
                    <span className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: pal.secondary }}></span>
                    <span className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: pal.bg }}></span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-800 block truncate">
                    {pal.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card Shape & Radius */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">
            انحناء زوايا البطاقات والحاويات (Border Radius)
          </h3>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
            {[
              { id: 'none', label: 'حادة (مربعة)', radiusClass: 'rounded-none' },
              { id: 'sm', label: 'طفيفة (sm)', radiusClass: 'rounded-sm' },
              { id: 'md', label: 'متوسطة (md)', radiusClass: 'rounded-md' },
              { id: 'lg', label: 'ناعمة (lg)', radiusClass: 'rounded-lg' },
              { id: 'xl', label: 'حديثة (xl)', radiusClass: 'rounded-xl' },
              { id: '2xl', label: 'دائرية (2xl)', radiusClass: 'rounded-2xl' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setCardRadius(option.id as CardRadius)}
                className={`p-3 border text-center transition-all cursor-pointer ${
                  cardRadius === option.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                } ${option.radiusClass}`}
              >
                <div className="w-8 h-8 mx-auto mb-1 border-2 border-slate-400 bg-slate-100 flex items-center justify-center text-[10px]">
                  عينة
                </div>
                <span className="text-[11px] block">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Size & Icon Visibility */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">حجم الخطوط والأيقونات</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Font Size */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                مقياس حجم الخط للموقع
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sm', label: 'صغير' },
                  { id: 'base', label: 'قياسي (معتدل)' },
                  { id: 'lg', label: 'كبير ومريح' },
                ].map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setFontSize(sz.id as FontSize)}
                    className={`py-2 px-3 text-xs rounded-lg border text-center transition-all cursor-pointer ${
                      fontSize === sz.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Visibility */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                ظهور أيقونات السجلات
              </label>
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showIcons}
                  onChange={(e) => setShowIcons(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-xs font-semibold text-slate-700">
                  إظهار الأيقونات الملونة بجانب أسماء السجلات
                </span>
              </label>
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
            <span>حفظ إعدادات المظهر والتصميم</span>
          </button>
        </div>
      </form>
    </div>
  );
};
