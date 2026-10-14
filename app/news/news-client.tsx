'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { news } from '@/lib/content';

export function NewsIndex() {
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('All years');
  const years = ['All years', ...Array.from(new Set(news.map((item) => item.year)))];
  const filtered = useMemo(() => news.filter((item) => {
    const matchesSearch = `${item.title} ${item.excerpt} ${item.category}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (year === 'All years' || item.year === year);
  }), [search, year]);

  return (
    <>
      <div className="news-tools">
        <label><span>Search stories</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search news..." /><b>⌕</b></label>
        <label><span>Filter by year</span><select value={year} onChange={(event) => setYear(event.target.value)}>{years.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="news-index-grid">
        {filtered.map((item, index) => (
          <article className={index === 0 ? 'large' : ''} key={item.slug}>
            <Link className="news-image" href={`/news/${item.slug}`}><img src={item.image} alt="" loading="lazy" /><span>↗</span></Link>
            <div><p>{item.category} · {item.date}</p><h2><Link href={`/news/${item.slug}`}>{item.title}</Link></h2><p>{item.excerpt}</p><Link className="text-link" href={`/news/${item.slug}`}>Read more <span>↗</span></Link></div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && <div className="empty-state"><strong>No stories found.</strong><span>Try a different keyword or year.</span></div>}
    </>
  );
}
