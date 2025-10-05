export type ProductBase = {
  name: string;
  weight: number;                 
  popularityScore: number;        
  images: { yellow: string; white: string; rose: string };
  slug?: string;
};

export type ProductApi = ProductBase & {
  rating: number;                 
  priceUSD: number;               
  currency: "USD";
  color?: "yellow" | "white" | "rose";
};
