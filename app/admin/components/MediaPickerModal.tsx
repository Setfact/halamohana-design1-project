'use client';

import { useState } from 'react';
import { useAdminStore } from '@/lib/admin-store';
import { X, Upload, Check, Folder } from 'lucide-react';

type MediaPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
  allowedType?: 'image' | 'document' | 'all';
};

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media',
  allowedType = 'image',
}: MediaPickerModalProps) {
  const { media, uploadMedia } = useAdminStore();
  const [selectedDir, setSelectedDir] = useState<string>('all');
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');

  if (!isOpen) return null;

  const filteredMedia = media.filter((m) => {
    if (allowedType !== 'all' && m.type !== allowedType) return false;
    if (selectedDir !== 'all' && m.directory !== selectedDir) return false;
    return true;
  });

  const directories = ['all', ...Array.from(new Set(media.map((m) => m.directory)))];

  const handleQuickUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const item = uploadMedia({
      name: newName.trim() || 'uploaded-file.jpg',
      url: newUrl.trim(),
      type: allowedType === 'document' ? 'document' : 'image',
      directory: selectedDir === 'all' ? '/uploads' : selectedDir,
      size: '1.2 MB',
      dimensions: '1920x1080',
    });

    onSelect(item.url);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal wide"
        onClick={(e) => e.stopPropagation()}
        style={{ height: '85vh' }}
      >
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Directories Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
              Directory:
            </span>
            {directories.map((dir) => (
              <button
                key={dir}
                type="button"
                className={`admin-btn admin-btn-sm ${selectedDir === dir ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                onClick={() => setSelectedDir(dir)}
              >
                <Folder size={13} />
                {dir === 'all' ? 'All Directories' : dir}
              </button>
            ))}
          </div>

          {/* Quick upload URL input */}
          <form
            onSubmit={handleQuickUpload}
            style={{
              display: 'flex',
              gap: 10,
              padding: 14,
              background: '#f9fafb',
              borderRadius: 8,
              border: '1px dashed var(--admin-border)',
            }}
          >
            <input
              type="text"
              placeholder="Paste Image URL to upload..."
              className="admin-input"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              style={{ flex: 2 }}
            />
            <input
              type="text"
              placeholder="Name / Title (Optional)"
              className="admin-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="admin-btn admin-btn-primary" style={{ whiteSpace: 'nowrap' }}>
              <Upload size={14} /> Add & Select
            </button>
          </form>

          {/* Grid Selection */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: 14,
              overflowY: 'auto',
              flex: 1,
              paddingRight: 4,
            }}
          >
            {filteredMedia.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
                No media found in this directory.
              </div>
            ) : (
              filteredMedia.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  style={{
                    border: '1px solid var(--admin-border)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: '#fff',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--admin-green)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--admin-border)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ height: 110, background: '#f3f4f6', overflow: 'hidden' }}>
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
                        DOC
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={item.name}
                    >
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{item.size}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="admin-modal-footer">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
