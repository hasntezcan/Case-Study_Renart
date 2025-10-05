"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Carousel.module.scss";

export default function Carousel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollByDir = useCallback((dir: "prev" | "next") => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.max(280, el.clientWidth * 0.75);
    el.scrollBy({ left: dir === "prev" ? -amount : amount, behavior: "smooth" });
  }, []);

  const updateEdgeState = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft < max - 2);
  }, []);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const prev = document.querySelector<HTMLButtonElement>(`.${styles.btn}[data-dir='prev']`);
    const next = document.querySelector<HTMLButtonElement>(`.${styles.btn}[data-dir='next']`);

    const goPrev = () => scrollByDir("prev");
    const goNext = () => scrollByDir("next");

    prev?.addEventListener("click", goPrev);
    next?.addEventListener("click", goNext);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
    };
    container.addEventListener("keydown", onKey);

    updateEdgeState();
    const onScroll = () => updateEdgeState();
    const onResize = () => updateEdgeState();
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      prev?.removeEventListener("click", goPrev);
      next?.removeEventListener("click", goNext);
      container.removeEventListener("keydown", onKey);
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [scrollByDir, updateEdgeState]);

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={`${styles.sideBtn} ${styles.left}`}
        aria-label="Previous products"
        onClick={() => scrollByDir("prev")}
        disabled={!canPrev}
      >
        <svg className={styles.chev} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15.5 5 8.5 12l7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={ref}
        className={styles.root}
        tabIndex={0}
        role="region"
        aria-label="Product carousel"
      >
        {children}
      </div>

      <button
        type="button"
        className={`${styles.sideBtn} ${styles.right}`}
        aria-label="Next products"
        onClick={() => scrollByDir("next")}
        disabled={!canNext}
      >
        <svg className={styles.chev} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.5 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
