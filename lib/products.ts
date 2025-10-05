import productsData from "@/data/products.json";
import type { ProductApi, ProductBase } from "@/lib/types";
import { getGoldPriceUSDPerGram } from "@/lib/gold";
import { toFiveStar } from "@/lib/math";

export type ProductFilters = {
  minPrice?: number;
  maxPrice?: number;
  minPopularity?: number; 
  maxPopularity?: number; 
};

export async function getProducts(): Promise<ProductApi[]> {
  const usdPerGram = await getGoldPriceUSDPerGram();
  const base = productsData as ProductBase[];

  return base.map<ProductApi>((p, i) => {
    const pop01 = Math.min(1, Math.max(0, Number(p.popularityScore) || 0));

    const price = (1 + pop01) * p.weight * usdPerGram;

    return {
      ...p,
      slug: p.slug ?? `engagement-ring-${i + 1}`,
      priceUSD: +price.toFixed(2),
      currency: "USD",
      rating: toFiveStar(pop01), 
      color: "yellow",
    };
  });
}

export function applyFilters(list: ProductApi[], f: ProductFilters = {}): ProductApi[] {
  let { minPrice, maxPrice, minPopularity, maxPopularity } = f;

  const isNum = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);

  if (isNum(minPrice) && isNum(maxPrice) && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }
  if (isNum(minPopularity) && isNum(maxPopularity) && minPopularity > maxPopularity) {
    [minPopularity, maxPopularity] = [maxPopularity, minPopularity];
  }

  return list.filter((p) => {
    const pop = Math.min(1, Math.max(0, Number(p.popularityScore) || 0));
    if (isNum(minPrice) && p.priceUSD < minPrice) return false;
    if (isNum(maxPrice) && p.priceUSD > maxPrice) return false;
    if (isNum(minPopularity) && pop < minPopularity) return false;
    if (isNum(maxPopularity) && pop > maxPopularity) return false;
    return true;
  });
}
