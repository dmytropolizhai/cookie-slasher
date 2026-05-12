import { ComboRank } from "@/types";

const RANK_THRESHOLDS: { rank: ComboRank; min: number }[] = [
  { rank: 'SSS', min: 50 },
  { rank: 'SS', min: 30 },
  { rank: 'S', min: 20 },
  { rank: 'A', min: 12 },
  { rank: 'B', min: 7 },
  { rank: 'C', min: 3 },
  { rank: 'D', min: 0 },
];

export const RANK_MULTIPLIERS: Record<ComboRank, number> = {
  D: 1, C: 1.2, B: 1.5, A: 2, S: 3, SS: 5, SSS: 8,
};

export function calcRank(count: number): ComboRank {
  return (RANK_THRESHOLDS.find((t) => count >= t.min)?.rank ?? 'D');
}
