import type { Particle, Vec2, CookieType } from '@/types';
import { makeParticle, recycleParticle } from './make-particle';
import { COOKIE_COLORS, NEON_COLORS } from './colors';

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Cookie crumbs burst
 * @param pos - Position of the cookie
 * @param cookieType - Type of the cookie
 * @param count - Number of particles to create
 */
export function makeCrumbs(pos: Vec2, cookieType: CookieType, count = 12): Particle[] {
  const colors = COOKIE_COLORS[cookieType];
  return Array.from({ length: count }, () => {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(80, 260);
    return makeParticle(
      'crumb',
      pos,
      { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed - rand(30, 100) },
      rand(3, 9),
      colors[Math.floor(Math.random() * colors.length)],
      rand(0.6, 1.4),
      { gravity: 350, shrink: 0.6 }
    );
  });
}

/**
 * Goo splatter effect
 * @param pos - Position of the cookie
 * @param cookieType - Type of the cookie
 * @param count - Number of particles to create
 */
export function makeGoo(pos: Vec2, cookieType: CookieType, count = 8): Particle[] {
  const gooColor = cookieType === 'golden' ? '#FFD700' : cookieType === 'fake' ? '#4A4A00' : '#D4622A';
  return Array.from({ length: count }, () => {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(40, 140);
    return makeParticle(
      'goo',
      pos,
      { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      rand(6, 18),
      gooColor,
      rand(0.8, 1.8),
      { gravity: 200, shrink: 0.4, rotationSpeed: 0 }
    );
  });
}

/**
 * Slash particles
 * @param pos - Position of the slash
 * @param angle - Angle of the slash
 * @param count - Number of particles to create
 */
export function makeSlashParticles(pos: Vec2, angle: number, count = 6): Particle[] {
  return Array.from({ length: count }, () => {
    const spread = rand(-0.5, 0.5);
    const a = angle + spread;
    const speed = rand(120, 300);
    return makeParticle(
      'slash',
      pos,
      { x: Math.cos(a) * speed, y: Math.sin(a) * speed },
      rand(2, 5),
      `hsl(${rand(180, 220)}, 100%, 70%)`,
      rand(0.2, 0.5),
      { gravity: 0, shrink: 1.5 }
    );
  });
}

/**
 * Critical burst particles
 * @param pos - Position of the burst
 * @param count - Number of particles to create
 */
export function makeCriticalBurst(pos: Vec2, count = 20): Particle[] {
  return Array.from({ length: count }, () => {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(100, 400);
    const hue = rand(0, 60);
    return makeParticle(
      'critical',
      pos,
      { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed - 50 },
      rand(4, 14),
      `hsl(${hue}, 100%, 70%)`,
      rand(0.5, 1.0),
      { gravity: 80, shrink: 0.8 }
    );
  });
}

/**
 * Impact sparks particles
 * @param pos - Position of the impact
 * @param count - Number of particles to create
 */
export function makeImpactSparks(pos: Vec2, count = 10): Particle[] {
  return Array.from({ length: count }, () => {
    const angle = rand(-Math.PI, 0);
    const speed = rand(60, 200);
    return makeParticle(
      'spark',
      pos,
      { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      rand(1, 4),
      `hsl(${rand(40, 70)}, 100%, 85%)`,
      rand(0.15, 0.4),
      { gravity: 400, shrink: 1.2 }
    );
  });
}

/**
 * Sakura petal particles
 * @param canvasWidth - Width of the canvas
 */
export function makeSakuraPetal(canvasWidth: number): Particle {
  const pos: Vec2 = { x: rand(0, canvasWidth), y: -20 };
  const vel: Vec2 = { x: rand(-30, 30), y: rand(20, 60) };
  return makeParticle(
    'sakura',
    pos,
    vel,
    rand(3, 8),
    `hsl(${rand(330, 360)}, 80%, ${rand(75, 90)}%)`,
    rand(8, 16),
    { gravity: 10, shrink: 0, rotationSpeed: rand(-1, 1) }
  );
}

/**
 * Explosion particles
 * @param pos - Position of the explosion
 * @param count - Number of particles to create
 */
export function makeExplosion(pos: Vec2, count = 24): Particle[] {
  return Array.from({ length: count }, () => {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(60, 360);
    const isCore = Math.random() < 0.3;
    return makeParticle(
      'neon',
      pos,
      { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed - 40 },
      isCore ? rand(8, 20) : rand(3, 8),
      isCore ? '#FF6600' : `hsl(${rand(0, 30)}, 100%, 65%)`,
      rand(0.4, 1.0),
      { gravity: isCore ? 150 : 80, shrink: 0.7 }
    );
  });
}

/**
 * Neon fragments particles
 * @param pos - Position of the fragments
 * @param count - Number of particles to create
 */
export function makeNeonFragments(pos: Vec2, count = 8): Particle[] {
  return Array.from({ length: count }, () => {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(100, 280);
    return makeParticle(
      'neon',
      pos,
      { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      rand(2, 6),
      NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      rand(0.3, 0.8),
      { gravity: 60, shrink: 0.5 }
    );
  });
}