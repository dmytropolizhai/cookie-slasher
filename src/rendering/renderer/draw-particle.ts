import type { Particle, ParticleType } from '@/types';

const TAU = Math.PI * 2;

function drawSakura(ctx: CanvasRenderingContext2D, s: number, color: string): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, s, s * 0.5, 0, 0, TAU);
  ctx.fill();

  ctx.fillStyle = `${color}88`;
  ctx.beginPath();
  ctx.ellipse(s * 0.3, s * 0.2, s * 0.5, s * 0.3, 0.5, 0, TAU);
  ctx.fill();
}

function drawGoo(ctx: CanvasRenderingContext2D, s: number, color: string): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, s, 0, TAU);
  ctx.fill();
  // Drip
  ctx.fillRect(-s * 0.3, 0, s * 0.6, s * 0.8);
}

function drawSlash(ctx: CanvasRenderingContext2D, s: number, color: string): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.5;
  ctx.shadowBlur = 8;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.moveTo(-s, 0);
  ctx.lineTo(s, 0);
  ctx.stroke();
}

function drawCritical(ctx: CanvasRenderingContext2D, s: number, color: string): void {
  ctx.fillStyle = color;
  ctx.shadowBlur = 12;
  ctx.shadowColor = color;
  ctx.fillRect(-s / 2, -s / 2, s, s);
}

function drawNeon(ctx: CanvasRenderingContext2D, s: number, color: string): void {
  ctx.fillStyle = color;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.arc(0, 0, s, 0, TAU);
  ctx.fill();
}

function drawDefault(ctx: CanvasRenderingContext2D, s: number, color: string): void {
  // crumb, spark, impact, smoke
  ctx.fillStyle = color;
  ctx.fillRect(-s / 2, -s / 2, s, s);
}

/** Lookup table so we avoid a long if-else chain at runtime */
const DRAW_FNS: Partial<Record<ParticleType, typeof drawDefault>> = {
  sakura: drawSakura,
  goo: drawGoo,
  slash: drawSlash,
  critical: drawCritical,
  neon: drawNeon,
};

export function drawParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
  ctx.save();
  ctx.globalAlpha = p.alpha * p.life;
  ctx.translate(p.pos.x, p.pos.y);
  ctx.rotate(p.rotation);

  const draw = DRAW_FNS[p.type] ?? drawDefault;
  draw(ctx, p.size, p.color);

  ctx.restore();
}
