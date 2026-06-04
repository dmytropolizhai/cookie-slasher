import { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import { usePersistStore } from './store/persist-store';
import { useGameLoop } from '@/core/use-game-loop';
import { HUD } from './components/hud';
import { MenuScreen } from './components/menu-screen';
import { GameOverScreen } from './components/game-over-screen';
import { PauseScreen } from './components/pause-screen';
import { ShopScreen } from './components/shop-screen';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { game, shopOpen, resumeGame, setPhase } = useStore();
  const { startGame } = useGameLoop(canvasRef);
  const { soulDust, runHistory, currentStreak, bestStreak, recordRun } = usePersistStore();

  // Derive high score from run history
  const highScore = runHistory.length > 0
    ? Math.max(...runHistory.map((r) => r.score))
    : 0;

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Record run once on game-over transition
  const recordedRef = useRef(false);
  useEffect(() => {
    if (game.phase === 'gameover') {
      if (!recordedRef.current) {
        recordedRef.current = true;
        recordRun(game.score, game.wave);
      }
    } else {
      recordedRef.current = false;
    }
  }, [game.phase, game.score, game.wave, recordRun]);

  useEffect(() => {
    const prevent = (e: MouseEvent) => e.preventDefault();
    window.addEventListener('contextmenu', prevent);
    return () => window.removeEventListener('contextmenu', prevent);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden relative"
      style={{ background: '#0A0010', cursor: game.phase === 'playing' ? 'none' : 'default' }}>
      <canvas ref={canvasRef} className="absolute inset-0" style={{ display: 'block' }} />
      {(game.phase === 'playing' || game.phase === 'paused') && <HUD />}
      <AnimatePresence mode="wait">
        {game.phase === 'menu' && (
          <MenuScreen
            key="menu"
            onStart={startGame}
            highScore={highScore}
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            soulDust={soulDust}
          />
        )}
        {game.phase === 'gameover' && (
          <GameOverScreen
            key="gameover"
            onRestart={startGame}
            highScore={highScore}
            runHistory={runHistory.slice(0, 5)}
          />
        )}
        {game.phase === 'paused' && (
          <PauseScreen
            key="paused"
            onResume={resumeGame}
            onQuit={() => setPhase('menu')}
          />
        )}
      </AnimatePresence>
      {game.phase === 'playing' && <CustomCursor />}
      <AnimatePresence>
        {shopOpen && <ShopScreen key="shop" />}
      </AnimatePresence>
    </div>
  );
}

function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div ref={ref} className="fixed top-0 left-0 pointer-events-none" style={{ zIndex: 9999, willChange: 'transform' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" style={{ overflow: 'visible' }}>
        <circle cx="12" cy="12" r="3" fill="none" stroke="#00FFFF" strokeWidth="1.5" opacity="0.8" />
        <line x1="12" y1="0" x2="12" y2="8" stroke="#00FFFF" strokeWidth="1" opacity="0.6" />
        <line x1="12" y1="16" x2="12" y2="24" stroke="#00FFFF" strokeWidth="1" opacity="0.6" />
        <line x1="0" y1="12" x2="8" y2="12" stroke="#00FFFF" strokeWidth="1" opacity="0.6" />
        <line x1="16" y1="12" x2="24" y2="12" stroke="#00FFFF" strokeWidth="1" opacity="0.6" />
        <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" opacity="0.9" />
      </svg>
    </div>
  );
}
