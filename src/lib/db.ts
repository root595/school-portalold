import { SchoolRecord, SiteSettings } from '../types';
import { DEFAULT_RECORDS, DEFAULT_SETTINGS } from './defaultData';
import { getSupabaseClient } from './supabase';

const LOCAL_STORAGE_RECORDS_KEY = 'school_records_v1';
const LOCAL_STORAGE_SETTINGS_KEY = 'school_settings_v1';
const LOCAL_STORAGE_LOCAL_AUTH_KEY = 'school_local_admin_session';

// --- Local Storage Helpers ---
function getLocalRecords(): SchoolRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RECORDS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(DEFAULT_RECORDS));
      return DEFAULT_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_RECORDS;
  }
}

function saveLocalRecords(records: SchoolRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save to local storage', err);
  }
}

function getLocalSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveLocalSettings(settings: SiteSettings) {
  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save local settings', err);
  }
}

// --- Data API ---

export async function fetchSchoolRecords(isAdmin = false): Promise<SchoolRecord[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase.from('school_records').select('*').order('order_index', { ascending: true });
      if (!isAdmin) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        saveLocalRecords(data);
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to cached local data:', err);
    }
  }

  // Fallback to local data
  const local = getLocalRecords();
  return isAdmin ? local : local.filter((r) => r.is_published);
}

export async function saveRecord(record: SchoolRecord): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  // Update local copy first for immediate UI responsiveness
  const currentRecords = getLocalRecords();
  const existingIdx = currentRecords.findIndex((r) => r.id === record.id);
  let updatedList: SchoolRecord[];

  if (existingIdx >= 0) {
    updatedList = [...currentRecords];
    updatedList[existingIdx] = { ...record, updated_at: new Date().toISOString() };
  } else {
    updatedList = [...currentRecords, { ...record, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }];
  }
  // Sort by order_index
  updatedList.sort((a, b) => a.order_index - b.order_index);
  saveLocalRecords(updatedList);

  if (supabase) {
    try {
      const { error } = await supabase.from('school_records').upsert({
        id: record.id,
        name: record.name,
        description: record.description || '',
        drive_url: record.drive_url || '',
        icon: record.icon || 'FileText',
        order_index: record.order_index,
        is_published: record.is_published,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل الحفظ في قاعدة البيانات';
      return { success: false, error: msg };
    }
  }

  return { success: true };
}

export async function deleteRecord(recordId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  // Remove from local cache
  const currentRecords = getLocalRecords();
  const filtered = currentRecords.filter((r) => r.id !== recordId);
  saveLocalRecords(filtered);

  if (supabase) {
    try {
      const { error } = await supabase.from('school_records').delete().eq('id', recordId);
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل الحذف من قاعدة البيانات';
      return { success: false, error: msg };
    }
  }

  return { success: true };
}

export async function batchUpdateRecordOrders(records: SchoolRecord[]): Promise<{ success: boolean; error?: string }> {
  saveLocalRecords(records);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // Upsert ordered records
      const updates = records.map((r, index) => ({
        id: r.id,
        name: r.name,
        description: r.description || '',
        drive_url: r.drive_url || '',
        icon: r.icon,
        order_index: index + 1,
        is_published: r.is_published,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from('school_records').upsert(updates);
      if (error) return { success: false, error: error.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل تحديث الترتيب';
      return { success: false, error: msg };
    }
  }

  return { success: true };
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'primary').maybeSingle();
      if (!error && data) {
        const parsed: SiteSettings = {
          school_name: data.school_name || DEFAULT_SETTINGS.school_name,
          site_title: data.site_title || DEFAULT_SETTINGS.site_title,
          site_description: data.site_description || DEFAULT_SETTINGS.site_description,
          hero_image_url: data.hero_image_url || DEFAULT_SETTINGS.hero_image_url,
          hero_image_alt: data.hero_image_alt || DEFAULT_SETTINGS.hero_image_alt,
          records_intro: data.records_intro || DEFAULT_SETTINGS.records_intro,
          vision_text: data.vision_text || DEFAULT_SETTINGS.vision_text,
          mission_text: data.mission_text || DEFAULT_SETTINGS.mission_text,
          theme: data.theme || DEFAULT_SETTINGS.theme,
          navigation: data.navigation || DEFAULT_SETTINGS.navigation,
          contact: data.contact || DEFAULT_SETTINGS.contact,
          updated_at: data.updated_at,
        };
        saveLocalSettings(parsed);
        return parsed;
      }
    } catch (err) {
      console.warn('Supabase settings fetch failed, using local settings:', err);
    }
  }

  return getLocalSettings();
}

export async function saveSiteSettings(settings: SiteSettings): Promise<{ success: boolean; error?: string }> {
  saveLocalSettings(settings);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('site_settings').upsert({
        id: 'primary',
        school_name: settings.school_name,
        site_title: settings.site_title,
        site_description: settings.site_description,
        hero_image_url: settings.hero_image_url,
        hero_image_alt: settings.hero_image_alt,
        records_intro: settings.records_intro,
        vision_text: settings.vision_text,
        mission_text: settings.mission_text,
        theme: settings.theme,
        navigation: settings.navigation,
        contact: settings.contact,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل حفظ الإعدادات';
      return { success: false, error: msg };
    }
  }

  return { success: true };
}

// Reset data to defaults
export async function resetToDefaults(): Promise<void> {
  localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(DEFAULT_RECORDS));
  localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
}

// Auth helpers
export function isLocalAdminLoggedIn(): boolean {
  return localStorage.getItem(LOCAL_STORAGE_LOCAL_AUTH_KEY) === 'true';
}

export function setLocalAdminLoggedIn(val: boolean): void {
  if (val) {
    localStorage.setItem(LOCAL_STORAGE_LOCAL_AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(LOCAL_STORAGE_LOCAL_AUTH_KEY);
  }
}
