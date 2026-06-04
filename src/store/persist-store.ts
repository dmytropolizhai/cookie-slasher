import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistStore, RunRecord } from './persist-types';

const MAX_HISTORY = 10;
const STREAK_MIN_WAVE = 3;
const SOUL_DUST_PER_WAVE = 5;
const SOUL_DUST_PER_100_SCORE = 1;

function calcSoulDust(score: number, wave: number): number {
  return wave * SOUL_DUST_PER_WAVE + Math.floor(score / 100) * SOUL_DUST_PER_100_SCORE;
}

export const usePersistStore = create<PersistStore>()(
  persist(
    (set, get) => ({
      soulDust: 0,
      runHistory: [],
      currentStreak: 0,
      bestStreak: 0,

      recordRun: (score, wave) => {
        const earned = calcSoulDust(score, wave);
        const record: RunRecord = {
          score,
          wave,
          soulDustEarned: earned,
          date: Date.now(),
        };

        const prev = get();
        const metStreak = wave >= STREAK_MIN_WAVE;
        const newStreak = metStreak ? prev.currentStreak + 1 : 0;
        const newBest = Math.max(prev.bestStreak, newStreak);
        const history: RunRecord[] = [record, ...prev.runHistory].slice(0, MAX_HISTORY);

        set({
          soulDust: prev.soulDust + earned,
          runHistory: history,
          currentStreak: newStreak,
          bestStreak: newBest,
        });
      },

      spendSoulDust: (amount) => {
        const prev = get();
        if (prev.soulDust < amount) return false;
        set({ soulDust: prev.soulDust - amount });
        return true;
      },
    }),
    {
      name: 'cookie-slash-persist',
    }
  )
);
