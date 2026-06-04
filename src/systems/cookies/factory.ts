import type { CookieEntity, CookieType } from '@/types';
import { uid } from '@/core/math';
import { getBossHpForPhase, getBossPhase, BOSS_PHASES } from '@/systems/boss/data';

function radiusForType(type: CookieType): number {
  if (type === 'boss') return 55;
  if (type === 'golden') return 34;
  if (type === 'mirror') return 30;
  return 28;
}

function glowForType(type: CookieType): number {
  if (type === 'golden' || type === 'boss') return 1;
  if (type === 'frozen') return 0.7;
  if (type === 'cursed') return 0.8;
  if (type === 'spirit') return 0.6;
  return 0;
}

export function spawnCookie(type: CookieType, canvasWidth: number, speed: number, wave = 1): CookieEntity {
  const x = 60 + Math.random() * (canvasWidth - 120);
  const isBoss = type === 'boss';
  const bossPhase = isBoss ? getBossPhase(wave) : 1;
  const phaseData = isBoss ? BOSS_PHASES[bossPhase] : null;
  const baseRadius = isBoss ? 55 : type === 'golden' ? 34 : 28;
  const radius = isBoss && phaseData ? Math.round(baseRadius * phaseData.sizeMultiplier) : baseRadius;
  const bossHp = isBoss ? getBossHpForPhase(bossPhase) : 1;
  const bossSpeed = isBoss && phaseData ? speed * phaseData.speedMultiplier : speed;

  return {
    id: uid(),
    type,
    pos: { x, y: -40 },
    vel: { x: (Math.random() - 0.5) * 60, y: bossSpeed },
    radius: radiusForType(type),
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 3,
    state: 'falling',
    hp: bossHp,
    maxHp: bossHp,
    phase: isBoss ? bossPhase : 0,
    spawnTime: performance.now() / 1000,
    scale: 1,
    glowIntensity: glowForType(type),
  };
}
