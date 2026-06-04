import type { CookieEntity } from '@/types/cookie';
import { COOKIE_GLOW_COLORS } from './constants/colors';

const TAU = Math.PI * 2;

/**
 * Draw the cookie's edge ring and chocolate-chip pattern.
 * Shared by normal, fake, golden, and boss cookies.
 * @param ctx Canvas context
 * @param r Radius of the cookie
 * @param edgeColor Edge color
 * @param chipColor Chip color
 */
function drawCookieDetails(
  ctx: CanvasRenderingContext2D,
  r: number,
  edgeColor: string,
  chipColor: string,
): void {
  // Edge ring
  ctx.strokeStyle = edgeColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r - 1, 0, TAU);
  ctx.stroke();

  // Chocolate chips
  ctx.fillStyle = chipColor;
  const chips: [number, number][] = [
    [-r * 0.25, -r * 0.2],
    [r * 0.3, -r * 0.1],
    [0, r * 0.3],
    [-r * 0.35, r * 0.25],
    [r * 0.15, r * 0.15],
  ];
  for (const [cx, cy] of chips) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.1, r * 0.07, 0.3, 0, TAU);
    ctx.fill();
  }
}

/**
 * Draw bomb cookie body
 * @param ctx Canvas context
 * @param r Radius of the cookie
 */
function drawBombBody(ctx: CanvasRenderingContext2D, r: number): void {
  // Dark sphere
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#555');
  grad.addColorStop(1, '#111');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();

  // Fuse
  ctx.strokeStyle = '#FF8800';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r * 0.5, -r * 1.3, r * 0.3, -r * 1.6);
  ctx.stroke();

  // Warning cross
  ctx.strokeStyle = '#FF3300';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-r * 0.4, 0);
  ctx.lineTo(r * 0.4, 0);
  ctx.moveTo(0, -r * 0.4);
  ctx.lineTo(0, r * 0.4);
  ctx.stroke();

  // Specular highlight
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  ctx.arc(-r * 0.3, -r * 0.3, r * 0.3, 0, TAU);
  ctx.fill();
}

/**
 * Draw fake cookie body
 * @param ctx Canvas context
 * @param r Radius of the cookie
 */
function drawFakeBody(ctx: CanvasRenderingContext2D, r: number): void {
  const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.3, r * 0.05, 0, 0, r);
  grad.addColorStop(0, '#BBA070');
  grad.addColorStop(0.6, '#8B6040');
  grad.addColorStop(1, '#5A3A20');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();

  drawCookieDetails(ctx, r, '#6A4020', '#4A2010');
}

/**
 * Draw golden cookie body
 * @param ctx Canvas context
 * @param r Radius of the cookie
 */
function drawGoldenBody(ctx: CanvasRenderingContext2D, r: number): void {
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#FFF0A0');
  grad.addColorStop(0.5, '#FFD700');
  grad.addColorStop(1, '#AA7700');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();

  drawCookieDetails(ctx, r, '#AA7700', '#886600');

  // Orbiting sparkles
  ctx.fillStyle = 'rgba(255,255,200,0.8)';
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU + Date.now() * 0.002;
    const sx = Math.cos(a) * r * 0.6;
    const sy = Math.sin(a) * r * 0.6;
    ctx.beginPath();
    ctx.arc(sx, sy, 2, 0, TAU);
    ctx.fill();
  }
}

// Boss phase color palettes
const BOSS_PHASE_COLORS = {
  1: { inner: '#CC88FF', mid: '#9B00FF', outer: '#440088', edge: '#FF0080', chip: '#CC0060', halo: 270 },
  2: { inner: '#FF88CC', mid: '#FF0080', outer: '#660033', edge: '#FF44AA', chip: '#CC0044', halo: 320 },
  3: { inner: '#FFCC66', mid: '#FF6600', outer: '#662200', edge: '#FFAA00', chip: '#CC6600', halo: 30 },
} as const;

/**
 * Draw boss cookie body with phase-aware visuals
 * @param ctx Canvas context
 * @param r Radius of the cookie
 * @param hp Current health points
 * @param maxHp Maximum health points
 * @param phase Boss phase (1, 2, or 3)
 */
