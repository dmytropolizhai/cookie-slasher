import type { Particle } from '../../types';

export function tickParticle(p: Particle, dt: number, time: number): boolean {
  p.life -= dt / p.maxLife;
  if (p.life <= 0) return false;
  p.pos.x += p.vel.x * dt;
  p.pos.y += p.vel.y * dt;
  p.vel.y += p.gravity * dt;
  p.rotation += p.rotationSpeed * dt;
  if (p.type === 'sakura') {
    p.vel.x += Math.sin(time * 1.5 + p.pos.x * 0.01) * 15 * dt;
    p.vel.x *= 0.99;
  }
  if (p.shrink > 0) {
    p.size = Math.max(0.5, p.size - p.shrink * dt);
  }
  return true;
}
