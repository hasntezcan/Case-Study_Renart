"use client";

import styles from "./ColorPicker.module.scss";

type Color = "yellow" | "white" | "rose";

export default function ColorPicker({
  value,
  onChange,
}: {
  value: Color;
  onChange: (c: Color) => void;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.swatches} role="radiogroup" aria-label="Color">
        {(["yellow", "white", "rose"] as Color[]).map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={value === c}
            className={styles.swatch}
            data-color={c}
            onClick={() => onChange(c)}
          />
        ))}
      </div>
    </div>
  );
}
