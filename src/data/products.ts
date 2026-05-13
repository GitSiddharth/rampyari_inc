export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  badge?: string;
  stock: number;
  images: string[];
  created_at?: string;
};
