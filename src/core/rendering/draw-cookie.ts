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
 * Draw frozen cookie body — icy blue with snowflake details and frost cracks
 * @param ctx Canvas context
 * @param r Radius of the cookie
 */
function drawFrozenBody(ctx: CanvasRenderingContext2D, r: number): void {
  const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.05, 0, 0, r);
  grad.addColorStop(0, '#E0F4FF');
  grad.addColorStop(0.4, '#88CCFF');
  grad.addColorStop(1, '#0055AA');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();

  // Frost cracks radiating from center
  ctx.strokeStyle = 'rgba(200,240,255,0.6)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85);
    ctx.stroke();
    // branch off
    const branchA = a + 0.4;
    const branchLen = r * 0.3;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r * 0.45, Math.sin(a) * r * 0.45);
    ctx.lineTo(
      Math.cos(a) * r * 0.45 + Math.cos(branchA) * branchLen,
      Math.sin(a) * r * 0.45 + Math.sin(branchA) * branchLen,
    );
    ctx.stroke();
  }

  // Edge ring with shimmer
  ctx.strokeStyle = '#AADDFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r - 1, 0, TAU);
  ctx.stroke();

  // Animated sparkle dots
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU + Date.now() * 0.0015;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, 2, 0, TAU);
    ctx.fill();
  }
}

/**
 * Draw cursed cookie body — dark purple with skull symbol and pulsing runes
 * @param ctx Canvas context
 * @param r Radius of the cookie
 */
function drawCursedBody(ctx: CanvasRenderingContext2D, r: number): void {
  const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.05, 0, 0, r);
  grad.addColorStop(0, '#660099');
  grad.addColorStop(0.5, '#330066');
  grad.addColorStop(1, '#0A0010');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();

  // Pulsing edge ring
  const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.004);
  ctx.strokeStyle = `rgba(180,0,255,${0.4 + pulse * 0.6})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r - 1, 0, TAU);
  ctx.stroke();

  // Skull-like eye dots
  ctx.fillStyle = `rgba(255,0,220,${0.7 + pulse * 0.3})`;
  ctx.beginPath();
  ctx.arc(-r * 0.22, -r * 0.15, r * 0.09, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 0.22, -r * 0.15, r * 0.09, 0, TAU);
  ctx.fill();

  // Frowning mouth curve
  ctx.strokeStyle = `rgba(255,0,220,${0.7 + pulse * 0.3})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, r * 0.1, r * 0.25, 0.3, Math.PI - 0.3);
  ctx.stroke();

  // Orbiting rune dots
  ctx.fillStyle = `rgba(220,0,255,${0.6 + pulse * 0.4})`;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU + Date.now() * 0.002;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.75, 2.5, 0, TAU);
    ctx.fill();
  }
}

/**
 * Draw mirror cookie body — chrome-like reflective surface with split effect
 * @param ctx Canvas context
 * @param r Radius of the cookie
 */
function drawMirrorBody(ctx: CanvasRenderingContext2D, r: number): void {
  const grad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.05, 0, 0, r);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.3, '#AACCEE');
  grad.addColorStop(0.7, '#4488BB');
  grad.addColorStop(1, '#113366');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();

  // Vertical mirror seam
  ctx.strokeStyle = 'rgba(200,240,255,0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.9);
  ctx.lineTo(0, r * 0.9);
  ctx.stroke();

  // Reflection shimmer lines (horizontal)
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) {
    const y = i * r * 0.25;
    const hw = Math.sqrt(Math.max(0, r * r - y * y)) * 0.9;
    ctx.beginPath();
    ctx.moveTo(-hw, y);
    ctx.lineTo(hw, y);
    ctx.stroke();
  }

  // Edge ring
  ctx.strokeStyle = '#88CCFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r - 1, 0, TAU);
  ctx.stroke();

  // Animated glint
  const t = Date.now() * 0.003;
  const gx = Math.cos(t) * r * 0.5;
  const gy = Math.sin(t * 0.7) * r * 0.5;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(gx, gy, 3, 0, TAU);
  ctx.fill();
}

/**
 * Draw spirit cookie body — translucent with ghostly wisp trails
 * @param ctx Canvas context
 * @param r Radius of the cookie
 * @param spawnTime Time when cookie was spawned (for phasing animation)
 */
function drawSpiritBody(ctx: CanvasRenderingContext2D, r: number, spawnTime: number): void {
  const t = performance.now() / 1000;
  const phase = (t - spawnTime) * 1.8;
  const visibility = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(phase));

  ctx.globalAlpha *= visibility;

  const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.05, 0, 0, r);
  grad.addColorStop(0, '#CCFFEE');
  grad.addColorStop(0.5, '#00FFAA');
  grad.addColorStop(1, 'rgba(0,150,80,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();

  // Wisp tendrils
  ctx.strokeStyle = 'rgba(0,255,170,0.7)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU + phase * 0.3;
    const len = r * (0.5 + 0.4 * Math.sin(phase + i));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(
      Math.cos(a + 0.5) * r * 0.4,
      Math.sin(a + 0.5) * r * 0.4,
      Math.cos(a) * len,
      Math.sin(a) * len,
    );
    ctx.stroke();
  }

  // Glowing core
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.15, 0, TAU);
  ctx.fill();
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
  const { pos, radius, rotation, type, hp, maxHp, glowIntensity, spawnTime } = cookie;

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
    case 'frozen': drawFrozenBody(ctx, r); break;
    case 'cursed': drawCursedBody(ctx, r); break;
    case 'mirror': drawMirrorBody(ctx, r); break;
    case 'spirit': drawSpiritBody(ctx, r, spawnTime); break;
    default: drawNormalBody(ctx, r); break;
  }

  // Skip the universal highlight for spirit (already alpha-blended) and bomb
  if (type !== 'spirit' && type !== 'bomb') {
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.35, r * 0.2, -0.6, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}
