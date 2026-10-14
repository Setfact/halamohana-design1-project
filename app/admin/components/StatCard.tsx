'use client';

import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: string | number;
  subtext?: string;
  icon: ReactNode;
  variant?: 'green' | 'coral' | 'pink' | 'charcoal';
};

export function StatCard({ label, value, subtext, icon, variant = 'green' }: StatCardProps) {
  return (
    <div className="admin-stat-card">
      <div>
        <div className="admin-stat-label">{label}</div>
        <div className="admin-stat-value">{value}</div>
        {subtext && <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 4 }}>{subtext}</div>}
      </div>
      <div className={`admin-stat-icon ${variant}`}>{icon}</div>
    </div>
  );
}
