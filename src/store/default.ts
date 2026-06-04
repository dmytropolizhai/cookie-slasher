import { ComboState, GameState, RunStats } from "@/types";

export const defaultUpgrades: Record<string, number> = {};

export const defaultGame: GameState = {
  phase: 'menu',
  score: 0,
  reiki: 0,
  hp: 5,
  maxHp: 5,
  wave: 1,
  timeScale: 1,
  screenShake: 0,
  criticalActive: false,
  criticalTimer: 0,
  damageVignette: 0,
};

export const defaultRunStats: RunStats = {
  sliced: 0,
  missed: 0,
  bombsAvoided: 0,
  bombsHit: 0,
  maxCombo: 0,
  reikiEarned: 0,
  wavesCleared: 0,
  criticals: 0,
  styleGrade: 'D',
};

export const defaultCombo: ComboState = {
  count: 0,
  rank: 'D',
  multiplier: 1,
  decayTimer: 0,
  maxDecay: 3,
  flash: false,
};
