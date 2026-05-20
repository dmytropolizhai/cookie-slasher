import { distance } from '@/core/math';
import type { Vec2 } from '@/types';

export function checkSlashHit(
  cookiePos: Vec2,
  cookieRadius: number,
  p0: Vec2,
  p1: Vec2,
): boolean {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return distance(cookiePos, p0) < cookieRadius;
  const t = Math.max(0, Math.min(1, ((cookiePos.x - p0.x) * dx + (cookiePos.y - p0.y) * dy) / len2));
  const closest = { x: p0.x + t * dx, y: p0.y + t * dy };
  return distance(cookiePos, closest) < cookieRadius + 10;
}
