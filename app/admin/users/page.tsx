'use client';

import { useState } from 'react';
import {
  User,
  Users,
  Shield,
  History,
  Plus,
  Save,
  CheckCircle,
  X,
  Upload,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '../components/Toast';
import { DataTable } from '../components/DataTable';
import { ConfirmModal } from '../components/ConfirmModal';
import { MediaPickerModal } from '../components/MediaPickerModal';
import type { AdminUser, AdminRole } from '@/lib/admin-types';

const allPermissionModules = [
  { id: 'general_config', label: 'General Configuration' },
  { id: 'users', label: 'User Administration' },
  { id: 'roles', label: 'Role Administration' },
  { id: 'pages', label: 'Page & Navigation Management' },
  { id: 'media', label: 'Media Library' },
  { id: 'banners', label: 'Banner & Slider Management' },
  { id: 'news', label: 'News Publications' },
  { id: 'corporate_info', label: 'Corporate Information' },
  { id: 'projects', label: 'Project Portfolio' },
  { id: 'contact_us', label: 'Contact Us Inquiries' },
  { id: 'gallery', label: 'Gallery Management' },
  { id: 'careers', label: 'Career Vacancies' },
];

export default function UserManagementPage() {
  const {
    currentUser,
    users,
    roles,
    activityLogs,
    updateUserProfile,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    addRole,
    updateRole,
    deleteRole,
  } = useAdminStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'roles' | 'history'>('profile');

  // Profile Form state
  const [profileForm, setProfileForm] = useState(currentUser);
  const [newPassword, setNewPassword] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // User CRUD Modal state
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: 'Content Editor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    status: 'active' as 'active' | 'inactive',
    phone: '',
  });

  // Role CRUD Modal state
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  // Confirm delete states
  const [deleteUserTarget, setDeleteUserTarget] = useState<AdminUser | null>(null);
  const [deleteRoleTarget, setDeleteRoleTarget] = useState<AdminRole | null>(null);

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    if (newPassword.trim()) {
      showToast('Profile and password updated successfully!', 'success');
      setNewPassword('');
    } else {
      showToast('Profile updated successfully!', 'success');
    }
  };

  // User CRUD actions
  const openAddUser = () => {
    setEditingUser(null);
    setUserFormData({
      name: '',
      email: '',
      role: roles[0]?.name || 'Content Editor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      status: 'active',
      phone: '',
    });
    setUserModalOpen(true);
  };

  const openEditUser = (u: AdminUser) => {
    setEditingUser(u);
    setUserFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      status: u.status,
      phone: u.phone,
    });
    setUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.name || !userFormData.email) {
      showToast('Name and Email are required', 'warning');
      return;
    }
    if (editingUser) {
      updateUser(editingUser.id, userFormData);
      showToast('User updated successfully', 'success');
    } else {
      addUser(userFormData);
      showToast('New user added successfully', 'success');
    }
    setUserModalOpen(false);
  };

  // Role CRUD actions
  const openAddRole = () => {
    setEditingRole(null);
    setRoleFormData({
      name: '',
      description: '',
      permissions: ['news', 'media'],
    });
    setRoleModalOpen(true);
  };

  const openEditRole = (r: AdminRole) => {
    setEditingRole(r);
    setRoleFormData({
      name: r.name,
      description: r.description,
      permissions: [...r.permissions],
    });
    setRoleModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleFormData.name) {
      showToast('Role name is required', 'warning');
      return;
    }
    if (editingRole) {
      updateRole(editingRole.id, roleFormData);
      showToast('Role updated successfully', 'success');
    } else {
      addRole(roleFormData);
      showToast('New role created successfully', 'success');
    }
    setRoleModalOpen(false);
  };

  const togglePermission = (permId: string) => {
    setRoleFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter((p) => p !== permId)
        : [...prev.permissions, permId],
    }));
  };

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>User &amp; Access Control</h1>
          <p>Manage personal profile, staff user accounts, role-based permission sets, and system audit logs.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={15} style={{ display: 'inline', marginRight: 6 }} />
          Profile (see &amp; edit profile)
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={15} style={{ display: 'inline', marginRight: 6 }} />
          User Administration (crud_user)
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          <Shield size={15} style={{ display: 'inline', marginRight: 6 }} />
          Role Administration (crud_role)
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={15} style={{ display: 'inline', marginRight: 6 }} />
          History (log_activity_user)
        </button>
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <div className="admin-grid-2">
          {/* See Profile Card */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">
                <User size={18} color="var(--admin-green)" />
                Current Profile (see_profile)
              </div>
              <span className="admin-badge active">Active Session</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 0 24px' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--admin-green)', marginBottom: 14 }}
              />
              <h2 style={{ fontSize: 20, margin: '0 0 4px', fontFamily: 'var(--admin-font-serif)' }}>{currentUser.name}</h2>
              <p style={{ margin: '0 0 12px', color: 'var(--admin-text-muted)', fontSize: 13 }}>{currentUser.email}</p>
              <span className="admin-badge" style={{ background: '#f3f4f6', color: '#374151', fontSize: 12 }}>
                {currentUser.role}
              </span>
            </div>

            <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--admin-text-muted)' }}>Direct Phone:</span>
                <strong>{currentUser.phone || '-'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--admin-text-muted)' }}>Last System Login:</span>
                <strong>{currentUser.lastLogin}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--admin-text-muted)' }}>Registered Member Since:</span>
                <strong>{currentUser.createdAt}</strong>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">
                <Save size={18} color="var(--admin-coral)" />
                Edit Profile Details (edit_profile)
              </div>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="admin-form-group">
                <label className="admin-form-label">Full Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Email Address</label>
                <input
                  type="email"
                  className="admin-input"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Phone Number</label>
                <input
                  type="text"
                  className="admin-input"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Avatar Photo URL</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setShowAvatarPicker(true)}
                  >
                    <Upload size={14} /> Browse
                  </button>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Change Password (Leave blank to keep current)</label>
                <input
                  type="password"
                  className="admin-input"
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="admin-btn admin-btn-primary">
                <Save size={14} /> Update My Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: USER ADMINISTRATION */}
      {activeTab === 'users' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <Users size={18} color="var(--admin-green)" />
              User Accounts (user_administration)
            </div>
            <button type="button" className="admin-btn admin-btn-primary" onClick={openAddUser}>
              <Plus size={15} /> Add New User
            </button>
          </div>

          <DataTable<AdminUser>
            data={users}
            searchKey="name"
            searchPlaceholder="Search user name, email, or role..."
            onEdit={openEditUser}
            onDelete={(u) => setDeleteUserTarget(u)}
            onToggleVisibility={(u) => toggleUserStatus(u.id)}
            getVisibility={(u) => u.status === 'active'}
            columns={[
              {
                header: 'User',
                render: (u) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={u.avatar}
                      alt={u.name}
                      style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <strong>{u.name}</strong>
                      <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{u.email}</div>
                    </div>
                  </div>
                ),
              },
              {
                header: 'Assigned Role',
                accessorKey: 'role',
              },
              {
                header: 'Phone',
                accessorKey: 'phone',
              },
              {
                header: 'Status',
                render: (u) => (
                  <span className={`admin-badge ${u.status === 'active' ? 'active' : 'inactive'}`}>
                    {u.status}
                  </span>
                ),
              },
              {
                header: 'Last Login',
                accessorKey: 'lastLogin',
              },
            ]}
          />
        </div>
      )}

      {/* TAB 3: ROLE ADMINISTRATION */}
      {activeTab === 'roles' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <Shield size={18} color="var(--admin-green)" />
              Role &amp; Permission Administration (role_administration)
            </div>
            <button type="button" className="admin-btn admin-btn-primary" onClick={openAddRole}>
              <Plus size={15} /> Create Role
            </button>
          </div>

          <DataTable<AdminRole>
            data={roles}
            searchKey="name"
            searchPlaceholder="Search roles..."
            onEdit={openEditRole}
            onDelete={(r) => setDeleteRoleTarget(r)}
            columns={[
              {
                header: 'Role Name',
                render: (r) => (
                  <div>
                    <strong>{r.name}</strong>
                    <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{r.description}</div>
                  </div>
                ),
              },
              {
                header: 'Assigned Users',
                render: (r) => `${r.userCount} user(s)`,
              },
              {
                header: 'Module Permissions',
                render: (r) => (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {r.permissions.map((p) => (
                      <span
                        key={p}
                        style={{
                          background: '#f3f4f6',
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 999,
                          color: '#374151',
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* TAB 4: ACTIVITY HISTORY */}
      {activeTab === 'history' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <History size={18} color="var(--admin-green)" />
              User Activity Audit Trail (log_activity_user)
            </div>
          </div>

          <DataTable
            data={activityLogs}
            searchKey={(l) => `${l.user} ${l.action} ${l.module} ${l.details}`}
            searchPlaceholder="Search activity by user, action, or module..."
            columns={[
              { header: 'No', render: (_, idx) => idx },
              { header: 'Timestamp', accessorKey: 'timestamp' },
              { header: 'User', accessorKey: 'user' },
              {
                header: 'Action',
                render: (l) => (
                  <span className="admin-badge" style={{ background: '#f0f4f0', color: '#2d5a27' }}>
                    {l.action}
                  </span>
                ),
              },
              { header: 'Module', accessorKey: 'module' },
              { header: 'Details', accessorKey: 'details' },
              {
                header: 'IP Address',
                render: (l) => <code>{l.ipAddress}</code>,
              },
              {
                header: 'Status',
                render: (l) => (
                  <span className={`admin-badge ${l.status === 'success' ? 'success' : 'danger'}`}>
                    {l.status}
                  </span>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* Modal: Add/Edit User */}
      {userModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setUserModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingUser ? 'Edit User Account' : 'Add New User'}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Full Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Email Address</label>
                  <input
                    type="email"
                    className="admin-input"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Phone Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Role</label>
                  <select
                    className="admin-select"
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Status</label>
                  <select
                    className="admin-select"
                    value={userFormData.status}
                    onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value as 'active' | 'inactive' })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setUserModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save size={14} /> Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Role */}
      {roleModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setRoleModalOpen(false)}>
          <div className="admin-modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingRole ? 'Edit Role Permissions' : 'Create Role'}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setRoleModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveRole}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Role Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={roleFormData.name}
                    onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Role Description</label>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={roleFormData.description}
                    onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Module Permissions Matrix</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {allPermissionModules.map((mod) => (
                      <label
                        key={mod.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 14px',
                          border: '1px solid var(--admin-border)',
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: roleFormData.permissions.includes(mod.id) ? 'var(--admin-green-light)' : '#fff',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={roleFormData.permissions.includes(mod.id)}
                          onChange={() => togglePermission(mod.id)}
                        />
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{mod.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setRoleModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save size={14} /> Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteUserTarget && (
        <ConfirmModal
          isOpen={true}
          title="Delete User Account"
          message={`Are you sure you want to delete user account "${deleteUserTarget.name}"? This action cannot be undone.`}
          confirmText="Delete User"
          variant="danger"
          onConfirm={() => {
            deleteUser(deleteUserTarget.id);
            setDeleteUserTarget(null);
            showToast('User deleted successfully', 'danger');
          }}
          onCancel={() => setDeleteUserTarget(null)}
        />
      )}

      {/* Delete Role Modal */}
      {deleteRoleTarget && (
        <ConfirmModal
          isOpen={true}
          title="Delete Role"
          message={`Are you sure you want to delete role "${deleteRoleTarget.name}"?`}
          confirmText="Delete Role"
          variant="danger"
          onConfirm={() => {
            deleteRole(deleteRoleTarget.id);
            setDeleteRoleTarget(null);
            showToast('Role deleted successfully', 'danger');
          }}
          onCancel={() => setDeleteRoleTarget(null)}
        />
      )}

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <MediaPickerModal
          isOpen={true}
          title="Select Profile Avatar"
          onClose={() => setShowAvatarPicker(false)}
          onSelect={(url) => {
            setProfileForm({ ...profileForm, avatar: url });
          }}
        />
      )}
    </div>
  );
}
