import { ContactBand, PageHero, SectionHeading, Shell } from '../components';
import { imageUrls } from '@/lib/content';
import { GalleryGrid } from './gallery-client';

export const metadata = {
  title: 'Gallery — PT Halla Mohana',
  description: 'Explore moments, events, spaces, and milestones from Halla Mohana destinations.',
};

export default function GalleryPage() {
  return (
    <Shell active="gallery">
      <main>
        <PageHero eyebrow="Gallery" title="Spaces, stories," accent="shared moments." copy="A visual journal of the places, people, events, and milestones that shape Halla Mohana." image={imageUrls.event} />
        <section className="section gallery-page">
          <div className="container"><SectionHeading eyebrow="Explore our world" title="A closer look at" accent="life in motion." /></div>
          <div className="container"><GalleryGrid /></div>
        </section>
        <ContactBand />
      </main>
    </Shell>
  );
}
