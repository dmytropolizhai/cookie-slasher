import type { Vec2 } from "./geometry";

export type CookieType = 'normal' | 'golden' | 'fake' | 'bomb' | 'boss' | 'frozen' | 'cursed' | 'mirror' | 'spirit';

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
