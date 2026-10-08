import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SchoolRecord, SiteSettings, ActiveTab, AdminSubTab } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_RECORDS } from '../lib/defaultData';
import {
  fetchSchoolRecords,
  fetchSiteSettings,
  saveRecord,
  deleteRecord,
  batchUpdateRecordOrders,
  saveSiteSettings,
  isLocalAdminLoggedIn,
  setLocalAdminLoggedIn,
} from '../lib/db';
import { getSupabaseClient, getSupabaseCredentials } from '../lib/supabase';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  adminSubTab: AdminSubTab;
  setAdminSubTab: (tab: AdminSubTab) => void;

  records: SchoolRecord[];
  settings: SiteSettings;
  loading: boolean;
  toasts: ToastInfo[];

  // Auth & Connection
  isAuthenticated: boolean;
  userEmail: string | null;
  isSupabaseConnected: boolean;
  supabaseUrl: string;

  // Actions
  refreshData: () => Promise<void>;
  createRecord: (record: Omit<SchoolRecord, 'id'>) => Promise<{ success: boolean; error?: string }>;
  editRecord: (record: SchoolRecord) => Promise<{ success: boolean; error?: string }>;
  removeRecord: (id: string) => Promise<{ success: boolean; error?: string }>;
  reorderRecords: (records: SchoolRecord[]) => Promise<{ success: boolean; error?: string }>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  configureSupabase: (url: string, key: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<ActiveTab>('home');
  const [adminSubTab, setAdminSubTab] = useState<AdminSubTab>('home');
  const [records, setRecords] = useState<SchoolRecord[]>(DEFAULT_RECORDS);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Update URL hash / history when tab changes
  const setActiveTab = useCallback((tab: ActiveTab) => {
    setActiveTabState(tab);
    if (tab === 'admin') {
      window.location.hash = '#admin';
    } else if (tab === 'records') {
      window.location.hash = '#records';
    } else if (tab === 'vision') {
      window.location.hash = '#vision';
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Load data
  const loadData = useCallback(async (isAdmin: boolean) => {
    setLoading(true);
    try {
      const [fetchedRecords, fetchedSettings] = await Promise.all([
        fetchSchoolRecords(isAdmin),
        fetchSiteSettings(),
      ]);
      setRecords(fetchedRecords);
      setSettings(fetchedSettings);
    } catch (err) {
      console.error('Failed to load site data:', err);
      showToast('تعذر تحميل بعض البيانات', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Check Supabase connection and auth state
  useEffect(() => {
    const creds = getSupabaseCredentials();
    setIsSupabaseConnected(creds.isConfigured);
    setSupabaseUrl(creds.url);

    const client = getSupabaseClient();
    if (client) {
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || 'المدير');
        } else {
          // Check local admin
          if (isLocalAdminLoggedIn()) {
            setIsAuthenticated(true);
            setUserEmail('مدير النظام (وضع المحاكاة المحلي)');
          }
        }
      });

      const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || 'المدير');
        } else {
          if (!isLocalAdminLoggedIn()) {
            setIsAuthenticated(false);
            setUserEmail(null);
          }
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    } else {
      if (isLocalAdminLoggedIn()) {
        setIsAuthenticated(true);
        setUserEmail('مدير النظام (الوضع المحلي)');
      }
    }
  }, []);

  // Check initial hash route
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'admin') setActiveTabState('admin');
    else if (hash === 'records') setActiveTabState('records');
    else if (hash === 'vision') setActiveTabState('vision');
    else setActiveTabState('home');

    const handleHash = () => {
      const current = window.location.hash.replace('#', '');
      if (current === 'admin') setActiveTabState('admin');
      else if (current === 'records') setActiveTabState('records');
      else if (current === 'vision') setActiveTabState('vision');
      else setActiveTabState('home');
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Initial data load
  useEffect(() => {
    loadData(isAuthenticated);
  }, [loadData, isAuthenticated]);

  // Apply theme styling dynamically to CSS root
  useEffect(() => {
    if (!settings.theme) return;
    const root = document.documentElement;
    root.style.setProperty('--primary-color', settings.theme.primary_color || '#0d9488');
    root.style.setProperty('--secondary-color', settings.theme.secondary_color || '#0f172a');
    
    // Background color
    if (settings.theme.background_color) {
      document.body.style.backgroundColor = settings.theme.background_color;
    }

    // Font size scaling
    if (settings.theme.font_size === 'sm') {
      root.style.fontSize = '15px';
    } else if (settings.theme.font_size === 'lg') {
      root.style.fontSize = '17px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [settings.theme]);

  const refreshData = async () => {
    await loadData(isAuthenticated);
  };

  // CRUD for Records
  const createRecord = async (recordData: Omit<SchoolRecord, 'id'>) => {
    const id = `rec-${Date.now()}`;
    const newRecord: SchoolRecord = {
      ...recordData,
      id,
    };
    const res = await saveRecord(newRecord);
    if (res.success) {
      setRecords((prev) => [...prev, newRecord].sort((a, b) => a.order_index - b.order_index));
      showToast('تمت إضافة السجل بنجاح', 'success');
      return { success: true };
    } else {
      showToast(res.error || 'فشل إضافة السجل', 'error');
      return res;
    }
  };

  const editRecord = async (updated: SchoolRecord) => {
    const res = await saveRecord(updated);
    if (res.success) {
      setRecords((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)).sort((a, b) => a.order_index - b.order_index)
      );
      showToast('تم تحديث بيانات السجل بنجاح', 'success');
      return { success: true };
    } else {
      showToast(res.error || 'فشل تحديث السجل', 'error');
      return res;
    }
  };

  const removeRecord = async (id: string) => {
    const res = await deleteRecord(id);
    if (res.success) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      showToast('تم حذف السجل بنجاح', 'success');
      return { success: true };
    } else {
      showToast(res.error || 'فشل حذف السجل', 'error');
      return res;
    }
  };

  const reorderRecords = async (reordered: SchoolRecord[]) => {
    const withIndices = reordered.map((rec, i) => ({
      ...rec,
      order_index: i + 1,
    }));
    setRecords(withIndices);
    const res = await batchUpdateRecordOrders(withIndices);
    if (res.success) {
      showToast('تم حفظ الترتيب الجديد بنجاح', 'success');
      return { success: true };
    } else {
      showToast(res.error || 'فشل حفظ الترتيب الجديد', 'error');
      return res;
    }
  };

  const updateSettings = async (partial: Partial<SiteSettings>) => {
    const merged: SiteSettings = {
      ...settings,
      ...partial,
      theme: { ...settings.theme, ...(partial.theme || {}) },
      navigation: { ...settings.navigation, ...(partial.navigation || {}) },
      contact: { ...settings.contact, ...(partial.contact || {}) },
    };
    const res = await saveSiteSettings(merged);
    if (res.success) {
      setSettings(merged);
      showToast('تم حفظ التعديلات بنجاح', 'success');
      return { success: true };
    } else {
      showToast(res.error || 'فشل حفظ التعديلات', 'error');
      return res;
    }
  };

  // Auth
  const loginAdmin = async (email: string, pass: string) => {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password: pass.trim(),
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          setIsAuthenticated(true);
          setUserEmail(data.user.email || 'المدير');
          showToast('تم تسجيل الدخول بنجاح', 'success');
          return { success: true };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'خطأ غير متوقع أثناء تسجيل الدخول';
        return { success: false, error: msg };
      }
    }

    // If Supabase not yet configured or credentials not provided, check local admin demo credentials
    if (email.trim().toLowerCase() === 'admin@school.edu.sa' && pass === 'Admin@2026') {
      setLocalAdminLoggedIn(true);
      setIsAuthenticated(true);
      setUserEmail('admin@school.edu.sa (الوضع المحلي)');
      showToast('تم تسجيل الدخول كمسؤول في النظام المحلي', 'success');
      return { success: true };
    }

    return {
      success: false,
      error: 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور المسجلة في Supabase Auth.',
    };
  };

  const logoutAdmin = async () => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    setLocalAdminLoggedIn(false);
    setIsAuthenticated(false);
    setUserEmail(null);
    showToast('تم تسجيل الخروج بنجاح', 'info');
  };

  const configureSupabase = async (url: string, key: string): Promise<boolean> => {
    try {
      localStorage.setItem('supabase_project_url', url.trim());
      localStorage.setItem('supabase_anon_key', key.trim());
      const creds = getSupabaseCredentials();
      setIsSupabaseConnected(creds.isConfigured);
      setSupabaseUrl(creds.url);
      if (creds.isConfigured) {
        showToast('تم حفظ بيانات الاتصال بـ Supabase بنجاح', 'success');
        await loadData(isAuthenticated);
        return true;
      }
      return false;
    } catch {
      showToast('فشل حفظ إعدادات Supabase', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        adminSubTab,
        setAdminSubTab,
        records,
        settings,
        loading,
        toasts,
        isAuthenticated,
        userEmail,
        isSupabaseConnected,
        supabaseUrl,
        refreshData,
        createRecord,
        editRecord,
        removeRecord,
        reorderRecords,
        updateSettings,
        loginAdmin,
        logoutAdmin,
        showToast,
        dismissToast,
        configureSupabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
