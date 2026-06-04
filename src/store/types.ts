import {
    ComboState,
    GamePhase,
    GameState,
    Particle,
    SlashTrail
} from "@/types";

import { CookieEntity, CookieHalf } from "@/types/cookie";

export interface Store {
  // Game state
  game: GameState;
  addMaxHp: (amount: number) => void;
  setPhase: (phase: GamePhase) => void;
  pauseGame: () => void;
  resumeGame: () => void;
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

  // Shop
  upgrades: Record<string, number>;
  shopOpen: boolean;
  openShop: () => void;
  closeShop: () => void;
  purchaseUpgrade: (id: string, price: number) => void;

  // Combo
  combo: ComboState;
  incrementCombo: () => void;
  breakCombo: (partial?: boolean) => void;
  tickCombo: (dt: number) => void;

  // Audio
  muted: boolean;
  toggleMute: () => void;

  // Tutorial
  tutorialSeen: boolean;
  setTutorialSeen: () => void;
}