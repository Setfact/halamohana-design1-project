'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Upload,
  Globe,
  Calendar,
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '../../components/Toast';
import { RichTextEditor } from '../../components/RichTextEditor';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export default function CreateNewsPage() {
  const router = useRouter();
  const { addNews } = useAdminStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    category: 'Corporate Governance',
    excerpt: '',
    description: '<h3>Article Subheading</h3><p>Start writing the news announcement details here...</p>',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=88',
    visibility: true,
  });

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Auto generate slug from title
  const handleTitleChange = (newTitle: string) => {
    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      url: prev.url === '' || prev.url === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') ? slug : prev.url,
    }));
  };

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

    addNews({
      title: formData.title.trim(),
      url: formData.url.trim(),
      date: formData.date,
      category: formData.category,
      excerpt: formData.excerpt.trim() || formData.title,
      description: formData.description,
      image: formData.image,
      visibility: formData.visibility,
    });

    showToast('News article published successfully!', 'success');
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
            <h1>Create News Article (create_news)</h1>
            <p>Compose and publish a new story with full Word-style rich text capabilities.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/news" className="admin-btn admin-btn-secondary">
            Cancel
          </Link>
          <button type="button" className="admin-btn admin-btn-primary" onClick={handleSubmit}>
            <Save size={15} /> Publish Article
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
                  placeholder="e.g. Halla Mohana Unveils New Milestone at Pekanbaru Xchange"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
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
                  WYSIWYG Toolbar Active
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
                <label className="admin-form-label">Excerpt / Summary (Brief overview for news cards)</label>
                <textarea
                  rows={3}
                  className="admin-textarea"
                  placeholder="Short introductory summary for homepage & news list teasers..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar: Date, Category, Featured Image, Visibility */}
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
                  placeholder="e.g. 18 August 2026"
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
                  placeholder="Or enter direct image URL"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', padding: '12px' }}>
              <Save size={15} /> Save &amp; Publish Story
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
