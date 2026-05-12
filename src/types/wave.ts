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
}
