import { useRef, useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import { useGameLoop } from '@/core/use-game-loop';
import { getDailySeed, formatDailyDate } from '@/core/seeded-rng';
import { HUD } from './components/hud';
import { MenuScreen } from './components/menu-screen';
import { GameOverScreen } from './components/game-over-screen';
import { PauseScreen } from './components/pause-screen';
import { ShopScreen } from './components/shop-screen';
import { DailyChallengeScreen } from './components/daily-challenge-screen';

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
  const { game, shopOpen, resumeGame, setPhase, dailyRecord, saveDailyRecord } = useStore();
  const { startGame } = useGameLoop(canvasRef);
  const [highScore, setHighScore] = useState(loadHighScore);
  const [showDaily, setShowDaily] = useState(false);

  const todayDate = formatDailyDate();

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

  // Save high score for endless mode; save daily record when daily game ends
  useEffect(() => {
    if (game.phase !== 'gameover') return;

    if (game.mode === 'endless') {
      if (game.score > highScore) {
        setHighScore(game.score);
        saveHighScore(game.score);
      }
    } else if (game.mode === 'daily' && game.dailyDate) {
      // Only save if not already saved for today (prevents overwrite on re-render)
      const existing = dailyRecord;
      if (!existing || existing.date !== game.dailyDate || !existing.completed) {
        saveDailyRecord({
          date: game.dailyDate,
          score: game.score,
          wave: game.wave,
          completed: true,
        });
      }
    }
  }, [game.phase, game.score, game.wave, game.mode, game.dailyDate, highScore, dailyRecord, saveDailyRecord]);

  useEffect(() => {
    const prevent = (e: MouseEvent) => e.preventDefault();
    window.addEventListener('contextmenu', prevent);
    return () => window.removeEventListener('contextmenu', prevent);
  }, []);

  const handleStartEndless = useCallback(() => {
    startGame('endless');
  }, [startGame]);

  const handleStartDaily = useCallback(() => {
    const seed = getDailySeed();
    startGame('daily', seed, todayDate);
    setShowDaily(false);
  }, [startGame, todayDate]);

  const handleMenu = useCallback(() => {
    setPhase('menu');
    setShowDaily(false);
  }, [setPhase]);

  return (
    <div className="w-screen h-screen overflow-hidden relative"
      style={{ background: '#0A0010', cursor: game.phase === 'playing' ? 'none' : 'default' }}>
      <canvas ref={canvasRef} className="absolute inset-0" style={{ display: 'block' }} />
      {(game.phase === 'playing' || game.phase === 'paused') && <HUD />}
      <AnimatePresence mode="wait">
        {game.phase === 'menu' && !showDaily && (
          <MenuScreen
            key="menu"
            onStart={handleStartEndless}
            onDailyChallenge={() => setShowDaily(true)}
            highScore={highScore}
            dailyRecord={dailyRecord}
            todayDate={todayDate}
          />
        )}
        {game.phase === 'menu' && showDaily && (
          <DailyChallengeScreen
            key="daily"
            todayDate={todayDate}
            record={dailyRecord}
            onStartDaily={handleStartDaily}
            onBack={() => setShowDaily(false)}
          />
        )}
        {game.phase === 'gameover' && (
          <GameOverScreen
            key="gameover"
            onRestart={handleStartEndless}
            onMenu={handleMenu}
            highScore={highScore}
          />
        )}
        {game.phase === 'paused' && (
          <PauseScreen
            key="paused"
            onResume={resumeGame}
            onQuit={handleMenu}
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
