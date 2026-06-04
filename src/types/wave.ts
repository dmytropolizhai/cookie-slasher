export interface WaveConfig {
  wave: number;
  totalCookies: number;
  spawnInterval: number;   // ms between spawns
  speedMin: number;
  speedMax: number;
  normalChance: number;
  goldenChance: number;
  fakeChance: number;
  bombChance: number;
  hasBoss: boolean;
  bossSpawnIndex?: number; // which spawn slot holds the boss (counts down to 0)
}
