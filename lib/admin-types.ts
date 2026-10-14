export type SiteStatus = 'live' | 'maintenance' | 'development';

export type GeneralConfig = {
  status: SiteStatus;
  logo: string;
  footerLogo: string;
  copyright: string;
  checkIpLogin: boolean;
  allowedIps: string[];
  officeInfo: {
    address: string;
    phone: string;
    fax: string;
    email: string;
  };
  sideOfficeInfo: {
    address: string;
    phone: string;
    fax: string;
    email: string;
  };
  autoSendEmail: {
    sendContactUs: string;
    sendCareerApplicationTo: string;
  };
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  phone: string;
  createdAt: string;
};

export type AdminRole = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
};

export type UserActivityLog = {
  id: string;
  no: number;
  timestamp: string;
  user: string;
  avatar?: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'failed';
};

export type PageMenuItem = {
  id: string;
  no: number;
  title: string;
  navigation: string;
  createdTime: string;
  updated: string;
  visibility: boolean;
  isFixed?: boolean;
};

export type MediaItem = {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document';
  directory: string;
  size: string;
  dimensions?: string;
  uploadedBy: string;
  uploadedAt: string;
  connectedToCarousel?: boolean;
};

export type BannerItem = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type NewsItem = {
  id: string;
  no: number;
  date: string;
  title: string;
  url: string;
  category: string;
  excerpt: string;
  description: string; // rich text HTML
  image: string;
  createTime: string;
  updated: string;
  visibility: boolean;
};

export type CorporateInfoItem = {
  id: string;
  no: number;
  date: string;
  title: string;
  url: string;
  category: string;
  createTime: string;
  updated: string;
  visibility: boolean;
};

export type ProjectItem = {
  id: string;
  no: number;
  title: string;
  slug: string;
  category: string;
  location: string;
  description: string;
  longDescription: string;
  image: string;
  secondaryImage: string;
  facilities: string[];
  createTime: string;
  updated: string;
  visibility: boolean;
};

export type ContactMessage = {
  id: string;
  no: number;
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createTime: string;
  isRead: boolean;
  visibility: boolean;
};

export type GalleryItem = {
  id: string;
  no: number;
  fullName: string; // Title / Name
  phone: string;    // Category / phone contact info as specified
  email: string;    // Media URL / email as specified
  image: string;
  category: string;
  size: 'standard' | 'tall' | 'wide';
  createTime: string;
  visibility: boolean;
};

export type CareerItem = {
  id: string;
  no: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  createTime: string;
  updated: string;
  visibility: boolean;
};
