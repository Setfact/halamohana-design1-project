'use client';

import { useState } from 'react';
import {
  Sliders,
  Plus,
  Save,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Upload,
  X,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { MediaPickerModal } from '../components/MediaPickerModal';
import type { BannerItem } from '@/lib/admin-types';

export default function BannerManagementPage() {
  const {
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerVisibility,
  } = useAdminStore();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '/projects',
    isActive: true,
    sortOrder: 1,
  });
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BannerItem | null>(null);

  // Hero Preview Slider state
  const activeBanners = banners.filter((b) => b.isActive);
  const [previewIdx, setPreviewIdx] = useState(0);
  const currentPreview = activeBanners[previewIdx] || banners[0];

  const openAdd = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      imageUrl: '',
      linkUrl: '/projects',
      isActive: true,
      sortOrder: banners.length + 1,
    });
    setModalOpen(true);
  };

  const openEdit = (b: BannerItem) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      imageUrl: b.imageUrl,
      linkUrl: b.linkUrl,
      isActive: b.isActive,
      sortOrder: b.sortOrder,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      showToast('Title and Image are required', 'warning');
      return;
    }

    if (editingBanner) {
      updateBanner(editingBanner.id, formData);
      showToast('Banner updated successfully', 'success');
    } else {
      addBanner(formData);
      showToast('New banner slide added', 'success');
    }
    setModalOpen(false);
  };

  const handleMoveOrder = (id: string, delta: number) => {
    const banner = banners.find((b) => b.id === id);
    if (!banner) return;
    const newOrder = Math.max(1, (banner.sortOrder || 1) + delta);
    updateBanner(id, { sortOrder: newOrder });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Banner &amp; Hero Carousel</h1>
          <p>Configure homepage hero sliders, visual transitions, promotional links, and display order.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openAdd}>
          <Plus size={15} /> Add New Banner Slide
        </button>
      </div>

      {/* Live Homepage Hero Mockup Preview */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
          <div style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={16} color="var(--admin-coral)" />
            Live Homepage Hero Carousel Preview ({activeBanners.length} active slides)
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className="admin-btn-icon"
                style={{
                  width: 28,
                  height: 28,
                  fontSize: 12,
                  background: previewIdx === idx ? 'var(--admin-green)' : '#fff',
                  color: previewIdx === idx ? '#fff' : 'inherit',
                  borderColor: previewIdx === idx ? 'var(--admin-green)' : undefined,
                }}
                onClick={() => setPreviewIdx(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {currentPreview ? (
          <div style={{ position: 'relative', height: 280, overflow: 'hidden', background: '#171c19', color: '#fff' }}>
            <img
              src={currentPreview.imageUrl}
              alt={currentPreview.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(23,28,25,0.85) 0%, rgba(23,28,25,0.3) 100%)',
              }}
            />
            <div style={{ position: 'absolute', left: 40, top: '50%', transform: 'translateY(-50%)', maxWidth: 540 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--admin-green)', fontWeight: 800 }}>
                HOSPITALITY · LIFESTYLE · PROPERTY
              </span>
              <h2 style={{ fontSize: 26, fontFamily: 'var(--admin-font-serif)', margin: '10px 0 14px', lineHeight: 1.2 }}>
                {currentPreview.title}
              </h2>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: 'var(--admin-green)',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Discover more →
              </span>
            </div>
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
            No active banners. Add a banner or toggle visibility below.
          </div>
        )}
      </div>

      {/* Banner Management List */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <Sliders size={18} color="var(--admin-green)" />
            Manage Carousel Banners (crud_banner &amp; combined_action)
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 10,
                border: '1px solid var(--admin-border)',
                background: banner.isActive ? '#fff' : '#fcfcfc',
                gap: 18,
                flexWrap: 'wrap',
              }}
            >
              {/* Thumbnail & Order */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#9ca3af',
                    width: 24,
                    textAlign: 'center',
                  }}
                >
                  #{banner.sortOrder || index + 1}
                </span>

                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  style={{
                    width: 100,
                    height: 58,
                    borderRadius: 6,
                    objectFit: 'cover',
                    border: '1px solid #e5e7eb',
                  }}
                />

                <div>
                  <strong style={{ fontSize: 14, display: 'block', color: 'var(--admin-text-main)' }}>
                    {banner.title}
                  </strong>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 3 }}>
                    Target Link: <code>{banner.linkUrl || '/projects'}</code>
                  </div>
                </div>
              </div>

              {/* Combined Actions & Visibility Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Order Up/Down */}
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    type="button"
                    className="admin-btn-icon"
                    onClick={() => handleMoveOrder(banner.id, -1)}
                    title="Move Order Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="admin-btn-icon"
                    onClick={() => handleMoveOrder(banner.id, 1)}
                    title="Move Order Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                {/* Visibility Badge & Switch (combined_action) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`admin-badge ${banner.isActive ? 'live' : 'hidden'}`}>
                    {banner.isActive ? 'Live' : 'Hidden'}
                  </span>
                  <label className="admin-toggle-switch">
                    <input
                      type="checkbox"
                      checked={banner.isActive}
                      onChange={() => {
                        toggleBannerVisibility(banner.id);
                        showToast(`Banner visibility toggled`, 'success');
                      }}
                    />
                    <span className="admin-toggle-slider" />
                  </label>
                </div>

                {/* Edit & Delete */}
                <button
                  type="button"
                  className="admin-btn-icon edit"
                  onClick={() => openEdit(banner)}
                  title="Edit Banner"
                >
                  <Edit size={14} />
                </button>
                <button
                  type="button"
                  className="admin-btn-icon delete"
                  onClick={() => setDeleteTarget(banner)}
                  title="Delete Banner"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Banner Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingBanner ? 'Edit Banner Slide' : 'Add New Banner Slide'}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Banner Headline Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Where hospitality meets possibility."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Slide Image URL</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="https://images.unsplash.com/... or choose from library"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      onClick={() => setMediaPickerOpen(true)}
                    >
                      <Upload size={14} /> Browse
                    </button>
                  </div>
                  {formData.imageUrl && (
                    <div style={{ marginTop: 10, height: 120, borderRadius: 8, overflow: 'hidden' }}>
                      <img src={formData.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Call-to-Action Destination Link</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. /projects or /about"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  />
                </div>

                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sort Order</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Display Status</label>
                    <select
                      className="admin-select"
                      value={formData.isActive ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    >
                      <option value="true">Active (Visible in Carousel)</option>
                      <option value="false">Inactive (Draft / Hidden)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save size={14} /> Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          title="Delete Banner Slide"
          message={`Are you sure you want to remove banner "${deleteTarget.title}" from the homepage carousel?`}
          confirmText="Delete Banner"
          variant="danger"
          onConfirm={() => {
            deleteBanner(deleteTarget.id);
            setDeleteTarget(null);
            showToast('Banner slide deleted', 'danger');
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={true}
          title="Select Carousel Image from Media Library"
          onClose={() => setMediaPickerOpen(false)}
          onSelect={(url) => setFormData({ ...formData, imageUrl: url })}
        />
      )}
    </div>
  );
}
