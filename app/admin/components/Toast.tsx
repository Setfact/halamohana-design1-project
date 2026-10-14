'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'warning' | 'danger';

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="admin-toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`admin-toast ${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} color="#7dbb4f" />}
            {toast.type === 'warning' && <AlertTriangle size={18} color="#f28b50" />}
            {toast.type === 'danger' && <AlertCircle size={18} color="#d94a7a" />}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 8 }}
            >
              <X size={15} color="#9ca3af" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
