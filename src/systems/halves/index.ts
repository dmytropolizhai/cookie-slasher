import type { CookieHalf } from "@/types";

export function stepHalf(half: CookieHalf, dt: number, canvasHeight: number): boolean {
  const newPos = { x: half.pos.x + half.vel.x * dt, y: half.pos.y + half.vel.y * dt };
  const newAlpha = half.alpha - dt * 0.9;
  if (newAlpha <= 0 || newPos.y > canvasHeight + 100) return false;
  half.pos = newPos;
  half.vel = { x: half.vel.x, y: half.vel.y + 400 * dt };
  half.alpha = newAlpha;
  half.rotation += half.rotationSpeed * dt;
  return true;
}
