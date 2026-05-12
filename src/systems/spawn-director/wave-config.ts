import type { WaveConfig } from "@/types";

/*
 * This functuion uses WaveConfig interface to build wave configuration
 * 
 * @param wave wave number
 * @returns wave configuration
 */
export function buildWaveConfig(wave: number): WaveConfig {
  const base: WaveConfig = {
    wave,
    totalCookies: 8 + wave * 3,
    spawnInterval: Math.max(400, 1400 - wave * 60),
    speedMin: 120 + wave * 8,
    speedMax: 200 + wave * 15,
    normalChance: 0.55,
    goldenChance: 0.08,
    fakeChance: Math.min(0.18, 0.04 + wave * 0.015),
    bombChance: Math.min(0.14, 0.02 + wave * 0.012),
    hasBoss: wave % 5 === 0,
  };
  return base;
}
