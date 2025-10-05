import { NextResponse, NextRequest } from "next/server";
import { getProducts, applyFilters } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams;
    const N = (v: string | null) => (v == null ? undefined : Number(v));

    const filters = {
      minPrice: N(q.get("minPrice") ?? q.get("priceMin") ?? q.get("min_price")),
      maxPrice: N(q.get("maxPrice") ?? q.get("priceMax") ?? q.get("max_price")),
      minPopularity: N(q.get("minPopularity") ?? q.get("popMin") ?? q.get("min_popularity")),
      maxPopularity: N(q.get("maxPopularity") ?? q.get("popMax") ?? q.get("max_popularity")),
    };

    const all = await getProducts();
    const data = applyFilters(all, filters);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}
