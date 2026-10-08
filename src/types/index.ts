export interface SchoolRecord {
  id: string;
  name: string;
  description?: string;
  drive_url: string;
  icon: string;
  order_index: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type FontSize = 'sm' | 'base' | 'lg';

export interface ThemeConfig {
  primary_color: string;
  secondary_color: string;
  background_color: string;
  card_radius: CardRadius;
  font_size: FontSize;
  show_icons: boolean;
}

export interface NavConfig {
  home_title: string;
  records_title: string;
  vision_title: string;
  home_visible: boolean;
  records_visible: boolean;
  vision_visible: boolean;
}

export interface ContactConfig {
  phone: string;
  email: string;
  twitter_x: string;
  whatsapp: string;
  telegram: string;
  location: string;
}

export interface SiteSettings {
  id?: string;
  school_name: string;
  site_title: string;
  site_description: string;
  hero_image_url: string;
  hero_image_alt: string;
  records_intro: string;
  vision_text: string;
  mission_text: string;
  theme: ThemeConfig;
  navigation: NavConfig;
  contact: ContactConfig;
  updated_at?: string;
}

export type ActiveTab = 'home' | 'records' | 'vision' | 'admin';

export type AdminSubTab = 'home' | 'records' | 'pages' | 'theme' | 'settings' | 'setup';
