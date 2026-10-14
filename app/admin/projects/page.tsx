'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Save,
  X,
  Upload,
  ExternalLink,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '../components/Toast';
import { DataTable } from '../components/DataTable';
import { ConfirmModal } from '../components/ConfirmModal';
import { MediaPickerModal } from '../components/MediaPickerModal';
import type { ProjectItem } from '@/lib/admin-types';

export default function ManageProjectsPage() {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectVisibility,
  } = useAdminStore();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Hospitality',
    location: 'Pekanbaru',
    description: '',
    longDescription: '',
    image: '',
    secondaryImage: '',
    facilities: ['Gym', 'Spa', 'Restaurant'],
    visibility: true,
  });

  const [facilityInput, setFacilityInput] = useState('');
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'main' | 'secondary' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null);

  const openAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Hospitality',
      location: 'Pekanbaru',
      description: '',
      longDescription: '',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=88',
      secondaryImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1800&q=88',
      facilities: ['Rooms', 'Restaurant', 'Meeting Facilities'],
      visibility: true,
    });
    setModalOpen(true);
  };

  const openEdit = (project: ProjectItem) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      category: project.category,
      location: project.location,
      description: project.description,
      longDescription: project.longDescription,
      image: project.image,
      secondaryImage: project.secondaryImage,
      facilities: [...project.facilities],
      visibility: project.visibility,
    });
    setModalOpen(true);
  };

  const handleTitleChange = (newTitle: string) => {
    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') ? slug : prev.slug,
    }));
  };

  const handleAddFacility = () => {
    if (!facilityInput.trim()) return;
    setFormData({
      ...formData,
      facilities: [...formData.facilities, facilityInput.trim()],
    });
    setFacilityInput('');
  };

  const handleRemoveFacility = (idxToRemove: number) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter((_, idx) => idx !== idxToRemove),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      showToast('Project title and slug are required', 'warning');
      return;
    }

    if (editingProject) {
      updateProject(editingProject.id, formData);
      showToast('Project updated successfully', 'success');
    } else {
      addProject(formData);
      showToast('New project created successfully', 'success');
    }
    setModalOpen(false);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Project Portfolio (manage_project)</h1>
          <p>Oversee integrated destination projects, hotels, lifestyle malls, and future developments.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openAdd}>
          <Plus size={15} /> Add New Project
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <Building2 size={18} color="var(--admin-green)" />
            Destination Projects Table
          </div>
          <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
            Total Projects: {projects.length}
          </span>
        </div>

        {/* Columns: no, title, create_time, updated, action (edit,delete,visibility) */}
        <DataTable<ProjectItem>
          data={projects}
          searchKey="title"
          searchPlaceholder="Search projects by title or location..."
          onEdit={openEdit}
          onDelete={(p) => setDeleteTarget(p)}
          onToggleVisibility={(p) => {
            toggleProjectVisibility(p.id);
            showToast(`Visibility updated for "${p.title}"`, 'success');
          }}
          getVisibility={(p) => p.visibility}
          extraActions={(p) => (
            <Link
              href={`/projects/${p.slug}`}
              target="_blank"
              className="admin-btn-icon"
              title="View Live Project Page"
            >
              <ExternalLink size={14} />
            </Link>
          )}
          columns={[
            {
              header: 'No',
              accessorKey: 'no',
              width: '60px',
            },
            {
              header: 'Title',
              render: (p) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{ width: 54, height: 54, borderRadius: 8, objectFit: 'cover' }}
                  />
                  <div>
                    <strong style={{ fontSize: 14 }}>{p.title}</strong>
                    <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                      {p.category} · {p.location}
                    </div>
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
              render: (p) => (
                <span className={`admin-badge ${p.visibility ? 'live' : 'hidden'}`}>
                  {p.visibility ? 'Active' : 'Hidden'}
                </span>
              ),
            },
          ]}
        />
      </div>

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProject ? 'Edit Project' : 'Add New Destination Project'}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Project Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. FOX Hotel Pekanbaru"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Slug URL Address</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Short Tagline Description</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Long Detailed Description</label>
                  <textarea
                    rows={4}
                    className="admin-textarea"
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  />
                </div>

                {/* Images */}
                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Primary Hero Image</label>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input
                        type="text"
                        className="admin-input"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={() => setMediaPickerTarget('main')}
                      >
                        <Upload size={14} /> Browse
                      </button>
                    </div>
                    {formData.image && (
                      <div style={{ height: 100, borderRadius: 6, overflow: 'hidden' }}>
                        <img src={formData.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Secondary / Facility Image</label>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input
                        type="text"
                        className="admin-input"
                        value={formData.secondaryImage}
                        onChange={(e) => setFormData({ ...formData, secondaryImage: e.target.value })}
                      />
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={() => setMediaPickerTarget('secondary')}
                      >
                        <Upload size={14} /> Browse
                      </button>
                    </div>
                    {formData.secondaryImage && (
                      <div style={{ height: 100, borderRadius: 6, overflow: 'hidden' }}>
                        <img src={formData.secondaryImage} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Facilities Tags */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Key Facilities &amp; Amenities</label>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Add amenity (e.g. 225 Rooms, Sky Pool)"
                      value={facilityInput}
                      onChange={(e) => setFacilityInput(e.target.value)}
                    />
                    <button type="button" className="admin-btn admin-btn-secondary" onClick={handleAddFacility}>
                      Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {formData.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#f3f4f6',
                          padding: '4px 10px',
                          borderRadius: 999,
                          fontSize: 12,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        {fac}
                        <button
                          type="button"
                          onClick={() => handleRemoveFacility(idx)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          <X size={12} color="#9ca3af" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label className="admin-form-label">Status Visibility</label>
                  <select
                    className="admin-select"
                    value={formData.visibility ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value === 'true' })}
                  >
                    <option value="true">Active (Published on website projects showcase)</option>
                    <option value="false">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save size={14} /> Save Project
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
          title="Delete Project"
          message={`Are you sure you want to delete project "${deleteTarget.title}"?`}
          confirmText="Delete Project"
          variant="danger"
          onConfirm={() => {
            deleteProject(deleteTarget.id);
            setDeleteTarget(null);
            showToast('Project deleted successfully', 'danger');
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Media Picker Modal */}
      {mediaPickerTarget && (
        <MediaPickerModal
          isOpen={true}
          title="Choose Project Image"
          onClose={() => setMediaPickerTarget(null)}
          onSelect={(url) => {
            if (mediaPickerTarget === 'main') setFormData({ ...formData, image: url });
            if (mediaPickerTarget === 'secondary') setFormData({ ...formData, secondaryImage: url });
          }}
        />
      )}
    </div>
  );
}
