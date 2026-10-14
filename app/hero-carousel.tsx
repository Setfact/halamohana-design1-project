'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Banner } from '@/services/api';

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = banners[activeIndex] ?? banners[0];

  useEffect(() => {
    if (banners.length < 2 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % banners.length), 6000);
    return () => window.clearInterval(timer);
  }, [banners.length, paused]);

  function move(direction: number) {
    setActiveIndex((current) => (current + direction + banners.length) % banners.length);
  }

  return (
    <section
      className="hero"
      id="top"
      aria-roledescription="carousel"
      aria-label="Featured destinations"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <img className="hero-image" src={active.image_url} alt="" key={active.id} />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="hero-content" aria-live="polite">
        <p className="eyebrow light"><span /> Hospitality · Lifestyle · Property</p>
        <h1>{active.title || 'Where hospitality meets possibility.'}</h1>
        <p className="hero-copy">We create integrated destinations designed for memorable stays, urban lifestyles, and meaningful experiences.</p>
        <div className="hero-actions">
          {active.link_url ? (
            <a className="button button-primary" href={active.link_url}>Discover more <span>↗</span></a>
          ) : (
            <Link className="button button-primary" href="/projects">Explore Projects <span>↗</span></Link>
          )}
          <Link className="button button-glass" href="/about">Discover our story <span>↓</span></Link>
        </div>
      </div>
      {banners.length > 1 && (
        <div className="hero-carousel-controls" aria-label="Banner controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous banner">←</button>
          <div className="hero-carousel-dots">
            {banners.map((banner, index) => (
              <button
                type="button"
                key={banner.id}
                className={index === activeIndex ? 'active' : ''}
                aria-label={`Show banner ${index + 1}: ${banner.title}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <button type="button" onClick={() => move(1)} aria-label="Next banner">→</button>
        </div>
      )}
      <div className="hero-meta"><p>Part of</p><strong>MAHADASHA</strong></div>
      <a className="scroll-cue" href="#overview"><span>Scroll</span><i /></a>
    </section>
  );
}
