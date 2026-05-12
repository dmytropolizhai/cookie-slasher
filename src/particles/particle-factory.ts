import type { Particle, ParticleType, Vec2, CookieType } from '../types';

let _id = 0;
const uid = () => `p${++_id}`;

// ─── Pool ─────────────────────────────────────────────────────────────────────

const pool: Particle[] = [];

function acquire(): Particle {
  return (
    pool.pop() ?? {
      id: uid(),
      type: 'crumb',
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      size: 4,
      alpha: 1,
      color: '#fff',
      life: 1,
      maxLife: 1,
      rotation: 0,
      rotationSpeed: 0,
      gravity: 0,
      shrink: 0,
    }
  );
}

export function recycleParticle(p: Particle): void {
  if (pool.length < 500) pool.push(p);
}

// ─── Factories ────────────────────────────────────────────────────────────────

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function makeParticle(
  type: ParticleType,
  pos: Vec2,
  vel: Vec2,
  size: number,
  color: string,
  maxLife: number,
  extras?: Partial<Particle>
): Particle {
  const p = acquire();
  p.id = uid();
  p.type = type;
  p.pos = { ...pos };
  p.vel = { ...vel };
  p.size = size;
  p.alpha = 1;
  p.color = color;
  p.life = 1;
  p.maxLife = maxLife;
  p.rotation = rand(0, Math.PI * 2);
  p.rotationSpeed = rand(-4, 4);
  p.gravity = 180;
  p.shrink = 0;
  Object.assign(p, extras);
  return p;
}

// ─── Crumb Burst ─────────────────────────────────────────────────────────────

const COOKIE_COLORS: Record<CookieType, string[]> = {
  normal: ['#D4955A', '#C47A3A', '#E8B080', '#F5D6A8'],
  golden: ['#FFD700', '#FFA500', '#FFEC6E', '#FF8C00'],
  fake: ['#8B4513', '#666', '#333', '#A0522D'],
  bomb: ['#FF4444', '#FF0000', '#FF6600', '#333'],
  boss: ['#9B00FF', '#FF0080', '#00FFFF', '#FFD700'],
};

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

// ─── Goo Splatter ─────────────────────────────────────────────────────────────

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

// ─── Slash Particles ──────────────────────────────────────────────────────────

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

// ─── Critical Particles ───────────────────────────────────────────────────────

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

// ─── Impact Spark ─────────────────────────────────────────────────────────────

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

// ─── Sakura Petals ────────────────────────────────────────────────────────────

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

// ─── Explosion ────────────────────────────────────────────────────────────────

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

// ─── Neon Fragment ────────────────────────────────────────────────────────────

export function makeNeonFragments(pos: Vec2, count = 8): Particle[] {
  const neonColors = ['#FF0080', '#00FFFF', '#FFE600', '#9B00FF', '#00FF88'];
  return Array.from({ length: count }, () => {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(100, 280);
    return makeParticle(
      'neon',
      pos,
      { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      rand(2, 6),
      neonColors[Math.floor(Math.random() * neonColors.length)],
      rand(0.3, 0.8),
      { gravity: 60, shrink: 0.5 }
    );
  });
}
