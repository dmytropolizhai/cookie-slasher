/**
 * Mulberry32 seeded pseudo-random number generator.
 * Returns a function that produces deterministic floats in [0, 1).
 */
export function makeSeededRng(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

/**
 * Derive a numeric seed from today's UTC date (YYYYMMDD).
 * Returns the same seed for every call within the same calendar day (UTC).
 */
export function getDailySeed(): number {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  // e.g. 20260604 → deterministic integer
  return y * 10000 + m * 100 + d;
}

/**
 * Format a UTC date as YYYY-MM-DD for display purposes.
 */
export function formatDailyDate(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
