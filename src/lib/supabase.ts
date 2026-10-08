import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables or custom local storage override
export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_project_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_anon_key') : null;

  const url = (localUrl && localUrl.trim()) || envUrl.trim();
  const key = (localKey && localKey.trim()) || envKey.trim();

  const isConfigured = Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    url.includes('supabase.co') &&
    key.length > 20
  );

  return { url, key, isConfigured };
}

let supabaseInstance: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return null;
  }

  if (supabaseInstance && lastUsedUrl === url && lastUsedKey === key) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    lastUsedUrl = url;
    lastUsedKey = key;
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

// Upload an image file to Supabase Storage bucket 'school-assets'
export async function uploadToSupabaseStorage(file: File): Promise<{ url: string | null; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { url: null, error: 'لم يتم ربط مشروع Supabase بعد' };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `hero_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `hero/${fileName}`;

    const { error: uploadError } = await client.storage
      .from('school-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = client.storage.from('school-assets').getPublicUrl(filePath);
    return { url: data.publicUrl, error: null };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'فشل رفع الصورة';
    return { url: null, error: errorMsg };
  }
}
