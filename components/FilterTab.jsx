"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./FilterTab.module.scss";

export default function FilterTab() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [open, setOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(5);

  useEffect(() => {
    setMinPrice(sp.get("minPrice") ?? sp.get("priceMin") ?? "");
    setMaxPrice(sp.get("maxPrice") ?? sp.get("priceMax") ?? "");
    setMinRating(sp.get("minRating") ? Number(sp.get("minRating")) : 0);
    setMaxRating(sp.get("maxRating") ? Number(sp.get("maxRating")) : 5);
  }, [sp]);

  function apply() {
    const q = new URLSearchParams(sp.toString());
    if (minPrice) q.set("minPrice", String(Number(minPrice))); else { q.delete("minPrice"); q.delete("priceMin"); }
    if (maxPrice) q.set("maxPrice", String(Number(maxPrice))); else { q.delete("maxPrice"); q.delete("priceMax"); }
    q.set("minRating", String(Math.max(0, Math.min(5, minRating))));
    q.set("maxRating", String(Math.max(0, Math.min(5, maxRating))));
    router.push(`${pathname}?${q.toString()}`, { scroll: false });
    setOpen(false);
  }

  function reset() {
    const q = new URLSearchParams(sp.toString());
    ["minPrice","maxPrice","priceMin","priceMax","minRating","maxRating"].forEach(k => q.delete(k));
    router.push(`${pathname}${q.toString() ? `?${q.toString()}` : ""}`, { scroll: false });
    setOpen(false);
  }

  return (
    <>
      <button type="button" className={styles.fab} aria-label="Open filters" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M3 5h18M6 12h12M10 19h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}

      <aside className={`${styles.panel} ${open ? styles.open : ""}`} aria-hidden={!open}>
        <header className={styles.title}>Filters</header>

        <label className={styles.field}>
          <span>Min Price (USD)</span>
          <input type="number" inputMode="decimal" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} placeholder="e.g. 250" />
        </label>

        <label className={styles.field}>
          <span>Max Price (USD)</span>
          <input type="number" inputMode="decimal" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} placeholder="e.g. 600" />
        </label>

        <label className={styles.field}>
          <span>Min Rating (0–5)</span>
          <input type="number" step={0.5} min={0} max={5} value={minRating} onChange={(e)=>setMinRating(Number(e.target.value) || 0)} />
        </label>

        <label className={styles.field}>
          <span>Max Rating (0–5)</span>
          <input type="number" step={0.5} min={0} max={5} value={maxRating} onChange={(e)=>setMaxRating(Number(e.target.value) || 5)} />
        </label>

        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={apply}>Apply</button>
          <button type="button" className={styles.ghost} onClick={reset}>Reset</button>
        </div>
      </aside>
    </>
  );
}
