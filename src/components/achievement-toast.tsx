import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { ACHIEVEMENTS } from '../systems/achievements';

export function AchievementToastQueue() {
  const { achievementQueue, dequeueAchievement } = useStore();
  const currentId = achievementQueue[0] ?? null;

  useEffect(() => {
    if (!currentId) return;
    const timer = setTimeout(() => {
      dequeueAchievement();
    }, 3800);
    return () => clearTimeout(timer);
  }, [currentId, dequeueAchievement]);

  const def = currentId ? ACHIEVEMENTS.find((a) => a.id === currentId) : null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 24,
        zIndex: 10000,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="wait">
        {def && (
          <motion.div
            key={currentId}
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '14px 20px',
              background: 'rgba(6, 0, 18, 0.96)',
              border: `2px solid ${def.iconColor}88`,
              boxShadow: `0 0 24px ${def.iconColor}44, 0 0 60px rgba(0,0,0,0.8)`,
              minWidth: 280,
              maxWidth: 340,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Shimmer bar at top */}
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 3.6, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, transparent, ${def.iconColor}, transparent)`,
                transformOrigin: 'left',
              }}
            />

            {/* Icon */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 28,
                color: def.iconColor,
                textShadow: `0 0 16px ${def.iconColor}`,
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              {def.icon}
            </motion.div>

            {/* Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 7,
                  color: def.iconColor,
                  textShadow: `0 0 8px ${def.iconColor}`,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                ACHIEVEMENT
              </div>
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 9,
                  color: '#fff',
                  textShadow: `0 0 8px ${def.iconColor}66`,
                  letterSpacing: 1,
                  lineHeight: 1.5,
                }}
              >
                {def.name}
              </div>
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 6,
                  color: '#9B00FF',
                  textShadow: '0 0 6px #9B00FF',
                  letterSpacing: 2,
                }}
              >
                {def.nameJP}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
