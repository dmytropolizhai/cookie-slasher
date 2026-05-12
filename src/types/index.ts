// ─── Vector / Geometry ───────────────────────────────────────────────────────

export interface Vec2 {
  x: number;
  y: number;
}

// ─── Cookie Types ────────────────────────────────────────────────────────────

export type CookieType = 'normal' | 'golden' | 'fake' | 'bomb' | 'boss';

export type CookieState = 'falling' | 'sliced' | 'exploded' | 'missed';

export interface CookieEntity {
  id: string;
  type: CookieType;
  pos: Vec2;
  vel: Vec2;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  state: CookieState;
  hp: number;
  maxHp: number;
  phase: number; // for boss
  spawnTime: number;
  scale: number;
  glowIntensity: number;
}

export interface CookieHalf {
  id: string;
  pos: Vec2;
  vel: Vec2;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  half: 'top' | 'bottom';
  cookieType: CookieType;
  slashAngle: number;
}

// ─── Particle ────────────────────────────────────────────────────────────────

export type ParticleType =
  | 'crumb'
  | 'goo'
  | 'slash'
  | 'critical'
  | 'sakura'
  | 'neon'
  | 'impact'
  | 'smoke'
  | 'spark';

export interface Particle {
  id: string;
  type: ParticleType;
  pos: Vec2;
  vel: Vec2;
  size: number;
  alpha: number;
  color: string;
  life: number;       // 0–1 normalized remaining life
  maxLife: number;    // total life in seconds
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  shrink: number;
}

// ─── Slash / Katana ──────────────────────────────────────────────────────────

export interface SlashPoint {
  pos: Vec2;
  time: number;
}

export interface SlashTrail {
  points: SlashPoint[];
  active: boolean;
}

// ─── Combo ───────────────────────────────────────────────────────────────────

export type ComboRank = 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export interface ComboState {
  count: number;
  rank: ComboRank;
  multiplier: number;
  decayTimer: number;
  maxDecay: number;
  flash: boolean;
}

// ─── Game State ──────────────────────────────────────────────────────────────

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
}

// ─── Wave / Spawn ────────────────────────────────────────────────────────────

export interface WaveConfig {
  wave: number;
  totalCookies: number;
  spawnInterval: number;   // ms between spawns
  speedMin: number;
  speedMax: number;
  normalChance: number;
  goldenChance: number;
  fakeChance: number;
  bombChance: number;
  hasBoss: boolean;
}

// ─── Audio ───────────────────────────────────────────────────────────────────

export type SoundKey =
  | 'slice_normal'
  | 'slice_golden'
  | 'slice_fake'
  | 'slice_bomb'
  | 'slice_critical'
  | 'katana_swing'
  | 'combo_up'
  | 'combo_break'
  | 'slow_mo_in'
  | 'slow_mo_out'
  | 'miss'
  | 'explosion'
  | 'boss_roar';
