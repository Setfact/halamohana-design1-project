export const imageUrls = {
  hero: 'https://images.unsplash.com/photo-1742844551986-de16fd4682c3?auto=format&fit=crop&w=2200&q=90',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=88',
  hotelPool: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1800&q=88',
  mall: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=88',
  mallInterior: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1800&q=88',
  architecture: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=88',
  team: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=88',
  meeting: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=88',
  dining: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=88',
  event: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=88',
  city: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1800&q=88',
  construction: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=88',
};

export const values = [
  { number: '01', title: 'Integrity', copy: 'Doing what is right, consistently and transparently.' },
  { number: '02', title: 'Continuous Development', copy: 'Always learning, improving, and creating room to grow.' },
  { number: '03', title: 'Excellence', copy: 'Delivering thoughtful quality in every guest experience.' },
  { number: '04', title: 'Proactive', copy: 'Seeing possibilities early and moving with purpose.' },
  { number: '05', title: 'Accountability', copy: 'Owning our decisions, outcomes, and commitments.' },
  { number: '06', title: 'Teamwork', copy: 'Growing stronger through trust and collaboration.' },
];

export const missions = [
  'Create meaningful and challenging job opportunities for Indonesians.',
  'Ensure sustainable, profitable growth that maximizes shareholder value.',
  'Provide value-added solutions that optimize customer satisfaction.',
  'Actively engage within communities as a good corporate citizen.',
];

export const projects = [
  {
    id: 1,
    title: 'FOX Hotel Pekanbaru',
    slug: 'fox-hotel-pekanbaru',
    category: 'Hospitality',
    location: 'Jalan Riau, Pekanbaru',
    description: 'A contemporary midscale hotel for smart stays, directly connected to Pekanbaru Xchange.',
    longDescription: 'FOX Hotel Pekanbaru is strategically located on Jalan Riau, approximately 30 minutes from Sultan Syarif Kasim II Airport. Designed for business travellers, families, and modern city explorers, the hotel brings comfort and convenience into one connected destination.',
    image: imageUrls.hotel,
    secondaryImage: imageUrls.hotelPool,
    facilities: ['225 Rooms', 'Gym', 'Spa', 'Restaurant', 'Indoor Rooftop Sky Pool'],
  },
  {
    id: 2,
    title: 'Pekanbaru Xchange',
    slug: 'pekanbaru-xchange',
    category: 'Lifestyle Destination',
    location: 'Pekanbaru Business District',
    description: 'A modern destination for shopping, dining, entertainment, business, and leisure.',
    longDescription: "Pekanbaru Xchange is a modern lifestyle and entertainment mall in the heart of Pekanbaru's business district. Physically connected to FOX Hotel Pekanbaru, it creates a seamless experience where retail, dining, business, and leisure come together.",
    image: imageUrls.mall,
    secondaryImage: imageUrls.mallInterior,
    facilities: ['Retail', 'Dining', 'Entertainment', 'Events', 'Direct Hotel Access'],
  },
];

export const gallery = [
  { id: 1, title: 'A warm welcome', category: 'FOX Hotel', image: imageUrls.hero, size: 'tall' },
  { id: 2, title: 'Lifestyle, connected', category: 'Mall Events', image: imageUrls.mall, size: 'wide' },
  { id: 3, title: 'Shared moments', category: 'Mall Events', image: imageUrls.event, size: 'standard' },
  { id: 4, title: 'Restful spaces', category: 'FOX Hotel', image: imageUrls.hotel, size: 'standard' },
  { id: 5, title: 'The journey begins', category: 'Ground Breaking', image: imageUrls.construction, size: 'tall' },
  { id: 6, title: 'Building the future', category: 'Underconstruction', image: imageUrls.architecture, size: 'standard' },
  { id: 7, title: 'A place to gather', category: 'FOX Hotel', image: imageUrls.dining, size: 'wide' },
  { id: 8, title: 'Urban energy', category: 'Underconstruction', image: imageUrls.city, size: 'standard' },
];

export const news = [
  {
    id: 1,
    title: 'Whistle Blowing System',
    slug: 'whistle-blowing-system',
    category: 'Corporate Governance',
    date: '02 December 2022',
    year: '2022',
    excerpt: 'Our commitment to conducting business professionally, transparently, and in line with good corporate governance.',
    image: imageUrls.architecture,
    content: [
      'PT Halla Mohana is committed to conducting business professionally and in accordance with good corporate governance principles.',
      'The Whistle Blowing System provides a trusted channel for reporting suspected violations while supporting confidentiality, fairness, and responsible follow-up.',
      'Every report is handled with care and reviewed according to applicable company policies and regulations.',
    ],
  },
  {
    id: 2,
    title: 'Building Connected Experiences in Pekanbaru',
    slug: 'building-connected-experiences',
    category: 'Projects',
    date: '18 August 2026',
    year: '2026',
    excerpt: 'How FOX Hotel and Pekanbaru Xchange work together as one integrated hospitality and lifestyle destination.',
    image: imageUrls.mallInterior,
    content: [
      'Great destinations feel effortless. At Pekanbaru Xchange, a direct connection to FOX Hotel brings stays, meetings, shopping, dining, and leisure into one convenient address.',
      'This integrated approach reflects Halla Mohana’s belief that thoughtful places can make city life more enjoyable and create lasting value for communities.',
    ],
  },
  {
    id: 3,
    title: 'Hospitality with a Human Touch',
    slug: 'hospitality-with-a-human-touch',
    category: 'People & Culture',
    date: '06 July 2026',
    year: '2026',
    excerpt: 'The people and principles behind meaningful stays, welcoming spaces, and memorable everyday moments.',
    image: imageUrls.team,
    content: [
      'Hospitality begins with people. Our teams combine professional standards with genuine care to create experiences that feel warm, personal, and dependable.',
      'We invest in continuous development so every team member can grow, contribute, and bring Halla Mohana’s values to life.',
    ],
  },
];

export const jobs = [
  { title: 'Marketing Communication Staff', location: 'Pekanbaru', type: 'Full-time', department: 'Marketing' },
  { title: 'Guest Experience Supervisor', location: 'Pekanbaru', type: 'Full-time', department: 'Hospitality' },
];

export const leadershipTraits = ['Competent', 'Visionary', 'Inspiring', 'Self-Actualizing', 'Honest & Humble'];
