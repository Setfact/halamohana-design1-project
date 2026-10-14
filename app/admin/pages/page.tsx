'use client';

import { useState } from 'react';
import {
  Layers,
  Plus,
  Save,
  X,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '../components/Toast';
import { DataTable } from '../components/DataTable';
import { ConfirmModal } from '../components/ConfirmModal';
import type { PageMenuItem } from '@/lib/admin-types';

export default function PageAdministrationPage() {
  const {
    pages,
    addPageMenu,
    updatePageMenu,
    deletePageMenu,
    togglePageMenuVisibility,
  } = useAdminStore();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PageMenuItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    navigation: '',
    visibility: true,
  });
  const [deleteTarget, setDeleteTarget] = useState<PageMenuItem | null>(null);

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ title: '', navigation: '/', visibility: true });
    setModalOpen(true);
  };

  const openEdit = (item: PageMenuItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      navigation: item.navigation,
      visibility: item.visibility,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.navigation.trim()) {
      showToast('Title and Navigation URL are required', 'warning');
      return;
    }

    if (editingItem) {
      updatePageMenu(editingItem.id, formData);
      showToast('Page menu item updated', 'success');
    } else {
      addPageMenu(formData);
      showToast('New page menu added', 'success');
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Page Administration</h1>
          <p>Manage site navigation structure, public navbar items, and visibility controls.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openAdd}>
          <Plus size={15} /> Add Menu Item
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <Layers size={18} color="var(--admin-green)" />
            Header Navigation Menu (menu_for_navbar_etc)
          </div>
          <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
            Total Items: {pages.length}
          </span>
        </div>

        <DataTable<PageMenuItem>
          data={pages}
          searchKey="title"
          searchPlaceholder="Search menu item title or url..."
          onEdit={openEdit}
          onDelete={(item) => setDeleteTarget(item)}
          onToggleVisibility={(item) => {
            togglePageMenuVisibility(item.id);
            showToast(`Visibility updated for "${item.title}"`, 'success');
          }}
          getVisibility={(item) => item.visibility}
          columns={[
            {
              header: 'No',
              accessorKey: 'no',
              width: '60px',
            },
            {
              header: 'Title',
              render: (item) => (
                <div>
                  <strong>{item.title}</strong>
                  {item.isFixed && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 10,
                        background: '#f3f4f6',
                        padding: '2px 6px',
                        borderRadius: 4,
                        color: '#6b7280',
                      }}
                    >
                      System Fixed
                    </span>
                  )}
                </div>
              ),
            },
            {
              header: 'Navigation',
              render: (item) => <code>{item.navigation}</code>,
            },
            {
              header: 'Created Time',
              accessorKey: 'createdTime',
            },
            {
              header: 'Updated',
              accessorKey: 'updated',
            },
            {
              header: 'Visibility',
              render: (item) => (
                <span className={`admin-badge ${item.visibility ? 'visible' : 'hidden'}`}>
                  {item.visibility ? 'Visible on Nav' : 'Hidden'}
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
              <h3>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Menu Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Sustainability"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Navigation URL (Path or External Link)</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. /sustainability or https://..."
                    value={formData.navigation}
                    onChange={(e) => setFormData({ ...formData, navigation: e.target.value })}
                    required
                  />
                  <div className="admin-form-help">
                    Use relative URLs like <code>/about</code> or full external links.
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Navbar Visibility</label>
                  <select
                    className="admin-select"
                    value={formData.visibility ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value === 'true' })}
                  >
                    <option value="true">Visible (Displayed in main header nav)</option>
                    <option value="false">Hidden (Draft / Hidden from main navbar)</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save size={14} /> Save Menu Item
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
          title="Delete Page Menu Item"
          message={`Are you sure you want to remove "${deleteTarget.title}" from site navigation?`}
          confirmText="Delete Menu Item"
          variant="danger"
          onConfirm={() => {
            deletePageMenu(deleteTarget.id);
            setDeleteTarget(null);
            showToast('Menu item removed', 'danger');
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
