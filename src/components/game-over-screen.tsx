import { motion } from 'framer-motion';
import { useStore } from '../store';
import { RunReportCard } from './run-report-card';

interface GameOverScreenProps {
  onRestart: () => void;
  highScore: number;
}

export function GameOverScreen({ onRestart, highScore }: GameOverScreenProps) {
  const { game } = useStore();
  const isNewRecord = game.score >= highScore;

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
        style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
      >
        {/* Game Over text */}
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
            marginTop: -8,
          }}
        >
          ゲームオーバー
        </div>

        {/* Divider */}
        <div
          style={{
            width: 680,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #FF0080, #9B00FF, #00FFFF, transparent)',
            boxShadow: '0 0 10px #FF0080',
          }}
        />

        {/* Two-column layout: score summary + report card */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Left: score summary + buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
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

            {/* Restart button */}
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

            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 8,
                color: '#444',
              }}
            >
              HIGH SCORE: {highScore.toString().padStart(7, '0')}
            </div>
          </div>

          {/* Right: Run Report Card */}
          <RunReportCard />
        </div>
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
