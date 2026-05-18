import type { CookieHalf } from '@/types/cookie';
import { HALF_FILL_COLORS, HALF_CUT_COLORS } from './constants/colors';

const TAU = Math.PI * 2;
const HALF_RADIUS = 28;

/**
 * Draw cookie half
 * @param ctx Canvas context
 * @param half Cookie half entity
 */
export function drawCookieHalf(
  ctx: CanvasRenderingContext2D,
  { pos, rotation, alpha, half: side, cookieType, slashAngle }: CookieHalf,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(pos.x, pos.y);
  ctx.rotate(rotation);

  const r = HALF_RADIUS;
  const sign = side === 'top' ? -1 : 1;

  // Semi-circle body
  ctx.beginPath();
  ctx.arc(0, 0, r, slashAngle, Math.PI + slashAngle, side === 'top');
  ctx.closePath();
  ctx.fillStyle = HALF_FILL_COLORS[cookieType];
  ctx.fill();

  // Exposed cross-section
  ctx.fillStyle = HALF_CUT_COLORS[cookieType];
  ctx.beginPath();
  ctx.ellipse(0, sign * 2, r, 4, slashAngle, 0, TAU);
  ctx.fill();

  ctx.restore();
}
