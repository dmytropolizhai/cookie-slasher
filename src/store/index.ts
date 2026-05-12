import { create } from 'zustand';
import type {
  CookieEntity,
  CookieHalf,
  Particle,
  SlashTrail,
  ComboState,
  ComboRank,
  GameState,
  GamePhase,
} from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RANK_THRESHOLDS: { rank: ComboRank; min: number }[] = [
  { rank: 'SSS', min: 50 },
  { rank: 'SS', min: 30 },
  { rank: 'S', min: 20 },
  { rank: 'A', min: 12 },
  { rank: 'B', min: 7 },
  { rank: 'C', min: 3 },
  { rank: 'D', min: 0 },
];

const RANK_MULTIPLIERS: Record<ComboRank, number> = {
  D: 1, C: 1.2, B: 1.5, A: 2, S: 3, SS: 5, SSS: 8,
};

function calcRank(count: number): ComboRank {
  return (RANK_THRESHOLDS.find((t) => count >= t.min)?.rank ?? 'D');
}

// ─── Store Shape ─────────────────────────────────────────────────────────────

interface Store {
  // Game state
  game: GameState;
  setPhase: (phase: GamePhase) => void;
  addScore: (pts: number) => void;
  addReiki: (amount: number) => void;
  takeDamage: (dmg: number) => void;
  setTimeScale: (ts: number) => void;
  triggerShake: (intensity: number) => void;
  decayShake: () => void;
  triggerCritical: () => void;
  tickCritical: (dt: number) => void;
  resetGame: () => void;
  nextWave: () => void;

  // Cookies
  cookies: CookieEntity[];
  addCookie: (c: CookieEntity) => void;
  removeCookie: (id: string) => void;
  updateCookie: (id: string, patch: Partial<CookieEntity>) => void;
  clearCookies: () => void;

  // Cookie halves
  halves: CookieHalf[];
  addHalf: (h: CookieHalf) => void;
  removeHalf: (id: string) => void;
  clearHalves: () => void;

  // Particles
  particles: Particle[];
  addParticle: (p: Particle) => void;
  removeParticle: (id: string) => void;
  clearParticles: () => void;

  // Slash trail
  slash: SlashTrail;
  pushSlashPoint: (x: number, y: number, time: number) => void;
  setSlashActive: (active: boolean) => void;
  pruneSlash: (cutoffTime: number) => void;

  // Combo
  combo: ComboState;
  incrementCombo: () => void;
  breakCombo: (partial?: boolean) => void;
  tickCombo: (dt: number) => void;
}

const defaultGame: GameState = {
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
};

const defaultCombo: ComboState = {
  count: 0,
  rank: 'D',
  multiplier: 1,
  decayTimer: 0,
  maxDecay: 3,
  flash: false,
};

export const useStore = create<Store>((set, get) => ({
  game: { ...defaultGame },
  cookies: [],
  halves: [],
  particles: [],
  slash: { points: [], active: false },
  combo: { ...defaultCombo },

  // ── Game ──────────────────────────────────────────────────────────────────
  setPhase: (phase) => set((s) => ({ game: { ...s.game, phase } })),

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

  // ── Cookies ───────────────────────────────────────────────────────────────
  addCookie: (c) => set((s) => ({ cookies: [...s.cookies, c] })),
  removeCookie: (id) => set((s) => ({ cookies: s.cookies.filter((c) => c.id !== id) })),
  updateCookie: (id, patch) =>
    set((s) => ({
      cookies: s.cookies.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
  clearCookies: () => set(() => ({ cookies: [] })),

  // ── Halves ────────────────────────────────────────────────────────────────
  addHalf: (h) => set((s) => ({ halves: [...s.halves, h] })),
  removeHalf: (id) => set((s) => ({ halves: s.halves.filter((h) => h.id !== id) })),
  clearHalves: () => set(() => ({ halves: [] })),

  // ── Particles ─────────────────────────────────────────────────────────────
  addParticle: (p) => set((s) => ({ particles: [...s.particles, p] })),
  removeParticle: (id) =>
    set((s) => ({ particles: s.particles.filter((p) => p.id !== id) })),
  clearParticles: () => set(() => ({ particles: [] })),

  // ── Slash ─────────────────────────────────────────────────────────────────
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

  // ── Combo ─────────────────────────────────────────────────────────────────
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
