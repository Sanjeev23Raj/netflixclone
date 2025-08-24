// Mock catalog data with posters/backdrops/videos in assets

export const catalog = [
  {
    id: 'm001',
    title: 'The Last Signal',
    year: 2021,
    rating: 'PG-13',
    durationMin: 108,
    categories: ['Trending', 'Popular', 'Sci-Fi'],
    description: 'A lone engineer receives a mysterious signal that could save humanity.',
    poster: '/workspace/netflux/assets/posters/poster1.jpg',
    backdrop: '/workspace/netflux/assets/backdrops/backdrop1.jpg',
    video: '/workspace/netflux/assets/videos/sample1.mp4'
  },
  {
    id: 'm002',
    title: 'Echoes of Dawn',
    year: 2023,
    rating: 'PG',
    durationMin: 96,
    categories: ['Trending', 'Drama'],
    description: 'An aspiring musician finds her voice in a small seaside town.',
    poster: '/workspace/netflux/assets/posters/poster2.jpg',
    backdrop: '/workspace/netflux/assets/backdrops/backdrop2.jpg',
    video: '/workspace/netflux/assets/videos/sample2.mp4'
  },
  {
    id: 'm003',
    title: 'Riftwalkers',
    year: 2020,
    rating: 'TV-14',
    durationMin: 52,
    categories: ['Popular', 'Series', 'Sci-Fi'],
    description: 'Dimension-hopping agents face paradoxes and peril.',
    poster: '/workspace/netflux/assets/posters/poster3.jpg',
    backdrop: '/workspace/netflux/assets/backdrops/backdrop3.jpg',
    video: '/workspace/netflux/assets/videos/sample3.mp4'
  },
  {
    id: 'm004',
    title: 'Timberline',
    year: 2019,
    rating: 'PG',
    durationMin: 88,
    categories: ['Drama'],
    description: 'A father and daughter rebuild their lives among the pines.',
    poster: '/workspace/netflux/assets/posters/poster4.jpg',
    backdrop: '/workspace/netflux/assets/backdrops/backdrop4.jpg',
    video: '/workspace/netflux/assets/videos/sample1.mp4'
  },
  {
    id: 'm005',
    title: 'Orbital Daydream',
    year: 2022,
    rating: 'PG',
    durationMin: 101,
    categories: ['Trending', 'Family'],
    description: 'Two kids befriend a homesick satellite.',
    poster: '/workspace/netflux/assets/posters/poster5.jpg',
    backdrop: '/workspace/netflux/assets/backdrops/backdrop5.jpg',
    video: '/workspace/netflux/assets/videos/sample2.mp4'
  },
  {
    id: 'm006',
    title: 'Neon Alley',
    year: 2018,
    rating: 'TV-MA',
    durationMin: 44,
    categories: ['Popular', 'Action'],
    description: 'A gritty detective hunts truth in a city of lights.',
    poster: '/workspace/netflux/assets/posters/poster6.jpg',
    backdrop: '/workspace/netflux/assets/backdrops/backdrop6.jpg',
    video: '/workspace/netflux/assets/videos/sample3.mp4'
  },
  {
    id: 'm007',
    title: 'Starlit Shores',
    year: 2017,
    rating: 'PG',
    durationMin: 93,
    categories: ['Family', 'Drama'],
    description: 'A magical summer changes everything for three friends.',
    poster: '/workspace/netflux/assets/posters/poster7.jpg',
    backdrop: '/workspace/netflux/assets/backdrops/backdrop7.jpg',
    video: '/workspace/netflux/assets/videos/sample1.mp4'
  },
  {
    id: 'm008',
    title: 'Clockwork Orchard',
    year: 2024,
    rating: 'PG-13',
    durationMin: 110,
    categories: ['Trending', 'Action'],
    description: 'An ex-inventor must save her town from a rogue automaton.',
    poster: '/workspace/netflux/assets/posters/poster8.jpg',
    backdrop: '/workspace/netflux/assets/backdrops/backdrop8.jpg',
    video: '/workspace/netflux/assets/videos/sample2.mp4'
  }
];

export function getByCategory(name) {
  return catalog.filter(m => m.categories.includes(name));
}

export function searchCatalog(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return catalog.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.description.toLowerCase().includes(q) ||
    m.categories.some(c => c.toLowerCase().includes(q))
  );
}

