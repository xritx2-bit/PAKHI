import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'saree-1',
    name: 'Banarasi Silk Saree',
    slug: 'banarasi-silk-saree',
    category: 'sarees',
    subcategory: 'Banarasi',
    price: 2499,
    originalPrice: 3199,
    discountPercent: 22,
    rating: 4.8,
    reviewCount: 24,
    image: '/images/hero-saree.jpg',
    gallery: [
      '/images/hero-saree.jpg',
      '/images/banarasi-blue.jpg',
      '/images/festive-editorial.jpg'
    ],
    description: 'An ode to timeless Indian heritage. Woven with pure silk threads and embellished with intricate antique gold zari floral jaal, this Banarasi masterpiece drapes like royal poetry.',
    fabric: 'Pure Silk',
    occasion: 'Wedding',
    pattern: 'Zari Floral Brocade',
    isNew: true,
    isTrending: true,
    stock: 14,
    colors: [
      { name: 'Wine Red', hex: '#722F3D', inStock: true },
      { name: 'Royal Blue', hex: '#1E3A8A', inStock: true },
      { name: 'Emerald', hex: '#064E3B', inStock: true },
      { name: 'Blush Pink', hex: '#F472B6', inStock: true }
    ],
    blouseIncluded: true,
    blouseLength: '0.8 m',
    sareeLength: '5.5 m',
    careInstructions: 'Dry clean only. Store wrapped in pure muslin cloth.',
    details: [
      'Craft: Banarasi Handloom Kadhwa Technique',
      'Pallu: Heavily ornamented gold zari grand pallu',
      'Border: Traditional temple floral borders',
      'Includes unstitched blouse piece in matching tone'
    ]
  },
  {
    id: 'kurta-1',
    name: 'Cotton Printed Kurta',
    slug: 'cotton-printed-kurta',
    category: 'kurtas',
    subcategory: 'Straight',
    price: 1299,
    originalPrice: 1699,
    discountPercent: 24,
    rating: 4.7,
    reviewCount: 18,
    image: '/images/cotton-printed-kurta.jpg',
    gallery: [
      '/images/cotton-printed-kurta.jpg',
      '/images/category-kurta.jpg'
    ],
    description: 'Breathe through your day in gentle luxury. Handcrafted from 100% premium long-staple organic cotton, featuring soothing floral hand-block motifs and clean silhouette lines.',
    fabric: '100% Breathable Cotton',
    occasion: 'Casual',
    pattern: 'Hand-block Botanical Print',
    isNew: true,
    isTrending: false,
    stock: 22,
    colors: [
      { name: 'Slate Blue', hex: '#7E9BB0', inStock: true },
      { name: 'Sage Green', hex: '#87A987', inStock: true },
      { name: 'Warm Ivory', hex: '#F5EBDD', inStock: true }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    careInstructions: 'Gentle cold hand wash or machine wash on delicate cycle with mild detergent.',
    details: [
      'Sleeve: 3/4th length with piped trim',
      'Neck: Round neck with subtle front slit placket',
      'Fit: Relaxed straight fit with side slits',
      'Length: Calf length (44 inches)'
    ]
  },
  {
    id: 'saree-2',
    name: 'Georgette Saree',
    slug: 'georgette-saree',
    category: 'sarees',
    subcategory: 'Georgette',
    price: 1999,
    originalPrice: 2599,
    discountPercent: 23,
    rating: 4.6,
    reviewCount: 15,
    image: '/images/georgette-saree.jpg',
    gallery: [
      '/images/georgette-saree.jpg',
      '/images/hero-saree.jpg'
    ],
    description: 'Effortless grace meets contemporary allure. This featherlight micro-georgette saree in rich berry tones features an ornate scalloped cutwork border with glistening micro-sequins.',
    fabric: 'Micro Georgette',
    occasion: 'Party',
    pattern: 'Embroidered Scallop Border',
    isNew: true,
    isTrending: true,
    stock: 18,
    colors: [
      { name: 'Wine Berry', hex: '#8E2849', inStock: true },
      { name: 'Teal Blue', hex: '#0F766E', inStock: true },
      { name: 'Midnight Onyx', hex: '#1C1917', inStock: true }
    ],
    blouseIncluded: true,
    blouseLength: '0.8 m',
    sareeLength: '5.5 m',
    careInstructions: 'Dry clean recommended. Gentle steam iron on reverse.',
    details: [
      'Lightweight, flowy drape that stays in place all evening',
      'Border: Hand-finished scalloped zari & sequin embroidery',
      'Includes raw silk running unstitched blouse piece'
    ]
  },
  {
    id: 'kurta-2',
    name: 'Embroidered Kurta',
    slug: 'embroidered-kurta',
    category: 'kurtas',
    subcategory: 'Straight',
    price: 1499,
    originalPrice: 1999,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 22,
    image: '/images/embroidered-kurta.jpg',
    gallery: [
      '/images/embroidered-kurta.jpg',
      '/images/category-kurta.jpg'
    ],
    description: 'Sophistication in delicate blush. Hand-embroidered with tonal resham threads, seed pearls, and shimmering sitara work on the neckline and cuffs. Pair with palazzo or silk trousers.',
    fabric: 'Chanderi Silk Blend',
    occasion: 'Festive',
    pattern: 'Resham Neckline Embroidery',
    isNew: true,
    isTrending: false,
    stock: 16,
    colors: [
      { name: 'Blush Pink', hex: '#E2A9A9', inStock: true },
      { name: 'Mint Frost', hex: '#BDD2C6', inStock: true },
      { name: 'Champagne Ivory', hex: '#EBE2D3', inStock: true }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    careInstructions: 'Dry clean only. Iron with protective cloth.',
    details: [
      'Craft: Delicate Gota Patti & Resham Hand-embroidery',
      'Lining: Premium butter crepe inner lining included',
      'Sleeve: Full length with embroidered cuff details',
      'Neck: Keyhole V-neck with pearl accents'
    ]
  },
  {
    id: 'saree-3',
    name: 'Royal Blue Banarasi Silk Saree',
    slug: 'royal-blue-banarasi-silk-saree',
    category: 'sarees',
    subcategory: 'Banarasi',
    price: 1999,
    originalPrice: 2499,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 146,
    image: '/images/banarasi-blue.jpg',
    gallery: [
      '/images/banarasi-blue.jpg',
      '/images/hero-saree.jpg',
      '/images/festive-editorial.jpg'
    ],
    description: 'The crowning jewel of traditional festive celebrations. Drenched in majestic royal sapphire blue with gleaming antique gold zari paisleys and an opulent heavy weave pallu.',
    fabric: 'Banarasi Katan Silk',
    occasion: 'Wedding',
    pattern: 'Kalka & Paisley Zari Motif',
    isNew: false,
    isTrending: true,
    stock: 12,
    colors: [
      { name: 'Royal Blue', hex: '#1E3A8A', inStock: true },
      { name: 'Wine Red', hex: '#722F3D', inStock: true },
      { name: 'Rani Pink', hex: '#BE185D', inStock: true },
      { name: 'Emerald', hex: '#065F46', inStock: true }
    ],
    blouseIncluded: true,
    blouseLength: '0.8 m',
    sareeLength: '5.5 m',
    careInstructions: 'Dry clean only. Air dry in shade. Avoid perfume contact.',
    details: [
      'Weave: Authentic Jacquard Zari Handloom Artistry',
      'Body: Intricate buti motifs across the entire drape',
      'Pallu: Traditional heritage Banarasi zari weave',
      'Includes contrast/matching tone blouse fabric'
    ]
  },
  {
    id: 'kurta-3',
    name: 'Ivory Anarkali Kurta Set',
    slug: 'ivory-anarkali-kurta-set',
    category: 'kurtas',
    subcategory: 'Anarkali',
    price: 2899,
    originalPrice: 3599,
    discountPercent: 19,
    rating: 4.9,
    reviewCount: 38,
    image: '/images/category-kurta.jpg',
    gallery: [
      '/images/category-kurta.jpg',
      '/images/cotton-printed-kurta.jpg'
    ],
    description: 'Majestic flair for sacred celebrations. A voluminous 24-kali flared Anarkali silhouette in rich organza-silk blend with woven zari border and a shimmering organza dupatta.',
    fabric: 'Pure Chanderi Silk & Organza',
    occasion: 'Festive',
    pattern: 'Zari Border & Kali Flare',
    isNew: false,
    isTrending: true,
    stock: 15,
    colors: [
      { name: 'Warm Ivory', hex: '#F8F3EC', inStock: true },
      { name: 'Pale Gold', hex: '#E5CCA0', inStock: true }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    careInstructions: 'Dry clean only.',
    details: [
      'Silhouette: Grand 3.5 meter royal kalidar flare',
      'Includes 3-piece set: Anarkali Kurta, Pants, and Organza Dupatta',
      'Embellishment: Delicate mukaish and pita embroidery work'
    ]
  }
];

export const OCCASIONS = [
  { name: 'Wedding', image: '/images/occasion-wedding.jpg', count: 18 },
  { name: 'Festive', image: '/images/occasion-festive.jpg', count: 24 },
  { name: 'Casual', image: '/images/occasion-casual.jpg', count: 14 },
  { name: 'Party', image: '/images/occasion-party.jpg', count: 12 },
  { name: 'Office', image: '/images/occasion-office.jpg', count: 9 }
];
