import type { CookieEntity, CookieType } from '@/types';
import { uid } from '@/core/math';

export function spawnCookie(type: CookieType, canvasWidth: number, speed: number): CookieEntity {
  const x = 60 + Math.random() * (canvasWidth - 120);
  const isBoss = type === 'boss';
  return {
    id: uid(),
    type,
    pos: { x, y: -40 },
    vel: { x: (Math.random() - 0.5) * 60, y: speed },
    radius: isBoss ? 55 : type === 'golden' ? 34 : 28,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 3,
    state: 'falling',
    hp: isBoss ? 8 : 1,
    maxHp: isBoss ? 8 : 1,
    phase: 0,
    spawnTime: performance.now() / 1000,
    scale: 1,
    glowIntensity: type === 'golden' || type === 'boss' ? 1 : 0,
  };
}
