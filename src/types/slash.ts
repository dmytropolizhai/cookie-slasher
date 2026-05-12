import type { Vec2 } from "./geometry";

export interface SlashPoint {
  pos: Vec2;
  time: number;
}

export interface SlashTrail {
  points: SlashPoint[];
  active: boolean;
}