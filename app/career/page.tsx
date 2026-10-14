import Link from 'next/link';
import { ContactBand, PageHero, SectionHeading, Shell } from '../components';
import { imageUrls, jobs } from '@/lib/content';

export const metadata = {
  title: 'Careers — PT Halla Mohana',
  description: 'Grow your career with PT Halla Mohana and help create meaningful hospitality experiences.',
};

const culture = [
  { number: '01', title: 'Goal oriented', copy: 'We focus our energy on meaningful outcomes and shared success.' },
  { number: '02', title: 'Innovative', copy: 'We welcome better ideas and give people room to explore them.' },
  { number: '03', title: 'Passionate', copy: 'We care deeply about the details that make an experience memorable.' },
  { number: '04', title: 'Positive together', copy: 'We build an environment where people can contribute and thrive.' },
];

export default function CareerPage() {
  return (
    <Shell active="career">
      <main>
        <PageHero eyebrow="Careers" title="Grow with purpose." accent="Create with heart." copy="Bring your talent, curiosity, and ambition to a team building meaningful experiences for Indonesia." image={imageUrls.team} />
        <section className="section career-culture">
          <div className="container"><SectionHeading eyebrow="Life at Halla Mohana" title="Great work starts with" accent="a great environment." copy="We believe people do their best when they feel trusted, challenged, and connected to a clear purpose." /></div>
          <div className="container culture-grid">{culture.map((item) => <article key={item.title}><span>{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
        </section>
        <section className="section openings" id="openings">
          <div className="container"><SectionHeading eyebrow="Open positions" title="Find your next" accent="opportunity." copy="Explore roles where your ideas and energy can make a difference." /></div>
          <div className="container job-list">
            {jobs.map((job) => <article key={job.title}><div><p>{job.department}</p><h3>{job.title}</h3><span>{job.location} · {job.type}</span></div><Link href={`mailto:hr@hallamohana.co.id?subject=Application — ${job.title}`}>Apply now <b>↗</b></Link></article>)}
          </div>
          <div className="container spontaneous-application"><div><strong>Don&apos;t see the right role?</strong><p>We&apos;re always interested in meeting thoughtful, passionate people.</p></div><Link className="button button-outline" href="mailto:hr@hallamohana.co.id?subject=General Application">Send your CV <span>↗</span></Link></div>
        </section>
        <ContactBand />
      </main>
    </Shell>
  );
}
