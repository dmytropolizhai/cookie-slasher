export interface SlashSkin {
  id: string;
  name: string;
  nameJP: string;
  description: string;
  /** Outer glow stroke color */
  glowColor: string;
  /** Inner core stroke color */
  coreColor: string;
  /** Reiki cost to unlock */
  price: number;
  /** Icon char shown in shop */
  icon: string;
  /** Icon display color */
  iconColor: string;
}

export const SLASH_SKINS: SlashSkin[] = [
  {
    id: 'slash_default',
    name: 'CYBER BLADE',
    nameJP: 'サイバーブレード',
    description: 'The original neon edge — cyan plasma wrapped in cold white light. It has claimed more cookies than any other blade in the dojo.',
    glowColor: '#00FFFF',
    coreColor: '#FFFFFF',
    price: 0,
    icon: '|',
    iconColor: '#00FFFF',
  },
  {
    id: 'slash_magenta',
    name: 'VENOM EDGE',
    nameJP: 'ベノムエッジ',
    description: 'Forged from crystallized arcane venom, this magenta streak burns through the air and leaves a sickly after-image that makes enemies hesitate.',
    glowColor: '#FF00FF',
    coreColor: '#FFAAFF',
    price: 400,
    icon: '/',
    iconColor: '#FF00FF',
  },
  {
    id: 'slash_gold',
    name: 'GOLDEN SLASH',
    nameJP: '黄金の一撃',
    description: 'Blessed by fortune itself. Each stroke glints with the same gilded light that golden cookies radiate — a symbol of prestige and wealth.',
    glowColor: '#FFD700',
    coreColor: '#FFF8AA',
    price: 600,
    icon: '✦',
    iconColor: '#FFD700',
  },
  {
    id: 'slash_blood',
    name: 'BLOOD RITE',
    nameJP: '血の契約',
    description: 'A forbidden technique passed down through shadow guilds. The crimson trail lingers longer than it should, as if the cut itself refuses to close.',
    glowColor: '#FF1111',
    coreColor: '#FF8888',
    price: 750,
    icon: '⚡',
    iconColor: '#FF1111',
  },
  {
    id: 'slash_void',
    name: 'VOID RIFT',
    nameJP: '虚無の裂け目',
    description: 'A tear between dimensions shaped into a weapon. Pure darkness edged with ultraviolet runes — the most feared trail in the neon arena.',
    glowColor: '#9B00FF',
    coreColor: '#CC88FF',
    price: 1000,
    icon: '◈',
    iconColor: '#9B00FF',
  },
];

/** Default skin is always available */
export const DEFAULT_SKIN_ID = 'slash_default';

export function getSkinById(id: string): SlashSkin {
  return SLASH_SKINS.find((s) => s.id === id) ?? SLASH_SKINS[0];
}
