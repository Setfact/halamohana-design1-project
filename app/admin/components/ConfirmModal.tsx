'use client';

import { AlertTriangle, X } from 'lucide-react';

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div
        className="admin-modal"
        style={{ maxWidth: 440 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {variant === 'danger' && <AlertTriangle size={20} color="#d94a7a" />}
            {variant === 'warning' && <AlertTriangle size={20} color="#f28b50" />}
            {title}
          </h3>
          <button type="button" className="admin-modal-close" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>
        <div className="admin-modal-body">
          <p style={{ margin: 0, fontSize: 14, color: 'var(--admin-text-muted)', lineHeight: 1.6 }}>
            {message}
          </p>
        </div>
        <div className="admin-modal-footer">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`admin-btn ${variant === 'danger' ? 'admin-btn-danger' : 'admin-btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
