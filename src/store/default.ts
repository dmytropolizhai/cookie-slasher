import { ComboState, GameState } from "@/types";

export const defaultUpgrades: Record<string, number> = {};

export const defaultGame: GameState = {
  phase: 'menu',
  mode: 'endless',
  score: 0,
  reiki: 0,
  hp: 5,
  maxHp: 5,
  wave: 1,
  timeScale: 1,
  screenShake: 0,
  criticalActive: false,
  criticalTimer: 0,
  dailyDate: null,
};

export const defaultCombo: ComboState = {
  count: 0,
  rank: 'D',
  multiplier: 1,
  decayTimer: 0,
  maxDecay: 3,
  flash: false,
};
