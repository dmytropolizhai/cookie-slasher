export type SeasonalEventId = 'halloween' | 'christmas' | 'valentine';

export interface SeasonalEvent {
  id: SeasonalEventId;
  name: string;
  nameJP: string;
  /** Score multiplier applied on top of combo (e.g. 1.5 = +50 %) */
  scoreMultiplier: number;
  /** Reiki earned per cookie multiplier */
  reikiMultiplier: number;
  /** CSS accent colour used in the HUD banner */
  color: string;
  /** Glow/shadow hex */
  glowColor: string;
  /** Short emoji used in the banner */
  emoji: string;
  /** Background sky-top override (null = default) */
  skyTop: string;
  /** Background sky-mid override */
  skyMid: string;
  /** Background sky-bot override */
  skyBot: string;
  /** Grid line colour override */
  gridStroke: string;
}

// Date windows (month is 1-based for readability)
const WINDOWS: Array<{ id: SeasonalEventId; startM: number; startD: number; endM: number; endD: number }> = [
  { id: 'halloween', startM: 10, startD: 20, endM: 11, endD: 1 },
  { id: 'christmas', startM: 12, startD: 15, endM: 1,  endD: 7 },
  { id: 'valentine', startM: 2,  startD: 7,  endM: 2,  endD: 18 },
];

export const SEASONAL_EVENTS: Record<SeasonalEventId, SeasonalEvent> = {
  halloween: {
    id: 'halloween',
    name: 'GHOST HARVEST',
    nameJP: '幽霊の収穫祭',
    scoreMultiplier: 1.5,
    reikiMultiplier: 1.25,
    color: '#FF6600',
    glowColor: '#FF4400',
    emoji: '🎃',
    skyTop: '#0D0005',
    skyMid: '#1A000A',
    skyBot: '#0A0020',
    gridStroke: '#FF4400',
  },
  christmas: {
    id: 'christmas',
    name: 'FROZEN BLADE',
    nameJP: '凍てつく刃',
    scoreMultiplier: 2.0,
    reikiMultiplier: 1.5,
    color: '#00FF88',
    glowColor: '#00FFCC',
    emoji: '❄',
    skyTop: '#000D12',
    skyMid: '#001A1E',
    skyBot: '#001530',
    gridStroke: '#00FFCC',
  },
  valentine: {
    id: 'valentine',
    name: "HEART SLASH",
    nameJP: '恋のスラッシュ',
    scoreMultiplier: 1.75,
    reikiMultiplier: 1.4,
    color: '#FF0080',
    glowColor: '#FF44AA',
    emoji: '♥',
    skyTop: '#0D0008',
    skyMid: '#1A0012',
    skyBot: '#0A0018',
    gridStroke: '#FF0080',
  },
};

/**
 * Returns the active seasonal event for a given Date, or null if none.
 */
export function getActiveSeasonalEvent(date: Date = new Date()): SeasonalEvent | null {
  const m = date.getMonth() + 1; // 1-based
  const d = date.getDate();

  for (const w of WINDOWS) {
    const start = w.startM * 100 + w.startD;
    const end   = w.endM   * 100 + w.endD;
    const now   = m * 100 + d;

    // Handle year wrap-around (e.g. Dec 15 → Jan 7)
    if (start > end) {
      if (now >= start || now <= end) return SEASONAL_EVENTS[w.id];
    } else {
      if (now >= start && now <= end) return SEASONAL_EVENTS[w.id];
    }
  }

  return null;
}
