'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import type { projects } from '@/lib/content';

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'News', href: '/news' },
  { label: 'Career', href: '/career' },
];

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Halla Mohana home">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span><b>HALLA</b><small>MOHANA</small></span>
    </Link>
  );
}

export function Header({ active = '', overlay = false }: { active?: string; overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const solid = !overlay || scrolled || open;

  return (
    <header className={`site-nav ${solid ? 'nav-solid' : 'nav-overlay'}`}>
      <Brand />
      <nav aria-label="Main navigation">
        {navigation.map((item) => (
          <Link className={active === item.label.toLowerCase() ? 'active' : ''} href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="nav-cta" href="/contact">Contact Us <span>↗</span></Link>
      <button className="menu-button" type="button" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
        <span /><span />
      </button>
      <div className={`mobile-menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div>
          {navigation.map((item, index) => (
            <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
              <small>0{index + 1}</small>{item.label}<span>↗</span>
            </Link>
          ))}
          <Link className="mobile-contact" href="/contact" onClick={() => setOpen(false)}>Let&apos;s talk <span>↗</span></Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-intro">
          <Brand />
          <p>Creating integrated destinations where hospitality, lifestyle, and opportunity come together.</p>
        </div>
        <div className="footer-links">
          <div><strong>Explore</strong><Link href="/about">About us</Link><Link href="/projects">Projects</Link><Link href="/gallery">Gallery</Link></div>
          <div><strong>Connect</strong><Link href="/news">News</Link><Link href="/career">Career</Link><Link href="/contact">Contact</Link></div>
          <div><strong>Visit</strong><p>Gedung TMT 1, 1st Floor<br />Jl. Cilandak KKO No. 1<br />Jakarta 12560</p></div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} PT Halla Mohana. All rights reserved.</p>
        <p>A member of <b>MAHADASHA</b></p>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, accent, copy, image }: { eyebrow: string; title: string; accent?: string; copy: string; image?: string }) {
  return (
    <section className={`page-hero ${image ? 'with-image' : ''}`}>
      {image && <><img src={image} alt="" /><div className="page-hero-shade" /></>}
      <div className="container page-hero-content">
        <p className={`eyebrow ${image ? 'light' : ''}`}><span /> {eyebrow}</p>
        <h1>{title} {accent && <em>{accent}</em>}</h1>
        <p>{copy}</p>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, accent, copy, light = false }: { eyebrow: string; title: string; accent?: string; copy?: string; light?: boolean }) {
  return (
    <div className={`section-heading ${light ? 'light-heading' : ''}`}>
      <div><p className={`eyebrow ${light ? 'light' : ''}`}><span /> {eyebrow}</p><h2>{title} {accent && <em>{accent}</em>}</h2></div>
      {copy && <p>{copy}</p>}
    </div>
  );
}

export function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <article className="project-card">
      <img src={project.image} alt={`${project.title} destination`} loading="lazy" />
      <div className="project-overlay" />
      <div className="project-number">0{index + 1}</div>
      <div className="project-info">
        <p>{project.category} · {project.location}</p>
        <h3>{project.title}</h3>
        <Link href={`/projects/${project.slug}`}>View project <span>↗</span></Link>
      </div>
    </article>
  );
}

export function ContactBand() {
  return (
    <section className="contact-band">
      <div className="contact-orb" aria-hidden="true" />
      <div className="container contact-band-inner">
        <div><p className="eyebrow light"><span /> Start a conversation</p><h2>Let&apos;s create something<br /><em>meaningful together.</em></h2></div>
        <Link className="round-link" href="/contact"><span>Contact us</span><b>↗</b></Link>
      </div>
    </section>
  );
}

export function Shell({ children, active, overlay = false }: { children: ReactNode; active?: string; overlay?: boolean }) {
  return <><Header active={active} overlay={overlay} />{children}<Footer /></>;
}
