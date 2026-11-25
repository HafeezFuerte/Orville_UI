export interface CmsItem {
  type: string;
  display_name: string;
  language: string;
  str_content: string;
  code: string;
}

export interface WebSettingItem {
  strKey: string;
  strValue: string;
  section?: string;
  description?: string | null;
  is_enabled?: boolean;
}

export interface WebSettingField {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'phone' | 'url' | 'textarea';
  helpText?: string;
}

export interface WebSettingGroup {
  groupName: string;
  description: string;
  items: WebSettingField[];
}

export const CMS_PAGE_DEFINITIONS: { type: string; displayName: string; defaultCode: string }[] = [
  { type: 'privacy_policy', displayName: 'Privacy Policy', defaultCode: 'CBCFB07B' },
  { type: 'terms_condition', displayName: 'Terms & Conditions', defaultCode: 'A58EFBC5' },
  { type: 'facility_management', displayName: 'Facility Management', defaultCode: '7C32B75D' },
  { type: 'legal_experts', displayName: 'Legal Experts', defaultCode: '7DFF635A' },
  { type: 'about_us', displayName: 'About Us', defaultCode: '92585A6D' },
];

export const DEFAULT_CMS_ITEMS: CmsItem[] = [
  {
    type: 'privacy_policy',
    display_name: 'Privacy Policy',
    language: 'en',
    code: 'CBCFB07B',
    str_content: '<section class="mb-8"><h2 class="dv_text_blue fw-700 font-22 mb-3">Who we are</h2><p class="dv_text_gray font-18 mb-4">Orville Real Estate operates this website and related enquiry forms to market and manage property services in the United Arab Emirates.</p></section>',
  },
  {
    type: 'terms_condition',
    display_name: 'Terms & Conditions',
    language: 'en',
    code: 'A58EFBC5',
    str_content: '<section class="mb-8"><h2 class="dv_text_blue fw-700 font-22 mb-3">Terms and Conditions</h2><p class="dv_text_gray font-18 mb-4">Please read these terms and conditions carefully before using our services.</p></section>',
  },
  {
    type: 'facility_management',
    display_name: 'Facility Management',
    language: 'en',
    code: '7C32B75D',
    str_content: '<section class="mb-8"><h2 class="dv_text_blue fw-700 font-22 mb-3">Facility Management Services</h2><p class="dv_text_gray font-18 mb-4">Comprehensive facility operations, maintenance, and asset management.</p></section>',
  },
  {
    type: 'legal_experts',
    display_name: 'Legal Experts',
    language: 'en',
    code: '7DFF635A',
    str_content: '<p class="dv_text_gray mb-0 font-18 text-center site-container">Specialized in handling a wide range of rental disputes</p>',
  },
  {
    type: 'about_us',
    display_name: 'About Us',
    language: 'en',
    code: '92585A6D',
    str_content: '<section class="mb-8"><h2 class="dv_text_blue fw-700 font-22 mb-3">About Orville Real Estate</h2><p class="dv_text_gray font-18 mb-4">Your trusted partner in premier Dubai property management and advisory.</p></section>',
  },
];

export interface NewsItem {
  code: string;
  title: string;
  short_desc: string;
  description?: string;
  long_desc?: string;
  slug_url?: string;
  author?: string;
  start_date?: string;
  end_date?: string;
  is_visible: boolean | number;
  hide_on_end_date?: boolean | number;
  thumbnail_img?: string | null;
  news_image?: string | null;
  created_date?: string;
  modified_date?: string;
  language?: string;
  languageid?: number;
}

export interface NewsFormData {
  code: string;
  title: string;
  author: string;
  short_desc: string;
  long_desc: string;
  slug_url: string;
  start_date: string;
  end_date: string;
  is_visible: boolean;
  hide_on_end_date: boolean;
  language: string;
  thumbnail_img_preview?: string | null;
  news_image_preview?: string | null;
}

export const SETTINGS_FIELD_GROUPS: WebSettingGroup[] = [
  {
    groupName: 'Contact & Support',
    description: 'Public contact channels displayed on your website header, footer, and inquiry forms.',
    items: [
      { key: 'support_email', label: 'Support Email', placeholder: 'e.g. info@orvillerealestate.com', type: 'email', helpText: 'Primary customer support and email address' },
      { key: 'phonePrimary', label: 'Primary Phone', placeholder: 'e.g. 04 333 3983', type: 'phone', helpText: 'Direct office line for incoming calls' },
      { key: 'phoneSecondary', label: 'Secondary Phone', placeholder: 'e.g. +971 4 000 0000', type: 'phone', helpText: 'Alternative or toll-free contact number' },
      { key: 'whatapp_link', label: 'WhatsApp Contact', placeholder: 'e.g. +971500000000', type: 'text', helpText: 'WhatsApp chat link or number (with country code)' },
    ],
  },
  {
    groupName: 'Office Address & Location',
    description: 'Physical company location shown on the website contact page and footer map.',
    items: [
      { key: 'officeAddress', label: 'Headquarters Address', placeholder: 'Building, Floor, Street, Dubai, UAE', type: 'textarea', helpText: 'Full physical office address' },
    ],
  },
  {
    groupName: 'Social Media Channels',
    description: 'Direct profile links shown in website navigation and footer social icons.',
    items: [
      { key: 'socialFacebookUrl', label: 'Facebook Page URL', placeholder: 'https://www.facebook.com/...', type: 'url' },
      { key: 'socialInstagramUrl', label: 'Instagram Profile URL', placeholder: 'https://www.instagram.com/...', type: 'url' },
      { key: 'linkedln_link', label: 'LinkedIn Company Page', placeholder: 'https://www.linkedin.com/...', type: 'url' },
    ],
  },
  {
    groupName: 'Mobile Applications',
    description: 'Store badges linking users to download tenant, landlord, and vendor mobile apps.',
    items: [
      { key: 'androidStoreUrl', label: 'Google Play Store URL', placeholder: 'https://play.google.com/store/apps/...', type: 'url' },
      { key: 'iosStoreUrl', label: 'Apple App Store URL', placeholder: 'https://apps.apple.com/app/...', type: 'url' },
    ],
  },
  {
    groupName: 'Footer & Copyright',
    description: 'Official copyright line and legal branding in website footers.',
    items: [
      { key: 'copyrightLine', label: 'Copyright Notice', placeholder: '© Orville Real Estate. All rights reserved.', type: 'text' },
    ],
  },
];
