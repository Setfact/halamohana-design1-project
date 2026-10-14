import { ContactBand, PageHero, SectionHeading, Shell } from '../components';
import { imageUrls } from '@/lib/content';
import { NewsIndex } from './news-client';

export const metadata = {
  title: 'News — PT Halla Mohana',
  description: 'Read official updates, project stories, and corporate news from PT Halla Mohana.',
};

export default function NewsPage() {
  return (
    <Shell active="news">
      <main>
        <PageHero eyebrow="News & insights" title="Stories from" accent="our world." copy="Official updates, project milestones, and perspectives from across Halla Mohana." image={imageUrls.meeting} />
        <section className="section news-page">
          <div className="container"><SectionHeading eyebrow="Latest updates" title="What&apos;s happening" accent="at Halla Mohana." /></div>
          <div className="container"><NewsIndex /></div>
        </section>
        <ContactBand />
      </main>
    </Shell>
  );
}
