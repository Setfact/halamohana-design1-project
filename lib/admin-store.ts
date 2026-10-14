'use client';

import { useState, useEffect } from 'react';
import type {
  GeneralConfig,
  AdminUser,
  AdminRole,
  UserActivityLog,
  PageMenuItem,
  MediaItem,
  BannerItem,
  NewsItem,
  CorporateInfoItem,
  ProjectItem,
  ContactMessage,
  GalleryItem,
  CareerItem,
} from './admin-types';
import { imageUrls } from './content';

const STORAGE_KEY = 'halamohana_cms_data_v1';

export type AdminStoreState = {
  generalConfig: GeneralConfig;
  currentUser: AdminUser;
  users: AdminUser[];
  roles: AdminRole[];
  activityLogs: UserActivityLog[];
  pages: PageMenuItem[];
  media: MediaItem[];
  banners: BannerItem[];
  news: NewsItem[];
  corporateInfo: CorporateInfoItem[];
  projects: ProjectItem[];
  contacts: ContactMessage[];
  gallery: GalleryItem[];
  careers: CareerItem[];
};

const initialData: AdminStoreState = {
  generalConfig: {
    status: 'live',
    logo: '/images/logo-halamohana.png',
    footerLogo: '/images/logo-footer.png',
    copyright: '© 2026 PT Halla Mohana. All rights reserved. A member of MAHADASHA',
    checkIpLogin: true,
    allowedIps: ['127.0.0.1', '192.168.1.100', '180.252.164.21', '36.72.215.110'],
    officeInfo: {
      address: 'Gedung TMT 1, 1st Floor, Jl. Cilandak KKO No. 1, Jakarta 12560, Indonesia',
      phone: '+62 21 2997 6700',
      fax: '+62 21 2997 6701',
      email: 'info@hallamohana.co.id',
    },
    sideOfficeInfo: {
      address: 'Jalan Riau No. 147, Pekanbaru, Riau 28154, Indonesia',
      phone: '+62 761 859 999',
      fax: '+62 761 859 998',
      email: 'pekanbaru@hallamohana.co.id',
    },
    autoSendEmail: {
      sendContactUs: 'inquiries@hallamohana.co.id',
      sendCareerApplicationTo: 'hr@hallamohana.co.id',
    },
  },
  currentUser: {
    id: 'usr-1',
    name: 'Alexander Wardhana',
    email: 'alexander@hallamohana.co.id',
    role: 'Super Administrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    status: 'active',
    lastLogin: '2026-10-09 11:24 WIB',
    phone: '+62 811 9876 5432',
    createdAt: '2025-01-15',
  },
  users: [
    {
      id: 'usr-1',
      name: 'Alexander Wardhana',
      email: 'alexander@hallamohana.co.id',
      role: 'Super Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      status: 'active',
      lastLogin: '2026-10-09 11:24 WIB',
      phone: '+62 811 9876 5432',
      createdAt: '2025-01-15',
    },
    {
      id: 'usr-2',
      name: 'Rina Kusuma',
      email: 'rina.kusuma@hallamohana.co.id',
      role: 'Content Editor',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      status: 'active',
      lastLogin: '2026-10-08 17:10 WIB',
      phone: '+62 812 3456 7890',
      createdAt: '2025-03-20',
    },
    {
      id: 'usr-3',
      name: 'Budi Santoso',
      email: 'budi.santoso@hallamohana.co.id',
      role: 'HR Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      status: 'active',
      lastLogin: '2026-10-07 09:45 WIB',
      phone: '+62 813 5555 4321',
      createdAt: '2025-05-10',
    },
    {
      id: 'usr-4',
      name: 'Dewi Lestari',
      email: 'dewi.lestari@hallamohana.co.id',
      role: 'Media Officer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      status: 'inactive',
      lastLogin: '2026-09-25 14:02 WIB',
      phone: '+62 815 6789 1234',
      createdAt: '2025-08-01',
    },
  ],
  roles: [
    {
      id: 'role-1',
      name: 'Super Administrator',
      description: 'Full administrative access to all modules, configurations, and user controls.',
      permissions: ['general_config', 'users', 'roles', 'pages', 'media', 'banners', 'news', 'corporate_info', 'projects', 'contact_us', 'gallery', 'careers'],
      userCount: 1,
    },
    {
      id: 'role-2',
      name: 'Content Editor',
      description: 'Can create and edit news, projects, banners, media, and corporate information.',
      permissions: ['media', 'banners', 'news', 'corporate_info', 'projects', 'gallery'],
      userCount: 1,
    },
    {
      id: 'role-3',
      name: 'HR Manager',
      description: 'Manages job vacancies, receives applications, and views public feedback.',
      permissions: ['careers', 'contact_us'],
      userCount: 1,
    },
    {
      id: 'role-4',
      name: 'Media Officer',
      description: 'Uploads and organizes media library files and manages photo galleries.',
      permissions: ['media', 'gallery'],
      userCount: 1,
    },
  ],
  activityLogs: [
    {
      id: 'log-1',
      no: 1,
      timestamp: '2026-10-09 11:24:12',
      user: 'Alexander Wardhana',
      action: 'LOGIN',
      module: 'Auth',
      details: 'Successful login from trusted office IP',
      ipAddress: '180.252.164.21',
      status: 'success',
    },
    {
      id: 'log-2',
      no: 2,
      timestamp: '2026-10-09 10:15:30',
      user: 'Rina Kusuma',
      action: 'UPDATE',
      module: 'News',
      details: 'Updated publication status for "Whistle Blowing System"',
      ipAddress: '180.252.164.21',
      status: 'success',
    },
    {
      id: 'log-3',
      no: 3,
      timestamp: '2026-10-08 16:42:05',
      user: 'Alexander Wardhana',
      action: 'CONFIG_CHANGE',
      module: 'General Config',
      details: 'Updated Pekanbaru site office contact details',
      ipAddress: '180.252.164.21',
      status: 'success',
    },
    {
      id: 'log-4',
      no: 4,
      timestamp: '2026-10-08 14:20:18',
      user: 'Budi Santoso',
      action: 'CREATE',
      module: 'Careers',
      details: 'Published new job: Marketing Communication Staff',
      ipAddress: '192.168.1.100',
      status: 'success',
    },
    {
      id: 'log-5',
      no: 5,
      timestamp: '2026-10-07 19:12:44',
      user: 'System Guard',
      action: 'IP_BLOCKED',
      module: 'Security',
      details: 'Denied login attempt from unauthorized external IP 103.45.21.9',
      ipAddress: '103.45.21.9',
      status: 'failed',
    },
  ],
  pages: [
    { id: 'pg-1', no: 1, title: 'Home', navigation: '/', createdTime: '2025-01-01', updated: '2026-10-01', visibility: true, isFixed: true },
    { id: 'pg-2', no: 2, title: 'About Us', navigation: '/about', createdTime: '2025-01-01', updated: '2026-10-02', visibility: true },
    { id: 'pg-3', no: 3, title: 'Projects', navigation: '/projects', createdTime: '2025-01-01', updated: '2026-10-04', visibility: true },
    { id: 'pg-4', no: 4, title: 'Gallery', navigation: '/gallery', createdTime: '2025-01-01', updated: '2026-10-05', visibility: true },
    { id: 'pg-5', no: 5, title: 'News & Insights', navigation: '/news', createdTime: '2025-01-01', updated: '2026-10-07', visibility: true },
    { id: 'pg-6', no: 6, title: 'Careers', navigation: '/career', createdTime: '2025-01-01', updated: '2026-10-08', visibility: true },
    { id: 'pg-7', no: 7, title: 'Contact Us', navigation: '/contact', createdTime: '2025-01-01', updated: '2026-10-09', visibility: true },
  ],
  media: [
    {
      id: 'med-1',
      name: 'hero-banner-main.jpg',
      url: imageUrls.hero,
      type: 'image',
      directory: '/banners',
      size: '1.4 MB',
      dimensions: '2200x1200',
      uploadedBy: 'Alexander Wardhana',
      uploadedAt: '2026-09-10',
      connectedToCarousel: true,
    },
    {
      id: 'med-2',
      name: 'fox-hotel-pekanbaru.jpg',
      url: imageUrls.hotel,
      type: 'image',
      directory: '/projects',
      size: '1.8 MB',
      dimensions: '1800x1200',
      uploadedBy: 'Rina Kusuma',
      uploadedAt: '2026-09-12',
      connectedToCarousel: true,
    },
    {
      id: 'med-3',
      name: 'pekanbaru-xchange-mall.jpg',
      url: imageUrls.mall,
      type: 'image',
      directory: '/projects',
      size: '2.1 MB',
      dimensions: '1800x1200',
      uploadedBy: 'Rina Kusuma',
      uploadedAt: '2026-09-15',
      connectedToCarousel: false,
    },
    {
      id: 'med-4',
      name: 'architecture-modern.jpg',
      url: imageUrls.architecture,
      type: 'image',
      directory: '/news',
      size: '1.6 MB',
      dimensions: '1800x1100',
      uploadedBy: 'Dewi Lestari',
      uploadedAt: '2026-09-20',
      connectedToCarousel: false,
    },
    {
      id: 'med-5',
      name: 'team-collaboration.jpg',
      url: imageUrls.team,
      type: 'image',
      directory: '/branding',
      size: '1.9 MB',
      dimensions: '1800x1200',
      uploadedBy: 'Budi Santoso',
      uploadedAt: '2026-09-22',
      connectedToCarousel: false,
    },
    {
      id: 'med-6',
      name: 'meeting-discussion.jpg',
      url: imageUrls.meeting,
      type: 'image',
      directory: '/news',
      size: '1.3 MB',
      dimensions: '1800x1000',
      uploadedBy: 'Rina Kusuma',
      uploadedAt: '2026-09-25',
      connectedToCarousel: false,
    },
    {
      id: 'med-7',
      name: 'company-profile-2026.pdf',
      url: '/documents/company-profile-2026.pdf',
      type: 'document',
      directory: '/documents',
      size: '4.8 MB',
      uploadedBy: 'Alexander Wardhana',
      uploadedAt: '2026-10-01',
    },
    {
      id: 'med-8',
      name: 'whistle-blowing-guideline.pdf',
      url: '/documents/whistle-blowing-guideline.pdf',
      type: 'document',
      directory: '/documents',
      size: '1.2 MB',
      uploadedBy: 'Alexander Wardhana',
      uploadedAt: '2026-10-03',
    },
  ],
  banners: [
    {
      id: 'ban-1',
      title: 'Where hospitality meets possibility.',
      imageUrl: imageUrls.hero,
      linkUrl: '/projects',
      isActive: true,
      sortOrder: 1,
      createdAt: '2026-08-01',
      updatedAt: '2026-10-01',
    },
    {
      id: 'ban-2',
      title: 'FOX Hotel Pekanbaru — Smart stays in the city.',
      imageUrl: imageUrls.hotel,
      linkUrl: '/projects/fox-hotel-pekanbaru',
      isActive: true,
      sortOrder: 2,
      createdAt: '2026-08-15',
      updatedAt: '2026-10-02',
    },
    {
      id: 'ban-3',
      title: 'Pekanbaru Xchange — Integrated lifestyle mall.',
      imageUrl: imageUrls.mall,
      linkUrl: '/projects/pekanbaru-xchange',
      isActive: true,
      sortOrder: 3,
      createdAt: '2026-09-01',
      updatedAt: '2026-10-05',
    },
  ],
  news: [
    {
      id: 'nws-1',
      no: 1,
      date: '02 December 2022',
      title: 'Whistle Blowing System',
      url: 'whistle-blowing-system',
      category: 'Corporate Governance',
      excerpt: 'Our commitment to conducting business professionally, transparently, and in line with good corporate governance.',
      description: `<h3>Good Corporate Governance at Halla Mohana</h3><p>PT Halla Mohana is committed to conducting business professionally and in accordance with good corporate governance principles.</p><p>The Whistle Blowing System provides a trusted channel for reporting suspected violations while supporting confidentiality, fairness, and responsible follow-up.</p><blockquote>"Integrity and transparency are the cornerstones of sustainable corporate growth."</blockquote><p>Every report is handled with care and reviewed according to applicable company policies and regulations.</p>`,
      image: imageUrls.architecture,
      createTime: '2022-12-02 09:00',
      updated: '2026-10-05 14:20',
      visibility: true,
    },
    {
      id: 'nws-2',
      no: 2,
      date: '18 August 2026',
      title: 'Building Connected Experiences in Pekanbaru',
      url: 'building-connected-experiences',
      category: 'Projects',
      excerpt: 'How FOX Hotel and Pekanbaru Xchange work together as one integrated hospitality and lifestyle destination.',
      description: `<h3>Integrated Hospitality &amp; Lifestyle</h3><p>Great destinations feel effortless. At Pekanbaru Xchange, a direct connection to FOX Hotel brings stays, meetings, shopping, dining, and leisure into one convenient address.</p><p>This integrated approach reflects Halla Mohana’s belief that thoughtful places can make city life more enjoyable and create lasting value for communities.</p>`,
      image: imageUrls.mallInterior,
      createTime: '2026-08-18 10:30',
      updated: '2026-10-02 11:15',
      visibility: true,
    },
    {
      id: 'nws-3',
      no: 3,
      date: '06 July 2026',
      title: 'Hospitality with a Human Touch',
      url: 'hospitality-with-a-human-touch',
      category: 'People & Culture',
      excerpt: 'The people and principles behind meaningful stays, welcoming spaces, and memorable everyday moments.',
      description: `<h3>People at the Core</h3><p>Hospitality begins with people. Our teams combine professional standards with genuine care to create experiences that feel warm, personal, and dependable.</p><p>We invest in continuous development so every team member can grow, contribute, and bring Halla Mohana’s values to life.</p>`,
      image: imageUrls.team,
      createTime: '2026-07-06 08:45',
      updated: '2026-09-28 16:00',
      visibility: true,
    },
  ],
  corporateInfo: [
    {
      id: 'corp-1',
      no: 1,
      date: '15 January 2026',
      title: 'Corporate Governance Charter & Guidelines',
      url: '/corporate-info/governance-charter',
      category: 'Governance',
      createTime: '2026-01-15 10:00',
      updated: '2026-06-12 11:30',
      visibility: true,
    },
    {
      id: 'corp-2',
      no: 2,
      date: '20 March 2026',
      title: 'Annual Sustainability & Impact Disclosure 2025',
      url: '/corporate-info/sustainability-disclosure',
      category: 'Sustainability',
      createTime: '2026-03-20 14:15',
      updated: '2026-07-01 09:20',
      visibility: true,
    },
    {
      id: 'corp-3',
      no: 3,
      date: '02 December 2022',
      title: 'Whistle Blowing System Operating Procedure',
      url: '/corporate-info/whistle-blowing-sop',
      category: 'Compliance',
      createTime: '2022-12-02 11:00',
      updated: '2026-08-10 15:00',
      visibility: true,
    },
  ],
  projects: [
    {
      id: 'prj-1',
      no: 1,
      title: 'FOX Hotel Pekanbaru',
      slug: 'fox-hotel-pekanbaru',
      category: 'Hospitality',
      location: 'Jalan Riau, Pekanbaru',
      description: 'A contemporary midscale hotel for smart stays, directly connected to Pekanbaru Xchange.',
      longDescription: 'FOX Hotel Pekanbaru is strategically located on Jalan Riau, approximately 30 minutes from Sultan Syarif Kasim II Airport. Designed for business travellers, families, and modern city explorers, the hotel brings comfort and convenience into one connected destination.',
      image: imageUrls.hotel,
      secondaryImage: imageUrls.hotelPool,
      facilities: ['225 Rooms', 'Gym', 'Spa', 'Restaurant', 'Indoor Rooftop Sky Pool'],
      createTime: '2025-02-10 09:00',
      updated: '2026-10-01 16:30',
      visibility: true,
    },
    {
      id: 'prj-2',
      no: 2,
      title: 'Pekanbaru Xchange',
      slug: 'pekanbaru-xchange',
      category: 'Lifestyle Destination',
      location: 'Pekanbaru Business District',
      description: 'A modern destination for shopping, dining, entertainment, business, and leisure.',
      longDescription: "Pekanbaru Xchange is a modern lifestyle and entertainment mall in the heart of Pekanbaru's business district. Physically connected to FOX Hotel Pekanbaru, it creates a seamless experience where retail, dining, business, and leisure come together.",
      image: imageUrls.mall,
      secondaryImage: imageUrls.mallInterior,
      facilities: ['Retail', 'Dining', 'Entertainment', 'Events', 'Direct Hotel Access'],
      createTime: '2025-02-15 11:20',
      updated: '2026-09-29 14:10',
      visibility: true,
    },
  ],
  contacts: [
    {
      id: 'msg-1',
      no: 1,
      fullName: 'Hendrik Pratama',
      phone: '+62 812 8899 0011',
      email: 'hendrik.p@metroproperty.co.id',
      subject: 'Inquiry on Retail Space at Pekanbaru Xchange',
      message: 'Hello, our group is interested in leasing 250 sqm space on the ground floor of Pekanbaru Xchange for an F&B concept. Could you provide tenant terms and leasing brochure?',
      createTime: '2026-10-09 09:15',
      isRead: false,
      visibility: true,
    },
    {
      id: 'msg-2',
      no: 2,
      fullName: 'Sarah Anindita',
      phone: '+62 813 4455 6677',
      email: 'sarah.anindita@agency.id',
      subject: 'Media & Event Collaboration at FOX Hotel',
      message: 'We are organizing an executive hospitality summit in Pekanbaru for November 2026 and would like to reserve the ballroom and accommodation block.',
      createTime: '2026-10-08 14:30',
      isRead: true,
      visibility: true,
    },
    {
      id: 'msg-3',
      no: 3,
      fullName: 'Michael Tanuwijaya',
      phone: '+62 821 7788 9900',
      email: 'm.tanuwijaya@investorgroup.com',
      subject: 'Investor Relations & Partnership Inquiry',
      message: 'Requesting a brief introductory meeting with Halla Mohana investment team regarding upcoming lifestyle mixed-use development opportunities.',
      createTime: '2026-10-07 10:45',
      isRead: true,
      visibility: true,
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      no: 1,
      fullName: 'A warm welcome',
      phone: 'FOX Hotel',
      email: imageUrls.hero,
      image: imageUrls.hero,
      category: 'FOX Hotel',
      size: 'tall',
      createTime: '2026-08-10 10:00',
      visibility: true,
    },
    {
      id: 'gal-2',
      no: 2,
      fullName: 'Lifestyle, connected',
      phone: 'Mall Events',
      email: imageUrls.mall,
      image: imageUrls.mall,
      category: 'Mall Events',
      size: 'wide',
      createTime: '2026-08-12 11:30',
      visibility: true,
    },
    {
      id: 'gal-3',
      no: 3,
      fullName: 'Shared moments',
      phone: 'Mall Events',
      email: imageUrls.event,
      image: imageUrls.event,
      category: 'Mall Events',
      size: 'standard',
      createTime: '2026-08-15 14:20',
      visibility: true,
    },
    {
      id: 'gal-4',
      no: 4,
      fullName: 'Restful spaces',
      phone: 'FOX Hotel',
      email: imageUrls.hotel,
      image: imageUrls.hotel,
      category: 'FOX Hotel',
      size: 'standard',
      createTime: '2026-08-18 16:40',
      visibility: true,
    },
    {
      id: 'gal-5',
      no: 5,
      fullName: 'The journey begins',
      phone: 'Ground Breaking',
      email: imageUrls.construction,
      image: imageUrls.construction,
      category: 'Ground Breaking',
      size: 'tall',
      createTime: '2026-08-20 09:10',
      visibility: true,
    },
    {
      id: 'gal-6',
      no: 6,
      fullName: 'Building the future',
      phone: 'Underconstruction',
      email: imageUrls.architecture,
      image: imageUrls.architecture,
      category: 'Underconstruction',
      size: 'standard',
      createTime: '2026-08-25 15:00',
      visibility: true,
    },
  ],
  careers: [
    {
      id: 'car-1',
      no: 1,
      title: 'Marketing Communication Staff',
      department: 'Marketing',
      location: 'Pekanbaru',
      type: 'Full-time',
      description: 'Manage brand communication, digital campaigns, and community engagement for FOX Hotel and Pekanbaru Xchange.',
      requirements: ['Bachelor degree in Marketing, PR, or related field', 'Minimum 2 years experience in hospitality or lifestyle property', 'Strong creative writing & digital content skills'],
      createTime: '2026-08-10 09:00',
      updated: '2026-10-01 14:00',
      visibility: true,
    },
    {
      id: 'car-2',
      no: 2,
      title: 'Guest Experience Supervisor',
      department: 'Hospitality',
      location: 'Pekanbaru',
      type: 'Full-time',
      description: 'Lead frontline hospitality teams to deliver exemplary service standards and memorable experiences for hotel and mall visitors.',
      requirements: ['Diploma or Bachelor degree in Hospitality Management', 'Minimum 3 years experience in hotel front office or guest relations', 'Excellent leadership and communication abilities'],
      createTime: '2026-08-15 11:30',
      updated: '2026-10-03 10:15',
      visibility: true,
    },
  ],
};

