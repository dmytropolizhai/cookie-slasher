export type { SynergyDef } from './types';
export { SYNERGIES } from './data';

import { SYNERGIES } from './data';
import type { SynergyDef } from './types';

/** Returns all synergies that are currently active given the player's upgrades */
export function getActiveSynergies(upgrades: Record<string, number>): SynergyDef[] {
  return SYNERGIES.filter((syn) =>
    syn.requires.every((id) => (upgrades[id] ?? 0) >= 1)
  );
}

/** Returns synergy IDs for quick lookup */
export function getActiveSynergyIds(upgrades: Record<string, number>): Set<string> {
  return new Set(getActiveSynergies(upgrades).map((s) => s.id));
}

/**
 * Returns the synergies an upgrade participates in,
 * split into active (all reqs met) and potential (this upgrade is missing).
 */
export function getSynergiesForUpgrade(
  upgradeId: string,
  upgrades: Record<string, number>
): { active: SynergyDef[]; potential: SynergyDef[] } {
  const related = SYNERGIES.filter((syn) => syn.requires.includes(upgradeId));
  const active: SynergyDef[] = [];
  const potential: SynergyDef[] = [];

  for (const syn of related) {
    const allMet = syn.requires.every((id) => (upgrades[id] ?? 0) >= 1);
    if (allMet) {
      active.push(syn);
    } else {
      potential.push(syn);
    }
  }

  return { active, potential };
}
