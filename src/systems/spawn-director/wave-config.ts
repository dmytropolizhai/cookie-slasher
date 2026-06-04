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
    normalChance: 0.55,
    goldenChance: 0.08,
    fakeChance: Math.min(0.18, 0.04 + wave * 0.015),
    bombChance: Math.min(0.14, 0.02 + wave * 0.012),
    hasBoss,
    bossSpawnIndex,
  };
  return base;
}
