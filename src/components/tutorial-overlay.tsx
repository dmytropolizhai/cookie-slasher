import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';

const STEPS = [
  {
    title: 'HOW TO SLICE',
    titleJP: '斬り方',
    color: '#FF0080',
    icon: '⚔',
    lines: [
      'Hold LEFT MOUSE BUTTON',
      'to draw your katana.',
      '',
      'Move the mouse while',
      'holding to slice cookies.',
    ],
  },
  {
    title: 'COOKIE TYPES',
    titleJP: 'クッキーの種類',
    color: '#FFE600',
    icon: '🍪',
    lines: [
      'NORMAL  — +50 pts, +10 霊気',
      'GOLDEN  — +150 pts, +30 霊気',
      'FAKE    — lose 10 霊気!',
      'BOMB    — lose 1 LIFE!',
    ],
  },
  {
    title: 'BUILD COMBOS',
    titleJP: 'コンボ',
    color: '#00FFFF',
    icon: '★',
    lines: [
      'Slice cookies quickly to',
      'build a combo chain.',
      '',
      'Higher combos give score',
      'multipliers up to x8!',
    ],
  },
  {
    title: 'UPGRADE SHOP',
    titleJP: '霊気ショップ',
    color: '#9B00FF',
    icon: '⬆',
    lines: [
      'Earn 霊気 by slicing.',
      '',
      'Between waves, open',
      'the shop to buy',
      'powerful upgrades.',
    ],
  },
];

interface TutorialOverlayProps {
  onDone: () => void;
}

export function TutorialOverlay({ onDone }: TutorialOverlayProps) {
  const { setTutorialSeen } = useStore();
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function advance() {
    if (isLast) {
      setTutorialSeen();
      onDone();
    } else {
      setStep((s) => s + 1);
    }
  }

  function skip() {
    setTutorialSeen();
    onDone();
  }

  const lineColor = (line: string): string => {
    if (line.startsWith('NORMAL')) return '#D4955A';
    if (line.startsWith('GOLDEN')) return '#FFD700';
    if (line.startsWith('FAKE')) return '#888888';
    if (line.startsWith('BOMB')) return '#FF4400';
    return '#aaaaaa';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'rgba(4,0,12,0.92)', backdropFilter: 'blur(3px)', zIndex: 100 }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(155,0,255,0.025) 3px, rgba(155,0,255,0.025) 4px)',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(155,0,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(155,0,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Header label */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 8,
          color: '#444',
          letterSpacing: 3,
          whiteSpace: 'nowrap',
        }}
      >
        チュートリアル · TUTORIAL
      </div>

      {/* Skip button — top right */}
      <motion.button
        whileHover={{ opacity: 1, color: '#9B00FF', borderColor: 'rgba(155,0,255,0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={skip}
        style={{
          position: 'absolute',
          top: 18,
          right: 24,
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 8,
          color: '#444',
          background: 'none',
          border: '1px solid #333',
          padding: '8px 14px',
          cursor: 'pointer',
          letterSpacing: 2,
          opacity: 0.7,
        }}
      >
        SKIP
      </motion.button>

      {/* Step dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 10,
        }}
      >
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i === step ? current.color : i < step ? '#444' : '#222',
              boxShadow: i === step ? `0 0 8px ${current.color}` : 'none',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          />
        ))}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '52px 64px',
            border: `2px solid ${current.color}55`,
            background: 'rgba(10,0,24,0.9)',
            boxShadow: `0 0 40px ${current.color}22`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            maxWidth: 500,
            width: '88vw',
          }}
        >
          {/* Icon */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 44,
              color: current.color,
              textShadow: `0 0 20px ${current.color}, 0 0 50px ${current.color}`,
              lineHeight: 1,
            }}
          >
            {current.icon}
          </motion.div>

          {/* JP subtitle */}
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 9,
              color: '#9B00FF',
              textShadow: '0 0 8px #9B00FF',
              letterSpacing: 4,
            }}
          >
            {current.titleJP}
          </div>

          {/* Title */}
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 18,
              color: current.color,
              textShadow: `0 0 16px ${current.color}`,
              letterSpacing: 3,
              textAlign: 'center',
            }}
          >
            {current.title}
          </div>

          {/* Neon divider */}
          <div
            style={{
              width: '100%',
              height: 2,
              background: `linear-gradient(90deg, transparent, ${current.color}, transparent)`,
              boxShadow: `0 0 8px ${current.color}`,
              opacity: 0.7,
            }}
          />

          {/* Content lines */}
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 8,
              lineHeight: 2.4,
              textAlign: 'center',
            }}
          >
            {current.lines.map((line, i) => (
              <div key={i} style={{ color: lineColor(line) }}>
                {line || ' '}
              </div>
            ))}
          </div>

          {/* Bottom divider */}
          <div
            style={{
              width: '100%',
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(155,0,255,0.3), transparent)',
            }}
          />

          {/* Progress / Next */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, width: '100%' }}>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 7,
                color: '#444',
                letterSpacing: 1,
                flex: 1,
              }}
            >
              {step + 1} / {STEPS.length}
            </div>
            <motion.button
              whileHover={{
                scale: 1.06,
                boxShadow: `0 0 30px ${current.color}`,
              }}
              whileTap={{ scale: 0.96 }}
              onClick={advance}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 11,
                color: '#fff',
                background: `linear-gradient(135deg, #9B00FF, ${current.color})`,
                border: `2px solid ${current.color}`,
                boxShadow: `0 0 14px ${current.color}66`,
                padding: '12px 28px',
                cursor: 'pointer',
                letterSpacing: 2,
                textShadow: '0 0 6px rgba(255,255,255,0.7)',
              }}
            >
              {isLast ? 'PLAY!' : 'NEXT >'}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
