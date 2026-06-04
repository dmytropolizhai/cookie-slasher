export interface AchievementDef {
  id: string;
  name: string;
  nameJP: string;
  description: string;
  icon: string;
  iconColor: string;
  secret?: boolean;
}

export interface AchievementState {
  id: string;
  unlockedAt: number; // timestamp ms
}

export interface AchievementCheckContext {
  score: number;
  wave: number;
  combo: number;
  slicesTotal: number;
  goldenSliced: number;
  bombsBlocked: number;
  perfectWaves: number;
  hp: number;
  maxHp: number;
  reiki: number;
  upgradeCount: number;
  criticals: number;
  phase: string;
}
