'use client';

import { useState } from 'react';
import {
  Image as ImageIcon,
  FileText,
  Upload,
  Folder,
  Sliders,
  Trash2,
  ExternalLink,
  Plus,
  CheckCircle,
  Copy,
  LayoutGrid,
  List as ListIcon,
  X,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { DataTable } from '../components/DataTable';
import type { MediaItem } from '@/lib/admin-types';

export default function MediaLibraryPage() {
  const { media, uploadMedia, deleteMedia, connectMediaToCarousel } = useAdminStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'images' | 'documents'>('images');
  const [selectedDir, setSelectedDir] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    name: '',
    url: '',
    directory: '/banners',
    type: 'image' as 'image' | 'document',
    size: '1.5 MB',
    dimensions: '1920x1080',
  });

  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);

  // Filter media by tab and directory
  const currentTabMedia = media.filter((m) =>
    activeTab === 'images' ? m.type === 'image' : m.type === 'document'
  );

  const filteredMedia = currentTabMedia.filter((m) =>
    selectedDir === 'all' ? true : m.directory === selectedDir
  );

  const directories = [
    'all',
    ...Array.from(new Set(currentTabMedia.map((m) => m.directory))),
  ];

  const handleOpenUpload = () => {
    setUploadFormData({
      name: '',
      url: '',
      directory: activeTab === 'images' ? '/banners' : '/documents',
      type: activeTab === 'images' ? 'image' : 'document',
      size: '1.5 MB',
      dimensions: '1920x1080',
    });
    setUploadModalOpen(true);
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFormData.name.trim() || !uploadFormData.url.trim()) {
      showToast('Name and URL/File are required', 'warning');
      return;
    }

    uploadMedia({
      name: uploadFormData.name.trim(),
      url: uploadFormData.url.trim(),
      directory: uploadFormData.directory,
      type: uploadFormData.type,
      size: uploadFormData.size,
      dimensions: uploadFormData.type === 'image' ? uploadFormData.dimensions : undefined,
    });

    showToast(`Successfully uploaded ${uploadFormData.type}: ${uploadFormData.name}`, 'success');
    setUploadModalOpen(false);
  };

  const handleConnectCarousel = (item: MediaItem) => {
    connectMediaToCarousel(item.id);
    showToast(`"${item.name}" connected directly to Homepage Carousel!`, 'success');
  };

  const handleCopyLink = (url: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url);
      showToast('Asset URL copied to clipboard!', 'success');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Media Asset Library</h1>
          <p>Centralized repository for images, hero photography, documents, brochures, and carousel assets.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={handleOpenUpload}>
          <Upload size={15} /> Upload {activeTab === 'images' ? 'Image' : 'Document'}
        </button>
      </div>

      {/* Primary Tabs */}
      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('images');
            setSelectedDir('all');
          }}
        >
          <ImageIcon size={15} style={{ display: 'inline', marginRight: 6 }} />
          Image Library (image_library)
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('documents');
            setSelectedDir('all');
          }}
        >
          <FileText size={15} style={{ display: 'inline', marginRight: 6 }} />
          Document Library (document_library)
        </button>
      </div>

      {/* Directory Filter & View Switcher */}
      <div className="admin-card" style={{ marginBottom: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          {/* Directories: see_dir_of_each_uploaded_image */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Directory (see_dir):
            </span>
            {directories.map((dir) => (
              <button
                key={dir}
                type="button"
                className={`admin-btn admin-btn-sm ${selectedDir === dir ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                onClick={() => setSelectedDir(dir)}
              >
                <Folder size={12} />
                {dir === 'all' ? 'All Directories' : dir}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              type="button"
              className={`admin-btn-icon ${viewMode === 'grid' ? 'view' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              className={`admin-btn-icon ${viewMode === 'table' ? 'view' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <ListIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: IMAGE LIBRARY */}
      {activeTab === 'images' && (
        <>
          {viewMode === 'grid' ? (
            <div className="admin-media-grid">
              {filteredMedia.map((item) => (
                <div key={item.id} className="admin-media-card">
                  <div className="admin-media-thumb">
                    <img src={item.url} alt={item.name} loading="lazy" />
                    {item.connectedToCarousel && (
                      <span
                        className="admin-badge live"
                        style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, backdropFilter: 'blur(4px)' }}
                      >
                        <CheckCircle size={10} /> Live Carousel
                      </span>
                    )}
                  </div>
                  <div className="admin-media-meta">
                    <strong title={item.name}>{item.name}</strong>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: 11, marginBottom: 8 }}>
                      <span>{item.directory}</span>
                      <span>{item.size}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 12 }}>
                      Uploaded by: <b>{item.uploadedBy}</b> ({item.uploadedAt})
                    </div>

                    {/* Action row */}
                    <div style={{ display: 'flex', gap: 6, borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
                      {/* connect_to_all_carosel */}
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm admin-btn-outline"
                        style={{ flex: 1, fontSize: 11 }}
                        onClick={() => handleConnectCarousel(item)}
                        title="Connect image directly to Homepage Carousel"
                      >
                        <Sliders size={12} color="var(--admin-coral)" /> Connect to Carousel
                      </button>
                      <button
                        type="button"
                        className="admin-btn-icon"
                        onClick={() => handleCopyLink(item.url)}
                        title="Copy Image URL"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        type="button"
                        className="admin-btn-icon delete"
                        onClick={() => setDeleteTarget(item)}
                        title="Delete Image"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-card">
              <DataTable<MediaItem>
                data={filteredMedia}
                searchKey="name"
                searchPlaceholder="Search uploaded images..."
                onDelete={(item) => setDeleteTarget(item)}
                extraActions={(item) => (
                  <button
                    type="button"
                    className="admin-btn-icon view"
                    onClick={() => handleConnectCarousel(item)}
                    title="Connect to Carousel"
                  >
                    <Sliders size={14} color="var(--admin-coral)" />
                  </button>
                )}
                columns={[
                  {
                    header: 'Thumbnail',
                    render: (m) => (
                      <img
                        src={m.url}
                        alt={m.name}
                        style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }}
                      />
                    ),
                    width: '60px',
                  },
                  { header: 'File Name', accessorKey: 'name' },
                  {
                    header: 'Directory',
                    render: (m) => <code>{m.directory}</code>,
                  },
                  { header: 'File Size', accessorKey: 'size' },
                  { header: 'Dimensions', accessorKey: 'dimensions' },
                  { header: 'Uploaded By (see_what_user_has_upload)', accessorKey: 'uploadedBy' },
                  { header: 'Date', accessorKey: 'uploadedAt' },
                  {
                    header: 'Carousel Link',
                    render: (m) =>
                      m.connectedToCarousel ? (
                        <span className="admin-badge live">Connected</span>
                      ) : (
                        <span className="admin-badge hidden">Not connected</span>
                      ),
                  },
                ]}
              />
            </div>
          )}
        </>
      )}

      {/* TAB 2: DOCUMENT LIBRARY */}
      {activeTab === 'documents' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <FileText size={18} color="var(--admin-green)" />
              Uploaded Documents (see_whats_user_uploaded_some_docs)
            </div>
          </div>

          <DataTable<MediaItem>
            data={filteredMedia}
            searchKey="name"
            searchPlaceholder="Search uploaded documents..."
            onDelete={(item) => setDeleteTarget(item)}
            extraActions={(item) => (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="admin-btn-icon"
                title="View Document"
              >
                <ExternalLink size={14} />
              </a>
            )}
            columns={[
              {
                header: 'Document Name',
                render: (m) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ background: '#fef2f2', padding: 8, borderRadius: 6, color: '#dc2626' }}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <strong>{m.name}</strong>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>{m.url}</div>
                    </div>
                  </div>
                ),
              },
              {
                header: 'Directory',
                render: (m) => <code>{m.directory}</code>,
              },
              { header: 'File Size', accessorKey: 'size' },
              { header: 'Uploaded By', accessorKey: 'uploadedBy' },
              { header: 'Upload Date', accessorKey: 'uploadedAt' },
            ]}
          />
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setUploadModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Upload {uploadFormData.type === 'image' ? 'Image File' : 'Document'}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setUploadModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveUpload}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Asset Title / File Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. pekalongan-branch-opening.jpg"
                    value={uploadFormData.name}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Target Directory (directory folder)</label>
                  <select
                    className="admin-select"
                    value={uploadFormData.directory}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, directory: e.target.value })}
                  >
                    <option value="/banners">/banners (Homepage Hero Slides)</option>
                    <option value="/projects">/projects (Property &amp; Hotel Architecture)</option>
                    <option value="/news">/news (Editorial &amp; Milestones)</option>
                    <option value="/gallery">/gallery (Public Photo Masonry)</option>
                    <option value="/branding">/branding (Corporate Logos &amp; Identity)</option>
                    <option value="/documents">/documents (Disclosures, Reports, SOPs)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">File / Image URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="https://images.unsplash.com/... or /documents/..."
                    value={uploadFormData.url}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, url: e.target.value })}
                    required
                  />
                  <div className="admin-form-help">
                    Paste asset URL or cloud storage path.
                  </div>
                </div>

                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">File Size</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={uploadFormData.size}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, size: e.target.value })}
                    />
                  </div>
                  {uploadFormData.type === 'image' && (
                    <div className="admin-form-group">
                      <label className="admin-form-label">Dimensions</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={uploadFormData.dimensions}
                        onChange={(e) => setUploadFormData({ ...uploadFormData, dimensions: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setUploadModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Upload size={14} /> Upload to Library
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
          title="Delete Media Asset"
          message={`Are you sure you want to delete "${deleteTarget.name}"? If this file is linked to carousel or published news, it will no longer display.`}
          confirmText="Delete File"
          variant="danger"
          onConfirm={() => {
            deleteMedia(deleteTarget.id);
            setDeleteTarget(null);
            showToast('Media file deleted', 'danger');
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
