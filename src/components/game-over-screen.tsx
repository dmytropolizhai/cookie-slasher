import { motion } from 'framer-motion';
import { useStore } from '../store';

interface GameOverScreenProps {
  onRestart: () => void;
  onMenu: () => void;
  highScore: number;
}

export function GameOverScreen({ onRestart, onMenu, highScore }: GameOverScreenProps) {
  const { game } = useStore();
  const isNewRecord = game.score >= highScore && game.mode === 'endless';
  const isDaily = game.mode === 'daily';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'rgba(5,0,15,0.92)' }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)',
        }}
      />

      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
        className="flex flex-col items-center gap-6"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Heading: daily vs endless */}
        {isDaily ? (
          <>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 32,
                color: '#FFE600',
                textShadow: '0 0 20px #FFE600, 0 0 60px #FFE600, 3px 3px 0 #664400',
                letterSpacing: 2,
                textAlign: 'center',
              }}
            >
              DAILY
              <br />
              COMPLETE
            </div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 10,
                color: '#00FFFF',
                letterSpacing: 3,
              }}
            >
              {game.dailyDate}
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 46,
                color: '#FF0044',
                textShadow: '0 0 20px #FF0044, 0 0 60px #FF0044, 4px 4px 0 #880022',
                letterSpacing: 2,
              }}
            >
              GAME OVER
            </div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 10,
                color: '#9B00FF',
                letterSpacing: 3,
              }}
            >
              ゲームオーバー
            </div>
          </>
        )}

        {/* Divider */}
        <div
          style={{
            width: 300,
            height: 2,
            background: isDaily
              ? 'linear-gradient(90deg, transparent, #FFE600, #00FFFF, #FFE600, transparent)'
              : 'linear-gradient(90deg, transparent, #FF0080, #9B00FF, #00FFFF, transparent)',
            boxShadow: isDaily ? '0 0 10px #FFE600' : '0 0 10px #FF0080',
          }}
        />

        {/* Stats */}
        <div className="flex flex-col items-center gap-3">
          <StatRow label="FINAL SCORE" value={game.score.toString().padStart(7, '0')} color="#FFFFFF" />
          <StatRow label="WAVE" value={`${game.wave}`} color="#00FFFF" />
          <StatRow label="霊気 REIKI" value={`¥${game.reiki}`} color="#FFE600" />
          {isNewRecord && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 12,
                color: '#FFE600',
                textShadow: '0 0 16px #FFE600',
                marginTop: 4,
              }}
            >
              ★ NEW RECORD ★
            </motion.div>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 300,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #9B00FF, #FF0080, transparent)',
          }}
        />

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3">
          {!isDaily && (
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: '0 0 40px #FF0080' }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 14,
                color: '#fff',
                background: 'linear-gradient(135deg, #9B00FF, #FF0080)',
                border: '3px solid #FF0080',
                boxShadow: '0 0 20px #FF0080',
                padding: '14px 40px',
                cursor: 'pointer',
                letterSpacing: 2,
              }}
            >
              ▶ PLAY AGAIN
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenu}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
              color: '#aaa',
              background: 'transparent',
              border: '2px solid #444',
              padding: '10px 28px',
              cursor: 'pointer',
              letterSpacing: 2,
            }}
          >
            ← MENU
          </motion.button>
        </div>

        {!isDaily && (
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 8,
              color: '#444',
            }}
          >
            HIGH SCORE: {highScore.toString().padStart(7, '0')}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-8">
      <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 9, color: '#666', width: 130, textAlign: 'right' }}>
        {label}
      </div>
      <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 18, color, textShadow: `0 0 10px ${color}` }}>
        {value}
      </div>
    </div>
  );
}
