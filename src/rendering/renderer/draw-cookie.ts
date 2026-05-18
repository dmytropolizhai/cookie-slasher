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

/**
 * Draw boss cookie body
 * @param ctx Canvas context
 * @param r Radius of the cookie
 * @param hp Current health points
 * @param maxHp Maximum health points
 */
function drawBossBody(ctx: CanvasRenderingContext2D, r: number, hp: number, maxHp: number): void {
  const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#CC88FF');
  grad.addColorStop(0.5, '#9B00FF');
  grad.addColorStop(1, '#440088');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();

  drawCookieDetails(ctx, r, '#FF0080', '#CC0060');

  // HP bar (only while damaged)
  if (hp < maxHp) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(-r, r + 6, r * 2, 6);
    ctx.fillStyle = '#9B00FF';
    ctx.fillRect(-r, r + 6, r * 2 * (hp / maxHp), 6);
  }

  // Animated halo ring
  ctx.strokeStyle = `hsla(${Date.now() * 0.1 % 360}, 100%, 70%, 0.6)`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r + 8, 0, TAU);
  ctx.stroke();
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
    case 'boss': drawBossBody(ctx, r, hp, maxHp); break;
    default: drawNormalBody(ctx, r); break;
  }

  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.35, r * 0.2, -0.6, 0, TAU);
  ctx.fill();

  ctx.restore();
}
