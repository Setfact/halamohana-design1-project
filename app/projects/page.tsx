import { ContactBand, PageHero, ProjectCard, SectionHeading, Shell } from '../components';
import { imageUrls, projects } from '@/lib/content';

export const metadata = {
  title: 'Our Projects — PT Halla Mohana',
  description: 'Explore FOX Hotel Pekanbaru and Pekanbaru Xchange, our integrated hospitality and lifestyle destinations.',
};

export default function ProjectsPage() {
  return (
    <Shell active="projects">
      <main>
        <PageHero eyebrow="Our projects" title="One connected vision." accent="Two distinct experiences." copy="Discover destinations designed for the rhythm of business, lifestyle, and leisure in Pekanbaru." image={imageUrls.mallInterior} />
        <section className="section project-list-page">
          <div className="container"><SectionHeading eyebrow="Signature destinations" title="Built around" accent="real life." copy="Each destination has its own character—together, they create a more complete city experience." /></div>
          <div className="container project-grid project-page-grid">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</div>
        </section>
        <section className="integrated-strip">
          <div className="container"><p>Stay</p><span>→</span><p>Meet</p><span>→</span><p>Shop</p><span>→</span><p>Dine</p><span>→</span><p>Enjoy</p></div>
        </section>
        <ContactBand />
      </main>
    </Shell>
  );
}
