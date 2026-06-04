import { create } from 'zustand';

import { Store } from './types';
import { calcRank, RANK_MULTIPLIERS } from './helpers';
import { defaultCombo, defaultGame, defaultRunStats, defaultUpgrades } from './default';
import type { StyleGrade } from '@/types';

let popIdCounter = 0;

function computeStyleGrade(
  sliced: number,
  missed: number,
  maxCombo: number,
  bombsHit: number,
  criticals: number,
): StyleGrade {
  let score = 0;

  // Accuracy (sliced vs missed ratio)
  const total = sliced + missed;
  const accuracy = total > 0 ? sliced / total : 1;
  if (accuracy >= 0.95) score += 3;
  else if (accuracy >= 0.85) score += 2;
  else if (accuracy >= 0.70) score += 1;

  // Max combo
  if (maxCombo >= 50) score += 4;
  else if (maxCombo >= 30) score += 3;
  else if (maxCombo >= 15) score += 2;
  else if (maxCombo >= 7) score += 1;

  // Bomb avoidance
  if (bombsHit === 0) score += 2;
  else if (bombsHit <= 1) score += 1;

  // Criticals show style
  if (criticals >= 10) score += 2;
  else if (criticals >= 5) score += 1;

  if (score >= 10) return 'S';
  if (score >= 7) return 'A';
  if (score >= 5) return 'B';
  if (score >= 3) return 'C';
  return 'D';
}


