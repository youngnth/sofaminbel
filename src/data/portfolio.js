// Perfa Portfolio — 4 styled living-space collections (all images are 1:1 squares)

const img = (slug, n) => `/portfolio/${slug}/${slug}-${String(n).padStart(2, '0')}.jpg`;

export const portfolioCollections = [
  {
    id: 'cozy-minimalist',
    number: '01',
    title: 'Cozy Minimalist Accent',
    tagline: 'Sculptural accent chairs & loungers',
    description:
      'Soft bouclé shells, quilted loungers and rounded tub chairs — small-footprint pieces that turn any corner of a Hanoi apartment into a calm reading nook for parents and a safe perch for little ones.',
    tags: ['Accent Chairs', 'Loungers', 'Bouclé Texture', '1-Seat'],
    productIds: ['1793683075661', '1793683337929', '1793683076576'],
    shopLink: '/shop?seatCount=1',
    shopLabel: 'Browse 1-Seat Accents',
    images: [
      { src: img('cozy-minimalist', 1), caption: 'Forest green scallop bouclé armchair' },
      { src: img('cozy-minimalist', 2), caption: 'Cream quilted lounger with walnut base & ottoman' },
      { src: img('cozy-minimalist', 3), caption: 'Sage tufted loveseat with terracotta cushion' },
      { src: img('cozy-minimalist', 4), caption: 'Olive bouclé armchair by the garden window' },
      { src: img('cozy-minimalist', 5), caption: 'Ivory tub chair in a sunlit corner' },
      { src: img('cozy-minimalist', 6), caption: 'Warm beige reading chair with brass lamp' },
      { src: img('cozy-minimalist', 7), caption: 'Pale grey curved chair with knit throw' },
      { src: img('cozy-minimalist', 8), caption: 'Mint scallop swivel chair' },
      { src: img('cozy-minimalist', 9), caption: 'Forest green tufted lounger with ottoman' }
    ]
  },
  {
    id: 'moss-modular',
    number: '02',
    title: 'Moss Modular',
    tagline: 'Low, deep modular seating in moss bouclé',
    description:
      'Generous modular blocks wrapped in moss-green bouclé. Rearrange them for movie nights, playdates or guests — and when muddy paws strike, every cover zips off for the washing machine.',
    tags: ['Modular', 'Moss Green', 'Washable Covers', 'Pet-Friendly'],
    productIds: ['1793684730432', '1793684591208'],
    shopLink: '/shop?material=Modal',
    shopLabel: 'Browse Modal Sofas',
    images: [
      { src: img('moss-modular', 1), caption: 'Moss bouclé modular in afternoon light' },
      { src: img('moss-modular', 2), caption: 'Seat detail with walnut side cube' },
      { src: img('moss-modular', 3), caption: 'Low-profile modular in a warm living room' },
      { src: img('moss-modular', 4), caption: 'Angled view over a layered vintage rug' }
    ]
  },
  {
    id: 'halo-series',
    number: '03',
    title: 'Perfa Halo Series',
    tagline: 'Natural rattan frames & airy neutrals',
    description:
      'Woven rattan frames, cream cushions and natural textures — a light, breezy look that keeps family living rooms feeling fresh through Hanoi\u2019s humid seasons.',
    tags: ['Rattan Frame', 'Cream Tones', 'Natural Textures', '2–4 Seat'],
    productIds: ['1793684008346', '1793684973979'],
    shopLink: '/shop?material=Liocel',
    shopLabel: 'Browse Liocel Sofas',
    images: [
      { src: img('halo-series', 1), caption: 'Rattan-frame sofa in a bright neutral room' },
      { src: img('halo-series', 2), caption: 'Cream sectional with rattan arms & garden view' },
      { src: img('halo-series', 3), caption: 'Boho lounge with woven wall art & terracotta accents' },
      { src: img('halo-series', 4), caption: 'Rattan loveseat with macramé & woven pendant' }
    ]
  },
  {
    id: 'verde-lounge',
    number: '04',
    title: 'Verde Lounge Series',
    tagline: 'Olive & forest-green mid-century living',
    description:
      'Rich olive and forest-green sofas styled with warm walnut, rust cushions and patterned rugs — mid-century character made tough enough for everyday family life.',
    tags: ['Olive Green', 'Mid-Century', 'Velvet & Weave', '2–4 Seat'],
    productIds: ['1793684103943', '1793683789316'],
    shopLink: '/shop?search=Green',
    shopLabel: 'Browse Green Sofas',
    images: [
      { src: img('verde-lounge', 1), caption: 'Olive sectional with open shelving & garden doors' },
      { src: img('verde-lounge', 2), caption: 'Green corner sofa over a checkerboard rug' },
      { src: img('verde-lounge', 3), caption: 'Moss sofa with arc floor lamp' },
      { src: img('verde-lounge', 4), caption: 'Forest green sofa with mid-century sideboard' },
      { src: img('verde-lounge', 5), caption: 'Olive sofa with rust cushions & checkered floor' }
    ]
  }
];

export const portfolioTotalImages = portfolioCollections.reduce(
  (sum, c) => sum + c.images.length,
  0
);
