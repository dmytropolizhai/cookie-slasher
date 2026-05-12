import { motion } from 'framer-motion';

interface MenuScreenProps {
  onStart: () => void;
  highScore: number;
}

export function MenuScreen({ onStart, highScore }: MenuScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #0A0010 0%, #12001E 60%, #0A0A2A 100%)' }}
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
            linear-gradient(rgba(155,0,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(155,0,255,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      {/* Neon horizon */}
      <div
        className="absolute"
        style={{
          bottom: '18%',
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, #FF0080, #9B00FF, #00FFFF, transparent)',
          boxShadow: '0 0 20px #FF0080, 0 0 40px #9B00FF',
        }}
      />

      {/* Japanese subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 11,
          color: '#9B00FF',
          textShadow: '0 0 12px #9B00FF',
          letterSpacing: 4,
          marginBottom: 20,
        }}
      >
        ネオ東京アーケード
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="text-center mb-2"
      >
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 52,
            color: '#FF0080',
            textShadow: '0 0 20px #FF0080, 0 0 50px #FF0080, 4px 4px 0 #660030',
            lineHeight: 1.1,
          }}
        >
          COOKIE
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 52,
            color: '#00FFFF',
            textShadow: '0 0 20px #00FFFF, 0 0 50px #00FFFF, -4px 4px 0 #006666',
            lineHeight: 1.1,
          }}
        >
          SLASH
        </div>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 9,
          color: '#FFE600',
          textShadow: '0 0 8px #FFE600',
          letterSpacing: 3,
          marginBottom: 48,
        }}
      >
        斬れ！SLICE THE COOKIES
      </motion.div>

      {/* Cookie type legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex gap-6 mb-10"
      >
        {[
          { label: 'NORMAL', color: '#D4955A', desc: '+50 pts' },
          { label: 'GOLDEN', color: '#FFD700', desc: '+150 pts' },
          { label: 'FAKE', color: '#888', desc: '-10 霊気' },
          { label: 'BOMB', color: '#FF4400', desc: '-1 LIFE' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
              style={{
                width: 24, height: 24, borderRadius: '50%',
                background: item.color,
                boxShadow: `0 0 10px ${item.color}`,
                border: `2px solid ${item.color}88`,
              }}
            />
            <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 6, color: item.color }}>
              {item.label}
            </div>
            <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 6, color: '#888' }}>
              {item.desc}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Start button */}
      <motion.button
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: 'spring' }}
        whileHover={{ scale: 1.08, boxShadow: '0 0 40px #FF0080, 0 0 80px #9B00FF' }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 16,
          color: '#fff',
          background: 'linear-gradient(135deg, #9B00FF, #FF0080)',
          border: '3px solid #FF0080',
          boxShadow: '0 0 20px #FF0080, 0 0 40px #9B00FF, inset 0 1px 0 rgba(255,255,255,0.2)',
          padding: '16px 48px',
          cursor: 'pointer',
          letterSpacing: 3,
          textShadow: '0 0 8px rgba(255,255,255,0.8)',
        }}
      >
        ▶ START GAME
      </motion.button>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex gap-8 mt-8"
      >
        {[
          { key: 'HOLD LMB', desc: 'Grab Katana' },
          { key: 'MOVE MOUSE', desc: 'Slice Cookies' },
        ].map((c) => (
          <div key={c.key} className="flex flex-col items-center gap-1">
            <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 8, color: '#00FFFF', textShadow: '0 0 6px #00FFFF' }}>
              {c.key}
            </div>
            <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 7, color: '#888' }}>
              {c.desc}
            </div>
          </div>
        ))}
      </motion.div>

      {/* High score */}
      {highScore > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6"
          style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 9, color: '#FFE600', textShadow: '0 0 6px #FFE600' }}
        >
          BEST: {highScore.toString().padStart(7, '0')}
        </motion.div>
      )}
    </motion.div>
  );
}
