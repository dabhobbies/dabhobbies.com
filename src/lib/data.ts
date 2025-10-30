import type { Image } from 'sanity';

export type Product = {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  brand: {
      title: string;
      slug: {
          current: string;
      }
  };
  category: {
      title: string;
      slug: {
          current: string;
      }
  };
  description: any[];
  price: number;
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: string[];
  images: Image[];
  gender?: 'Unisex' | 'Men' | 'Women';
  materials?: string[];
  protection?: string[];
  certification?: string | null;
  specialFeatures?: string[];
  weight?: number; // in kilograms
  longDescription?: any[];
};
