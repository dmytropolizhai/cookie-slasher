import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { ACHIEVEMENTS } from '../systems/achievements';

export function AchievementsScreen() {
  const { achievements, stats, closeAchievements } = useStore();

  const unlockedIds = new Set(achievements.map((a) => a.id));
  const unlockedCount = unlockedIds.size;
  const total = ACHIEVEMENTS.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'rgba(4,0,12,0.97)', backdropFilter: 'blur(4px)', zIndex: 100 }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(155,0,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(155,0,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: -20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '40px 48px',
          border: '2px solid rgba(155,0,255,0.35)',
          background: 'rgba(10,0,24,0.95)',
          maxWidth: 880,
          width: '92vw',
          maxHeight: '88vh',
          overflowY: 'auto',
          boxShadow: '0 0 60px rgba(155,0,255,0.2)',
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 9,
              color: '#9B00FF',
              textShadow: '0 0 10px #9B00FF',
              letterSpacing: 5,
            }}
          >
            実績
          </div>

          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 26,
              color: '#FF0080',
              textShadow: '0 0 20px #FF0080, 0 0 50px #FF0080, 4px 4px 0 #660030',
              letterSpacing: 3,
            }}
          >
            ACHIEVEMENTS
          </div>

          {/* Neon divider */}
          <div
            style={{
              width: 480,
              height: 2,
              background: 'linear-gradient(90deg, transparent, #9B00FF, #FF0080, #00FFFF, transparent)',
              boxShadow: '0 0 10px #9B00FF',
              marginTop: 4,
            }}
          />

          {/* Progress */}
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 9,
              color: '#FFE600',
              textShadow: '0 0 8px #FFE600',
              letterSpacing: 2,
            }}
          >
            {unlockedCount} / {total} UNLOCKED
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: 320,
              height: 6,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(155,0,255,0.3)',
            }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: unlockedCount / total }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #9B00FF, #FF0080)',
                boxShadow: '0 0 8px #9B00FF',
                transformOrigin: 'left',
              }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            marginBottom: 32,
            padding: '12px 24px',
            border: '1px solid rgba(155,0,255,0.2)',
            background: 'rgba(155,0,255,0.04)',
          }}
        >
          {[
            { label: 'TOTAL SLICES', value: stats.slicesTotal, color: '#00FFFF' },
            { label: 'GOLDEN SLICED', value: stats.goldenSliced, color: '#FFD700' },
            { label: 'BOMBS BLOCKED', value: stats.bombsBlocked, color: '#FF4400' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 6,
                  color: '#555',
                  letterSpacing: 2,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 16,
                  color: stat.color,
                  textShadow: `0 0 10px ${stat.color}`,
                }}
              >
                {stat.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Achievement grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 12,
            marginBottom: 32,
          }}
        >
          {ACHIEVEMENTS.map((def, i) => {
            const unlocked = unlockedIds.has(def.id);
            const state = achievements.find((a) => a.id === def.id);
            return (
              <motion.div
                key={def.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '14px 16px',
                  border: unlocked
                    ? `2px solid ${def.iconColor}66`
                    : '2px solid rgba(50,30,70,0.5)',
                  background: unlocked
                    ? `rgba(6,0,18,0.85)`
                    : 'rgba(4,0,10,0.6)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow background for unlocked */}
                {unlocked && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(ellipse at 20% 50%, ${def.iconColor}0A 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Icon */}
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: 22,
                    color: unlocked ? def.iconColor : '#2A1840',
                    textShadow: unlocked ? `0 0 12px ${def.iconColor}` : 'none',
                    flexShrink: 0,
                    lineHeight: 1,
                    filter: unlocked ? 'none' : 'grayscale(1)',
                  }}
                >
                  {def.secret && !unlocked ? '?' : def.icon}
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div
                    style={{
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: 7,
                      color: unlocked ? '#fff' : '#3A2050',
                      letterSpacing: 1,
                      lineHeight: 1.5,
                    }}
                  >
                    {def.secret && !unlocked ? '??????' : def.name.toUpperCase()}
                  </div>

                  <div
                    style={{
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: 5,
                      color: unlocked ? '#9B00FF' : '#2A1040',
                      textShadow: unlocked ? '0 0 6px #9B00FF' : 'none',
                      letterSpacing: 2,
                    }}
                  >
                    {def.secret && !unlocked ? '' : def.nameJP}
                  </div>

                  <div
                    style={{
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: 5,
                      color: unlocked ? '#666' : '#1E0E30',
                      lineHeight: 1.8,
                    }}
                  >
                    {def.secret && !unlocked
                      ? 'SECRET — keep playing!'
                      : def.description}
                  </div>

                  {unlocked && state && (
                    <div
                      style={{
                        fontFamily: '"Press Start 2P", monospace',
                        fontSize: 5,
                        color: `${def.iconColor}88`,
                        marginTop: 4,
                      }}
                    >
                      ✓ {new Date(state.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Lock icon for locked */}
                {!unlocked && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: 8,
                      color: '#2A1840',
                    }}
                  >
                    🔒
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Back button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(155,0,255,0.5)' }}
            whileTap={{ scale: 0.96 }}
            onClick={closeAchievements}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 11,
              color: '#9B00FF',
              background: 'transparent',
              border: '2px solid rgba(155,0,255,0.4)',
              padding: '12px 40px',
              cursor: 'pointer',
              letterSpacing: 2,
            }}
          >
            ← BACK
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
