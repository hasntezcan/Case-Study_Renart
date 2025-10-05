import axios from "axios";

const OZ_TO_GRAMS = 31.1034768;

type Cache = { price: number | null; ts: number };
let cache: Cache = { price: null, ts: 0 };

function ttlMs() {
  const min = Number(process.env.GOLD_PRICE_TTL_MIN ?? 30);
  return min * 60 * 1000;
}

async function fetchFromGoldAPI(): Promise<number> {
  const url = process.env.GOLD_API_URL;
  const key = process.env.GOLD_API_KEY;
  if (!url || !key) throw new Error("GOLD_API_URL or GOLD_API_KEY is missing");

  const res = await axios.get(url, {
    headers: { "x-access-token": key },
    timeout: 10_000,
  });

  const d = res.data ?? {};

  if (typeof d.price_gram_24k === "number" && isFinite(d.price_gram_24k)) {
    return d.price_gram_24k;
  }

  // Yoksa ons fiyatından gram'a çevir
  if (typeof d.price === "number" && isFinite(d.price)) {
    return d.price / OZ_TO_GRAMS;
  }

  throw new Error("Invalid response from GoldAPI");
}

export async function getGoldPriceUSDPerGram(): Promise<number> {
  const now = Date.now();
  if (cache.price && now - cache.ts < ttlMs()) return cache.price;

  try {
    const price = await fetchFromGoldAPI();
    cache = { price, ts: now };
    return price;
  } catch {
    const fallback = Number(process.env.DEV_GOLD_PRICE_PER_GRAM ?? 78.5);
    cache = { price: fallback, ts: now };
    return fallback;
  }
}
