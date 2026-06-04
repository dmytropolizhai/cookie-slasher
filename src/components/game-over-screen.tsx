import { motion } from 'framer-motion';
import { useStore } from '../store';
import type { RunRecord } from '../store/persist-types';

interface GameOverScreenProps {
  onRestart: () => void;
  highScore: number;
  runHistory: RunRecord[];
}

export function GameOverScreen({ onRestart, highScore, runHistory }: GameOverScreenProps) {
  const { game } = useStore();
  // The current run is not yet in history when this renders (it gets recorded in App effect),
  // so isNewRecord compares current score vs persisted history high score.
  const isNewRecord = game.score > 0 && game.score >= highScore;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'rgba(5,0,15,0.92)', overflowY: 'auto' }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
        className="flex flex-col items-center gap-6"
        style={{ position: 'relative', zIndex: 1, paddingTop: 32, paddingBottom: 32 }}
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
          }}
        >
          ゲームオーバー
        </div>

        {/* Divider */}
        <div
          style={{
            width: 300,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #FF0080, #9B00FF, #00FFFF, transparent)',
            boxShadow: '0 0 10px #FF0080',
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

        {/* Run History (F02) */}
        {runHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-2"
            style={{ width: 340 }}
          >
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 8,
                color: '#9B00FF',
                letterSpacing: 2,
                marginBottom: 6,
                textShadow: '0 0 8px #9B00FF',
              }}
            >
              ─── RUN HISTORY ───
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 0.6fr 1fr',
                gap: '3px 12px',
                width: '100%',
              }}
            >
              {/* Header row */}
              <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 6, color: '#444', textAlign: 'right' }}>SCORE</div>
              <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 6, color: '#444', textAlign: 'center' }}>WAVE</div>
              <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 6, color: '#444', textAlign: 'right' }}>SOUL DUST</div>
              {runHistory.map((run, i) => {
                const isCurrentRun = i === 0;
                const scoreColor = isCurrentRun ? '#FFFFFF' : '#666';
                const waveColor = isCurrentRun ? '#00FFFF' : '#555';
                const dustColor = isCurrentRun ? '#AA88FF' : '#555';
                return [
                  <div key={`s${i}`} style={{ fontFamily: '"Press Start 2P", monospace', fontSize: isCurrentRun ? 10 : 8, color: scoreColor, textAlign: 'right' }}>
                    {run.score.toString().padStart(7, '0')}
                  </div>,
                  <div key={`w${i}`} style={{ fontFamily: '"Press Start 2P", monospace', fontSize: isCurrentRun ? 10 : 8, color: waveColor, textAlign: 'center' }}>
                    {run.wave}
                  </div>,
                  <div key={`d${i}`} style={{ fontFamily: '"Press Start 2P", monospace', fontSize: isCurrentRun ? 10 : 8, color: dustColor, textAlign: 'right' }}>
                    +{run.soulDustEarned}✦
                  </div>,
                ];
              })}
            </div>
          </motion.div>
        )}

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
