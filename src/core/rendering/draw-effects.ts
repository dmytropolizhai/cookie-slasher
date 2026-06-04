// Dark radial vignette overlay
export function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

// Full-screen white flash (e.g. on critical hit)
export function drawFlashFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  alpha: number,
): void {
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.fillRect(0, 0, w, h);
}

// Red edge vignette that flashes on damage
export function drawDamageVignette(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  alpha: number,
): void {
  if (alpha <= 0) return;
  const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.9);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.6, `rgba(180,0,0,${alpha * 0.3})`);
  grad.addColorStop(1, `rgba(255,0,0,${alpha * 0.75})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}
