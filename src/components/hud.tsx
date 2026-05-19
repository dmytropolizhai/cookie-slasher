import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';

const RANK_COLORS: Record<string, string> = {
  D: '#888888',
  C: '#44CCFF',
  B: '#44FF88',
  A: '#FFCC00',
  S: '#FF6600',
  SS: '#FF00AA',
  SSS: '#FF0080',
};

const RANK_SHADOW: Record<string, string> = {
  D: '0 0 8px #888',
  C: '0 0 12px #44CCFF',
  B: '0 0 16px #44FF88',
  A: '0 0 20px #FFCC00',
  S: '0 0 24px #FF6600, 0 0 40px #FF6600',
  SS: '0 0 28px #FF00AA, 0 0 50px #FF00AA',
  SSS: '0 0 32px #FF0080, 0 0 60px #FF0080, 0 0 80px #9B00FF',
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
      <path
        d="M11 18.5C11 18.5 2 13 2 6.5C2 4 4 2 6.5 2C8.2 2 9.7 2.9 10.7 4.3C10.8 4.4 11.2 4.4 11.3 4.3C12.3 2.9 13.8 2 15.5 2C18 2 20 4 20 6.5C20 13 11 18.5 11 18.5Z"
        fill={filled ? '#FF0080' : '#2A004A'}
        stroke={filled ? '#FF44AA' : '#4A1060'}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function HUD() {
  const { game, combo, openShop } = useStore();
  const rankColor = RANK_COLORS[combo.rank] ?? '#888';
  const rankShadow = RANK_SHADOW[combo.rank] ?? '';

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-6 pt-4">
        {/* Score */}
        <div className="flex flex-col gap-1">
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
              color: '#9B00FF',
              letterSpacing: 2,
              textShadow: '0 0 8px #9B00FF',
            }}
          >
            SCORE
          </div>
          <motion.div
            key={game.score}
            initial={{ scale: 1.3, color: '#FFE600' }}
            animate={{ scale: 1, color: '#FFFFFF' }}
            transition={{ duration: 0.25 }}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 22,
              color: '#fff',
              textShadow: '0 0 12px #FF0080, 0 0 24px #9B00FF',
            }}
          >
            {game.score.toString().padStart(7, '0')}
          </motion.div>
        </div>

        {/* Wave */}
        <div className="flex flex-col items-center gap-1">
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 9,
              color: '#00FFFF',
              letterSpacing: 2,
              textShadow: '0 0 8px #00FFFF',
            }}
          >
            WAVE
          </div>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 20,
              color: '#00FFFF',
              textShadow: '0 0 16px #00FFFF',
            }}
          >
            {game.wave}
          </div>
        </div>

        {/* Reiki */}
        <div className="flex flex-col items-end gap-1">
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 9,
              color: '#FFE600',
              letterSpacing: 2,
              textShadow: '0 0 8px #FFE600',
            }}
          >
            霊気 REIKI
          </div>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 18,
              color: '#FFE600',
              textShadow: '0 0 12px #FFE600',
            }}
          >
            ¥{game.reiki}
          </div>
        </div>
      </div>
      
      
      <button className="absolute bottom-6 right-6" onClick={() => openShop()}>
        Shop
      </button>

      {/* HP Bar */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2">
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 8,
            color: '#FF0080',
            letterSpacing: 2,
            textShadow: '0 0 6px #FF0080',
          }}
        >
          LIFE
        </div>
        <div className="flex gap-2">
          {Array.from({ length: game.maxHp }, (_, i) => (
            <motion.div
              key={i}
              animate={i < game.hp ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <HeartIcon filled={i < game.hp} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Combo ── */}
      <AnimatePresence>
        {combo.count >= 2 && (
          <motion.div
            key="combo"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            className="absolute bottom-6 right-6 flex flex-col items-end gap-1"
          >
            {/* Rank badge */}
            <motion.div
              key={combo.rank}
              initial={{ scale: 2, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 36,
                color: rankColor,
                textShadow: rankShadow,
                lineHeight: 1,
              }}
            >
              {combo.rank}
            </motion.div>

            {/* Combo count */}
            <motion.div
              key={combo.count}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 14,
                color: '#FFFFFF',
                textShadow: `0 0 10px ${rankColor}`,
              }}
            >
              {combo.count} HIT
            </motion.div>

            {/* Multiplier */}
            {combo.multiplier > 1 && (
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 9,
                  color: rankColor,
                  opacity: 0.8,
                }}
              >
                ×{combo.multiplier} BONUS
              </div>
            )}

            {/* Decay bar */}
            <div
              style={{
                width: 100,
                height: 4,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${rankColor}44`,
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  background: rankColor,
                  boxShadow: `0 0 6px ${rankColor}`,
                  transformOrigin: 'left',
                }}
                animate={{ scaleX: 1 - combo.decayTimer / combo.maxDecay }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Critical Flash ── */}
      <AnimatePresence>
        {game.criticalActive && (
          <motion.div
            key="critical"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1.1, 0.8], y: [20, 0, -5, -20] }}
            transition={{ duration: 1.0, times: [0, 0.15, 0.6, 1] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ top: '35%' }}
          >
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 48,
                color: '#FFE600',
                textShadow: '0 0 20px #FF6600, 0 0 40px #FF0000, 4px 4px 0 #AA0000',
                letterSpacing: 4,
              }}
            >
              CRITICAL!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Time Scale indicator ── */}
      {game.timeScale < 0.8 && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="absolute top-20 left-1/2 -translate-x-1/2"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 11,
            color: '#00FFFF',
            textShadow: '0 0 12px #00FFFF',
            letterSpacing: 3,
          }}
        >
          ◈ SLOW MOTION ◈
        </motion.div>
      )}

      {/* ── Scanlines overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
