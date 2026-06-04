export interface BossPhaseData {
  phase: 1 | 2 | 3;
  label: string;
  hpTotal: number;
  color: string;
  glowColor: string;
  auraColor: string;
  haloSpinSpeed: number;
  ringCount: number;
  speedMultiplier: number;
  sizeMultiplier: number;
  enrageParticles: boolean;
}

export const BOSS_PHASES: Record<1 | 2 | 3, BossPhaseData> = {
  1: {
    phase: 1,
    label: 'PHASE I',
    hpTotal: 6,
    color: '#9B00FF',
    glowColor: '#CC44FF',
    auraColor: 'rgba(155, 0, 255, 0.15)',
    haloSpinSpeed: 0.8,
    ringCount: 1,
    speedMultiplier: 1.0,
    sizeMultiplier: 1.0,
    enrageParticles: false,
  },
  2: {
    phase: 2,
    label: 'PHASE II',
    hpTotal: 10,
    color: '#FF0080',
    glowColor: '#FF44AA',
    auraColor: 'rgba(255, 0, 128, 0.2)',
    haloSpinSpeed: 1.6,
    ringCount: 2,
    speedMultiplier: 1.3,
    sizeMultiplier: 1.15,
    enrageParticles: true,
  },
  3: {
    phase: 3,
    label: 'PHASE III',
    hpTotal: 14,
    color: '#FF6600',
    glowColor: '#FFAA00',
    auraColor: 'rgba(255, 102, 0, 0.25)',
    haloSpinSpeed: 2.8,
    ringCount: 3,
    speedMultiplier: 1.6,
    sizeMultiplier: 1.3,
    enrageParticles: true,
  },
};

export function getBossPhase(wave: number): 1 | 2 | 3 {
  if (wave >= 15) return 3;
  if (wave >= 10) return 2;
  return 1;
}

export function getBossHpForPhase(phase: 1 | 2 | 3): number {
  return BOSS_PHASES[phase].hpTotal;
}
