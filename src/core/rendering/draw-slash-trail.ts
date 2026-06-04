import type { SlashTrail } from '@/types';
import { SLASH_GLOW_COLOR, SLASH_CORE_COLOR } from './constants/colors';

const TRAIL_DURATION = 0.18;
const BASE_WIDTH = 4;
const WIDTH_GROWTH = 10;
const GLOW_EXTRA_WIDTH = 6;
const GLOW_BLUR = 15;

export function drawSlashTrail(
  ctx: CanvasRenderingContext2D,
  slash: SlashTrail,
  now: number,
  glowColor?: string,
  coreColor?: string,
): void {
  const effectiveGlow = glowColor ?? SLASH_GLOW_COLOR;
  const effectiveCore = coreColor ?? SLASH_CORE_COLOR;
  const { points } = slash;
  if (points.length < 2) return;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const age0 = now - p0.time;
    const age1 = now - p1.time;
    if (age0 > TRAIL_DURATION) continue;

    const a0 = Math.max(0, 1 - age0 / TRAIL_DURATION);
    const a1 = Math.max(0, 1 - age1 / TRAIL_DURATION);
    const prog = i / points.length;
    const width = BASE_WIDTH + prog * WIDTH_GROWTH;

    // Outer glow
    ctx.globalAlpha = a0 * 0.4;
    ctx.strokeStyle = effectiveGlow;
    ctx.lineWidth = width + GLOW_EXTRA_WIDTH;
    ctx.shadowBlur = GLOW_BLUR;
    ctx.shadowColor = effectiveGlow;
    ctx.beginPath();
    ctx.moveTo(p0.pos.x, p0.pos.y);
    ctx.lineTo(p1.pos.x, p1.pos.y);
    ctx.stroke();

    // Inner core
    ctx.globalAlpha = (a0 + a1) * 0.5;
    ctx.strokeStyle = effectiveCore;
    ctx.lineWidth = width;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(p0.pos.x, p0.pos.y);
    ctx.lineTo(p1.pos.x, p1.pos.y);
    ctx.stroke();
  }

  ctx.restore();
}
