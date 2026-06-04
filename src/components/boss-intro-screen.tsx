import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOSS_PHASES } from '@/systems/boss/data';
import type { BossPhaseData } from '@/systems/boss/data';

interface BossIntroScreenProps {
  phase: 1 | 2 | 3;
  wave: number;
  onComplete: () => void;
}

const PHASE_NAMES: Record<1 | 2 | 3, string> = {
  1: 'COOKIE OVERLORD',
  2: 'DARK CONFECTION',
  3: 'SUPREME BISCUIT',
};

const PHASE_SUBTITLES: Record<1 | 2 | 3, string> = {
  1: 'A monstrous treat awakens...',
  2: 'Its true form emerges!',
  3: 'MAXIMUM SUGAR OVERDRIVE',
};

export function BossIntroScreen({ phase, wave, onComplete }: BossIntroScreenProps) {
  const data: BossPhaseData = BOSS_PHASES[phase];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(onComplete, 3200);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onComplete}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(8, 0, 20, 0.88)',
        cursor: 'pointer',
      }}
    >
      {/* Radial burst */}
      <motion.div
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${data.color} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Wave indicator */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 11,
          color: '#00FFFF',
          letterSpacing: 4,
          textShadow: '0 0 10px #00FFFF',
          marginBottom: 20,
        }}
      >
        WAVE {wave}
      </motion.div>

      {/* "BOSS" label */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.25, duration: 0.35, ease: 'backOut' }}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 13,
          color: data.color,
          letterSpacing: 8,
          textShadow: `0 0 16px ${data.color}, 0 0 32px ${data.glowColor}`,
          marginBottom: 14,
        }}
      >
        ★ BOSS ENCOUNTER ★
      </motion.div>

      {/* Phase label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 10,
          color: data.glowColor,
          letterSpacing: 6,
          textShadow: `0 0 8px ${data.glowColor}`,
          marginBottom: 28,
        }}
      >
        {data.label}
      </motion.div>

      {/* Boss name — big dramatic reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.55, type: 'spring', stiffness: 260, damping: 18 }}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 28,
          color: '#FFFFFF',
          textShadow: `0 0 24px ${data.color}, 0 0 48px ${data.glowColor}, 4px 4px 0 ${data.color}88`,
          textAlign: 'center',
          letterSpacing: 2,
          lineHeight: 1.4,
          maxWidth: 560,
          padding: '0 24px',
        }}
      >
        {PHASE_NAMES[phase]}
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 0.85, duration: 0.4 }}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 9,
          color: '#CCCCCC',
          letterSpacing: 2,
          marginTop: 18,
          textAlign: 'center',
        }}
      >
        {PHASE_SUBTITLES[phase]}
      </motion.div>

      {/* HP indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 34,
          gap: 6,
        }}
      >
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 8,
            color: '#FF0080',
            letterSpacing: 3,
            textShadow: '0 0 6px #FF0080',
          }}
        >
          BOSS HP
        </div>
        <AnimatePresence>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.25, duration: 0.6, ease: 'easeOut' }}
            style={{
              width: 260,
              height: 12,
              borderRadius: 6,
              background: data.color,
              boxShadow: `0 0 16px ${data.color}, 0 0 32px ${data.glowColor}`,
              transformOrigin: 'left',
            }}
          />
        </AnimatePresence>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 9,
            color: data.glowColor,
            textShadow: `0 0 6px ${data.glowColor}`,
          }}
        >
          {data.hpTotal} HP
        </div>
      </motion.div>

      {/* "Click to skip" hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.5, 0] }}
        transition={{ delay: 2.0, duration: 1.0, times: [0, 0.2, 0.8, 1] }}
        style={{
          position: 'absolute',
          bottom: 32,
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 8,
          color: '#666688',
          letterSpacing: 2,
        }}
      >
        CLICK TO SKIP
      </motion.div>

      {/* Scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
}
