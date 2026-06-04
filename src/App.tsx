import { useRef, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import { useGameLoop } from '@/core/use-game-loop';
import { HUD } from './components/hud';
import { MenuScreen } from './components/menu-screen';
import { GameOverScreen } from './components/game-over-screen';
import { PauseScreen } from './components/pause-screen';
import { ShopScreen } from './components/shop-screen';
import { ReikiPops } from './components/reiki-pops';
import { WaveClearScreen } from './components/wave-clear-screen';

const LS_KEY = 'cookie_slash_hs';

function loadHighScore(): number {
  try { return parseInt(localStorage.getItem(LS_KEY) ?? '0', 10) || 0; }
  catch { return 0; }
}

function saveHighScore(score: number): void {
  try { localStorage.setItem(LS_KEY, String(score)); } catch { /* ignore */ }
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { game, shopOpen, resumeGame, setPhase, waveClearVisible, finalizeRunStats } = useStore();
  const { startGame } = useGameLoop(canvasRef);
  const [highScore, setHighScore] = useState(loadHighScore);

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

  useEffect(() => {
    if (game.phase === 'gameover') {
      finalizeRunStats();
      if (game.score > highScore) {
        setHighScore(game.score);
        saveHighScore(game.score);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.phase]);

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
        {game.phase === 'menu' && <MenuScreen key="menu" onStart={startGame} highScore={highScore} />}
        {game.phase === 'gameover' && <GameOverScreen key="gameover" onRestart={startGame} highScore={highScore} />}
        {game.phase === 'paused' && (
          <PauseScreen
            key="paused"
            onResume={resumeGame}
            onQuit={() => setPhase('menu')}
          />
        )}
      </AnimatePresence>
      {game.phase === 'playing' && <CustomCursor />}
      {/* Floating reiki pops during play */}
      {game.phase === 'playing' && <ReikiPops />}
      {/* Wave clear interstitial */}
      <AnimatePresence>
        {waveClearVisible && game.phase === 'playing' && (
          <WaveClearScreen key="wave-clear" />
        )}
      </AnimatePresence>
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
