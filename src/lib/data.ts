
import { PlaceHolderImages } from './placeholder-images';

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: 'Helmets' | 'Jackets' | 'Gloves' | 'Boots' | 'Pants' | 'Suits';
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: string[];
  image: (typeof PlaceHolderImages)[0];
  gender: 'Unisex' | 'Men' | 'Women';
  materials: string[];
  protection: string[];
  certification: string | null;
  specialFeatures: string[];
};

export const products: Product[] = [
  {
    id: 'prod_1',
    slug: 'urban-explorer-helmet',
    name: 'Urban Explorer Helmet',
    brand: 'Aether',
    category: 'Helmets',
    description: 'A sleek and modern full-face helmet designed for the urban rider. Offers superior protection and comfort without compromising on style.',
    price: 2999000,
    rating: 4.5,
    reviewCount: 82,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Matte Black', 'Gloss White', 'Titanium'],
    image: PlaceHolderImages.find(p => p.id === 'product-helmet-1')!,
    gender: 'Unisex',
    materials: ['Advanced Polycarbonate Composite Shell', 'Multi-density EPS liner'],
    protection: ['High impact absorption shell'],
    certification: 'DOT, ECE 22.05',
    specialFeatures: ['Integrated sun visor', 'Advanced channeling ventilation system'],
  },
  {
    id: 'prod_2',
    slug: 'classic-leather-jacket',
    name: 'Classic Leather Jacket',
    brand: 'Dainese',
    category: 'Jackets',
    description: 'Timeless style meets modern protection. This premium leather jacket is perfect for any rider looking for a classic look with CE-rated armor.',
    price: 5250000,
    rating: 4.8,
    reviewCount: 154,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Brown'],
    image: PlaceHolderImages.find(p => p.id === 'product-jacket-1')!,
    gender: 'Men',
    materials: ['1.2mm Genuine Cowhide Leather'],
    protection: ['Removable CE-approved shoulder armor', 'Removable CE-approved elbow armor'],
    certification: 'EN 17092 Class A',
    specialFeatures: ['Action back for comfort and mobility', 'Multiple zippered pockets for storage', 'Waist adjustment straps'],
  },
  {
    id: 'prod_3',
    slug: 'apex-pro-gloves',
    name: 'Apex Pro Gloves',
    brand: 'Alpinestars',
    category: 'Gloves',
    description: 'Get a grip with the Apex Pro gloves. Featuring hard-knuckle protection and a pre-curved design for maximum comfort and control.',
    price: 1200000,
    rating: 4.6,
    reviewCount: 65,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Red', 'Blue'],
    image: PlaceHolderImages.find(p => p.id === 'product-gloves-1')!,
    gender: 'Unisex',
    materials: ['Goat leather', 'Textile'],
    protection: ['TPU molded hard knuckle protector', 'Reinforced palm slider'],
    certification: 'CE Certified EN 13594:2015',
    specialFeatures: ['Touchscreen compatible fingertips', 'Pre-curved finger construction', 'Hook and loop wrist closure'],
  },
  {
    id: 'prod_4',
    slug: 'touring-tech-boots',
    name: 'Touring-Tech Boots',
    brand: 'Sidi',
    category: 'Boots',
    description: 'Built for the long haul, these waterproof touring boots provide all-day comfort and protection against the elements and the road.',
    price: 3450000,
    rating: 4.7,
    reviewCount: 91,
    sizes: ['8', '9', '10', '11', '12'],
    colors: ['Black'],
    image: PlaceHolderImages.find(p => p.id === 'product-boots-1')!,
    gender: 'Unisex',
    materials: ['Technomicro Microfiber', 'Gore-Tex membrane'],
    protection: ['Shin plate', 'Ankle support braces', 'Reinforced heel cup'],
    certification: 'CE Certified EN 13634:2017',
    specialFeatures: ['Waterproof and breathable', 'High-grip rubber sole', 'Side-entry system with zipper and Velcro'],
  },
  {
    id: 'prod_5',
    slug: 'retro-cruiser-helmet',
    name: 'Retro Cruiser Helmet',
    brand: 'Vanguard',
    category: 'Helmets',
    description: 'A vintage-inspired open-face helmet for the modern classic enthusiast. Lightweight and comfortable for city cruising.',
    price: 2250000,
    rating: 4.3,
    reviewCount: 45,
    sizes: ['S', 'M', 'L'],
    colors: ['Cream', 'British Racing Green'],
    image: PlaceHolderImages.find(p => p.id === 'product-helmet-2')!,
    gender: 'Unisex',
    materials: ['Fiberglass composite shell', 'Quilted comfort liner'],
    protection: ['Multi-density EPS liner'],
    certification: 'DOT',
    specialFeatures: ['Goggle strap holder', '3-snap visor compatibility', 'Lightweight design'],
  },
  {
    id: 'prod_6',
    slug: 'adventure-touring-jacket',
    name: 'Adventure Touring Jacket',
    brand: 'Rev\'It',
    category: 'Jackets',
    description: 'The ultimate all-weather, all-terrain jacket. With a removable thermal liner and waterproof shell, you\'re ready for any adventure.',
    price: 6450000,
    rating: 4.9,
    reviewCount: 112,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Sand', 'Grey/Black'],
    image: PlaceHolderImages.find(p => p.id === 'product-jacket-2')!,
    gender: 'Men',
    materials: ['Durable 600D Textile Outer Shell', 'Hydratex waterproof liner'],
    protection: ['Seesmart CE-level 1 shoulder protectors', 'Seesmart CE-level 1 elbow protectors', 'Pocket for back protector'],
    certification: 'EN 17092 Class AA',
    specialFeatures: ['Removable full-sleeve thermal liner', 'Adjustable ventilation ports', 'Waterproof'],
  },
  {
    id: 'prod_7',
    slug: 'armored-riding-jeans',
    name: 'Armored Riding Jeans',
    brand: 'Klim',
    category: 'Pants',
    description: 'Look casual, ride protected. These riding jeans are reinforced with aramid fibers and come with removable knee and hip armor.',
    price: 2700000,
    rating: 4.6,
    reviewCount: 78,
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Dark Wash', 'Black'],
    image: PlaceHolderImages.find(p => p.id === 'product-pants-1')!,
    gender: 'Men',
    materials: ['14oz Denim', 'Aramid Fiber'],
    protection: ['Removable CE Level 2 knee protectors', 'Removable CE Level 2 hip protectors'],
    certification: 'EN 17092 Class A',
    specialFeatures: ['Classic 5-pocket design', 'Comfort-fit'],
  },
  {
    id: 'prod_8',
    slug: 'track-day-racing-suit',
    name: 'Track Day Racing Suit',
    brand: 'Alpinestars',
    category: 'Suits',
    description: 'A one-piece leather suit for the aspiring track enthusiast. Aerodynamically designed with top-tier protection for high-speed performance.',
    price: 13500000,
    rating: 4.9,
    reviewCount: 34,
    sizes: ['48', '50', '52', '54'],
    colors: ['Black/White', 'Red/Black'],
    image: PlaceHolderImages.find(p => p.id === 'product-suit-1')!,
    gender: 'Unisex',
    materials: ['Full-grain 1.3mm Cowhide Leather', 'Aramidic stretch panels'],
    protection: ['CE-certified internal protectors', 'GP-R elbow, shoulder, knee protectors', 'DFS sliders'],
    certification: 'CE-certified to CE Category II',
    specialFeatures: ['Aerodynamic back hump', 'Perforated panels for ventilation', 'Replaceable sport knee sliders'],
  },
];

    