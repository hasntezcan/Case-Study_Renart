import { NextResponse, NextRequest } from "next/server";
import { getProducts, applyFilters } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams;
    const N = (v: string | null) => (v == null ? undefined : Number(v));
    const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

    const minPrice = N(q.get("minPrice") ?? q.get("priceMin") ?? q.get("min_price"));
    const maxPrice = N(q.get("maxPrice") ?? q.get("priceMax") ?? q.get("max_price"));

    // popularity parametreleri hâlâ desteklenir (opsiyonel)
    let minPopularity = N(q.get("minPopularity") ?? q.get("popMin") ?? q.get("min_popularity"));
    let maxPopularity = N(q.get("maxPopularity") ?? q.get("popMax") ?? q.get("max_popularity"));

    // rating (0–5) verilirse popularity'yi override et
    const minRating = N(q.get("minRating"));
    const maxRating = N(q.get("maxRating"));
    if (minRating != null) minPopularity = clamp01(minRating / 5);
    if (maxRating != null) maxPopularity = clamp01(maxRating / 5);

    const all = await getProducts();
    const data = applyFilters(all, { minPrice, maxPrice, minPopularity, maxPopularity });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}
