export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover' | 'boss_intro' | 'wave_clear';

export type StyleGrade = 'S' | 'A' | 'B' | 'C' | 'D';

export interface RunStats {
  sliced: number;
  missed: number;
  bombsAvoided: number;
  bombsHit: number;
  maxCombo: number;
  reikiEarned: number;
  wavesCleared: number;
  criticals: number;
  styleGrade: StyleGrade;
}

export interface GameState {
  phase: GamePhase;
  score: number;
  reiki: number;
  hp: number;
  maxHp: number;
  wave: number;
  timeScale: number;     // 1.0 = normal, 0.25 = slow mo
  screenShake: number;
  criticalActive: boolean;
  criticalTimer: number;
  // damage vignette intensity (0–1, decays each frame)
  damageVignette: number;
}
