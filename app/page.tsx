import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Carousel from "@/components/Carousel";

export const dynamic = "force-dynamic";

export default async function Page() {

  const products = await getProducts();

  return (
    <main className="container">
      <h1 className="title">
        Product List 
      </h1>

      <div className="only-desktop">
        <Carousel>
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </Carousel>
      </div>

      <section className="only-mobile grid">
        {products.map((p) => (
          <ProductCard key={`m-${p.slug}`} product={p} />
        ))}
      </section>
    </main>
  );
}
