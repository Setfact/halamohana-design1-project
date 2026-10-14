import Link from 'next/link';
import { ContactBand, ProjectCard, SectionHeading, Shell } from './components';
import { HeroCarousel } from './hero-carousel';
import { gallery, imageUrls, missions, news, projects, values } from '@/lib/content';
import { getAbout, getBanners, missionItems, type Banner } from '@/services/api';

const fallbackBanner: Banner = {
  id: 'local-hero',
  title: 'Where hospitality meets possibility.',
  image_url: imageUrls.hero,
  is_active: true,
  sort_order: 0,
};

export default async function Home() {
  const [apiBanners, about] = await Promise.all([
    getBanners().catch(() => []),
    getAbout().catch(() => null),
  ]);
  const banners = apiBanners.length ? apiBanners : [fallbackBanner];
  const currentMissions = missionItems(about?.mission);
  const displayedMissions = currentMissions.length ? currentMissions : missions;

  return (
    <Shell active="home" overlay>
      <main>
        <HeroCarousel banners={banners} />

        <section className="overview section" id="overview">
          <div className="container overview-grid">
            <div><p className="eyebrow"><span /> Who we are</p><h2>{about?.title || <>Creating places where<br /><em>people feel at home.</em></>}</h2></div>
            <div className="overview-copy">
              <p>{about?.description || 'PT Halla Mohana provides thoughtfully designed hospitality and lifestyle destinations that bring together comfort, connection, and opportunity.'}</p>
              <Link className="text-link" href="/about">More about us <span>↗</span></Link>
            </div>
          </div>
          <div className="container stats" aria-label="Company highlights">
            <div><strong>2013</strong><span>Established</span></div>
            <div><strong>225</strong><span>Hotel rooms</span></div>
            <div><strong>2</strong><span>Signature projects</span></div>
            <div><strong>1</strong><span>Integrated destination</span></div>
          </div>
        </section>

        <section className="projects section">
          <div className="container">
            <SectionHeading eyebrow="Our destinations" title="Designed for the way" accent="people live today." copy="Two distinctive destinations. One connected vision for Pekanbaru." />
          </div>
          <div className="container project-grid">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</div>
        </section>

        <section className="vision-section section">
          <div className="container vision-grid">
            <div className="vision-statement">
              <p className="eyebrow"><span /> Our direction</p>
              <span className="quote-mark">“</span>
              <h2>{about?.vision || <>Deliver innovative hospitality products and services that create <em>lasting value.</em></>}</h2>
              <p>Our vision</p>
            </div>
            <div className="mission-list">
              <h3>How we move forward</h3>
              {displayedMissions.map((mission, index) => <div key={mission}><span>{String(index + 1).padStart(2, '0')}</span><p>{mission}</p></div>)}
            </div>
          </div>
        </section>

        <section className="values-section section">
          <div className="container"><SectionHeading eyebrow="What guides us" title="Values we live by," accent="every day." copy="Six principles shape our decisions, our partnerships, and every experience we create." /></div>
          <div className="container value-grid">
            {values.map((value) => <article className="value-card" key={value.title}><span>{value.number}</span><i aria-hidden="true" /><h3>{value.title}</h3><p>{value.copy}</p></article>)}
          </div>
          <div className="container centered-link"><Link className="text-link" href="/about#values">Discover our culture <span>↗</span></Link></div>
        </section>

        <section className="gallery-preview section">
          <div className="container"><SectionHeading eyebrow="Life at Halla Mohana" title="Moments that make" accent="a destination." copy="A glimpse of the spaces, people, and experiences that bring our destinations to life." /></div>
          <div className="home-gallery">
            {gallery.slice(0, 5).map((item, index) => (
              <Link className={`home-gallery-item item-${index + 1}`} href="/gallery" key={item.id}>
                <img src={item.image} alt={item.title} loading="lazy" /><span>{item.category}</span>
              </Link>
            ))}
          </div>
          <div className="container centered-link"><Link className="button button-outline" href="/gallery">Explore gallery <span>↗</span></Link></div>
        </section>

        <section className="news-preview section">
          <div className="container"><SectionHeading eyebrow="Latest stories" title="News from" accent="our world." copy="Company updates, project stories, and perspectives from Halla Mohana." /></div>
          <div className="container news-home-grid">
            <Link className="featured-news" href={`/news/${news[1].slug}`}>
              <img src={news[1].image} alt="Pekanbaru Xchange interior" loading="lazy" /><div><p>{news[1].category} · {news[1].date}</p><h3>{news[1].title}</h3><span>Read story ↗</span></div>
            </Link>
            <div className="news-list">
              {[news[0], news[2]].map((item) => <Link href={`/news/${item.slug}`} key={item.slug}><div><p>{item.category} · {item.date}</p><h3>{item.title}</h3></div><span>↗</span></Link>)}
              <Link className="all-news-link" href="/news">View all news <span>↗</span></Link>
            </div>
          </div>
        </section>

        <section className="career-preview">
          <img src={imageUrls.team} alt="A collaborative professional team" loading="lazy" />
          <div className="career-shade" />
          <div className="container career-content">
            <p className="eyebrow light"><span /> Grow with us</p>
            <h2>Do your best work.<br /><em>Make a real impact.</em></h2>
            <p>Join a team that values ideas, growth, and the positive difference we can make together.</p>
            <Link className="button button-primary" href="/career">Explore careers <span>↗</span></Link>
          </div>
        </section>

        <ContactBand />
      </main>
    </Shell>
  );
}
