'use client';

import { useState } from 'react';
import {
  Images,
  Plus,
  Save,
  X,
  Upload,
  LayoutGrid,
  List as ListIcon,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '../components/Toast';
import { DataTable } from '../components/DataTable';
import { ConfirmModal } from '../components/ConfirmModal';
import { MediaPickerModal } from '../components/MediaPickerModal';
import type { GalleryItem } from '@/lib/admin-types';

export default function ManageGalleryPage() {
  const {
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    toggleGalleryVisibility,
  } = useAdminStore();
  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: 'FOX Hotel',
    email: '',
    image: '',
    category: 'FOX Hotel',
    size: 'standard' as 'standard' | 'tall' | 'wide',
    visibility: true,
  });

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  const openAdd = () => {
    setEditingItem(null);
    setFormData({
      fullName: '',
      phone: 'FOX Hotel',
      email: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=88',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=88',
      category: 'FOX Hotel',
      size: 'standard',
      visibility: true,
    });
    setModalOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      fullName: item.fullName,
      phone: item.phone,
      email: item.email,
      image: item.image,
      category: item.category,
      size: item.size,
      visibility: item.visibility,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.image.trim()) {
      showToast('Title / Full Name and Image are required', 'warning');
      return;
    }

    if (editingItem) {
      updateGalleryItem(editingItem.id, {
        ...formData,
        email: formData.image, // ensure email/image stay synced with user requirements
      });
      showToast('Gallery item updated', 'success');
    } else {
      addGalleryItem({
        ...formData,
        email: formData.image,
      });
      showToast('Gallery item added', 'success');
    }
    setModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Gallery Management (manage_galery)</h1>
          <p>Curate architectural photography, lifestyle photos, and hospitality events.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              type="button"
              className={`admin-btn-icon ${viewMode === 'table' ? 'view' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <ListIcon size={15} />
            </button>
            <button
              type="button"
              className={`admin-btn-icon ${viewMode === 'grid' ? 'view' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid Cards"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
          <button type="button" className="admin-btn admin-btn-primary" onClick={openAdd}>
            <Plus size={15} /> Add Gallery Photo
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <Images size={18} color="var(--admin-green)" />
              Photo Gallery Table (manage_galery)
            </div>
            <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
              Total Photos: {gallery.length}
            </span>
          </div>

          {/* Columns: no, full_name, Phone, Email, create_time, action (delete, visibility) */}
          <DataTable<GalleryItem>
            data={gallery}
            searchKey={(g) => `${g.fullName} ${g.phone} ${g.category}`}
            searchPlaceholder="Search gallery photos..."
            onEdit={openEdit}
            onDelete={(g) => setDeleteTarget(g)}
            onToggleVisibility={(g) => {
              toggleGalleryVisibility(g.id);
              showToast(`Visibility toggled for "${g.fullName}"`, 'success');
            }}
            getVisibility={(g) => g.visibility}
            columns={[
              {
                header: 'No',
                accessorKey: 'no',
                width: '50px',
              },
              {
                header: 'Title / Item Name (full_name)',
                render: (g) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={g.image}
                      alt={g.fullName}
                      style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover' }}
                    />
                    <div>
                      <strong>{g.fullName}</strong>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>Layout Size: {g.size}</div>
                    </div>
                  </div>
                ),
              },
              {
                header: 'Category / Tag (Phone)',
                accessorKey: 'phone',
              },
              {
                header: 'Media Link (Email)',
                render: (g) => (
                  <a
                    href={g.image}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: 'var(--admin-green-dark)',
                      display: 'block',
                      maxWidth: 240,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {g.email || g.image}
                  </a>
                ),
              },
              {
                header: 'Create Time (create_time)',
                accessorKey: 'createTime',
              },
              {
                header: 'Visibility',
                render: (g) => (
                  <span className={`admin-badge ${g.visibility ? 'live' : 'hidden'}`}>
                    {g.visibility ? 'Visible' : 'Hidden'}
                  </span>
                ),
              },
            ]}
          />
        </div>
      ) : (
        <div className="admin-media-grid">
          {gallery.map((item) => (
            <div key={item.id} className="admin-media-card">
              <div className="admin-media-thumb" style={{ height: 180 }}>
                <img src={item.image} alt={item.fullName} loading="lazy" />
                <span
                  className={`admin-badge ${item.visibility ? 'live' : 'hidden'}`}
                  style={{ position: 'absolute', top: 8, right: 8, fontSize: 10 }}
                >
                  {item.visibility ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <div className="admin-media-meta">
                <strong title={item.fullName}>{item.fullName}</strong>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: 11, marginBottom: 10 }}>
                  <span>{item.category || item.phone}</span>
                  <span>{item.size}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-sm admin-btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => openEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-btn-icon delete"
                    onClick={() => setDeleteTarget(item)}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingItem ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Photo Title / Caption (full_name)</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. A warm welcome at FOX Hotel"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category / Tag (Phone)</label>
                    <select
                      className="admin-select"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="FOX Hotel">FOX Hotel</option>
                      <option value="Mall Events">Mall Events</option>
                      <option value="Ground Breaking">Ground Breaking</option>
                      <option value="Underconstruction">Underconstruction</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Masonry Tile Aspect (size)</label>
                    <select
                      className="admin-select"
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          size: e.target.value as 'standard' | 'tall' | 'wide',
                        })
                      }
                    >
                      <option value="standard">Standard (Square/Neutral)</option>
                      <option value="tall">Tall (Vertical highlight)</option>
                      <option value="wide">Wide (Horizontal banner)</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Image Source URL (Email)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: e.target.value,
                          email: e.target.value,
                        })
                      }
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
                  {formData.image && (
                    <div style={{ marginTop: 10, height: 120, borderRadius: 8, overflow: 'hidden' }}>
                      <img src={formData.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label className="admin-form-label">Display Visibility</label>
                  <select
                    className="admin-select"
                    value={formData.visibility ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value === 'true' })}
                  >
                    <option value="true">Visible (Shown in public gallery)</option>
                    <option value="false">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save size={14} /> Save Photo
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
          title="Delete Gallery Photo"
          message={`Are you sure you want to delete "${deleteTarget.fullName}"?`}
          confirmText="Delete Photo"
          variant="danger"
          onConfirm={() => {
            deleteGalleryItem(deleteTarget.id);
            setDeleteTarget(null);
            showToast('Gallery item deleted', 'danger');
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={true}
          title="Select Photo from Media Library"
          onClose={() => setMediaPickerOpen(false)}
          onSelect={(url) => setFormData({ ...formData, image: url, email: url })}
        />
      )}
    </div>
  );
}
