import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { renderRecordIcon } from '../../lib/icons';
import { ExternalLink, Search, FileText, Lock, Sparkles, FolderOpen } from 'lucide-react';
import { CardRadius } from '../../types';

export const RecordsPage: React.FC = () => {
  const { records, settings, isAuthenticated, setActiveTab, setAdminSubTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Radius helper
  const getRadiusClass = (radius: CardRadius) => {
    switch (radius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-md';
      case 'md': return 'rounded-lg';
      case 'lg': return 'rounded-xl';
      case 'xl': return 'rounded-2xl';
      case '2xl': return 'rounded-3xl';
      default: return 'rounded-2xl';
    }
  };

  const cardRadiusClass = getRadiusClass(settings.theme.card_radius);

  // Filter records based on search query
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          rec.name.toLowerCase().includes(q) ||
          (rec.description && rec.description.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => a.order_index - b.order_index);
  }, [records, searchQuery]);

  const handleRecordClick = (url: string) => {
    if (url && url.trim().length > 0) {
      window.open(url.trim(), '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      {/* Intro Header Section */}
      <section className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm">
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-emerald-600 to-teal-500"></div>
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>بوابة التوثيق الإداري والمدرسي</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {settings.navigation.records_title || 'السجلات الإدارية والمدرسية'}
          </h1>

          {/* Exact Required Intro Text */}
          <div className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50/80 p-5 rounded-xl border border-slate-200/60 font-normal">
            {settings.records_intro}
          </div>
        </div>
      </section>

      {/* Controls Bar: Search & Stats */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في أسماء أو تفاصيل السجلات..."
            className="w-full pr-10 pl-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-2xs placeholder:text-slate-400"
          />
        </div>

        {/* Count Metadata (Zero-Pill discipline compliant) */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 px-1">
          <span>إجمالي السجلات: {filteredRecords.length}</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span>ترتيب معتمد</span>
          {isAuthenticated && (
            <>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setAdminSubTab('records');
                }}
                className="text-emerald-700 hover:underline cursor-pointer"
              >
                تعديل السجلات في لوحة التحكم
              </button>
            </>
          )}
        </div>
      </div>

      {/* Records Cards Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">لا توجد سجلات مطابقة للبحث</h3>
          <p className="text-xs text-slate-500 mt-1">جرب البحث بكلمات أخرى أو أفرغ صندوق البحث.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((record) => {
            const hasLink = Boolean(record.drive_url && record.drive_url.trim().length > 0);

            return (
              <div
                key={record.id}
                onClick={() => hasLink && handleRecordClick(record.drive_url)}
                className={`group relative bg-white border border-slate-200/90 p-5 ${cardRadiusClass} shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
                  hasLink ? 'cursor-pointer hover:border-emerald-400 hover:-translate-y-0.5' : 'cursor-default opacity-95'
                }`}
              >
                {/* Header: Icon & Order index */}
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    {settings.theme.show_icons && (
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        {renderRecordIcon(record.icon, 'w-5 h-5')}
                      </div>
                    )}
                    <span className="text-xs font-mono text-slate-500 font-semibold">
                      #{record.order_index}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {record.name}
                    </h3>
                    {record.description && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                        {record.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action: Direct Drive link or Status */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {hasLink ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>فتح ملف Google Drive</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>الرابط قيد الإضافة من الإدارة</span>
                    </div>
                  )}

                  {hasLink && (
                    <span className="text-[11px] font-medium text-slate-600">
                      نافذة جديدة ↗
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
