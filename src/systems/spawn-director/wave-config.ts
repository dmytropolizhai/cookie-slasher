import type { WaveConfig } from "@/types";

/*
 * This function uses WaveConfig interface to build wave configuration
 *
 * @param wave wave number
 * @returns wave configuration
 */
export function buildWaveConfig(wave: number): WaveConfig {
  const hasBoss = wave % 5 === 0;
  const totalCookies = 8 + wave * 3;
  // Boss spawns roughly at the midpoint of the wave so players fight through regular
  // cookies first, then face the boss (countdown counts down to 0 = spawn boss)
  const bossSpawnIndex = hasBoss ? Math.floor(totalCookies * 0.5) : undefined;

  const base: WaveConfig = {
    wave,
    totalCookies,
    spawnInterval: Math.max(400, 1400 - wave * 60),
    speedMin: 120 + wave * 8,
    speedMax: 200 + wave * 15,
    normalChance: 0.43,
    goldenChance: 0.08,
    fakeChance: Math.min(0.14, 0.03 + wave * 0.012),
    bombChance: Math.min(0.10, 0.02 + wave * 0.010),
    frozenChance: Math.min(0.10, wave >= 2 ? 0.02 + wave * 0.008 : 0),
    cursedChance: Math.min(0.10, wave >= 3 ? 0.01 + wave * 0.008 : 0),
    mirrorChance: Math.min(0.08, wave >= 4 ? 0.01 + wave * 0.006 : 0),
    spiritChance: Math.min(0.08, wave >= 5 ? 0.01 + wave * 0.006 : 0),
    hasBoss: wave % 5 === 0,
  };
  return base;
}
