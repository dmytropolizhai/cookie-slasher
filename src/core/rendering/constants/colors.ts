import type { CookieType } from '@/types/cookie';

// Glow colors per cookie type 
export const COOKIE_GLOW_COLORS: Record<CookieType, string> = {
  golden: '#FFD700',
  fake: '#666',
  bomb: '#FF4400',
  boss: '#9B00FF',
  normal: '#FF9966',
};

// Body fill color for sliced cookie halves 
export const HALF_FILL_COLORS: Record<CookieType, string> = {
  golden: '#D4A000',
  fake: '#7A5040',
  bomb: '#C47A3A',
  boss: '#C47A3A',
  normal: '#C47A3A',
};

// Exposed cross-section fill for sliced halves 
export const HALF_CUT_COLORS: Record<CookieType, string> = {
  golden: '#FFD700',
  fake: '#5A4020',
  bomb: '#D44A00',
  boss: '#D44A00',
  normal: '#D44A00',
};

// Slash trail colors 
export const SLASH_GLOW_COLOR = '#00FFFF';
export const SLASH_CORE_COLOR = '#FFFFFF';

// Background palette 
export const BG = {
  skyTop: '#0A0010',
  skyMid: '#12001E',
  skyBot: '#0A0A2A',
  gridStroke: '#9B00FF',
  buildingFill: '#1A003A',
  windowFill: '#9B00FF',
  horizonPink: '#FF0080',
  horizonPurple: '#9B00FF',
  horizonCyan: '#00FFFF',
} as const;
