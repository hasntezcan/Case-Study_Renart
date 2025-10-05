import { getProducts, applyFilters } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Carousel from "@/components/Carousel";
import FilterTab from "@/components/FilterTab";
import c from "@/components/Carousel.module.scss";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const N = (v: string | string[] | undefined) => {
  if (v == null) return undefined;
  const s = Array.isArray(v) ? v[0] : v;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const q = (await searchParams) ?? {};

  const minPrice = N(q.minPrice ?? q.priceMin ?? q.min_price);
  const maxPrice = N(q.maxPrice ?? q.priceMax ?? q.max_price);

  const minRating = N(q.minRating);
  const maxRating = N(q.maxRating);
  const minPop = minRating != null ? clamp01(minRating / 5) : undefined;
  const maxPop = maxRating != null ? clamp01(maxRating / 5) : undefined;

  const all = await getProducts();
  const products = applyFilters(all, {
    minPrice,
    maxPrice,
    minPopularity: minPop,
    maxPopularity: maxPop,
  });

  return (
    <main>
      <section className="container">
        <h1 className="title">Product List</h1>
      </section>

      <FilterTab />

      <section className="container only-desktop">
        <div className={c.wrap}>
          <Carousel>
            {products.map((p) => (
              <ProductCard key={p.slug ?? p.name} product={p} />
            ))}
          </Carousel>
        </div>
      </section>

      <section className="container only-mobile grid">
        {products.map((p) => (
          <ProductCard key={`m-${p.slug ?? p.name}`} product={p} />
        ))}
      </section>
    </main>
  );
}
