"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ColorPicker from "./ColorPicker";
import Rating from "./Rating";
import styles from "./ProductCard.module.scss";
import type { ProductApi } from "@/lib/types";

type Color = "yellow" | "white" | "rose";

export default function ProductCard({ product }: { product: ProductApi }) {
  const [color, setColor] = useState<Color>("yellow");

  const src = useMemo(
    () => product.images?.[color] ?? product.images?.yellow,
    [color, product.images]
  );

  const label =
    color === "yellow" ? "Yellow Gold" : color === "white" ? "White Gold" : "Rose Gold";

  const displayRating = product.rating;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {src && (
          <Image
            src={src}
            alt={`${product.name} ${label}`}
            width={600}
            height={600}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
            priority
          />
        )}
      </div>

      <div className={styles.metaRow}>
        <h3 className={`mont-medium-15 ${styles.name}`}>{product.name}</h3>
        <div className={`mont-regular-15 ${styles.price}`}>$
          {product.priceUSD.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          USD
        </div>
      </div>

      <ColorPicker value={color} onChange={setColor} />
      <div className={`avenir-12 ${styles.colorLabel}`}>{label}</div>

      <div className={styles.ratingRow}>
        <Rating value={displayRating} />
      </div>
    </article>
  );
}
