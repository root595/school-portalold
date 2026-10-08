import React from 'react';
import { useApp } from '../../context/AppContext';
import { School, Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setActiveTab } = useApp();
  const { school_name, contact } = settings;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{school_name}</h3>
                <p className="text-xs text-slate-400">بوابة السجلات والمتابعة الإدارية المدرسية</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              نظام إلكتروني متكامل لتوثيق وتسهيل وصول الكادر التعليمي والإداري إلى ملفات وسجلات العمل المدرسي بما يواكب متطلبات الجودة والتميز المؤسسي.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase border-b border-slate-800 pb-2">
              روابط البوابة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('records')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  بوابة السجلات الإدارية
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('vision')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  الرؤية والرسالة المؤسسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer pt-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>دخول لوحة التحكم الإدارية</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Vision */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase border-b border-slate-800 pb-2">
              التواصل والمعلومات
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              {contact.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{contact.location}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span dir="ltr" className="text-right">{contact.phone}</span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span dir="ltr">{contact.email}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(contact.twitter_x || contact.whatsapp || contact.telegram) && (
              <div className="flex items-center gap-2 pt-2">
                {contact.twitter_x && (
                  <a
                    href={contact.twitter_x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                    title="منصة إكس"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    واتساب
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {school_name}. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-2 text-slate-400">
            <span>وفق رؤية المملكة العربية السعودية 2030</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>جاهز للنشر على Vercel</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
