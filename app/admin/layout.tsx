'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Settings,
  Users,
  Layers,
  Image as ImageIcon,
  Sliders,
  Newspaper,
  FileText,
  Building2,
  Mail,
  Images,
  Briefcase,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { ToastProvider } from './components/Toast';
import { useAdminStore } from '@/lib/admin-store';
import './admin.css';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, category: 'Overview' },
  { label: 'General Config', href: '/admin/general-config', icon: Settings, category: 'Core Settings' },
  { label: 'User & Roles', href: '/admin/users', icon: Users, category: 'Core Settings' },
  { label: 'Page Administration', href: '/admin/pages', icon: Layers, category: 'Content Structure' },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon, category: 'Assets' },
  { label: 'Banner & Slider', href: '/admin/banners', icon: Sliders, category: 'Assets' },
  { label: 'News Management', href: '/admin/news', icon: Newspaper, category: 'Publications' },
  { label: 'Corporate Info', href: '/admin/corporate-info', icon: FileText, category: 'Publications' },
  { label: 'Manage Projects', href: '/admin/projects', icon: Building2, category: 'Portfolio' },
  { label: 'Manage Gallery', href: '/admin/gallery', icon: Images, category: 'Portfolio' },
  { label: 'Contact Us', href: '/admin/contact-us', icon: Mail, category: 'Communications', badgeKey: 'contacts' },
  { label: 'Manage Careers', href: '/admin/careers', icon: Briefcase, category: 'Communications' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, generalConfig, contacts } = useAdminStore();

  const unreadContacts = contacts.filter((c) => !c.isRead).length;

  const currentNavItem = navItems.find((item) =>
    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
  );

  return (
    <ToastProvider>
      <div className="admin-shell">
        {/* Mobile Backdrop */}
        {mobileOpen && (
          <div
            className="admin-modal-backdrop"
            style={{ zIndex: 45 }}
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-header">
            <Link href="/admin" className="admin-brand">
              <span className="admin-brand-mark" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="admin-brand-text">
                <b>HALLA MOHANA</b>
                <small>CMS PANEL</small>
              </span>
            </Link>
            <span className="admin-badge-cms">v2.0</span>
          </div>

          <nav className="admin-sidebar-nav">
            {navItems.map((item, idx) => {
              const prevItem = navItems[idx - 1];
              const showCategory = !prevItem || prevItem.category !== item.category;
              const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

              return (
                <div key={item.href}>
                  {showCategory && <div className="admin-nav-category">{item.category}</div>}
                  <Link
                    href={item.href}
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="admin-nav-left">
                      <item.icon />
                      <span>{item.label}</span>
                    </div>
                    {item.badgeKey === 'contacts' && unreadContacts > 0 && (
                      <span className="admin-nav-pill coral">{unreadContacts}</span>
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <div className="admin-user-pill">
              <img src={currentUser.avatar} alt={currentUser.name} />
              <div className="admin-user-info">
                <strong>{currentUser.name}</strong>
                <small>{currentUser.role}</small>
              </div>
            </div>
            <Link href="/" title="Exit CMS to Public Website" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <LogOut size={16} />
            </Link>
          </div>
        </aside>

        {/* Main Workspace */}
        <div className="admin-main">
          {/* Topbar */}
          <header className="admin-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                type="button"
                className="admin-btn-icon"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{ display: 'inline-flex' }}
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              <div className="admin-breadcrumbs">
                <Link href="/admin" style={{ color: 'inherit' }}>Admin</Link>
                {currentNavItem && currentNavItem.href !== '/admin' && (
                  <>
                    <ChevronRight size={14} />
                    <span className="active">{currentNavItem.label}</span>
                  </>
                )}
              </div>
            </div>

            <div className="admin-topbar-actions">
              {/* Site Status Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`admin-badge ${generalConfig.status}`}>
                  <ShieldCheck size={12} />
                  {generalConfig.status}
                </span>
              </div>

              {/* View Website Live Link */}
              <Link href="/" target="_blank" className="admin-btn-live">
                <span>View Website</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <main className="admin-page-content">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
