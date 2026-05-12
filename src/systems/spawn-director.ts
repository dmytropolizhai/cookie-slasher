import type { WaveConfig, CookieType } from '../types';

// ─── Wave Configuration Database ─────────────────────────────────────────────

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

// ─── Cookie Type Selector ────────────────────────────────────────────────────

export function pickCookieType(config: WaveConfig, rng: () => number): CookieType {
  const r = rng();
  let acc = 0;

  acc += config.goldenChance;
  if (r < acc) return 'golden';

  acc += config.bombChance;
  if (r < acc) return 'bomb';

  acc += config.fakeChance;
  if (r < acc) return 'fake';

  return 'normal';
}

// ─── Spawn Director ───────────────────────────────────────────────────────────

export class SpawnDirector {
  private config: WaveConfig;
  private spawnedCount = 0;
  private timer = 0;
  private rng: () => number;

  constructor(wave: number) {
    this.config = buildWaveConfig(wave);
    this.rng = Math.random;
  }

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

  getSpeed(): number {
    return (
      this.config.speedMin +
      this.rng() * (this.config.speedMax - this.config.speedMin)
    );
  }

  isWaveComplete(): boolean {
    return this.spawnedCount >= this.config.totalCookies;
  }

  getConfig(): WaveConfig {
    return this.config;
  }

  reset(wave: number): void {
    this.config = buildWaveConfig(wave);
    this.spawnedCount = 0;
    this.timer = 0;
  }
}
