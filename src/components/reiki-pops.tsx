import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store';

export function ReikiPops() {
  const { reikiPops, removeReikiPop } = useStore();

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 200 }}
    >
      <AnimatePresence>
        {reikiPops.map((pop) => (
          <motion.div
            key={pop.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -60, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            onAnimationComplete={() => removeReikiPop(pop.id)}
            style={{
              position: 'absolute',
              left: pop.x,
              top: pop.y,
              transform: 'translate(-50%, -50%)',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: pop.amount >= 100 ? 13 : pop.amount >= 30 ? 11 : 9,
              color: pop.amount >= 100 ? '#FF0080' : pop.amount >= 30 ? '#FFE600' : '#FFE600',
              textShadow: pop.amount >= 100
                ? '0 0 14px #FF0080, 0 0 28px #9B00FF'
                : pop.amount >= 30
                  ? '0 0 10px #FFE600, 0 0 20px #FF6600'
                  : '0 0 8px #FFE600',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            +¥{pop.amount}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
