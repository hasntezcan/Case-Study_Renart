export const OZT_TO_GRAMS = 31.1034768;

export function toFiveStar(score01: number): number {
  const clamped = Math.max(0, Math.min(1, score01));
  return Math.round(clamped * 50) / 10; // 1 decimal
}
