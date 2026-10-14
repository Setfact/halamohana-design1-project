import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactBand, Shell } from '@/app/components';
import { projects } from '@/lib/content';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: 'Project — PT Halla Mohana', openGraph: { images: [] }, twitter: { images: [] } };
  return {
    title: `${project.title} — PT Halla Mohana`,
    description: project.description,
    openGraph: { title: project.title, description: project.description, images: [{ url: project.image }] },
    twitter: { card: 'summary_large_image', title: project.title, description: project.description, images: [project.image] },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <Shell active="projects"><main className="not-found"><p className="eyebrow"><span /> Project</p><h1>Destination not found.</h1><Link className="button button-primary" href="/projects">Back to projects</Link></main></Shell>;
  }

  return (
    <Shell active="projects" overlay>
      <main>
        <section className="detail-hero">
          <img src={project.image} alt={project.title} />
          <div className="detail-shade" />
          <div className="container detail-hero-content">
            <p className="eyebrow light"><span /> {project.category} · {project.location}</p>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
          </div>
          <div className="container detail-scroll">Explore destination <span>↓</span></div>
        </section>

        <section className="section project-story">
          <div className="container project-story-grid">
            <div><p className="eyebrow"><span /> The destination</p><h2>Everything you need,<br /><em>thoughtfully connected.</em></h2></div>
            <div><p>{project.longDescription}</p><div className="facility-list">{project.facilities.map((facility) => <span key={facility}>{facility}</span>)}</div></div>
          </div>
          <div className="container project-detail-image"><img src={project.secondaryImage} alt={`Experience at ${project.title}`} loading="lazy" /></div>
        </section>

        <section className="next-project">
          <div className="container">
            <span>Explore another destination</span>
            <Link href={`/projects/${projects.find((item) => item.slug !== slug)?.slug}`}>
              {projects.find((item) => item.slug !== slug)?.title} <b>↗</b>
            </Link>
          </div>
        </section>
        <ContactBand />
      </main>
    </Shell>
  );
}
