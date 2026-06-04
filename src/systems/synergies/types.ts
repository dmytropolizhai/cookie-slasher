export interface SynergyDef {
  id: string;
  name: string;
  nameJP: string;
  description: string;
  /** IDs of required upgrades (all must be owned at level >= 1) */
  requires: string[];
  color: string;
  icon: string;
}
