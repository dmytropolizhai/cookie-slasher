import { motion } from 'framer-motion';
import { useStore } from '../store';
import type { StyleGrade } from '@/types';

const GRADE_COLOR: Record<StyleGrade, string> = {
  S: '#FFE600',
  A: '#FF6600',
  B: '#44FF88',
  C: '#44CCFF',
  D: '#888888',
};

const GRADE_SHADOW: Record<StyleGrade, string> = {
  S: '0 0 24px #FFE600, 0 0 48px #FF6600',
  A: '0 0 20px #FF6600, 0 0 40px #FF4400',
  B: '0 0 16px #44FF88',
  C: '0 0 12px #44CCFF',
  D: '0 0 6px #888',
};

const GRADE_LABEL: Record<StyleGrade, string> = {
  S: 'LEGENDARY',
  A: 'EXCELLENT',
  B: 'SKILLED',
  C: 'DECENT',
  D: 'NEEDS WORK',
};

interface StatRowProps {
  label: string;
  value: string;
  color?: string;
  highlight?: boolean;
}

function StatRow({ label, value, color = '#aaa', highlight = false }: StatRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 8,
          color: '#666',
          letterSpacing: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: highlight ? 13 : 11,
          color,
          textShadow: highlight ? `0 0 10px ${color}` : 'none',
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function RunReportCard() {
  const { runStats, game } = useStore();
  const grade = runStats.styleGrade;
  const gradeColor = GRADE_COLOR[grade];
  const gradeShadow = GRADE_SHADOW[grade];
  const gradeLabel = GRADE_LABEL[grade];

  const total = runStats.sliced + runStats.missed;
  const accuracyPct = total > 0 ? Math.round((runStats.sliced / total) * 100) : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        background: 'rgba(10,0,20,0.85)',
        border: `2px solid ${gradeColor}44`,
        boxShadow: `0 0 30px ${gradeColor}22, inset 0 0 20px rgba(0,0,0,0.4)`,
        padding: '20px 24px',
        width: 320,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Corner glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 60,
          height: 60,
          background: `radial-gradient(circle at top left, ${gradeColor}22, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 9,
              color: '#9B00FF',
              letterSpacing: 3,
              marginBottom: 4,
            }}
          >
            RUN REPORT
          </div>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 7,
              color: '#444',
              letterSpacing: 2,
            }}
          >
            WAVE {game.wave}
          </div>
        </div>

        {/* Style Grade badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 15 }}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 42,
              color: gradeColor,
              textShadow: gradeShadow,
              lineHeight: 1,
            }}
          >
            {grade}
          </motion.div>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 6,
              color: gradeColor,
              opacity: 0.7,
              letterSpacing: 1,
            }}
          >
            {gradeLabel}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${gradeColor}66, transparent)`,
          marginBottom: 12,
        }}
      />

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <StatRow
          label="SLICED"
          value={String(runStats.sliced)}
          color="#00FFFF"
          highlight
        />
        <StatRow
          label="MISSED"
          value={String(runStats.missed)}
          color={runStats.missed === 0 ? '#44FF88' : '#FF4466'}
        />
        <StatRow
          label="ACCURACY"
          value={`${accuracyPct}%`}
          color={accuracyPct >= 90 ? '#44FF88' : accuracyPct >= 70 ? '#FFE600' : '#FF4466'}
          highlight
        />
        <StatRow
          label="MAX COMBO"
          value={String(runStats.maxCombo)}
          color="#FF0080"
          highlight
        />
        <StatRow
          label="CRITICALS"
          value={String(runStats.criticals)}
          color="#FFE600"
        />
        <StatRow
          label="BOMBS HIT"
          value={String(runStats.bombsHit)}
          color={runStats.bombsHit === 0 ? '#44FF88' : '#FF4400'}
        />
        <StatRow
          label="BOMBS AVOIDED"
          value={String(runStats.bombsAvoided)}
          color="#44FF88"
        />
        <StatRow
          label="REIKI EARNED"
          value={`¥${runStats.reikiEarned}`}
          color="#FFE600"
        />
      </div>
    </motion.div>
  );
}
