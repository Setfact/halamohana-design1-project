import { ContactBand, PageHero, SectionHeading, Shell } from '../components';
import { imageUrls, leadershipTraits, missions, values } from '@/lib/content';
import { getAbout, missionItems } from '@/services/api';

export const metadata = {
  title: 'About Us — PT Halla Mohana',
  description: 'Discover PT Halla Mohana, our relationship with MahaDasha Group, vision, mission, and values.',
};

export default async function AboutPage() {
  const about = await getAbout().catch(() => null);
  const apiMissions = missionItems(about?.mission);
  const displayedMissions = apiMissions.length ? apiMissions : missions;

  return (
    <Shell active="about">
      <main>
        <PageHero eyebrow="About Halla Mohana" title={about?.title || 'Places with purpose.'} accent={about ? undefined : 'Growth with heart.'} copy={about?.description || 'We build hospitality and lifestyle destinations that feel welcoming, work beautifully, and create sustainable value.'} image={about?.image_url || imageUrls.architecture} />

        <section className="section about-story">
          <div className="container split-story">
            <div><p className="eyebrow"><span /> Our story</p><h2>{about?.title || <>A thoughtful approach to <em>modern hospitality.</em></>}</h2></div>
            <div className="story-copy"><p>{about?.description || 'PT Halla Mohana provides hospitality services that make stays and visits more enjoyable. We create complete, efficient, and easily accessible facilities for business and lifestyle enjoyment.'}</p>{!about && <p>Every project starts with a simple idea: places work better when they genuinely understand the people who use them.</p>}</div>
          </div>
          <div className="container about-image-pair">
            <img src={about?.image_url || imageUrls.hero} alt="Bright and welcoming hospitality interior" />
            <div className="group-card"><span>Member of</span><strong>MAHADASHA</strong><p>A subsidiary of TMT Group, focused on managing a diversified portfolio of businesses with sustainable growth.</p></div>
          </div>
        </section>

        <section className="section vision-page-section" id="vision">
          <div className="container"><SectionHeading eyebrow="Vision & mission" title="A clear direction." accent="A meaningful journey." /></div>
          <div className="container vision-page-grid">
            <article className="vision-feature"><span>Our vision</span><p>{about?.vision || 'Deliver innovative products and services in hospitality business to create a positive return for shareholders.'}</p></article>
            <div className="mission-cards">{displayedMissions.map((mission, index) => <article key={mission}><span>{String(index + 1).padStart(2, '0')}</span><p>{mission}</p></article>)}</div>
          </div>
        </section>

        <section className="section about-values" id="values">
          <div className="container"><SectionHeading eyebrow="Our core values" title="The principles behind" accent="everything we do." copy="They guide how we work, collaborate, and create experiences our guests can trust." /></div>
          <div className="container value-grid about-value-grid">{values.map((value) => <article className="value-card" key={value.title}><span>{value.number}</span><i /><h3>{value.title}</h3><p>{value.copy}</p></article>)}</div>
          <div className="container leadership-block">
            <p className="eyebrow"><span /> Leadership traits</p>
            <div>{leadershipTraits.map((trait, index) => <span key={trait}><b>0{index + 1}</b>{trait}</span>)}</div>
          </div>
        </section>
        <ContactBand />
      </main>
    </Shell>
  );
}
