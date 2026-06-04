import { buildWaveConfig } from './wave-config';
import { pickCookieType } from './cookie-selector';

import type { WaveConfig } from '@/types';
import type { CookieType } from '@/types/cookie';

/**
 * Spawn director
 *
 * Use to control cookie spawning based on wave number.
 * Pass a seeded RNG factory to produce deterministic spawns (daily challenge).
 */
export class SpawnDirector {
  private config: WaveConfig;
  private spawnedCount = 0;
  private timer = 0;
  private rng: () => number;
  private rngFactory: ((wave: number) => () => number) | null;

  constructor(wave: number, rngFactory?: (wave: number) => () => number) {
    this.config = buildWaveConfig(wave);
    this.rngFactory = rngFactory ?? null;
    this.rng = rngFactory ? rngFactory(wave) : Math.random;
  }

  /**
   * Tick spawn director
   * 
   * @param dt delta time in seconds
   * @returns cookie type to spawn or null
   */
  tick(dt: number): CookieType | null {
    if (this.spawnedCount >= this.config.totalCookies) return null;
    this.timer += dt * 1000;
    if (this.timer >= this.config.spawnInterval) {
      this.timer = 0;
      this.spawnedCount++;
      return pickCookieType(this.config, this.rng);
    }
    return null;
  }

  /**
   * Get cookie speed
   * 
   * @returns cookie speed in pixels per second
   */
  getSpeed(): number {
    return (
      this.config.speedMin +
      this.rng() * (this.config.speedMax - this.config.speedMin)
    );
  }

  /**
   * Check if wave is complete
   * 
   * @returns true if wave is complete, false otherwise
   */
  isWaveComplete(): boolean {
    return this.spawnedCount >= this.config.totalCookies;
  }

  /**
   * Get wave configuration
   * 
   * @returns wave configuration
   */
  getConfig(): WaveConfig {
    return this.config;
  }

  /**
   * Reset spawn director
   *
   * @param wave wave number
   */
  reset(wave: number): void {
    this.config = buildWaveConfig(wave);
    this.spawnedCount = 0;
    this.timer = 0;
    this.rng = this.rngFactory ? this.rngFactory(wave) : Math.random;
  }
}
