'use client';

import { useEffect, useState } from 'react';
import { gallery } from '@/lib/content';

const categories = ['All', ...Array.from(new Set(gallery.map((item) => item.category)))];

export function GalleryGrid() {
  const [active, setActive] = useState('All');
  const [selected, setSelected] = useState<(typeof gallery)[number] | null>(null);
  const items = active === 'All' ? gallery : gallery.filter((item) => item.category === active);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [selected]);

  return (
    <>
      <div className="gallery-filters" role="group" aria-label="Filter gallery by category">
        {categories.map((category) => <button className={active === category ? 'active' : ''} type="button" onClick={() => setActive(category)} key={category}>{category}</button>)}
      </div>
      <div className="gallery-masonry">
        {items.map((item) => (
          <button className={`gallery-tile ${item.size}`} type="button" onClick={() => setSelected(item)} key={item.id} aria-label={`Open ${item.title}`}>
            <img src={item.image} alt={item.title} loading="lazy" />
            <span><small>{item.category}</small><b>{item.title}</b></span>
          </button>
        ))}
      </div>
      {items.length === 0 && <div className="empty-state">No items available at the moment.</div>}
      {selected && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onMouseDown={(event) => event.currentTarget === event.target && setSelected(null)}>
          <button type="button" onClick={() => setSelected(null)} aria-label="Close image">×</button>
          <img src={selected.image} alt={selected.title} />
          <div><small>{selected.category}</small><strong>{selected.title}</strong></div>
        </div>
      )}
    </>
  );
}
