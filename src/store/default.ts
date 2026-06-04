import { ComboState, GameState } from "@/types";
import type { AchievementState } from "@/systems/achievements";

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
  bossActive: false,
  bossPhase: 1,
  bossHp: 0,
  bossMaxHp: 0,
  bossIntroWave: 0,
};

export const defaultCombo: ComboState = {
  count: 0,
  rank: 'D',
  multiplier: 1,
  decayTimer: 0,
  maxDecay: 3,
  flash: false,
};

export const defaultAchievements: AchievementState[] = [];

export const defaultStats = {
  slicesTotal: 0,
  goldenSliced: 0,
  bombsBlocked: 0,
};
