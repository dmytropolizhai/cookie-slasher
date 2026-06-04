import { motion } from 'framer-motion';
import { formatDailyDate } from '@/core/seeded-rng';
import type { DailyChallengeRecord } from '@/types';

interface DailyChallengeScreenProps {
  todayDate: string;
  record: DailyChallengeRecord | null;
  onStartDaily: () => void;
  onBack: () => void;
}

export function DailyChallengeScreen({
  todayDate,
  record,
  onStartDaily,
  onBack,
}: DailyChallengeScreenProps) {
  const alreadyPlayed = record?.date === todayDate && record.completed;

  return (
    <motion.div
      key="daily"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #0A0010 0%, #00101E 60%, #0A0A2A 100%)' }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)',
          pointerEvents: 'none',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center gap-6"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Header label */}
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 10,
            color: '#00FFFF',
            textShadow: '0 0 10px #00FFFF',
            letterSpacing: 4,
          }}
        >
          今日のチャレンジ
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 30,
            color: '#FFE600',
            textShadow: '0 0 20px #FFE600, 0 0 50px #FFE600, 3px 3px 0 #664400',
            letterSpacing: 2,
            textAlign: 'center',
          }}
        >
          DAILY
          <br />
          CHALLENGE
        </div>

        {/* Date */}
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 11,
            color: '#9B00FF',
            textShadow: '0 0 8px #9B00FF',
            letterSpacing: 2,
          }}
        >
          {todayDate}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 320,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #00FFFF, #FFE600, #9B00FF, transparent)',
            boxShadow: '0 0 10px #00FFFF',
          }}
        />

        {/* Description */}
        <div
          className="flex flex-col items-center gap-2"
          style={{ maxWidth: 320, textAlign: 'center' }}
        >
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 7,
              color: '#aaa',
              lineHeight: 1.8,
            }}
          >
            SAME SEED FOR EVERYONE TODAY.
            <br />
            ONE ATTEMPT PER DAY.
            <br />
            NO UPGRADES — PURE SKILL.
          </div>
        </div>

        {/* Previous result (if played today) */}
        {alreadyPlayed && record && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-2"
            style={{
              border: '2px solid #FFE600',
              padding: '12px 24px',
              background: 'rgba(255,230,0,0.06)',
            }}
          >
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 8,
                color: '#FFE600',
                textShadow: '0 0 6px #FFE600',
              }}
            >
              TODAY'S RESULT
            </div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 22,
                color: '#fff',
                textShadow: '0 0 10px #fff',
              }}
            >
              {record.score.toString().padStart(7, '0')}
            </div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 8,
                color: '#00FFFF',
              }}
            >
              WAVE {record.wave}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-4">
          {!alreadyPlayed ? (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: 'spring' }}
              whileHover={{ scale: 1.08, boxShadow: '0 0 40px #FFE600, 0 0 80px #9B00FF' }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartDaily}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 14,
                color: '#000',
                background: 'linear-gradient(135deg, #FFE600, #FF9900)',
                border: '3px solid #FFE600',
                boxShadow: '0 0 20px #FFE600, 0 0 40px rgba(255,230,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                padding: '14px 40px',
                cursor: 'pointer',
                letterSpacing: 2,
                textShadow: '0 1px 0 rgba(255,255,255,0.4)',
              }}
            >
              ▶ PLAY TODAY
            </motion.button>
          ) : (
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 8,
                color: '#666',
                textAlign: 'center',
                lineHeight: 1.8,
              }}
            >
              COME BACK TOMORROW
              <br />
              FOR A NEW CHALLENGE!
            </div>
          )}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
              color: '#666',
              background: 'transparent',
              border: '2px solid #333',
              padding: '10px 28px',
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

// Re-export helper so callers don't need to import from seeded-rng directly
export { formatDailyDate };
