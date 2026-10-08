import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { School, ShieldCheck, Menu, X, LogOut, ChevronLeft } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, settings, isAuthenticated, logoutAdmin } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { navigation, school_name } = settings;

  const handleNavClick = (tab: 'home' | 'records' | 'vision' | 'admin') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 text-right group cursor-pointer focus:outline-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <School className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                {school_name || 'بوابة المدرسة'}
              </span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">
                {settings.site_description || 'منصة السجلات الإدارية والتربوية'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navigation.home_visible && (
              <button
                onClick={() => handleNavClick('home')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'home'
                    ? 'text-emerald-800 bg-emerald-50 border border-emerald-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {navigation.home_title || 'الرئيسية'}
              </button>
            )}

            {navigation.records_visible && (
              <button
                onClick={() => handleNavClick('records')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'records'
                    ? 'text-emerald-800 bg-emerald-50 border border-emerald-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {navigation.records_title || 'السجلات الإدارية'}
              </button>
            )}

            {navigation.vision_visible && (
              <button
                onClick={() => handleNavClick('vision')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'vision'
                    ? 'text-emerald-800 bg-emerald-50 border border-emerald-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {navigation.vision_title || 'الرؤية والرسالة'}
              </button>
            )}
          </nav>

          {/* Admin Action Button */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>لوحة التحكم</span>
                </button>
                <button
                  onClick={() => logoutAdmin()}
                  title="تسجيل الخروج"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span>دخول الإدارة</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-150">
          {navigation.home_visible && (
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold ${
                activeTab === 'home' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{navigation.home_title || 'الرئيسية'}</span>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
          )}

          {navigation.records_visible && (
            <button
              onClick={() => handleNavClick('records')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold ${
                activeTab === 'records' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{navigation.records_title || 'السجلات الإدارية'}</span>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
          )}

          {navigation.vision_visible && (
            <button
              onClick={() => handleNavClick('vision')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold ${
                activeTab === 'vision' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{navigation.vision_title || 'الرؤية والرسالة'}</span>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {isAuthenticated ? 'لوحة التحكم الإدارية' : 'تسجيل دخول الإدارة'}
              </span>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
