import { create } from 'zustand';

import { Store } from './types';
import { calcRank, RANK_MULTIPLIERS } from './helpers';
import { defaultCombo, defaultGame } from './default';


export const useStore = create<Store>((set, get) => ({
  game: { ...defaultGame },
  cookies: [],
  halves: [],
  particles: [],
  slash: { points: [], active: false },
  combo: { ...defaultCombo },

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

  resetGame: () =>
    set(() => ({
      game: { ...defaultGame },
      cookies: [],
      halves: [],
      particles: [],
      slash: { points: [], active: false },
      combo: { ...defaultCombo },
    })),

  nextWave: () =>
    set((s) => ({ game: { ...s.game, wave: s.game.wave + 1 } })),

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
      return {
        combo: {
          count,
          rank,
          multiplier: RANK_MULTIPLIERS[rank],
          decayTimer: 0,
          maxDecay: 3,
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