let memoryState: AdminStoreState = initialData;
const listeners = new Set<(state: AdminStoreState) => void>();

function notify() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    } catch {
      // ignore storage quota errors
    }
  }
  listeners.forEach((listener) => listener(memoryState));
}

function loadInitial(): AdminStoreState {
  if (typeof window === 'undefined') return initialData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialData;
    const parsed = JSON.parse(raw);
    return { ...initialData, ...parsed };
  } catch {
    return initialData;
  }
}

export function useAdminStore() {
  const [state, setState] = useState<AdminStoreState>(() => memoryState);

  useEffect(() => {
    const loaded = loadInitial();
    memoryState = loaded;
    setState(loaded);

    const handler = (nextState: AdminStoreState) => setState(nextState);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  // Helper log activity
  const logActivity = (action: string, module: string, details: string, status: 'success' | 'warning' | 'failed' = 'success') => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: UserActivityLog = {
      id: `log-${Date.now()}`,
      no: memoryState.activityLogs.length + 1,
      timestamp,
      user: memoryState.currentUser.name,
      avatar: memoryState.currentUser.avatar,
      action,
      module,
      details,
      ipAddress: '180.252.164.21',
      status,
    };
    memoryState = {
      ...memoryState,
      activityLogs: [newLog, ...memoryState.activityLogs],
    };
    notify();
  };

  // General Config
  const updateGeneralConfig = (updates: Partial<GeneralConfig>) => {
    memoryState = {
      ...memoryState,
      generalConfig: { ...memoryState.generalConfig, ...updates },
    };
    logActivity('UPDATE_CONFIG', 'General Config', 'Updated site configuration parameters');
    notify();
  };

  // User Profile
  const updateUserProfile = (profile: Partial<AdminUser>) => {
    const updated = { ...memoryState.currentUser, ...profile };
    memoryState = {
      ...memoryState,
      currentUser: updated,
      users: memoryState.users.map((u) => (u.id === updated.id ? updated : u)),
    };
    logActivity('EDIT_PROFILE', 'User Profile', `Updated personal profile for ${updated.name}`);
    notify();
  };

  // User CRUD
  const addUser = (user: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: AdminUser = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
    };
    memoryState = {
      ...memoryState,
      users: [...memoryState.users, newUser],
    };
    logActivity('CREATE_USER', 'User Administration', `Added user: ${newUser.name} (${newUser.email})`);
    notify();
  };

  const updateUser = (id: string, updates: Partial<AdminUser>) => {
    memoryState = {
      ...memoryState,
      users: memoryState.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
      currentUser: memoryState.currentUser.id === id ? { ...memoryState.currentUser, ...updates } : memoryState.currentUser,
    };
    logActivity('UPDATE_USER', 'User Administration', `Updated user ID: ${id}`);
    notify();
  };

  const deleteUser = (id: string) => {
    const target = memoryState.users.find((u) => u.id === id);
    memoryState = {
      ...memoryState,
      users: memoryState.users.filter((u) => u.id !== id),
    };
    logActivity('DELETE_USER', 'User Administration', `Deleted user: ${target?.name ?? id}`, 'warning');
    notify();
  };

  const toggleUserStatus = (id: string) => {
    memoryState = {
      ...memoryState,
      users: memoryState.users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      ),
    };
    logActivity('TOGGLE_STATUS', 'User Administration', `Changed status for user ID: ${id}`);
    notify();
  };

  // Roles CRUD
  const addRole = (role: Omit<AdminRole, 'id' | 'userCount'>) => {
    const newRole: AdminRole = { ...role, id: `role-${Date.now()}`, userCount: 0 };
    memoryState = { ...memoryState, roles: [...memoryState.roles, newRole] };
    logActivity('CREATE_ROLE', 'Role Administration', `Created role: ${newRole.name}`);
    notify();
  };

  const updateRole = (id: string, updates: Partial<AdminRole>) => {
    memoryState = {
      ...memoryState,
      roles: memoryState.roles.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    };
    logActivity('UPDATE_ROLE', 'Role Administration', `Updated role ID: ${id}`);
    notify();
  };

  const deleteRole = (id: string) => {
    memoryState = {
      ...memoryState,
      roles: memoryState.roles.filter((r) => r.id !== id),
    };
    logActivity('DELETE_ROLE', 'Role Administration', `Deleted role ID: ${id}`, 'warning');
    notify();
  };

  // Page Menu Administration
  const addPageMenu = (item: Omit<PageMenuItem, 'id' | 'no' | 'createdTime' | 'updated'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newItem: PageMenuItem = {
      ...item,
      id: `pg-${Date.now()}`,
      no: memoryState.pages.length + 1,
      createdTime: now,
      updated: now,
    };
    memoryState = { ...memoryState, pages: [...memoryState.pages, newItem] };
    logActivity('ADD_PAGE', 'Page Administration', `Added page menu: ${newItem.title}`);
    notify();
  };

  const updatePageMenu = (id: string, updates: Partial<PageMenuItem>) => {
    const now = new Date().toISOString().split('T')[0];
    memoryState = {
      ...memoryState,
      pages: memoryState.pages.map((p) => (p.id === id ? { ...p, ...updates, updated: now } : p)),
    };
    logActivity('UPDATE_PAGE', 'Page Administration', `Updated menu: ${id}`);
    notify();
  };

  const deletePageMenu = (id: string) => {
    memoryState = {
      ...memoryState,
      pages: memoryState.pages.filter((p) => p.id !== id).map((p, idx) => ({ ...p, no: idx + 1 })),
    };
    logActivity('DELETE_PAGE', 'Page Administration', `Deleted page ID: ${id}`, 'warning');
    notify();
  };

  const togglePageMenuVisibility = (id: string) => {
    const now = new Date().toISOString().split('T')[0];
    memoryState = {
      ...memoryState,
      pages: memoryState.pages.map((p) => (p.id === id ? { ...p, visibility: !p.visibility, updated: now } : p)),
    };
    logActivity('TOGGLE_VISIBILITY', 'Page Administration', `Toggled visibility for menu ID: ${id}`);
    notify();
  };

  // Media Library
  const uploadMedia = (item: Omit<MediaItem, 'id' | 'uploadedAt' | 'uploadedBy'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newMedia: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      uploadedAt: now,
      uploadedBy: memoryState.currentUser.name,
    };
    memoryState = { ...memoryState, media: [newMedia, ...memoryState.media] };
    logActivity('UPLOAD_MEDIA', 'Media Library', `Uploaded ${newMedia.type}: ${newMedia.name}`);
    notify();
    return newMedia;
  };

  const deleteMedia = (id: string) => {
    const target = memoryState.media.find((m) => m.id === id);
    memoryState = {
      ...memoryState,
      media: memoryState.media.filter((m) => m.id !== id),
    };
    logActivity('DELETE_MEDIA', 'Media Library', `Deleted media: ${target?.name ?? id}`, 'warning');
    notify();
  };

  const connectMediaToCarousel = (id: string) => {
    const target = memoryState.media.find((m) => m.id === id);
    if (!target) return;

    // Check if already in banner
    const existing = memoryState.banners.find((b) => b.imageUrl === target.url);
    if (existing) {
      logActivity('BANNER_EXISTS', 'Banner', `Media already active on carousel banner: ${target.name}`);
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    const newBanner: BannerItem = {
      id: `ban-${Date.now()}`,
      title: target.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      imageUrl: target.url,
      linkUrl: '/projects',
      isActive: true,
      sortOrder: memoryState.banners.length + 1,
      createdAt: now,
      updatedAt: now,
    };

    memoryState = {
      ...memoryState,
      banners: [...memoryState.banners, newBanner],
      media: memoryState.media.map((m) => (m.id === id ? { ...m, connectedToCarousel: true } : m)),
    };
    logActivity('CONNECT_CAROUSEL', 'Media Library', `Connected ${target.name} to Homepage Carousel`);
    notify();
  };

  // Banners CRUD
  const addBanner = (banner: Omit<BannerItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newBanner: BannerItem = {
      ...banner,
      id: `ban-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    memoryState = { ...memoryState, banners: [...memoryState.banners, newBanner] };
    logActivity('ADD_BANNER', 'Banner', `Added banner: ${newBanner.title}`);
    notify();
  };

  const updateBanner = (id: string, updates: Partial<BannerItem>) => {
    const now = new Date().toISOString().split('T')[0];
    memoryState = {
      ...memoryState,
      banners: memoryState.banners.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: now } : b)),
    };
    logActivity('UPDATE_BANNER', 'Banner', `Updated banner ID: ${id}`);
    notify();
  };

  const deleteBanner = (id: string) => {
    memoryState = {
      ...memoryState,
      banners: memoryState.banners.filter((b) => b.id !== id),
    };
    logActivity('DELETE_BANNER', 'Banner', `Deleted banner ID: ${id}`, 'warning');
    notify();
  };

  const toggleBannerVisibility = (id: string) => {
    const now = new Date().toISOString().split('T')[0];
    memoryState = {
      ...memoryState,
      banners: memoryState.banners.map((b) => (b.id === id ? { ...b, isActive: !b.isActive, updatedAt: now } : b)),
    };
    logActivity('TOGGLE_BANNER', 'Banner', `Toggled visibility for banner ID: ${id}`);
    notify();
  };

  // News CRUD
  const addNews = (newsData: Omit<NewsItem, 'id' | 'no' | 'createTime' | 'updated'>) => {
    const now = new Date();
    const createTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newNews: NewsItem = {
      ...newsData,
      id: `nws-${Date.now()}`,
      no: memoryState.news.length + 1,
      createTime,
      updated: createTime,
    };
    memoryState = { ...memoryState, news: [newNews, ...memoryState.news] };
    logActivity('ADD_NEWS', 'News', `Published news article: ${newNews.title}`);
    notify();
    return newNews;
  };

  const updateNews = (id: string, updates: Partial<NewsItem>) => {
    const now = new Date();
    const updatedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    memoryState = {
      ...memoryState,
      news: memoryState.news.map((n) => (n.id === id ? { ...n, ...updates, updated: updatedTime } : n)),
    };
    logActivity('UPDATE_NEWS', 'News', `Updated news ID: ${id}`);
    notify();
  };

  const deleteNews = (id: string) => {
    const target = memoryState.news.find((n) => n.id === id);
    memoryState = {
      ...memoryState,
      news: memoryState.news.filter((n) => n.id !== id).map((n, idx) => ({ ...n, no: idx + 1 })),
    };
    logActivity('DELETE_NEWS', 'News', `Deleted news: ${target?.title ?? id}`, 'warning');
    notify();
  };

  const toggleNewsVisibility = (id: string) => {
    const now = new Date();
    const updatedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    memoryState = {
      ...memoryState,
      news: memoryState.news.map((n) => (n.id === id ? { ...n, visibility: !n.visibility, updated: updatedTime } : n)),
    };
    logActivity('TOGGLE_NEWS', 'News', `Toggled visibility for news ID: ${id}`);
    notify();
  };

  // Corporate Info CRUD
  const addCorporateInfo = (data: Omit<CorporateInfoItem, 'id' | 'no' | 'createTime' | 'updated'>) => {
    const now = new Date();
    const createTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newItem: CorporateInfoItem = {
      ...data,
      id: `corp-${Date.now()}`,
      no: memoryState.corporateInfo.length + 1,
      createTime,
      updated: createTime,
    };
    memoryState = { ...memoryState, corporateInfo: [newItem, ...memoryState.corporateInfo] };
    logActivity('ADD_CORP_INFO', 'Corporate Info', `Added corporate info: ${newItem.title}`);
    notify();
  };

  const updateCorporateInfo = (id: string, updates: Partial<CorporateInfoItem>) => {
    const now = new Date();
    const updatedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    memoryState = {
      ...memoryState,
      corporateInfo: memoryState.corporateInfo.map((c) => (c.id === id ? { ...c, ...updates, updated: updatedTime } : c)),
    };
    logActivity('UPDATE_CORP_INFO', 'Corporate Info', `Updated corporate info ID: ${id}`);
    notify();
  };

  const deleteCorporateInfo = (id: string) => {
    memoryState = {
      ...memoryState,
      corporateInfo: memoryState.corporateInfo.filter((c) => c.id !== id).map((c, idx) => ({ ...c, no: idx + 1 })),
    };
    logActivity('DELETE_CORP_INFO', 'Corporate Info', `Deleted corporate info ID: ${id}`, 'warning');
    notify();
  };

  const toggleCorporateInfoVisibility = (id: string) => {
    const now = new Date();
    const updatedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    memoryState = {
      ...memoryState,
      corporateInfo: memoryState.corporateInfo.map((c) => (c.id === id ? { ...c, visibility: !c.visibility, updated: updatedTime } : c)),
    };
    logActivity('TOGGLE_CORP_INFO', 'Corporate Info', `Toggled visibility for corporate info ID: ${id}`);
    notify();
  };

  // Projects CRUD
  const addProject = (data: Omit<ProjectItem, 'id' | 'no' | 'createTime' | 'updated'>) => {
    const now = new Date();
    const createTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newProject: ProjectItem = {
      ...data,
      id: `prj-${Date.now()}`,
      no: memoryState.projects.length + 1,
      createTime,
      updated: createTime,
    };
    memoryState = { ...memoryState, projects: [...memoryState.projects, newProject] };
    logActivity('ADD_PROJECT', 'Projects', `Created project: ${newProject.title}`);
    notify();
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    const now = new Date();
    const updatedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    memoryState = {
      ...memoryState,
      projects: memoryState.projects.map((p) => (p.id === id ? { ...p, ...updates, updated: updatedTime } : p)),
    };
    logActivity('UPDATE_PROJECT', 'Projects', `Updated project ID: ${id}`);
    notify();
  };

  const deleteProject = (id: string) => {
    memoryState = {
      ...memoryState,
      projects: memoryState.projects.filter((p) => p.id !== id).map((p, idx) => ({ ...p, no: idx + 1 })),
    };
    logActivity('DELETE_PROJECT', 'Projects', `Deleted project ID: ${id}`, 'warning');
    notify();
  };

  const toggleProjectVisibility = (id: string) => {
    const now = new Date();
    const updatedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    memoryState = {
      ...memoryState,
      projects: memoryState.projects.map((p) => (p.id === id ? { ...p, visibility: !p.visibility, updated: updatedTime } : p)),
    };
    logActivity('TOGGLE_PROJECT', 'Projects', `Toggled visibility for project ID: ${id}`);
    notify();
  };

  // Contact Us
  const deleteContactMessage = (id: string) => {
    memoryState = {
      ...memoryState,
      contacts: memoryState.contacts.filter((c) => c.id !== id).map((c, idx) => ({ ...c, no: idx + 1 })),
    };
    logActivity('DELETE_CONTACT', 'Contact Us', `Deleted contact message ID: ${id}`, 'warning');
    notify();
  };

  const toggleContactVisibility = (id: string) => {
    memoryState = {
      ...memoryState,
      contacts: memoryState.contacts.map((c) => (c.id === id ? { ...c, visibility: !c.visibility } : c)),
    };
    logActivity('TOGGLE_CONTACT', 'Contact Us', `Toggled archive status for message ID: ${id}`);
    notify();
  };

  const markContactAsRead = (id: string) => {
    memoryState = {
      ...memoryState,
      contacts: memoryState.contacts.map((c) => (c.id === id ? { ...c, isRead: true } : c)),
    };
    notify();
  };

  // Gallery CRUD
  const addGalleryItem = (data: Omit<GalleryItem, 'id' | 'no' | 'createTime'>) => {
    const now = new Date();
    const createTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newItem: GalleryItem = {
      ...data,
      id: `gal-${Date.now()}`,
      no: memoryState.gallery.length + 1,
      createTime,
    };
    memoryState = { ...memoryState, gallery: [newItem, ...memoryState.gallery] };
    logActivity('ADD_GALLERY', 'Gallery', `Added gallery photo: ${newItem.fullName}`);
    notify();
  };

  const updateGalleryItem = (id: string, updates: Partial<GalleryItem>) => {
    memoryState = {
      ...memoryState,
      gallery: memoryState.gallery.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    };
    logActivity('UPDATE_GALLERY', 'Gallery', `Updated gallery item ID: ${id}`);
    notify();
  };

  const deleteGalleryItem = (id: string) => {
    memoryState = {
      ...memoryState,
      gallery: memoryState.gallery.filter((g) => g.id !== id).map((g, idx) => ({ ...g, no: idx + 1 })),
    };
    logActivity('DELETE_GALLERY', 'Gallery', `Deleted gallery item ID: ${id}`, 'warning');
    notify();
  };

  const toggleGalleryVisibility = (id: string) => {
    memoryState = {
      ...memoryState,
      gallery: memoryState.gallery.map((g) => (g.id === id ? { ...g, visibility: !g.visibility } : g)),
    };
    logActivity('TOGGLE_GALLERY', 'Gallery', `Toggled visibility for gallery item ID: ${id}`);
    notify();
  };

  // Careers CRUD
  const addCareerItem = (data: Omit<CareerItem, 'id' | 'no' | 'createTime' | 'updated'>) => {
    const now = new Date();
    const createTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newItem: CareerItem = {
      ...data,
      id: `car-${Date.now()}`,
      no: memoryState.careers.length + 1,
      createTime,
      updated: createTime,
    };
    memoryState = { ...memoryState, careers: [newItem, ...memoryState.careers] };
    logActivity('ADD_CAREER', 'Careers', `Posted job opening: ${newItem.title}`);
    notify();
  };

  const updateCareerItem = (id: string, updates: Partial<CareerItem>) => {
    const now = new Date();
    const updatedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    memoryState = {
      ...memoryState,
      careers: memoryState.careers.map((c) => (c.id === id ? { ...c, ...updates, updated: updatedTime } : c)),
    };
    logActivity('UPDATE_CAREER', 'Careers', `Updated career opening ID: ${id}`);
    notify();
  };

  const deleteCareerItem = (id: string) => {
    memoryState = {
      ...memoryState,
      careers: memoryState.careers.filter((c) => c.id !== id).map((c, idx) => ({ ...c, no: idx + 1 })),
    };
    logActivity('DELETE_CAREER', 'Careers', `Deleted career opening ID: ${id}`, 'warning');
    notify();
  };

  const toggleCareerVisibility = (id: string) => {
    const now = new Date();
    const updatedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    memoryState = {
      ...memoryState,
      careers: memoryState.careers.map((c) => (c.id === id ? { ...c, visibility: !c.visibility, updated: updatedTime } : c)),
    };
    logActivity('TOGGLE_CAREER', 'Careers', `Toggled visibility for career opening ID: ${id}`);
    notify();
  };

  const resetToDefaults = () => {
    memoryState = initialData;
    notify();
  };

  return {
    ...state,
    updateGeneralConfig,
    updateUserProfile,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    addRole,
    updateRole,
    deleteRole,
    addPageMenu,
    updatePageMenu,
    deletePageMenu,
    togglePageMenuVisibility,
    uploadMedia,
    deleteMedia,
    connectMediaToCarousel,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerVisibility,
    addNews,
    updateNews,
    deleteNews,
    toggleNewsVisibility,
    addCorporateInfo,
    updateCorporateInfo,
    deleteCorporateInfo,
    toggleCorporateInfoVisibility,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectVisibility,
    deleteContactMessage,
    toggleContactVisibility,
    markContactAsRead,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    toggleGalleryVisibility,
    addCareerItem,
    updateCareerItem,
    deleteCareerItem,
    toggleCareerVisibility,
    logActivity,
    resetToDefaults,
  };
}
