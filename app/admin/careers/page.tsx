'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  Save,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '../components/Toast';
import { DataTable } from '../components/DataTable';
import { ConfirmModal } from '../components/ConfirmModal';
import type { CareerItem } from '@/lib/admin-types';

export default function ManageCareerPage() {
  const {
    careers,
    addCareerItem,
    updateCareerItem,
    deleteCareerItem,
    toggleCareerVisibility,
  } = useAdminStore();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CareerItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Marketing',
    location: 'Pekanbaru',
    type: 'Full-time',
    description: '',
    requirements: ['Relevant Bachelor degree', 'Min. 2 years experience'],
    visibility: true,
  });

  const [reqInput, setReqInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<CareerItem | null>(null);

  const openAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      department: 'Marketing',
      location: 'Pekanbaru',
      type: 'Full-time',
      description: 'Job responsibility and summary...',
      requirements: ['Bachelor degree in relevant field', 'Minimum 2 years experience in hospitality or lifestyle property'],
      visibility: true,
    });
    setModalOpen(true);
  };

  const openEdit = (item: CareerItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      department: item.department,
      location: item.location,
      type: item.type,
      description: item.description,
      requirements: [...item.requirements],
      visibility: item.visibility,
    });
    setModalOpen(true);
  };

  const handleAddReq = () => {
    if (!reqInput.trim()) return;
    setFormData({
      ...formData,
      requirements: [...formData.requirements, reqInput.trim()],
    });
    setReqInput('');
  };

  const handleRemoveReq = (idx: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== idx),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Job title is required', 'warning');
      return;
    }

    if (editingItem) {
      updateCareerItem(editingItem.id, formData);
      showToast('Career opening updated successfully', 'success');
    } else {
      addCareerItem(formData);
      showToast('New career opening posted', 'success');
    }
    setModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Career Openings (manage_career)</h1>
          <p>Post and manage talent vacancies across hotel operations, mall management, and corporate offices.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openAdd}>
          <Plus size={15} /> Post Job Opening
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <Briefcase size={18} color="var(--admin-green)" />
            Open Career Positions Table (manage_career)
          </div>
          <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
            Active Openings: {careers.length}
          </span>
        </div>

        {/* Columns: no, title, create_time, updated, action (edit,delete,visibility) */}
        <DataTable<CareerItem>
          data={careers}
          searchKey="title"
          searchPlaceholder="Search openings by position title..."
          onEdit={openEdit}
          onDelete={(item) => setDeleteTarget(item)}
          onToggleVisibility={(item) => {
            toggleCareerVisibility(item.id);
            showToast(`Visibility toggled for "${item.title}"`, 'success');
          }}
          getVisibility={(item) => item.visibility}
          extraActions={(item) => (
            <Link
              href="/career#openings"
              target="_blank"
              className="admin-btn-icon"
              title="View on public career board"
            >
              <ExternalLink size={14} />
            </Link>
          )}
          columns={[
            {
              header: 'No',
              accessorKey: 'no',
              width: '50px',
            },
            {
              header: 'Position Title',
              render: (item) => (
                <div>
                  <strong>{item.title}</strong>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                    {item.department} · {item.location} ({item.type})
                  </div>
                </div>
              ),
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
                  {item.visibility ? 'Open' : 'Closed / Draft'}
                </span>
              ),
            },
          ]}
        />
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingItem ? 'Edit Job Opening' : 'Post New Job Vacancy'}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Job Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Front Office Manager"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-grid-3">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Department</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Location</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Employment Type</label>
                    <select
                      className="admin-select"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Role Description &amp; Objectives</label>
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Key Qualifications */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Key Candidate Requirements</label>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Add qualification requirement..."
                      value={reqInput}
                      onChange={(e) => setReqInput(e.target.value)}
                    />
                    <button type="button" className="admin-btn admin-btn-secondary" onClick={handleAddReq}>
                      Add
                    </button>
                  </div>
                  <ul style={{ paddingLeft: 20, margin: 0, fontSize: 13, color: 'var(--admin-text-main)' }}>
                    {formData.requirements.map((req, idx) => (
                      <li key={idx} style={{ marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>{req}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveReq(idx)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            <X size={13} color="#d94a7a" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label className="admin-form-label">Status Visibility</label>
                  <select
                    className="admin-select"
                    value={formData.visibility ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value === 'true' })}
                  >
                    <option value="true">Open (Published on public career page)</option>
                    <option value="false">Closed / Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save size={14} /> Save Vacancy
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
          title="Delete Career Opening"
          message={`Are you sure you want to delete opening "${deleteTarget.title}"?`}
          confirmText="Delete Vacancy"
          variant="danger"
          onConfirm={() => {
            deleteCareerItem(deleteTarget.id);
            setDeleteTarget(null);
            showToast('Career opening deleted', 'danger');
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
