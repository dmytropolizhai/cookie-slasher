import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { UPGRADES } from '../systems/shop';

interface PauseScreenProps {
  onResume: () => void;
  onQuit: () => void;
}

const GLITCH_CSS = `
@keyframes glitch-clip-1 {
  0%,100% { clip-path: inset(0 0 96% 0); transform: translate(-3px, 0); }
  20%      { clip-path: inset(30% 0 50% 0); transform: translate(3px, 0); }
  40%      { clip-path: inset(70% 0 10% 0); transform: translate(-2px, 1px); }
  60%      { clip-path: inset(10% 0 80% 0); transform: translate(2px, -1px); }
  80%      { clip-path: inset(50% 0 30% 0); transform: translate(-3px, 0); }
}
@keyframes glitch-clip-2 {
  0%,100% { clip-path: inset(80% 0 0 0);   transform: translate(3px, 0); }
  20%      { clip-path: inset(10% 0 70% 0); transform: translate(-3px, 0); }
  40%      { clip-path: inset(50% 0 20% 0); transform: translate(2px, 1px); }
  60%      { clip-path: inset(20% 0 60% 0); transform: translate(-2px, -1px); }
  80%      { clip-path: inset(70% 0 10% 0); transform: translate(3px, 0); }
}
@keyframes stutter-shake {
  0%,100% { transform: translate(0,0) skewX(0deg); }
  8%       { transform: translate(-4px, 1px) skewX(-1deg); }
  16%      { transform: translate(4px,-1px) skewX(1.5deg); }
  24%      { transform: translate(-2px, 2px) skewX(0deg); }
  32%      { transform: translate(0,0); }
}
@keyframes scanline-drift {
  from { background-position: 0 0; }
  to   { background-position: 0 100px; }
}
@keyframes border-pulse {
  0%,100% { box-shadow: 0 0 16px #9B00FF, inset 0 0 16px rgba(155,0,255,0.1); }
  50%      { box-shadow: 0 0 32px #FF0080, inset 0 0 24px rgba(255,0,128,0.15); }
}
`;

function injectGlitchStyles() {
  if (document.getElementById('pause-glitch-styles')) return;
  const s = document.createElement('style');
  s.id = 'pause-glitch-styles';
  s.textContent = GLITCH_CSS;
  document.head.appendChild(s);
}

function GlitchTitle({ text }: { text: string }) {
  const base: React.CSSProperties = {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 52,
    color: '#00FFFF',
    textShadow: '0 0 20px #00FFFF, 0 0 50px #00FFFF, 4px 4px 0 #006666',
    letterSpacing: 4,
    position: 'relative',
    userSelect: 'none',
  };

  const pseudo: React.CSSProperties = {
    ...base,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    pointerEvents: 'none',
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Base layer — stutter shake */}
      <div
        style={{
          ...base,
          animation: 'stutter-shake 2.4s steps(1) infinite',
        }}
      >
        {text}
      </div>

      {/* Glitch layer 1 — cyan shifted */}
      <div
        style={{
          ...pseudo,
          color: '#FF0080',
          textShadow: 'none',
          animation: 'glitch-clip-1 2.4s steps(1) infinite',
          mixBlendMode: 'screen',
        }}
      >
        {text}
      </div>

      {/* Glitch layer 2 — magenta shifted */}
      <div
        style={{
          ...pseudo,
          color: '#9B00FF',
          textShadow: 'none',
          animation: 'glitch-clip-2 2.4s steps(1) infinite 0.15s',
          mixBlendMode: 'screen',
        }}
      >
        {text}
      </div>
    </div>
  );
}

