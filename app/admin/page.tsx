'use client';

import Link from 'next/link';
import {
  Sliders,
  Newspaper,
  Mail,
  Building2,
  Briefcase,
  Image as ImageIcon,
  ArrowUpRight,
  Shield,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { StatCard } from './components/StatCard';

export default function AdminDashboardPage() {
  const {
    projects,
    news,
    banners,
    contacts,
    careers,
    media,
    activityLogs,
    generalConfig,
  } = useAdminStore();

  const unreadContacts = contacts.filter((c) => !c.isRead).length;

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>CMS Dashboard Overview</h1>
          <p>Welcome back! Monitor and manage all Halla Mohana digital assets and content.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/news/create" className="admin-btn admin-btn-primary">
            + Create New Story
          </Link>
          <Link href="/admin/general-config" className="admin-btn admin-btn-secondary">
            Settings
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="admin-grid-4" style={{ marginBottom: 28 }}>
        <StatCard
          label="Active Projects"
          value={projects.length}
          subtext="FOX Hotel & Pekanbaru Xchange"
          icon={<Building2 size={22} />}
          variant="green"
        />
        <StatCard
          label="Published Stories"
          value={news.length}
          subtext="Corporate & Milestones"
          icon={<Newspaper size={22} />}
          variant="coral"
        />
        <StatCard
          label="Hero Banners"
          value={banners.filter((b) => b.isActive).length}
          subtext="Live on Homepage Carousel"
          icon={<Sliders size={22} />}
          variant="pink"
        />
        <StatCard
          label="New Inquiries"
          value={unreadContacts}
          subtext={`${contacts.length} total messages`}
          icon={<Mail size={22} />}
          variant="charcoal"
        />
      </div>

      {/* Quick Launchpad & Status */}
      <div className="admin-grid-2" style={{ marginBottom: 28 }}>
        {/* System Health & Identity Summary */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <Shield size={18} color="var(--admin-green)" />
              System Status &amp; Configuration
            </div>
            <span className={`admin-badge ${generalConfig.status}`}>{generalConfig.status} mode</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>IP Login Guard:</span>
              <strong style={{ fontSize: 13, color: generalConfig.checkIpLogin ? 'var(--admin-green)' : '#9ca3af' }}>
                {generalConfig.checkIpLogin ? 'Active (Restricted)' : 'Disabled'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>Inquiry Alert Email:</span>
              <strong style={{ fontSize: 13 }}>{generalConfig.autoSendEmail.sendContactUs}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>Career Alert Email:</span>
              <strong style={{ fontSize: 13 }}>{generalConfig.autoSendEmail.sendCareerApplicationTo}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>Main Jakarta Office:</span>
              <strong style={{ fontSize: 13 }}>{generalConfig.officeInfo.phone}</strong>
            </div>
          </div>
        </div>

        {/* Quick Shortcut Launchpad */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <ArrowUpRight size={18} color="var(--admin-coral)" />
              Management Shortcuts
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <Link
              href="/admin/media"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid var(--admin-border)',
                background: '#fafafa',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ background: 'var(--admin-green-light)', padding: 8, borderRadius: 8 }}>
                <ImageIcon size={18} color="var(--admin-green-dark)" />
              </div>
              <div>
                <strong style={{ fontSize: 13, display: 'block' }}>Media Library</strong>
                <small style={{ color: '#6b7280' }}>{media.length} files</small>
              </div>
            </Link>

            <Link
              href="/admin/banners"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid var(--admin-border)',
                background: '#fafafa',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ background: 'var(--admin-coral-light)', padding: 8, borderRadius: 8 }}>
                <Sliders size={18} color="var(--admin-coral)" />
              </div>
              <div>
                <strong style={{ fontSize: 13, display: 'block' }}>Banner Slider</strong>
                <small style={{ color: '#6b7280' }}>{banners.length} slides</small>
              </div>
            </Link>

            <Link
              href="/admin/careers"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid var(--admin-border)',
                background: '#fafafa',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ background: 'var(--admin-pink-light)', padding: 8, borderRadius: 8 }}>
                <Briefcase size={18} color="var(--admin-pink)" />
              </div>
              <div>
                <strong style={{ fontSize: 13, display: 'block' }}>Job Openings</strong>
                <small style={{ color: '#6b7280' }}>{careers.length} open roles</small>
              </div>
            </Link>

            <Link
              href="/admin/contact-us"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid var(--admin-border)',
                background: '#fafafa',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ background: '#f3f4f6', padding: 8, borderRadius: 8 }}>
                <Mail size={18} color="#4b5563" />
              </div>
              <div>
                <strong style={{ fontSize: 13, display: 'block' }}>Contact Inbox</strong>
                <small style={{ color: '#6b7280' }}>{contacts.length} inquiries</small>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Activity Logs Stream */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <Clock size={18} color="var(--admin-green)" />
            Recent Administrative Activity Log
          </div>
          <Link href="/admin/users" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--admin-green)' }}>
            View All Audit Logs →
          </Link>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>No</th>
                <th>Timestamp</th>
                <th>Admin User</th>
                <th>Action</th>
                <th>Module</th>
                <th>Details</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.slice(0, 5).map((log, idx) => (
                <tr key={log.id}>
                  <td>{idx + 1}</td>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--admin-text-muted)' }}>{log.timestamp}</td>
                  <td>
                    <strong>{log.user}</strong>
                  </td>
                  <td>
                    <span className="admin-badge" style={{ background: '#f0f4f0', color: '#2d5a27' }}>
                      {log.action}
                    </span>
                  </td>
                  <td>{log.module}</td>
                  <td>{log.details}</td>
                  <td><code>{log.ipAddress}</code></td>
                  <td>
                    <span className={`admin-badge ${log.status === 'success' ? 'success' : 'danger'}`}>
                      {log.status === 'success' ? <CheckCircle size={11} /> : null} {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
