export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover' | 'boss_intro' | 'wave_clear';

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
  // Boss fight state
  bossActive: boolean;
  bossPhase: 1 | 2 | 3;
  bossHp: number;
  bossMaxHp: number;
  bossIntroWave: number;  // wave that triggered boss_intro (avoid re-showing)
}
