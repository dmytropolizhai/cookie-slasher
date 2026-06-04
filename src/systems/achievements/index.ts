export { ACHIEVEMENTS } from './data';
export type { AchievementDef, AchievementState, AchievementCheckContext } from './types';

import type { AchievementCheckContext } from './types';

type CheckFn = (ctx: AchievementCheckContext) => boolean;

const CHECKS: Record<string, CheckFn> = {
  first_slice:  (ctx) => ctx.slicesTotal >= 1,
  combo_10:     (ctx) => ctx.combo >= 10,
  combo_30:     (ctx) => ctx.combo >= 30,
  combo_50:     (ctx) => ctx.combo >= 50,
  score_5000:   (ctx) => ctx.score >= 5_000,
  score_25000:  (ctx) => ctx.score >= 25_000,
  score_100000: (ctx) => ctx.score >= 100_000,
  wave_5:       (ctx) => ctx.wave >= 5,
  wave_10:      (ctx) => ctx.wave >= 10,
  golden_10:    (ctx) => ctx.goldenSliced >= 10,
  bomb_blocked: (ctx) => ctx.bombsBlocked >= 1,
  slices_100:   (ctx) => ctx.slicesTotal >= 100,
  slices_1000:  (ctx) => ctx.slicesTotal >= 1_000,
  max_reiki:    (ctx) => ctx.reiki >= 1_000,
  perfect_hp:   (ctx) => ctx.wave >= 4 && ctx.hp === ctx.maxHp,
};

/** Returns IDs of achievements that now pass but were not yet unlocked. */
export function checkNewAchievements(
  ctx: AchievementCheckContext,
  unlockedIds: Set<string>,
): string[] {
  const newIds: string[] = [];
  for (const [id, check] of Object.entries(CHECKS)) {
    if (!unlockedIds.has(id) && check(ctx)) {
      newIds.push(id);
    }
  }
  return newIds;
}
