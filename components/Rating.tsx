"use client";

type StarType = "full" | "half" | "empty";

function Star({ type }: { type: StarType }) {
  const base = (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
        fill="currentColor"
      />
    </svg>
  );

  if (type === "full") return <span style={{ color: "#F4C15D" }}>{base}</span>;
  if (type === "empty") return <span style={{ color: "#D9D9D9" }}>{base}</span>;

  // half
  return (
    <span style={{ position: "relative", display: "inline-block", width: 16, height: 16 }}>
      <span style={{ color: "#D9D9D9", position: "absolute" }}>{base}</span>
      <span
        style={{
          color: "#F4C15D",
          position: "absolute",
          width: 8,
          overflow: "hidden",
          inset: 0,
        }}
      >
        {base}
      </span>
    </span>
  );
}

export default function Rating({ value }: { value: number }) {
  // Tasarım: 1 ondalık, /5 yazımı
  const v = Math.round(value * 2) / 2;
  const full = Math.floor(v);
  const half = v - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span aria-hidden="true">
        {Array.from({ length: full }).map((_, i) => <Star key={`f${i}`} type="full" />)}
        {half === 1 && <Star type="half" />}
        {Array.from({ length: empty }).map((_, i) => <Star key={`e${i}`} type="empty" />)}
      </span>

      <span className="avenir-14" aria-label={`${v.toFixed(1)} out of 5`}>
        {v.toFixed(1)} / 5
      </span>
    </div>
  );
}
