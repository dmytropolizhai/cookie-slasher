/**
 * React hook that exposes the audio engine and manages music lifecycle.
 * Handles the browser autoplay policy by resuming AudioContext on first interaction.
 */

import { useEffect, useRef, useCallback } from 'react';
import { audioEngine, type SoundKey } from './audio-engine';
import { chiptunePlayer } from './chiptune-music';
import { useStore } from '@/store';

export function useAudio() {
  const { game } = useStore();
  const musicStartedRef = useRef(false);
  const prevPhaseRef = useRef(game.phase);

  // Resume AudioContext on first user interaction (browser autoplay policy)
  useEffect(() => {
    const resume = () => audioEngine.resume();
    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
    return () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
  }, []);

  // Start / stop music based on game phase
  useEffect(() => {
    const prev = prevPhaseRef.current;
    prevPhaseRef.current = game.phase;

    if (game.phase === 'playing' && !musicStartedRef.current) {
      musicStartedRef.current = true;
      audioEngine.resume();
      const { ctx, masterGain } = audioEngine.getAudioNodes();
      chiptunePlayer.init(ctx, masterGain);
      chiptunePlayer.start();
    }

    if ((game.phase === 'gameover' || game.phase === 'menu') && prev === 'playing') {
      chiptunePlayer.stop();
      musicStartedRef.current = false;
    }

    if (game.phase === 'paused') {
      chiptunePlayer.setVolume(0.08);
    } else if (game.phase === 'playing') {
      chiptunePlayer.setVolume(0.35);
    }
  }, [game.phase]);

  const play = useCallback((key: SoundKey) => {
    audioEngine.play(key);
  }, []);

  return { play };
}

export { type SoundKey } from './audio-engine';
