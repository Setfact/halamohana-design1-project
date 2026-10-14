'use client';

import { useState } from 'react';
import {
  Save,
  Globe,
  Shield,
  Building,
  Mail,
  Upload,
  Plus,
  Trash2,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '../components/Toast';
import { MediaPickerModal } from '../components/MediaPickerModal';
import type { SiteStatus } from '@/lib/admin-types';

export default function GeneralConfigPage() {
  const { generalConfig, updateGeneralConfig } = useAdminStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'identity' | 'security' | 'offices' | 'emails'>('identity');
  const [formData, setFormData] = useState(generalConfig);
  const [pickerTarget, setPickerTarget] = useState<'logo' | 'footerLogo' | null>(null);
  const [newIp, setNewIp] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateGeneralConfig(formData);
    showToast('General configuration updated successfully!', 'success');
  };

  const handleAddIp = () => {
    if (!newIp.trim()) return;
    if (formData.allowedIps.includes(newIp.trim())) {
      showToast('IP address already exists in whitelist', 'warning');
      return;
    }
    setFormData({
      ...formData,
      allowedIps: [...formData.allowedIps, newIp.trim()],
    });
    setNewIp('');
  };

  const handleRemoveIp = (ipToRemove: string) => {
    setFormData({
      ...formData,
      allowedIps: formData.allowedIps.filter((ip) => ip !== ipToRemove),
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>General Configuration</h1>
          <p>Manage site parameters, company offices, logo assets, and auto-notification emails.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={handleSave}>
          <Save size={15} /> Save All Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab ${activeTab === 'identity' ? 'active' : ''}`}
          onClick={() => setActiveTab('identity')}
        >
          <Globe size={15} style={{ display: 'inline', marginRight: 6 }} />
          Site Identity &amp; Status
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={15} style={{ display: 'inline', marginRight: 6 }} />
          Option: IP Login Guard
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'offices' ? 'active' : ''}`}
          onClick={() => setActiveTab('offices')}
        >
          <Building size={15} style={{ display: 'inline', marginRight: 6 }} />
          Main &amp; Side Office Info
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'emails' ? 'active' : ''}`}
          onClick={() => setActiveTab('emails')}
        >
          <Mail size={15} style={{ display: 'inline', marginRight: 6 }} />
          Auto-Send Email Routing
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* Tab 1: Identity & Status */}
        {activeTab === 'identity' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">
                <Globe size={18} color="var(--admin-green)" />
                Site Identity &amp; Branding
              </div>
            </div>

            {/* Status Field */}
            <div className="admin-form-group">
              <label className="admin-form-label">Site Status (status)</label>
              <select
                className="admin-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as SiteStatus })}
              >
                <option value="live">Live (Website publicly accessible)</option>
                <option value="maintenance">Maintenance Mode (Visitors see maintenance splash)</option>
                <option value="development">Development Mode (Internal testing only)</option>
              </select>
              <div className="admin-form-help">
                Controls the global accessibility of the public website.
              </div>
            </div>

            {/* Logos Grid */}
            <div className="admin-grid-2" style={{ marginBottom: 20 }}>
              {/* Header Logo */}
              <div className="admin-form-group">
                <label className="admin-form-label">Header Logo (logo)</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setPickerTarget('logo')}
                  >
                    <Upload size={14} /> Browse
                  </button>
                </div>
                <div style={{ padding: 16, background: '#171c19', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <div className="admin-brand-mark">
                    <i /><i /><i />
                  </div>
                  <span style={{ color: '#fff', fontSize: 13, letterSpacing: '0.2em' }}>HALLA MOHANA</span>
                </div>
              </div>

              {/* Footer Logo */}
              <div className="admin-form-group">
                <label className="admin-form-label">Footer Logo (footer logo)</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.footerLogo}
                    onChange={(e) => setFormData({ ...formData, footerLogo: e.target.value })}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setPickerTarget('footerLogo')}
                  >
                    <Upload size={14} /> Browse
                  </button>
                </div>
                <div style={{ padding: 16, background: '#f8f8f8', border: '1px solid #e8e8e8', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <div className="admin-brand-mark">
                    <i /><i /><i />
                  </div>
                  <span style={{ color: '#1f2428', fontSize: 13, letterSpacing: '0.2em' }}>HALLA MOHANA</span>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="admin-form-group">
              <label className="admin-form-label">Copyright Notice (copyright)</label>
              <input
                type="text"
                className="admin-input"
                value={formData.copyright}
                onChange={(e) => setFormData({ ...formData, copyright: e.target.value })}
              />
              <div className="admin-form-help">
                Appears on the bottom copyright bar across all pages.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Security & Option Field */}
        {activeTab === 'security' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">
                <Shield size={18} color="var(--admin-green)" />
                Security Options (option_field)
              </div>
            </div>

            {/* Check IP Login */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--admin-border)' }}>
              <div>
                <strong style={{ fontSize: 14, display: 'block' }}>Check IP Login (check_ip_login)</strong>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--admin-text-muted)' }}>
                  Enforce IP address whitelisting. Only verified corporate and site office IPs can access the CMS backend.
                </p>
              </div>
              <label className="admin-toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.checkIpLogin}
                  onChange={(e) => setFormData({ ...formData, checkIpLogin: e.target.checked })}
                />
                <span className="admin-toggle-slider" />
              </label>
            </div>

            {/* Whitelisted IPs */}
            {formData.checkIpLogin && (
              <div style={{ marginTop: 24 }}>
                <label className="admin-form-label">Authorized IP Addresses (Corporate Whitelist)</label>
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <input
                    type="text"
                    placeholder="Enter valid IPv4 / IPv6 address (e.g. 180.252.164.21)"
                    className="admin-input"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    style={{ maxWidth: 360 }}
                  />
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={handleAddIp}>
                    <Plus size={14} /> Add IP
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {formData.allowedIps.map((ip) => (
                    <span
                      key={ip}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: '#f3f4f6',
                        padding: '6px 12px',
                        borderRadius: 999,
                        fontSize: 12.5,
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <code>{ip}</code>
                      <button
                        type="button"
                        onClick={() => handleRemoveIp(ip)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <Trash2 size={13} color="#d94a7a" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Offices */}
        {activeTab === 'offices' && (
          <div className="admin-grid-2">
            {/* Main Office */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title">
                  <Building size={18} color="var(--admin-green)" />
                  Main Office (office_info_input)
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Address (address)</label>
                <textarea
                  rows={3}
                  className="admin-textarea"
                  value={formData.officeInfo.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      officeInfo: { ...formData.officeInfo, address: e.target.value },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Phone (phone)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.officeInfo.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      officeInfo: { ...formData.officeInfo, phone: e.target.value },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Fax (fax)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.officeInfo.fax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      officeInfo: { ...formData.officeInfo, fax: e.target.value },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Email (email)</label>
                <input
                  type="email"
                  className="admin-input"
                  value={formData.officeInfo.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      officeInfo: { ...formData.officeInfo, email: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            {/* Side Office */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title">
                  <Building size={18} color="var(--admin-coral)" />
                  Side Office (side_office_input)
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Address (address)</label>
                <textarea
                  rows={3}
                  className="admin-textarea"
                  value={formData.sideOfficeInfo.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sideOfficeInfo: { ...formData.sideOfficeInfo, address: e.target.value },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Phone (phone)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.sideOfficeInfo.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sideOfficeInfo: { ...formData.sideOfficeInfo, phone: e.target.value },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Fax (fax)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.sideOfficeInfo.fax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sideOfficeInfo: { ...formData.sideOfficeInfo, fax: e.target.value },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Email (email)</label>
                <input
                  type="email"
                  className="admin-input"
                  value={formData.sideOfficeInfo.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sideOfficeInfo: { ...formData.sideOfficeInfo, email: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Auto-Send Emails */}
        {activeTab === 'emails' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">
                <Mail size={18} color="var(--admin-green)" />
                Auto-Send Email Dispatch (auto_send_email)
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">
                Forward &apos;Contact Us&apos; Messages To (send_contact_us)
              </label>
              <input
                type="email"
                className="admin-input"
                value={formData.autoSendEmail.sendContactUs}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    autoSendEmail: {
                      ...formData.autoSendEmail,
                      sendContactUs: e.target.value,
                    },
                  })
                }
              />
              <div className="admin-form-help">
                All visitor contact form submissions will be automatically forwarded to this address.
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">
                Forward &apos;Career Applications&apos; To (send_career_application_to)
              </label>
              <input
                type="email"
                className="admin-input"
                value={formData.autoSendEmail.sendCareerApplicationTo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    autoSendEmail: {
                      ...formData.autoSendEmail,
                      sendCareerApplicationTo: e.target.value,
                    },
                  })
                }
              />
              <div className="admin-form-help">
                Candidate job applications, CV uploads, and spontaneous resumes route here.
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <button type="submit" className="admin-btn admin-btn-primary">
            <Save size={15} /> Save All Changes
          </button>
        </div>
      </form>

      {/* Media Picker Modal */}
      {pickerTarget && (
        <MediaPickerModal
          isOpen={true}
          title={`Select Image for ${pickerTarget === 'logo' ? 'Header Logo' : 'Footer Logo'}`}
          onClose={() => setPickerTarget(null)}
          onSelect={(url) => {
            if (pickerTarget === 'logo') setFormData({ ...formData, logo: url });
            if (pickerTarget === 'footerLogo') setFormData({ ...formData, footerLogo: url });
          }}
        />
      )}
    </div>
  );
}
