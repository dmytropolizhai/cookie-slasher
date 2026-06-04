import type { CookieEntity } from '@/types';

export type CookieStep =
  | { action: 'remove' }
  | { action: 'missed' }
  | { action: 'update'; patch: Partial<CookieEntity> };

export function stepCookie(cookie: CookieEntity, dt: number, canvasHeight: number): CookieStep {
  if (cookie.state !== 'falling') return { action: 'remove' };

  const newPos = {
    x: cookie.pos.x + cookie.vel.x * dt,
    y: cookie.pos.y + cookie.vel.y * dt,
  };

  if (newPos.y > canvasHeight + 60) {
    // bomb, fake, cursed, spirit vanish silently without a miss penalty
    const noMiss = cookie.type === 'bomb' || cookie.type === 'fake'
      || cookie.type === 'cursed' || cookie.type === 'spirit';
    if (!noMiss) return { action: 'missed' };
    return { action: 'remove' };
  }

  return {
    action: 'update',
    patch: {
      pos: newPos,
      rotation: cookie.rotation + cookie.rotationSpeed * dt,
      vel: { x: cookie.vel.x * 0.995, y: cookie.vel.y },
    },
  };
}