export function PauseScreen({ onResume, onQuit }: PauseScreenProps) {
  const { game, upgrades, openShop, muted, toggleMute } = useStore();
  const injected = useRef(false);
  const [showAbandon, setShowAbandon] = useState(false);

  const ownedCount = UPGRADES.filter((u) => (upgrades[u.id] ?? 0) > 0).length;

  useEffect(() => {
    if (!injected.current) {
      injectGlitchStyles();
      injected.current = true;
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'rgba(4,0,12,0.88)', backdropFilter: 'blur(2px)' }}
    >
      {/* Animated scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,255,0.03) 3px, rgba(0,255,255,0.03) 4px)',
          animation: 'scanline-drift 4s linear infinite',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content card */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="flex flex-col items-center gap-8"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '52px 64px',
          border: '2px solid rgba(155,0,255,0.5)',
          animation: 'border-pulse 2s ease-in-out infinite',
          background: 'rgba(10,0,24,0.85)',
        }}
      >
        {/* Mute toggle — top-right corner of card */}
        <motion.button
          whileHover={{ scale: 1.15, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          style={{
            position: 'absolute',
            top: 14,
            right: 18,
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 12,
            color: muted ? '#555' : '#00FFFF',
            textShadow: muted ? 'none' : '0 0 8px #00FFFF',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            opacity: muted ? 0.5 : 0.85,
            letterSpacing: 0,
          }}
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </motion.button>

        {/* Japanese subtitle */}
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 10,
            color: '#9B00FF',
            textShadow: '0 0 10px #9B00FF',
            letterSpacing: 5,
          }}
        >
          ポーズ
        </div>

        {/* Glitchy PAUSED title */}
        <GlitchTitle text="PAUSED" />

        {/* Neon divider */}
        <div
          style={{
            width: 280,
            height: 2,
            background:
              'linear-gradient(90deg, transparent, #9B00FF, #00FFFF, #FF0080, transparent)',
            boxShadow: '0 0 10px #9B00FF',
          }}
        />

        {/* Current stats */}
        <div className="flex gap-12">
          <StatPill label="SCORE" value={game.score.toString().padStart(7, '0')} color="#FFFFFF" />
          <StatPill label="WAVE" value={`${game.wave}`} color="#00FFFF" />
          <StatPill label="霊気" value={`¥${game.reiki}`} color="#FFE600" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full">
          <PauseButton
            label="▶  RESUME"
            primary
            onClick={onResume}
          />
          <ShopButton reiki={game.reiki} ownedCount={ownedCount} onClick={openShop} />
          <PauseButton
            label="✕  ABANDON RUN"
            primary={false}
            onClick={() => setShowAbandon(true)}
          />
        </div>

        {/* ESC hint */}
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 7,
            color: '#444',
            letterSpacing: 2,
          }}
        >
          [ESC] TO RESUME
        </div>
      </motion.div>

      {/* Abandon Run confirmation */}
      <AnimatePresence>
        {showAbandon && (
          <AbandonConfirm
            onConfirm={onQuit}
            onCancel={() => setShowAbandon(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function AbandonConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: 10, background: 'rgba(2,0,8,0.82)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.82, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.82, opacity: 0, y: 16 }}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          padding: '44px 56px',
          border: '2px solid rgba(255,0,128,0.5)',
          background: 'rgba(10,0,24,0.96)',
          boxShadow: '0 0 40px rgba(255,0,128,0.2), 0 0 80px rgba(0,0,0,0.8)',
          maxWidth: 400,
          width: '80vw',
        }}
      >
        {/* Warning icon */}
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 36,
            color: '#FF0080',
            textShadow: '0 0 20px #FF0080',
            lineHeight: 1,
          }}
        >
          ⚠
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 16,
            color: '#FF0080',
            textShadow: '0 0 16px #FF0080',
            letterSpacing: 2,
            textAlign: 'center',
          }}
        >
          ABANDON RUN?
        </div>

        {/* Divider */}
        <div
          style={{
            width: '100%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,0,128,0.5), transparent)',
          }}
        />

        {/* Warning text */}
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 7,
            color: '#888',
            lineHeight: 2.2,
            textAlign: 'center',
            maxWidth: 280,
          }}
        >
          Your current progress will be lost. Score and 霊気 will not be saved.
        </div>

        {/* Buttons */}
        <div className="flex gap-4 w-full">
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(155,0,255,0.5)' }}
            whileTap={{ scale: 0.96 }}
            onClick={onCancel}
            style={{
              flex: 1,
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
              color: '#9B00FF',
              background: 'transparent',
              border: '2px solid rgba(155,0,255,0.4)',
              padding: '12px 0',
              cursor: 'pointer',
              letterSpacing: 1,
            }}
          >
            {'<'} STAY
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(255,0,128,0.5)' }}
            whileTap={{ scale: 0.96 }}
            onClick={onConfirm}
            style={{
              flex: 1,
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
              color: '#fff',
              background: 'linear-gradient(135deg, #9B00FF, #FF0080)',
              border: '2px solid #FF0080',
              boxShadow: '0 0 12px rgba(255,0,128,0.4)',
              padding: '12px 0',
              cursor: 'pointer',
              letterSpacing: 1,
              textShadow: '0 0 6px rgba(255,255,255,0.7)',
            }}
          >
            QUIT
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 7,
          color: '#666',
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 16,
          color,
          textShadow: `0 0 10px ${color}`,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ShopButton({ reiki, ownedCount, onClick }: { reiki: number; ownedCount: number; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(255,230,0,0.5)', borderColor: '#FFE600' }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 13,
        color: '#FFE600',
        background: 'transparent',
        border: '2px solid rgba(255,230,0,0.4)',
        boxShadow: 'none',
        padding: '12px 0',
        cursor: 'pointer',
        letterSpacing: 2,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        textShadow: '0 0 8px rgba(255,230,0,0.6)',
        transition: 'border-color 0.2s',
      }}
    >
      ★  UPGRADE SHOP
      <span style={{ fontSize: 8, color: '#FFE600', opacity: 0.7, textShadow: 'none' }}>
        ¥{reiki}{ownedCount > 0 ? `  ·  ${ownedCount} owned` : ''}
      </span>
    </motion.button>
  );
}

function PauseButton({
  label,
  primary,
  onClick,
}: {
  label: string;
  primary: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{
        scale: 1.04,
        boxShadow: primary
          ? '0 0 40px #FF0080, 0 0 70px #9B00FF'
          : '0 0 20px rgba(155,0,255,0.4)',
      }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 13,
        color: primary ? '#fff' : '#9B00FF',
        background: primary
          ? 'linear-gradient(135deg, #9B00FF, #FF0080)'
          : 'transparent',
        border: primary ? '3px solid #FF0080' : '2px solid rgba(155,0,255,0.4)',
        boxShadow: primary ? '0 0 20px #FF0080' : 'none',
        padding: primary ? '14px 0' : '12px 0',
        cursor: 'pointer',
        letterSpacing: 2,
        width: '100%',
        textShadow: primary ? '0 0 8px rgba(255,255,255,0.8)' : 'none',
        transition: 'border-color 0.2s',
      }}
    >
      {label}
    </motion.button>
  );
}
