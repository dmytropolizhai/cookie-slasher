import type { CookieType, WaveConfig } from "@/types";

export function pickCookieType(config: WaveConfig, rng: () => number): CookieType {
  if (config.hasBoss && config.bossSpawnIndex !== undefined && config.bossSpawnIndex === 0) {
    return 'boss';
  }

  const r = rng();
  let acc = 0;

  acc += config.goldenChance;
  if (r < acc) return 'golden';

  acc += config.bombChance;
  if (r < acc) return 'bomb';

  acc += config.fakeChance;
  if (r < acc) return 'fake';

  acc += config.frozenChance;
  if (r < acc) return 'frozen';

  acc += config.cursedChance;
  if (r < acc) return 'cursed';

  acc += config.mirrorChance;
  if (r < acc) return 'mirror';

  acc += config.spiritChance;
  if (r < acc) return 'spirit';

  return 'normal';
}
