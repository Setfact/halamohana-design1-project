'use client';

import { useState } from 'react';
import {
  FileText,
  Plus,
  Save,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '../components/Toast';
import { DataTable } from '../components/DataTable';
import { ConfirmModal } from '../components/ConfirmModal';
import type { CorporateInfoItem } from '@/lib/admin-types';

export default function CorporateInfoPage() {
  const {
    corporateInfo,
    addCorporateInfo,
    updateCorporateInfo,
    deleteCorporateInfo,
    toggleCorporateInfoVisibility,
  } = useAdminStore();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CorporateInfoItem | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    title: '',
    url: '',
    category: 'Governance',
    visibility: true,
  });

  const [deleteTarget, setDeleteTarget] = useState<CorporateInfoItem | null>(null);

  const openAdd = () => {
    setEditingItem(null);
    setFormData({
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      title: '',
      url: '/corporate-info/',
      category: 'Governance',
      visibility: true,
    });
    setModalOpen(true);
  };

  const openEdit = (item: CorporateInfoItem) => {
    setEditingItem(item);
    setFormData({
      date: item.date,
      title: item.title,
      url: item.url,
      category: item.category,
      visibility: item.visibility,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Title is required', 'warning');
      return;
    }

    if (editingItem) {
      updateCorporateInfo(editingItem.id, formData);
      showToast('Corporate information updated', 'success');
    } else {
      addCorporateInfo(formData);
      showToast('Corporate information entry added', 'success');
    }
    setModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Corporate Information (corporate_info)</h1>
          <p>Disclosures, governance guidelines, annual reports, sustainability filings, and regulatory notices.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openAdd}>
          <Plus size={15} /> Add Corporate Info
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <FileText size={18} color="var(--admin-green)" />
            Corporate Disclosures &amp; Guidelines Table
          </div>
          <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
            Total Items: {corporateInfo.length}
          </span>
        </div>

        {/* Columns: no, date, title, url, create_time, updated, action (edit,delete,visibility) */}
        <DataTable<CorporateInfoItem>
          data={corporateInfo}
          searchKey="title"
          searchPlaceholder="Search corporate title or url..."
          onEdit={openEdit}
          onDelete={(item) => setDeleteTarget(item)}
          onToggleVisibility={(item) => {
            toggleCorporateInfoVisibility(item.id);
            showToast(`Visibility toggled for "${item.title}"`, 'success');
          }}
          getVisibility={(item) => item.visibility}
          extraActions={(item) => (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="admin-btn-icon"
              title="Open document/link"
            >
              <ExternalLink size={14} />
            </a>
          )}
          columns={[
            {
              header: 'No',
              accessorKey: 'no',
              width: '60px',
            },
            {
              header: 'Date',
              accessorKey: 'date',
              width: '140px',
            },
            {
              header: 'Title',
              render: (item) => (
                <div>
                  <strong>{item.title}</strong>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                    Category: {item.category}
                  </div>
                </div>
              ),
            },
            {
              header: 'URL',
              render: (item) => <code>{item.url}</code>,
            },
            {
              header: 'Create Time',
              accessorKey: 'createTime',
            },
            {
              header: 'Updated',
              accessorKey: 'updated',
            },
            {
              header: 'Visibility',
              render: (item) => (
                <span className={`admin-badge ${item.visibility ? 'live' : 'hidden'}`}>
                  {item.visibility ? 'Public' : 'Hidden'}
                </span>
              ),
            },
          ]}
        />
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingItem ? 'Edit Corporate Information' : 'Add Corporate Information'}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Code of Conduct & Business Ethics 2026"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Date</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Category</label>
                    <select
                      className="admin-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Governance">Governance</option>
                      <option value="Sustainability">Sustainability</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Annual Report">Annual Report</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Document URL / Target Link</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. /documents/whistle-blowing-guideline.pdf or https://..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Visibility Status</label>
                  <select
                    className="admin-select"
                    value={formData.visibility ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value === 'true' })}
                  >
                    <option value="true">Visible (Publicly accessible)</option>
                    <option value="false">Hidden (Draft / Archive)</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save size={14} /> Save Entry
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
          title="Delete Corporate Info Entry"
          message={`Are you sure you want to remove "${deleteTarget.title}"?`}
          confirmText="Delete Entry"
          variant="danger"
          onConfirm={() => {
            deleteCorporateInfo(deleteTarget.id);
            setDeleteTarget(null);
            showToast('Corporate info entry deleted', 'danger');
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
