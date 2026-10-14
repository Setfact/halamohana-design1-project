import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactBand, Shell } from '@/app/components';
import { news } from '@/lib/content';

export function generateStaticParams() {
  return news.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = news.find((item) => item.slug === slug);
  if (!article) return { title: 'News — PT Halla Mohana', openGraph: { images: [] }, twitter: { images: [] } };
  return {
    title: `${article.title} — PT Halla Mohana`, description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, images: [{ url: article.image }] },
    twitter: { card: 'summary_large_image', title: article.title, description: article.excerpt, images: [article.image] },
  };
}

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = news.find((item) => item.slug === slug);
  if (!article) return <Shell active="news"><main className="not-found"><p className="eyebrow"><span /> News</p><h1>Story not found.</h1><Link className="button button-primary" href="/news">Back to news</Link></main></Shell>;

  return (
    <Shell active="news">
      <main className="article-page">
        <section className="article-head">
          <div className="container narrow"><p className="eyebrow"><span /> {article.category}</p><h1>{article.title}</h1><p>{article.excerpt}</p><div><span>{article.date}</span><b>PT Halla Mohana</b></div></div>
        </section>
        <div className="container article-image"><img src={article.image} alt="" /></div>
        <article className="container article-body">
          {article.content.map((paragraph, index) => index === 0 ? <p className="lead" key={paragraph}>{paragraph}</p> : <p key={paragraph}>{paragraph}</p>)}
          <div className="article-rule" />
          <Link className="text-link" href="/news">← Back to all news</Link>
        </article>
        <ContactBand />
      </main>
    </Shell>
  );
}
