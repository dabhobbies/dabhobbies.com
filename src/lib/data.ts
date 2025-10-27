import { PlaceHolderImages } from './placeholder-images';

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'Helmets' | 'Jackets' | 'Gloves' | 'Boots' | 'Pants' | 'Suits';
  description: string;
  details: string[];
  price: number;
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: string[];
  image: (typeof PlaceHolderImages)[0];
};

export const products: Product[] = [
  {
    id: 'prod_1',
    slug: 'urban-explorer-helmet',
    name: 'Urban Explorer Helmet',
    category: 'Helmets',
    description: 'A sleek and modern full-face helmet designed for the urban rider. Offers superior protection and comfort without compromising on style.',
    details: [
        'Advanced polycarbonate composite shell',
        'Multi-density EPS liner for impact absorption',
        'Integrated sun visor',
        'Advanced channeling ventilation system',
    ],
    price: 2999000,
    rating: 4.5,
    reviewCount: 82,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Matte Black', 'Gloss White', 'Titanium'],
    image: PlaceHolderImages.find(p => p.id === 'product-helmet-1')!,
  },
  {
    id: 'prod_2',
    slug: 'classic-leather-jacket',
    name: 'Classic Leather Jacket',
    category: 'Jackets',
    description: 'Timeless style meets modern protection. This premium leather jacket is perfect for any rider looking for a classic look with CE-rated armor.',
    details: [
        '1.2mm genuine cowhide leather',
        'Removable CE-approved shoulder and elbow armor',
        'Action back for comfort and mobility',
        'Multiple zippered pockets for storage',
    ],
    price: 5250000,
    rating: 4.8,
    reviewCount: 154,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Brown'],
    image: PlaceHolderImages.find(p => p.id === 'product-jacket-1')!,
  },
  {
    id: 'prod_3',
    slug: 'apex-pro-gloves',
    name: 'Apex Pro Gloves',
    category: 'Gloves',
    description: 'Get a grip with the Apex Pro gloves. Featuring hard-knuckle protection and a pre-curved design for maximum comfort and control.',
    details: [
        'Goat leather and textile construction',
        'TPU molded hard knuckle protector',
        'Touchscreen compatible fingertips',
        'Hook and loop wrist closure',
    ],
    price: 1200000,
    rating: 4.6,
    reviewCount: 65,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Red', 'Blue'],
    image: PlaceHolderImages.find(p => p.id === 'product-gloves-1')!,
  },
  {
    id: 'prod_4',
    slug: 'touring-tech-boots',
    name: 'Touring-Tech Boots',
    category: 'Boots',
    description: 'Built for the long haul, these waterproof touring boots provide all-day comfort and protection against the elements and the road.',
    details: [
        'Waterproof and breathable membrane',
        'Shin, ankle, and heel protection',
        'High-grip rubber sole',
        'Side-entry system with zipper and Velcro',
    ],
    price: 3450000,
    rating: 4.7,
    reviewCount: 91,
    sizes: ['8', '9', '10', '11', '12'],
    colors: ['Black'],
    image: PlaceHolderImages.find(p => p.id === 'product-boots-1')!,
  },
  {
    id: 'prod_5',
    slug: 'retro-cruiser-helmet',
    name: 'Retro Cruiser Helmet',
    category: 'Helmets',
    description: 'A vintage-inspired open-face helmet for the modern classic enthusiast. Lightweight and comfortable for city cruising.',
    details: [
        'Fiberglass composite shell',
        'Quilted comfort liner',
        'Goggle strap holder',
        '3-snap visor compatibility',
    ],
    price: 2250000,
    rating: 4.3,
    reviewCount: 45,
    sizes: ['S', 'M', 'L'],
    colors: ['Cream', 'British Racing Green'],
    image: PlaceHolderImages.find(p => p.id === 'product-helmet-2')!,
  },
  {
    id: 'prod_6',
    slug: 'adventure-touring-jacket',
    name: 'Adventure Touring Jacket',
    category: 'Jackets',
    description: 'The ultimate all-weather, all-terrain jacket. With a removable thermal liner and waterproof shell, you\'re ready for any adventure.',
    details: [
        'Durable 600D textile outer shell',
        'Waterproof and breathable liner',
        'Removable full-sleeve thermal liner',
        'Adjustable ventilation ports',
    ],
    price: 6450000,
    rating: 4.9,
    reviewCount: 112,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Sand', 'Grey/Black'],
    image: PlaceHolderImages.find(p => p.id === 'product-jacket-2')!,
  },
  {
    id: 'prod_7',
    slug: 'armored-riding-jeans',
    name: 'Armored Riding Jeans',
    category: 'Pants',
    description: 'Look casual, ride protected. These riding jeans are reinforced with aramid fibers and come with removable knee and hip armor.',
    details: [
        'Comfort-fit 14oz denim',
        'Aramid fiber reinforcement at seat and knees',
        'Removable CE Level 2 knee and hip protectors',
        'Classic 5-pocket design',
    ],
    price: 2700000,
    rating: 4.6,
    reviewCount: 78,
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Dark Wash', 'Black'],
    image: PlaceHolderImages.find(p => p.id === 'product-pants-1')!,
  },
  {
    id: 'prod_8',
    slug: 'track-day-racing-suit',
    name: 'Track Day Racing Suit',
    category: 'Suits',
    description: 'A one-piece leather suit for the aspiring track enthusiast. Aerodynamically designed with top-tier protection for high-speed performance.',
    details: [
        'Full-grain 1.3mm leather construction',
        'CE-certified internal protectors',
        'Aerodynamic back hump',
        'Perforated panels for ventilation',
    ],
    price: 13500000,
    rating: 4.9,
    reviewCount: 34,
    sizes: ['48', '50', '52', '54'],
    colors: ['Black/White', 'Red/Black'],
    image: PlaceHolderImages.find(p => p.id === 'product-suit-1')!,
  },
];
