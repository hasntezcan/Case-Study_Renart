import { getProducts, applyFilters } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Carousel from "@/components/Carousel";
import FilterTab from "@/components/FilterTab";
import c from "@/components/Carousel.module.scss";

export const dynamic = "force-dynamic";

type QS = Record<string, string | undefined>;
const N = (v?: string) => (v == null ? undefined : Number(v));
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<QS> | QS;
}) {
  const q: QS = (await Promise.resolve(searchParams)) ?? {};

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
