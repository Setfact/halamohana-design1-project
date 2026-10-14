import { PageHero, SectionHeading, Shell } from '../components';
import { imageUrls } from '@/lib/content';
import { ContactForm } from './contact-form';

export const metadata = {
  title: 'Contact Us — PT Halla Mohana',
  description: 'Contact PT Halla Mohana in Jakarta or Pekanbaru for business, partnership, media, and general enquiries.',
};

export default function ContactPage() {
  return (
    <Shell active="contact">
      <main>
        <PageHero eyebrow="Contact us" title="Let&apos;s start a" accent="conversation." copy="Whether you are exploring a partnership, a project, or simply want to know more, we would love to hear from you." image={imageUrls.city} />
        <section className="section contact-page">
          <div className="container contact-page-grid">
            <div className="contact-details">
              <SectionHeading eyebrow="Get in touch" title="We&apos;re here to" accent="help." />
              <div className="address-list">
                <article><span>01</span><div><strong>Jakarta office</strong><p>Gedung TMT 1, 1st Floor<br />Jl. Cilandak KKO No. 1<br />Jakarta 12560, Indonesia</p></div></article>
                <article><span>02</span><div><strong>Pekanbaru site office</strong><p>Jalan Riau No. 147<br />Pekanbaru, Riau, Indonesia</p></div></article>
                <article><span>03</span><div><strong>Direct contact</strong><p><a href="tel:+622129976700">+62 21 2997 6700</a><br /><a href="mailto:info@hallamohana.co.id">info@hallamohana.co.id</a></p></div></article>
              </div>
            </div>
            <div className="form-panel"><p className="eyebrow"><span /> Send a message</p><h2>How can we help?</h2><ContactForm /></div>
          </div>
        </section>
        <section className="map-section" aria-label="Halla Mohana Jakarta office map">
          <iframe title="Map to Gedung TMT 1" src="https://www.google.com/maps?q=Gedung%20TMT%201%20Cilandak%20Jakarta&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="map-card"><span>Jakarta office</span><strong>Gedung TMT 1</strong><a href="https://maps.google.com/?q=Gedung+TMT+1+Cilandak+Jakarta" target="_blank" rel="noreferrer">Open in Maps ↗</a></div>
        </section>
      </main>
    </Shell>
  );
}
