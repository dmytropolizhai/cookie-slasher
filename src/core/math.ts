import type { Vec2 } from '@/types';

let _entityId = 0;
export const uid = () => `e${++_entityId}`;
export const resetEntityId = () => { _entityId = 0; };

export function distance(a: Vec2, b: Vec2): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
