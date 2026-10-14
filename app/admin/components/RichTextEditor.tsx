'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Code,
  Eye,
  Edit3,
  RemoveFormatting,
} from 'lucide-react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  minHeight = '320px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  };

  const execute = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      handleInput();
    }
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL link (e.g. https://... or /projects):');
    if (url) {
      execute('createLink', url);
    }
  };

  const handleInsertImage = () => {
    const url = prompt('Enter image URL or select from media library:');
    if (url) {
      execute('insertImage', url);
    }
  };

  return (
    <div className="admin-rte-container">
      {/* Word-like Editor Toolbar */}
      <div className="admin-rte-toolbar">
        {/* Undo / Redo */}
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('undo')}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('redo')}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={15} />
        </button>

        <div className="admin-rte-separator" />

        {/* Headings */}
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('formatBlock', '<h1>')}
          title="Heading 1"
        >
          <Heading1 size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('formatBlock', '<h2>')}
          title="Heading 2"
        >
          <Heading2 size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('formatBlock', '<h3>')}
          title="Heading 3"
        >
          <Heading3 size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('formatBlock', '<p>')}
          title="Normal Paragraph"
        >
          P
        </button>

        <div className="admin-rte-separator" />

        {/* Text Formats */}
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('underline')}
          title="Underline (Ctrl+U)"
        >
          <Underline size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('strikeThrough')}
          title="Strikethrough"
        >
          <Strikethrough size={15} />
        </button>

        <div className="admin-rte-separator" />

        {/* Alignment */}
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('justifyLeft')}
          title="Align Left"
        >
          <AlignLeft size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('justifyCenter')}
          title="Align Center"
        >
          <AlignCenter size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('justifyRight')}
          title="Align Right"
        >
          <AlignRight size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('justifyFull')}
          title="Justify"
        >
          <AlignJustify size={15} />
        </button>

        <div className="admin-rte-separator" />

        {/* Lists & Quotes */}
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('insertUnorderedList')}
          title="Bulleted List"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('formatBlock', '<blockquote>')}
          title="Quote"
        >
          <Quote size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('formatBlock', '<pre>')}
          title="Code Block"
        >
          <Code size={15} />
        </button>

        <div className="admin-rte-separator" />

        {/* Links & Media */}
        <button
          type="button"
          className="admin-rte-btn"
          onClick={handleInsertLink}
          title="Insert Hyperlink"
        >
          <LinkIcon size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={handleInsertImage}
          title="Insert Image"
        >
          <ImageIcon size={15} />
        </button>
        <button
          type="button"
          className="admin-rte-btn"
          onClick={() => execute('removeFormat')}
          title="Clear Formatting"
        >
          <RemoveFormatting size={15} />
        </button>

        <div className="admin-rte-separator" style={{ marginLeft: 'auto' }} />

        {/* Preview / Edit Toggle */}
        <button
          type="button"
          className={`admin-rte-btn ${isPreview ? 'active' : ''}`}
          onClick={() => setIsPreview(!isPreview)}
          title={isPreview ? 'Back to Editor' : 'Preview HTML'}
          style={{ gap: 5, padding: '4px 10px' }}
        >
          {isPreview ? <Edit3 size={14} /> : <Eye size={14} />}
          <span style={{ fontSize: 11, fontWeight: 600 }}>{isPreview ? 'Edit' : 'Preview'}</span>
        </button>
      </div>

      {/* Editor Body or Preview Body */}
      {isPreview ? (
        <div
          className="admin-rte-content"
          style={{ minHeight, background: '#fafafa' }}
          dangerouslySetInnerHTML={{ __html: value || '<p style="color:#9ca3af">No content yet.</p>' }}
        />
      ) : (
        <div
          ref={editorRef}
          className="admin-rte-content"
          contentEditable
          onInput={handleInput}
          style={{ minHeight }}
          data-placeholder={placeholder}
        />
      )}
    </div>
  );
}
