'use client';

import { useState } from 'react';
import {
  Mail,
  Trash2,
  Eye,
  EyeOff,
  X,
  Phone,
  Calendar,
  Send,
  MessageSquare,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '../components/Toast';
import { DataTable } from '../components/DataTable';
import { ConfirmModal } from '../components/ConfirmModal';
import type { ContactMessage } from '@/lib/admin-types';

export default function ContactUsInboxPage() {
  const {
    contacts,
    deleteContactMessage,
    toggleContactVisibility,
    markContactAsRead,
  } = useAdminStore();
  const { showToast } = useToast();

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      markContactAsRead(msg.id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Contact Us Inquiries (contact_us)</h1>
          <p>Review customer feedback, business partnership proposals, and leasing requests.</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <Mail size={18} color="var(--admin-green)" />
            Inquiries Inbox
          </div>
          <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
            Total Inquiries: {contacts.length}
          </span>
        </div>

        {/* Columns: no, full_name, Phone, Email, create_time, action (delete, visibility) */}
        <DataTable<ContactMessage>
          data={contacts}
          searchKey={(m) => `${m.fullName} ${m.email} ${m.phone} ${m.subject}`}
          searchPlaceholder="Search message by sender name, email, or phone..."
          onDelete={(m) => setDeleteTarget(m)}
          onToggleVisibility={(m) => {
            toggleContactVisibility(m.id);
            showToast(`Inquiry visibility toggled for "${m.fullName}"`, 'success');
          }}
          getVisibility={(m) => m.visibility}
          extraActions={(m) => (
            <button
              type="button"
              className="admin-btn-icon view"
              onClick={() => handleOpenMessage(m)}
              title="Read Full Message"
            >
              <MessageSquare size={14} />
            </button>
          )}
          columns={[
            {
              header: 'No',
              accessorKey: 'no',
              width: '50px',
            },
            {
              header: 'Full Name (full_name)',
              render: (m) => (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {!m.isRead && (
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          backgroundColor: 'var(--admin-coral)',
                          display: 'inline-block',
                        }}
                      />
                    )}
                    <strong>{m.fullName}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                    {m.subject}
                  </div>
                </div>
              ),
            },
            {
              header: 'Phone (Phone)',
              accessorKey: 'phone',
            },
            {
              header: 'Email (Email)',
              render: (m) => (
                <a href={`mailto:${m.email}`} style={{ color: 'var(--admin-green-dark)' }}>
                  {m.email}
                </a>
              ),
            },
            {
              header: 'Create Time (create_time)',
              accessorKey: 'createTime',
            },
          ]}
        />
      </div>

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedMessage(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={18} color="var(--admin-green)" />
                {selectedMessage.subject || 'Inquiry Details'}
              </h3>
              <button type="button" className="admin-modal-close" onClick={() => setSelectedMessage(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Sender Info Bar */}
              <div
                style={{
                  background: '#f9fafb',
                  padding: '14px 18px',
                  borderRadius: 8,
                  marginBottom: 18,
                  border: '1px solid var(--admin-border)',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
                  {selectedMessage.fullName}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13, color: 'var(--admin-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Mail size={13} /> {selectedMessage.email}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Phone size={13} /> {selectedMessage.phone}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Calendar size={13} /> {selectedMessage.createTime}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="admin-form-label" style={{ marginBottom: 8 }}>
                  Message Content:
                </label>
                <div
                  style={{
                    padding: 16,
                    background: '#fff',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 8,
                    lineHeight: 1.7,
                    fontSize: 14,
                    color: 'var(--admin-text-main)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                className="admin-btn admin-btn-primary"
              >
                <Send size={14} /> Reply via Email
              </a>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          title="Delete Inquiry Message"
          message={`Are you sure you want to delete message from "${deleteTarget.fullName}"?`}
          confirmText="Delete Message"
          variant="danger"
          onConfirm={() => {
            deleteContactMessage(deleteTarget.id);
            setDeleteTarget(null);
            showToast('Message deleted', 'danger');
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
