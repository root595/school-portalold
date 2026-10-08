import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolRecord } from '../../types';
import { AVAILABLE_ICONS, renderRecordIcon } from '../../lib/icons';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  AlertCircle,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const RecordsManager: React.FC = () => {
  const { records, createRecord, editRecord, removeRecord, reorderRecords, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SchoolRecord | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [icon, setIcon] = useState('FileText');
  const [isPublished, setIsPublished] = useState(true);
  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');

  // Validate Google Drive URL
  const validateGoogleDriveUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is allowed as per requirement
    const trimmed = url.trim().toLowerCase();
    const isDrive =
      trimmed.includes('drive.google.com') ||
      trimmed.includes('docs.google.com') ||
      trimmed.startsWith('https://');
    return isDrive;
  };

  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setName('');
    setDescription('');
    setDriveUrl('');
    setIcon('FileText');
    setIsPublished(true);
    setUrlValidationError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (rec: SchoolRecord) => {
    setEditingRecord(rec);
    setName(rec.name);
    setDescription(rec.description || '');
    setDriveUrl(rec.drive_url || '');
    setIcon(rec.icon || 'FileText');
    setIsPublished(rec.is_published);
    setUrlValidationError(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('يرجى إدخال اسم السجل', 'error');
      return;
    }

    if (driveUrl.trim() && !validateGoogleDriveUrl(driveUrl)) {
      setUrlValidationError('يرجى التأكد من كتابة رابط صحيح (يفضل رابط مجلد أو ملف Google Drive يبدأ بـ https://)');
      return;
    }

    setSubmitting(true);

    if (editingRecord) {
      await editRecord({
        ...editingRecord,
        name: name.trim(),
        description: description.trim(),
        drive_url: driveUrl.trim(),
        icon,
        is_published: isPublished,
      });
    } else {
      await createRecord({
        name: name.trim(),
        description: description.trim(),
        drive_url: driveUrl.trim(),
        icon,
        order_index: records.length + 1,
        is_published: isPublished,
      });
    }

    setSubmitting(false);
    setModalOpen(false);
  };

  const handleTogglePublished = async (rec: SchoolRecord) => {
    await editRecord({
      ...rec,
      is_published: !rec.is_published,
    });
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const reordered = [...records];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    await reorderRecords(reordered);
  };

  const handleMoveDown = async (index: number) => {
    if (index === records.length - 1) return;
    const reordered = [...records];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    await reorderRecords(reordered);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    await removeRecord(deleteTargetId);
    setDeleteTargetId(null);
  };

  const filtered = useMemo(() => {
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">ب. إدارة السجلات المدرسية والإدارية</h2>
          <p className="text-xs text-slate-500 mt-1">
            إضافة، تعديل، حذف، تغيير الترتيب، وربط مجلدات Google Drive للسجلات.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة سجل جديد</span>
        </button>
      </div>

      {/* Search & Total info */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في أسماء السجلات..."
            className="w-full pr-9 pl-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>العدد الإجمالي: {records.length} سجل</span>
          <span aria-hidden="true">·</span>
          <span>المنشور: {records.filter((r) => r.is_published).length}</span>
          <span aria-hidden="true">·</span>
          <span>المخفي: {records.filter((r) => !r.is_published).length}</span>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">الترتيب</th>
                <th className="py-3.5 px-4 w-12 text-center">الأيقونة</th>
                <th className="py-3.5 px-4">اسم السجل والوصف</th>
                <th className="py-3.5 px-4">رابط Google Drive</th>
                <th className="py-3.5 px-4 text-center">حالة النشر</th>
                <th className="py-3.5 px-4 text-center w-36">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    لا توجد سجلات تطابق البحث
                  </td>
                </tr>
              ) : (
                filtered.map((record, index) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Order Controls */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-mono font-bold text-slate-500 w-6">
                          {record.order_index}
                        </span>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveUp(index)}
                            title="تحريك لأعلى"
                            className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === records.length - 1}
                            onClick={() => handleMoveDown(index)}
                            title="تحريك لأسفل"
                            className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Icon */}
                    <td className="py-3 px-4 text-center">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mx-auto">
                        {renderRecordIcon(record.icon, 'w-4 h-4')}
                      </div>
                    </td>

                    {/* Name & Description */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-800 text-xs sm:text-sm">
                        {record.name}
                      </div>
                      {record.description && (
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {record.description}
                        </div>
                      )}
                    </td>

                    {/* Drive URL */}
                    <td className="py-3 px-4 max-w-[200px]">
                      {record.drive_url ? (
                        <a
                          href={record.drive_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline flex items-center gap-1 text-[11px] font-mono truncate"
                          title={record.drive_url}
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{record.drive_url}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">
                          لم يُحدد رابط بعد
                        </span>
                      )}
                    </td>

                    {/* Publish Status Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(record)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                          record.is_published
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {record.is_published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>ظاهر</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>مخفي</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(record)}
                          title="تعديل"
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTargetId(record.id);
                            setDeleteTargetName(record.name);
                          }}
                          title="حذف"
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>{editingRecord ? 'تعديل بيانات السجل' : 'إضافة سجل إداري جديد'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Record Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  اسم السجل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: سجل لجنة التحصيل الدراسي"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  الوصف (اختياري)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف مختصر لأهداف ومحتويات السجل..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Google Drive URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  رابط Google Drive
                </label>
                <input
                  type="url"
                  dir="ltr"
                  value={driveUrl}
                  onChange={(e) => {
                    setDriveUrl(e.target.value);
                    setUrlValidationError(null);
                  }}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 font-mono text-left"
                />
                {urlValidationError && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{urlValidationError}</span>
                  </p>
                )}
                <p className="text-[11px] text-slate-400">
                  إذا لم يتوفر الرابط حاليًا، اتركه فارغًا وسيظهر للزوار أن الرابط قيد الإضافة لاحقًا.
                </p>
              </div>

              {/* Icon selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  أيقونة السجل
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                  {Object.entries(AVAILABLE_ICONS).map(([iconKey, info]) => {
                    const isSelected = icon === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setIcon(iconKey)}
                        className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
                        }`}
                        title={info.label}
                      >
                        {renderRecordIcon(iconKey, 'w-4 h-4')}
                        <span className="text-[9px] truncate max-w-full font-medium">
                          {iconKey}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Publishing Status */}
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span>نشر السجل في البوابة العامة (ظاهر لجميع الزوار)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingRecord ? 'حفظ التعديلات' : 'إضافة السجل'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="تأكيد حذف السجل"
        message={`هل أنت متأكد من رغبتك في حذف "${deleteTargetName}" نهائيًا؟ لن يتمكن الزوار من الوصول إليه بعد الحذف.`}
        confirmLabel="نعم، احذف السجل"
        cancelLabel="تراجع"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
