export type ComboRank = 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export interface ComboState {
  count: number;
  rank: ComboRank;
  multiplier: number;
  decayTimer: number;
  maxDecay: number;
  flash: boolean;
}
