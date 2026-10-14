import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hallamohana.co.id'),
  title: 'PT Halla Mohana — Hospitality & Lifestyle Destinations',
  description:
    'PT Halla Mohana creates integrated hospitality and lifestyle destinations in Indonesia.',
  openGraph: {
    type: 'website',
    title: 'PT Halla Mohana',
    description: 'Hospitality & Lifestyle Destinations',
    images: [{ url: '/og.png', width: 1733, height: 907, alt: 'PT Halla Mohana — Hospitality & Lifestyle Destinations' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PT Halla Mohana',
    description: 'Hospitality & Lifestyle Destinations',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
