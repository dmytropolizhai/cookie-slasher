import type { Vec2 } from "./geometry"

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
