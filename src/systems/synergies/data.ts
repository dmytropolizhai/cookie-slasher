import type { SynergyDef } from './types';

export const SYNERGIES: SynergyDef[] = [
  {
    id: 'soul_overflow',
    name: 'Soul Overflow',
    nameJP: '霊魂爆発',
    description:
      'The shard and the overflow feed each other. Every time a wave clears, the excess spirit floods your wounds — each HP above the base grants a burst of bonus reiki.',
    requires: ['soul_shard', 'spirit_overflow'],
    color: '#FF44AA',
    icon: '♥◉',
  },
  {
    id: 'phantom_chrono',
    name: 'Phantom Chrono',
    nameJP: '幻時切断',
    description:
      'Silk threads bind each moment of slow time. While the world crawls under Chronoslice Protocol, the Phantom Thread refuses to decay — your combo hangs suspended in frozen seconds.',
    requires: ['phantom_thread', 'chrono_slice'],
    color: '#AA44FF',
    icon: '∞⊙',
  },
  {
    id: 'ghost_fortune',
    name: 'Ghost Fortune',
    nameJP: '亡霊の黄金',
    description:
      'The spectral echo craves gold above all else. Your phantom strike doubles its chances when it senses golden aura — fortune and ghost become inseparable hunters.',
    requires: ['ghost_multiplier', 'fortune_magnet'],
    color: '#FFD700',
    icon: '◑★',
  },
  {
    id: 'blast_surge',
    name: 'Blast Surge',
    nameJP: '爆破加速',
    description:
      'The rune\'s sacrifice ignites the blade. After absorbing an explosion, your momentum peaks — the next five slices cut so fast they are guaranteed to trigger critical strikes.',
    requires: ['blast_rune', 'crumb_accelerator'],
    color: '#FF6600',
    icon: '✦►',
  },
];
