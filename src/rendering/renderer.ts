import { CookieEntity, CookieHalf } from '@/types/cookie';
import type { Particle, SlashTrail, GameState } from '@/types';

// Cookie rendering
function drawCookie(
  ctx: CanvasRenderingContext2D,
  cookie: CookieEntity,
  timeScale: number
): void {
  const { pos, radius, rotation, type, hp, maxHp, glowIntensity } = cookie;
  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(rotation);

  const r = radius;

  // ── Glow ──
  if (glowIntensity > 0) {
    ctx.shadowBlur = 20 * glowIntensity;
    ctx.shadowColor =
      type === 'golden'
        ? '#FFD700'
        : type === 'fake'
        ? '#666'
        : type === 'bomb'
        ? '#FF4400'
        : type === 'boss'
        ? '#9B00FF'
        : '#FF9966';
  }

  // Body
  if (type === 'bomb') {
    // Dark sphere with red warning markings
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#555');
    grad.addColorStop(1, '#111');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
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

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.arc(-r * 0.3, -r * 0.3, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'fake') {
    // Slightly dull, greyish cookie - deceptive but subtly off
    const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.3, r * 0.05, 0, 0, r);
    grad.addColorStop(0, '#BBA070');
    grad.addColorStop(0.6, '#8B6040');
    grad.addColorStop(1, '#5A3A20');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    drawCookieDetails(ctx, r, '#6A4020', '#4A2010', false);
  } else if (type === 'golden') {
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#FFF0A0');
    grad.addColorStop(0.5, '#FFD700');
    grad.addColorStop(1, '#AA7700');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    drawCookieDetails(ctx, r, '#AA7700', '#886600', true);

    // Star sparkles
    ctx.fillStyle = 'rgba(255,255,200,0.8)';
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Date.now() * 0.002;
      const sx = Math.cos(a) * r * 0.6;
      const sy = Math.sin(a) * r * 0.6;
      ctx.beginPath();
      ctx.arc(sx, sy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'boss') {
    const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#CC88FF');
    grad.addColorStop(0.5, '#9B00FF');
    grad.addColorStop(1, '#440088');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    drawCookieDetails(ctx, r, '#FF0080', '#CC0060', true);

    // HP bar
    if (hp < maxHp) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(-r, r + 6, r * 2, 6);
      ctx.fillStyle = '#9B00FF';
      ctx.fillRect(-r, r + 6, r * 2 * (hp / maxHp), 6);
    }

    // Halo ring
    ctx.strokeStyle = `hsla(${Date.now() * 0.1 % 360}, 100%, 70%, 0.6)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r + 8, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // Normal cookie
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#F5C87A');
    grad.addColorStop(0.6, '#D4955A');
    grad.addColorStop(1, '#8B5A2B');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    drawCookieDetails(ctx, r, '#8B5A2B', '#6B3A1B', false);
  }

  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.35, r * 0.2, -0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCookieDetails(
  ctx: CanvasRenderingContext2D,
  r: number,
  edgeColor: string,
  chipColor: string,
  hasGlow: boolean
): void {
  // Edge
  ctx.strokeStyle = edgeColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r - 1, 0, Math.PI * 2);
  ctx.stroke();

  // Chocolate chips
  ctx.fillStyle = chipColor;
  const chips = [
    [-r * 0.25, -r * 0.2],
    [r * 0.3, -r * 0.1],
    [0, r * 0.3],
    [-r * 0.35, r * 0.25],
    [r * 0.15, r * 0.15],
  ];
  chips.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.1, r * 0.07, 0.3, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ─── Cookie Half ─────────────────────────────────────────────────────────────

function drawCookieHalf(ctx: CanvasRenderingContext2D, half: CookieHalf): void {
  const { pos, rotation, alpha, half: side, cookieType, slashAngle } = half;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(pos.x, pos.y);
  ctx.rotate(rotation);

  const r = 28;
  const sign = side === 'top' ? -1 : 1;

  ctx.beginPath();
  ctx.arc(0, 0, r, 0 + slashAngle, Math.PI + slashAngle, side === 'top');
  ctx.closePath();

  const fillColor =
    cookieType === 'golden'
      ? '#D4A000'
      : cookieType === 'fake'
      ? '#7A5040'
      : '#C47A3A';
  ctx.fillStyle = fillColor;
  ctx.fill();

  // Filling exposed cut
  ctx.fillStyle =
    cookieType === 'golden' ? '#FFD700' : cookieType === 'fake' ? '#5A4020' : '#D44A00';
  ctx.beginPath();
  ctx.ellipse(0, sign * 2, r, 4, slashAngle, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─── Particle Renderer ───────────────────────────────────────────────────────

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
  ctx.save();
  ctx.globalAlpha = p.alpha * p.life;
  ctx.translate(p.pos.x, p.pos.y);
  ctx.rotate(p.rotation);

  const s = p.size;

  if (p.type === 'sakura') {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `${p.color}88`;
    ctx.beginPath();
    ctx.ellipse(s * 0.3, s * 0.2, s * 0.5, s * 0.3, 0.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'goo') {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(0, 0, s, 0, Math.PI * 2);
    ctx.fill();
    // Drip
    ctx.fillRect(-s * 0.3, 0, s * 0.6, s * 0.8);
  } else if (p.type === 'slash') {
    ctx.strokeStyle = p.color;
    ctx.lineWidth = s * 0.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.moveTo(-s, 0);
    ctx.lineTo(s, 0);
    ctx.stroke();
  } else if (p.type === 'critical') {
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = p.color;
    ctx.fillRect(-s / 2, -s / 2, s, s);
  } else if (p.type === 'neon') {
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.arc(0, 0, s, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // crumb, spark, impact
    ctx.fillStyle = p.color;
    ctx.fillRect(-s / 2, -s / 2, s, s);
  }

  ctx.restore();
}

// ─── Slash Trail ─────────────────────────────────────────────────────────────

function drawSlashTrail(
  ctx: CanvasRenderingContext2D,
  slash: SlashTrail,
  now: number
): void {
  const { points, active } = slash;
  if (points.length < 2) return;

  const trailAge = 0.18; // seconds of trail to show

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const age0 = now - p0.time;
    const age1 = now - p1.time;
    if (age0 > trailAge) continue;

    const a0 = Math.max(0, 1 - age0 / trailAge);
    const a1 = Math.max(0, 1 - age1 / trailAge);
    const prog = i / points.length;
    const width = 4 + prog * 10;

    // Glow layer
    ctx.globalAlpha = a0 * 0.4;
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = width + 6;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00FFFF';
    ctx.beginPath();
    ctx.moveTo(p0.pos.x, p0.pos.y);
    ctx.lineTo(p1.pos.x, p1.pos.y);
    ctx.stroke();

    // Core layer
    ctx.globalAlpha = (a0 + a1) * 0.5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = width;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(p0.pos.x, p0.pos.y);
    ctx.lineTo(p1.pos.x, p1.pos.y);
    ctx.stroke();
  }

  ctx.restore();
}

// ─── Background ──────────────────────────────────────────────────────────────

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number
): void {
  // Gradient sky
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#0A0010');
  sky.addColorStop(0.5, '#12001E');
  sky.addColorStop(1, '#0A0A2A');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Grid floor
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = '#9B00FF';
  ctx.lineWidth = 1;
  const gridSize = 60;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, h * 0.55);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = h * 0.55; y < h; y += gridSize * 0.5) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();

  // City silhouette
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#1A003A';
  const buildings = [
    [0, 0.78, 0.06, 0.3],
    [0.05, 0.72, 0.04, 0.28],
    [0.1, 0.65, 0.08, 0.35],
    [0.18, 0.73, 0.05, 0.27],
    [0.24, 0.68, 0.06, 0.32],
    [0.3, 0.75, 0.04, 0.25],
    [0.35, 0.62, 0.07, 0.38],
    [0.43, 0.7, 0.05, 0.3],
    [0.5, 0.6, 0.09, 0.4],
    [0.6, 0.72, 0.06, 0.28],
    [0.67, 0.65, 0.05, 0.35],
    [0.73, 0.7, 0.08, 0.3],
    [0.82, 0.63, 0.06, 0.37],
    [0.89, 0.72, 0.05, 0.28],
    [0.95, 0.68, 0.05, 0.32],
  ];
  buildings.forEach(([bx, by, bw, bh]) => {
    ctx.fillRect(bx * w, by * h, bw * w, bh * h);
  });

  // Building windows
  ctx.fillStyle = '#9B00FF';
  ctx.globalAlpha = 0.3;
  buildings.forEach(([bx, by, bw]) => {
    for (let wy = 0; wy < 5; wy++) {
      for (let wx = 0; wx < 2; wx++) {
        if (Math.random() < 0.6) {
          ctx.fillRect(
            bx * w + bw * w * 0.2 + wx * bw * w * 0.45,
            by * h + wy * 14,
            bw * w * 0.25,
            6
          );
        }
      }
    }
  });
  ctx.restore();

  // Neon horizon line
  ctx.save();
  const horizon = ctx.createLinearGradient(0, 0, w, 0);
  horizon.addColorStop(0, 'transparent');
  horizon.addColorStop(0.3, '#FF0080');
  horizon.addColorStop(0.5, '#9B00FF');
  horizon.addColorStop(0.7, '#00FFFF');
  horizon.addColorStop(1, 'transparent');
  ctx.strokeStyle = horizon;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.7 + Math.sin(time * 2) * 0.15;
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#FF0080';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.78);
  ctx.lineTo(w, h * 0.78);
  ctx.stroke();
  ctx.restore();
}

// ─── Screen Shake + Vignette ─────────────────────────────────────────────────

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

// ─── Flash Frame ─────────────────────────────────────────────────────────────

export function drawFlashFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  alpha: number
): void {
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.fillRect(0, 0, w, h);
}

// ─── Main Render Call ────────────────────────────────────────────────────────

export function renderFrame(params: {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  cookies: CookieEntity[];
  halves: CookieHalf[];
  particles: Particle[];
  slash: SlashTrail;
  game: GameState;
  now: number;
  time: number;
  flashAlpha: number;
}): void {
  const { ctx, w, h, cookies, halves, particles, slash, game, now, time, flashAlpha } = params;

  // Screen shake transform
  const shakeX = (Math.random() - 0.5) * game.screenShake * 8;
  const shakeY = (Math.random() - 0.5) * game.screenShake * 8;
  ctx.clearRect(0, 0, w, h);

  ctx.save();
  ctx.translate(shakeX, shakeY);

  // 1. Background
  drawBackground(ctx, w, h, time);

  // 2. Particles (below cookies)
  const bgParticles = particles.filter((p) => p.type === 'sakura' || p.type === 'neon');
  bgParticles.forEach((p) => drawParticle(ctx, p));

  // 3. Cookie halves
  halves.forEach((h2) => drawCookieHalf(ctx, h2));

  // 4. Cookies
  cookies
    .filter((c) => c.state === 'falling')
    .forEach((c) => drawCookie(ctx, c, game.timeScale));

  // 5. Foreground particles
  const fgParticles = particles.filter((p) => p.type !== 'sakura' && p.type !== 'neon');
  fgParticles.forEach((p) => drawParticle(ctx, p));

  // 6. Slash trail
  drawSlashTrail(ctx, slash, now);

  // 7. Vignette
  drawVignette(ctx, w, h);

  // 8. Flash frame
  if (flashAlpha > 0) {
    drawFlashFrame(ctx, w, h, flashAlpha);
  }

  ctx.restore();
}