export const useStore = create<Store>((set, get) => ({
  game: { ...defaultGame },
  cookies: [],
  halves: [],
  particles: [],
  slash: { points: [], active: false },
  combo: { ...defaultCombo },
  upgrades: { ...defaultUpgrades },
  shopOpen: false,
  runStats: { ...defaultRunStats },
  reikiPops: [],
  waveClearVisible: false,

  // Game
  setPhase: (phase) => set((s) => ({ game: { ...s.game, phase } })),

  pauseGame: () =>
    set((s) => ({
      game: { ...s.game, phase: s.game.phase === 'playing' ? 'paused' : s.game.phase },
    })),

  resumeGame: () =>
    set((s) => ({
      game: { ...s.game, phase: s.game.phase === 'paused' ? 'playing' : s.game.phase },
    })),

  addScore: (pts) =>
    set((s) => ({
      game: { ...s.game, score: s.game.score + Math.round(pts * s.combo.multiplier) },
    })),

  addReiki: (amount) =>
    set((s) => ({ game: { ...s.game, reiki: s.game.reiki + amount } })),

  addMaxHp: (amount) =>
    set((s) => ({
      game: {
        ...s.game,
        maxHp: s.game.maxHp + amount,
        hp: Math.min(s.game.hp + amount, s.game.maxHp + amount),
      },
    })),

  takeDamage: (dmg) =>
    set((s) => {
      const hp = Math.max(0, s.game.hp - dmg);
      return {
        game: { ...s.game, hp, phase: hp <= 0 ? 'gameover' : s.game.phase },
      };
    }),

  setTimeScale: (timeScale) => set((s) => ({ game: { ...s.game, timeScale } })),

  triggerShake: (intensity) =>
    set((s) => ({ game: { ...s.game, screenShake: Math.max(s.game.screenShake, intensity) } })),

  decayShake: () =>
    set((s) => ({
      game: { ...s.game, screenShake: Math.max(0, s.game.screenShake - 0.5) },
    })),

  triggerCritical: () =>
    set((s) => ({ game: { ...s.game, criticalActive: true, criticalTimer: 1.2 } })),

  tickCritical: (dt) =>
    set((s) => {
      const t = Math.max(0, s.game.criticalTimer - dt);
      return { game: { ...s.game, criticalTimer: t, criticalActive: t > 0 } };
    }),

  triggerDamageVignette: () =>
    set((s) => ({ game: { ...s.game, damageVignette: 1.0 } })),

  decayDamageVignette: (dt) =>
    set((s) => ({
      game: { ...s.game, damageVignette: Math.max(0, s.game.damageVignette - dt * 2.5) },
    })),

  resetGame: () =>
    set(() => ({
      game: { ...defaultGame },
      cookies: [],
      halves: [],
      particles: [],
      slash: { points: [], active: false },
      combo: { ...defaultCombo },
      upgrades: { ...defaultUpgrades },
      shopOpen: false,
      runStats: { ...defaultRunStats },
      reikiPops: [],
      waveClearVisible: false,
    })),

  nextWave: () =>
    set((s) => ({
      game: { ...s.game, wave: s.game.wave + 1 },
      runStats: { ...s.runStats, wavesCleared: s.runStats.wavesCleared + 1 },
    })),

  // Run stats
  recordSlice: () =>
    set((s) => ({ runStats: { ...s.runStats, sliced: s.runStats.sliced + 1 } })),

  recordMiss: () =>
    set((s) => ({ runStats: { ...s.runStats, missed: s.runStats.missed + 1 } })),

  recordBombAvoided: () =>
    set((s) => ({ runStats: { ...s.runStats, bombsAvoided: s.runStats.bombsAvoided + 1 } })),

  recordBombHit: () =>
    set((s) => ({ runStats: { ...s.runStats, bombsHit: s.runStats.bombsHit + 1 } })),

  recordCombo: (count) =>
    set((s) => ({
      runStats: { ...s.runStats, maxCombo: Math.max(s.runStats.maxCombo, count) },
    })),

  recordReikiEarned: (amount) =>
    set((s) => ({
      runStats: { ...s.runStats, reikiEarned: s.runStats.reikiEarned + amount },
    })),

  recordCritical: () =>
    set((s) => ({ runStats: { ...s.runStats, criticals: s.runStats.criticals + 1 } })),

  finalizeRunStats: () =>
    set((s) => {
      const { sliced, missed, maxCombo, bombsHit, criticals } = s.runStats;
      const styleGrade = computeStyleGrade(sliced, missed, maxCombo, bombsHit, criticals);
      return { runStats: { ...s.runStats, styleGrade } };
    }),

  // Floating reiki pops
  spawnReikiPop: (amount, x, y) =>
    set((s) => ({
      reikiPops: [
        ...s.reikiPops,
        { id: String(++popIdCounter), amount, x, y },
      ],
    })),

  removeReikiPop: (id) =>
    set((s) => ({ reikiPops: s.reikiPops.filter((p) => p.id !== id) })),

  // Wave clear
  showWaveClear: () => set(() => ({ waveClearVisible: true })),
  hideWaveClear: () => set(() => ({ waveClearVisible: false })),

  // Shop
  openShop: () => set(() => ({ shopOpen: true })),
  closeShop: () => set(() => ({ shopOpen: false })),

  purchaseUpgrade: (id, price) =>
    set((s) => {
      if (s.game.reiki < price) return {};
      const current = s.upgrades[id] ?? 0;
      return {
        game: { ...s.game, reiki: s.game.reiki - price },
        upgrades: { ...s.upgrades, [id]: current + 1 },
      };
    }),

  // Cookies
  addCookie: (c) => set((s) => ({ cookies: [...s.cookies, c] })),
  removeCookie: (id) => set((s) => ({ cookies: s.cookies.filter((c) => c.id !== id) })),
  updateCookie: (id, patch) =>
    set((s) => ({
      cookies: s.cookies.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
  clearCookies: () => set(() => ({ cookies: [] })),

  // Halves
  addHalf: (h) => set((s) => ({ halves: [...s.halves, h] })),
  removeHalf: (id) => set((s) => ({ halves: s.halves.filter((h) => h.id !== id) })),
  clearHalves: () => set(() => ({ halves: [] })),

  // Particles
  addParticle: (p) => set((s) => ({ particles: [...s.particles, p] })),
  removeParticle: (id) =>
    set((s) => ({ particles: s.particles.filter((p) => p.id !== id) })),
  clearParticles: () => set(() => ({ particles: [] })),

  // Slash
  pushSlashPoint: (x, y, time) =>
    set((s) => ({
      slash: {
        ...s.slash,
        points: [...s.slash.points, { pos: { x, y }, time }].slice(-40),
      },
    })),

  setSlashActive: (active) => set((s) => ({ slash: { ...s.slash, active } })),

  pruneSlash: (cutoffTime) =>
    set((s) => ({
      slash: {
        ...s.slash,
        points: s.slash.points.filter((p) => p.time > cutoffTime),
      },
    })),

  // Combo
  incrementCombo: () =>
    set((s) => {
      const count = s.combo.count + 1;
      const rank = calcRank(count);
      const phantomLevel = s.upgrades['phantom_thread'] ?? 0;
      return {
        combo: {
          count,
          rank,
          multiplier: RANK_MULTIPLIERS[rank],
          decayTimer: 0,
          maxDecay: 3 + phantomLevel * 1.5,
          flash: true,
        },
      };
    }),

  breakCombo: (partial = false) =>
    set((s) => {
      if (partial) {
        const count = Math.max(0, Math.floor(s.combo.count * 0.6));
        const rank = calcRank(count);
        return { combo: { ...s.combo, count, rank, multiplier: RANK_MULTIPLIERS[rank], decayTimer: 0 } };
      }
      return { combo: { ...defaultCombo } };
    }),

  tickCombo: (dt) =>
    set((s) => {
      if (s.combo.count === 0) return {};
      const decayTimer = s.combo.decayTimer + dt;
      if (decayTimer >= s.combo.maxDecay) {
        return { combo: { ...defaultCombo } };
      }
      return { combo: { ...s.combo, decayTimer, flash: false } };
    }),
}));
