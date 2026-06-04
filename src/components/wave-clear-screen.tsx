import { motion } from 'framer-motion';
import { useStore } from '../store';

export function WaveClearScreen() {
  const { game } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      style={{ zIndex: 150 }}
    >
      {/* Main text */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0, y: 20 }}
        animate={{ scale: [0.4, 1.15, 1.0], opacity: [0, 1, 1], y: [20, -8, 0] }}
        transition={{ duration: 0.5, times: [0, 0.5, 1] }}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 40,
          color: '#00FFFF',
          textShadow: '0 0 20px #00FFFF, 0 0 40px #9B00FF, 4px 4px 0 #003366',
          letterSpacing: 4,
        }}
      >
        WAVE CLEAR
      </motion.div>

      {/* Wave number */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 11,
          color: '#9B00FF',
          letterSpacing: 3,
          marginTop: 12,
          textShadow: '0 0 10px #9B00FF',
        }}
      >
        WAVE {game.wave - 1} COMPLETE
      </motion.div>

      {/* Decorative bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
        style={{
          width: 340,
          height: 2,
          background: 'linear-gradient(90deg, transparent, #00FFFF, #9B00FF, transparent)',
          boxShadow: '0 0 12px #00FFFF',
          marginTop: 16,
          transformOrigin: 'center',
        }}
      />

      {/* Next wave hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.6, 0.6] }}
        transition={{ duration: 1.8, times: [0, 0.5, 0.75, 1] }}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 8,
          color: '#444',
          letterSpacing: 2,
          marginTop: 20,
        }}
      >
        WAVE {game.wave} INCOMING...
      </motion.div>
    </motion.div>
  );
}