function drawBossBody(
  ctx: CanvasRenderingContext2D,
  r: number,
  hp: number,
  maxHp: number,
  phase: number,
): void {
  const p = (phase === 2 || phase === 3 ? phase : 1) as 1 | 2 | 3;
  const colors = BOSS_PHASE_COLORS[p];
  const t = Date.now();

  // Aura pulse behind the boss
  const pulseRadius = r + 14 + Math.sin(t * 0.003) * 6;
  const auraGrad = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, pulseRadius);
  auraGrad.addColorStop(0, `hsla(${colors.halo}, 100%, 60%, 0.0)`);
  auraGrad.addColorStop(1, `hsla(${colors.halo}, 100%, 60%, 0.25)`);
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(0, 0, pulseRadius, 0, TAU);
  ctx.fill();

  // Main body
  const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, colors.inner);
  grad.addColorStop(0.5, colors.mid);
  grad.addColorStop(1, colors.outer);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();

  drawCookieDetails(ctx, r, colors.edge, colors.chip);

  // Phase II: extra inner rune circle
  if (p >= 2) {
    ctx.save();
    ctx.rotate(t * 0.0012);
    ctx.strokeStyle = `hsla(${colors.halo}, 100%, 75%, 0.5)`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.55, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // Phase III: star-burst cracks
  if (p === 3) {
    ctx.save();
    ctx.rotate(t * 0.0008);
    ctx.strokeStyle = `rgba(255, 200, 100, 0.55)`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3);
      ctx.lineTo(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9);
      ctx.stroke();
    }
    ctx.restore();
  }

  // HP bar (only while damaged)
  if (hp < maxHp) {
    const barY = r + 8;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.roundRect(-r, barY, r * 2, 7, 3);
    ctx.fill();

    const hpFrac = hp / maxHp;
    const hpColor = hpFrac > 0.5 ? colors.mid : hpFrac > 0.25 ? '#FF8800' : '#FF2200';
    ctx.fillStyle = hpColor;
    ctx.beginPath();
    ctx.roundRect(-r, barY, r * 2 * hpFrac, 7, 3);
    ctx.fill();
  }

  // Spinning halo rings (count = phase)
  const ringCount = p;
  for (let ring = 0; ring < ringCount; ring++) {
    const ringOffset = ring * 10;
    const spinSpeed = 0.0008 * (1 + ring * 0.5) * (p >= 2 ? 2 : 1);
    ctx.save();
    ctx.rotate(t * spinSpeed + (ring * TAU) / ringCount);
    ctx.strokeStyle = `hsla(${(colors.halo + ring * 40) % 360}, 100%, 70%, ${0.7 - ring * 0.15})`;
    ctx.lineWidth = 2 - ring * 0.3;
    ctx.beginPath();
    ctx.arc(0, 0, r + 9 + ringOffset, 0, TAU * 0.8);
    ctx.stroke();
    ctx.restore();
  }

  // Phase label badge above the boss
  const label = p === 1 ? 'I' : p === 2 ? 'II' : 'III';
  ctx.fillStyle = `hsla(${colors.halo}, 100%, 75%, 0.9)`;
  ctx.font = `bold ${Math.round(r * 0.28)}px "Press Start 2P", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 0, 0);
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
}

/**
 * Draw normal cookie body
 * @param ctx Canvas context
 * @param r Radius of the cookie
 */
function drawNormalBody(ctx: CanvasRenderingContext2D, r: number): void {
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#F5C87A');
  grad.addColorStop(0.6, '#D4955A');
  grad.addColorStop(1, '#8B5A2B');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();

  drawCookieDetails(ctx, r, '#8B5A2B', '#6B3A1B');
}

/**
 * Draw cookie
 * @param ctx Canvas context
 * @param cookie Cookie entity
 * @param _timeScale Time scale
 */
export function drawCookie(
  ctx: CanvasRenderingContext2D,
  cookie: CookieEntity,
  _timeScale: number,
): void {
  const { pos, radius, rotation, type, hp, maxHp, glowIntensity } = cookie;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(rotation);

  const r = radius;

  // Per-type glow
  if (glowIntensity > 0) {
    ctx.shadowBlur = 20 * glowIntensity;
    ctx.shadowColor = COOKIE_GLOW_COLORS[type];
  }

  switch (type) {
    case 'bomb': drawBombBody(ctx, r); break;
    case 'fake': drawFakeBody(ctx, r); break;
    case 'golden': drawGoldenBody(ctx, r); break;
    case 'boss': drawBossBody(ctx, r, hp, maxHp, cookie.phase); break;
    default: drawNormalBody(ctx, r); break;
  }

  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.35, r * 0.2, -0.6, 0, TAU);
  ctx.fill();

  ctx.restore();
}
