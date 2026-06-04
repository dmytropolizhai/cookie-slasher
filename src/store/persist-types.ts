export interface RunRecord {
  score: number;
  wave: number;
  soulDustEarned: number;
  date: number; // timestamp
}

export interface PersistStore {
  // Meta-currency accumulated across all runs
  soulDust: number;
  // Last 10 run records
  runHistory: RunRecord[];
  // Streak: consecutive runs reaching wave >= 3
  currentStreak: number;
  bestStreak: number;

  recordRun: (score: number, wave: number) => void;
  spendSoulDust: (amount: number) => boolean;
}
