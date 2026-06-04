export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover' | 'boss_intro' | 'wave_clear';

export type GameMode = 'endless' | 'daily';

export interface GameState {
  phase: GamePhase;
  mode: GameMode;
  score: number;
  reiki: number;
  hp: number;
  maxHp: number;
  wave: number;
  timeScale: number;     // 1.0 = normal, 0.25 = slow mo
  screenShake: number;
  criticalActive: boolean;
  criticalTimer: number;

  /** ISO date string YYYY-MM-DD for which the daily challenge was played */
  dailyDate: string | null;
}

/** Persisted record of a completed daily challenge attempt */
export interface DailyChallengeRecord {
  date: string;          // YYYY-MM-DD
  score: number;
  wave: number;
  completed: boolean;    // true once submitted (prevent replaying same day)
  // Boss fight state
  bossActive: boolean;
  bossPhase: 1 | 2 | 3;
  bossHp: number;
  bossMaxHp: number;
  bossIntroWave: number;  // wave that triggered boss_intro (avoid re-showing)
}
