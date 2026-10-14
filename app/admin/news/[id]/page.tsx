'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Upload,
  Globe,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '../../components/Toast';
import { RichTextEditor } from '../../components/RichTextEditor';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { news, updateNews } = useAdminStore();
  const { showToast } = useToast();

  const newsItem = news.find((n) => n.id === id);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    date: '',
    category: 'Corporate Governance',
    excerpt: '',
    description: '',
    image: '',
    visibility: true,
  });

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => {
    if (newsItem) {
      setFormData({
        title: newsItem.title,
        url: newsItem.url,
        date: newsItem.date,
        category: newsItem.category,
        excerpt: newsItem.excerpt,
        description: newsItem.description,
        image: newsItem.image,
        visibility: newsItem.visibility,
      });
    }
  }, [newsItem]);

  if (!newsItem) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>News Article Not Found</h2>
        <p style={{ color: 'var(--admin-text-muted)' }}>The requested article does not exist or was deleted.</p>
        <Link href="/admin/news" className="admin-btn admin-btn-primary" style={{ marginTop: 14 }}>
          Return to News Management
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Article title is required', 'warning');
      return;
    }
    if (!formData.url.trim()) {
      showToast('Article URL slug is required', 'warning');
      return;
    }

    updateNews(id, formData);
    showToast('Article changes saved successfully!', 'success');
    router.push('/admin/news');
  };

  return (
    <div>
      {/* Top Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/admin/news" className="admin-btn-icon" title="Back to News List">
            <ArrowLeft size={16} />
          </Link>
          <div className="admin-page-title-group">
            <h1>Edit News Article (edit_news)</h1>
            <p>Modify article copy, publication date, URL slug, and rich text formatting.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href={`/news/${newsItem.url}`}
            target="_blank"
            className="admin-btn admin-btn-secondary"
          >
            <ExternalLink size={14} /> Preview Live
          </Link>
          <button type="button" className="admin-btn admin-btn-primary" onClick={handleSubmit}>
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-grid-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
          {/* Main Column: Title, Word Editor, Excerpt */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Title (title) */}
            <div className="admin-card" style={{ padding: 20 }}>
              <div className="admin-form-group" style={{ marginBottom: 14 }}>
                <label className="admin-form-label">Article Title (title)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ fontSize: 16, fontWeight: 600, padding: '12px 16px' }}
                  required
                />
              </div>

              {/* URL Slug (url) */}
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-form-label">Slug URL Address (url)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>https://hallamohana.co.id/news/</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Word-like Editor: description (full features like word edit) */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title">
                  Description / Article Body (full features like word edit)
                </div>
                <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                  Word-style WYSIWYG
                </span>
              </div>

              <RichTextEditor
                value={formData.description}
                onChange={(html) => setFormData({ ...formData, description: html })}
                placeholder="Write full article body content..."
                minHeight="360px"
              />
            </div>

            {/* Short Excerpt */}
            <div className="admin-card">
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-form-label">Excerpt / Summary</label>
                <textarea
                  rows={3}
                  className="admin-textarea"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Date, Category, Featured Image, Visibility */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Publishing Settings */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title" style={{ fontSize: 15 }}>
                  <Calendar size={16} color="var(--admin-green)" />
                  Publication Settings
                </div>
              </div>

              {/* Date (date) */}
              <div className="admin-form-group">
                <label className="admin-form-label">Publication Date (date)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              {/* Category */}
              <div className="admin-form-group">
                <label className="admin-form-label">Category</label>
                <select
                  className="admin-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Corporate Governance">Corporate Governance</option>
                  <option value="Projects">Projects</option>
                  <option value="People & Culture">People &amp; Culture</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Sustainability">Sustainability</option>
                </select>
              </div>

              {/* Visibility */}
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-form-label">Publishing Visibility</label>
                <select
                  className="admin-select"
                  value={formData.visibility ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value === 'true' })}
                >
                  <option value="true">Published (Public on Website)</option>
                  <option value="false">Draft (Hidden from Public)</option>
                </select>
              </div>
            </div>

            {/* Featured Image */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title" style={{ fontSize: 15 }}>
                  <Globe size={16} color="var(--admin-coral)" />
                  Featured Thumbnail Image
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ height: 160, borderRadius: 8, overflow: 'hidden', background: '#f3f4f6', marginBottom: 10 }}>
                  <img
                    src={formData.image}
                    alt="Featured preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  style={{ width: '100%' }}
                  onClick={() => setMediaPickerOpen(true)}
                >
                  <Upload size={14} /> Select from Media Library
                </button>
              </div>

              <div className="admin-form-group" style={{ margin: 0 }}>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
            </div>

            {/* Submit Action */}
            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', padding: '12px' }}>
              <Save size={15} /> Save Changes
            </button>
          </div>
        </div>
      </form>

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={true}
          title="Choose Featured Image"
          onClose={() => setMediaPickerOpen(false)}
          onSelect={(url) => setFormData({ ...formData, image: url })}
        />
      )}
    </div>
  );
}
