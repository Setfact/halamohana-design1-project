'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Newspaper,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '../components/Toast';
import { DataTable } from '../components/DataTable';
import { ConfirmModal } from '../components/ConfirmModal';
import type { NewsItem } from '@/lib/admin-types';

export default function ManageNewsPage() {
  const { news, deleteNews, toggleNewsVisibility } = useAdminStore();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>News &amp; Editorial Management</h1>
          <p>Publish corporate announcements, project milestones, press releases, and governance disclosures.</p>
        </div>
        <Link href="/admin/news/create" className="admin-btn admin-btn-primary">
          <Plus size={15} /> Create News Article
        </Link>
      </div>

      {/* News Management Table (manage_news) */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <Newspaper size={18} color="var(--admin-green)" />
            Manage News (manage_news)
          </div>
          <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
            Total Articles: {news.length}
          </span>
        </div>

        <DataTable<NewsItem>
          data={news}
          searchKey="title"
          searchPlaceholder="Search news by title or slug..."
          onToggleVisibility={(item) => {
            toggleNewsVisibility(item.id);
            showToast(`Visibility updated for "${item.title}"`, 'success');
          }}
          getVisibility={(item) => item.visibility}
          onDelete={(item) => setDeleteTarget(item)}
          extraActions={(item) => (
            <>
              <Link
                href={`/admin/news/${item.id}`}
                className="admin-btn-icon edit"
                title="Edit News (full features like word edit)"
              >
                <Edit size={14} />
              </Link>
              <Link
                href={`/news/${item.url}`}
                target="_blank"
                className="admin-btn-icon"
                title="View live article"
              >
                <ExternalLink size={14} />
              </Link>
            </>
          )}
          columns={[
            {
              header: 'No',
              accessorKey: 'no',
              width: '50px',
            },
            {
              header: 'Date',
              accessorKey: 'date',
              width: '130px',
            },
            {
              header: 'Title',
              render: (item) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }}
                  />
                  <div>
                    <strong style={{ fontSize: 13.5 }}>{item.title}</strong>
                    <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                      Category: {item.category}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              header: 'URL (Slug)',
              render: (item) => <code>/news/{item.url}</code>,
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
                  {item.visibility ? 'Published' : 'Draft'}
                </span>
              ),
            },
          ]}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          title="Delete News Article"
          message={`Are you sure you want to permanently delete article "${deleteTarget.title}"?`}
          confirmText="Delete Article"
          variant="danger"
          onConfirm={() => {
            deleteNews(deleteTarget.id);
            setDeleteTarget(null);
            showToast('News article deleted', 'danger');
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
