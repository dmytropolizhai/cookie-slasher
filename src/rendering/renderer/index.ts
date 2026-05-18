import type { CookieEntity, CookieHalf } from '@/types/cookie';
import type { Particle, SlashTrail, GameState } from '@/types';

import { drawCookie } from './draw-cookie';
import { drawCookieHalf } from './draw-cookie-half';
import { drawParticle } from './draw-particle';
import { drawSlashTrail } from './draw-slash-trail';
import { drawBackground, type BackgroundContextWithTime } from './draw-background';
import { drawVignette, drawFlashFrame } from './draw-effects';

export { drawFlashFrame };

type RenderFrameParams = BackgroundContextWithTime & {
  cookies: CookieEntity[];
  halves: CookieHalf[];
  particles: Particle[];
  slash: SlashTrail;
  game: GameState;
  now: number;
  flashAlpha: number;
}

const BG_PARTICLE_TYPES = new Set(['sakura', 'neon']);

function isBackgroundParticle(p: Particle): boolean {
  return BG_PARTICLE_TYPES.has(p.type);
}


export function renderFrame({
  ctx,
  width,
  height,
  cookies,
  halves,
  particles,
  slash,
  game,
  now,
  time,
  flashAlpha,
}: RenderFrameParams): void {

  // Screen shake
  const shakeX = (Math.random() - 0.5) * game.screenShake * 8;
  const shakeY = (Math.random() - 0.5) * game.screenShake * 8;
  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.translate(shakeX, shakeY);

  // Background scene
  drawBackground({ ctx, width, height, time });

  // Background particles (sakura petals, neon dots)
  for (const p of particles) {
    if (isBackgroundParticle(p)) drawParticle(ctx, p);
  }

  // Sliced cookie halves
  for (const half of halves) {
    drawCookieHalf(ctx, half);
  }

  // Active cookies
  for (const c of cookies) {
    if (c.state === 'falling') drawCookie(ctx, c, game.timeScale);
  }

  // Foreground particles (crumbs, sparks, slashes, etc.)
  for (const p of particles) {
    if (!isBackgroundParticle(p)) drawParticle(ctx, p);
  }

  // Slash trail
  drawSlashTrail(ctx, slash, now);

  // Vignette overlay
  drawVignette(ctx, width, height);

  // Flash frame
  if (flashAlpha > 0) {
    drawFlashFrame(ctx, width, height, flashAlpha);
  }

  ctx.restore();
}
