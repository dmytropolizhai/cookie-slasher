import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/store';

import {
  makeCrumbs,
  makeGoo,
  makeSlashParticles,
  makeCriticalBurst,
  makeExplosion,
  makeNeonFragments,
  makeSakuraPetal,
  makeImpactSparks,
} from '@/core/particles/particle-factory';
import { renderFrame } from '@/core/rendering';
import { uid, resetEntityId, distance } from '@/core/math';
import { recycleParticle, tickParticle } from '@/core/particles';
import { makeSeededRng } from '@/core/seeded-rng';

import { SpawnDirector } from '@/systems/spawn-director';
import { checkSlashHit } from '@/systems/slash/hit-detection';
import { spawnCookie } from '@/systems/cookies/factory';
import { stepCookie } from '@/systems/cookies/movement';
import { stepHalf } from '@/systems/halves';

import type { CookieHalf, GameMode, Vec2 } from '@/types';

export function useGameLoop(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const store = useStore();
  const storeRef = useRef(store);
  useEffect(() => { storeRef.current = store; }, [store]);

  const directorRef = useRef(new SpawnDirector(1));
  const flashAlphaRef = useRef(0);
  const timeRef = useRef(0);
  const lastFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef<Vec2>({ x: 0, y: 0 });
  const prevMouseRef = useRef<Vec2>({ x: 0, y: 0 });
  const isSlashingRef = useRef(false);
  const sakuraTimerRef = useRef(0);
  const hitCookiesRef = useRef(new Set<string>());
  const sliceCountRef = useRef(0);
  const blastRuneUsedRef = useRef(false);
  const chronoRecoveryRef = useRef(1.5);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    prevMouseRef.current = { ...mouseRef.current };
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    if (isSlashingRef.current) {
      storeRef.current.pushSlashPoint(mouseRef.current.x, mouseRef.current.y, performance.now() / 1000);
    }
  }, [canvasRef]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button !== 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    isSlashingRef.current = true;
    storeRef.current.setSlashActive(true);
    hitCookiesRef.current.clear();
  }, [canvasRef]);

  const handleMouseUp = useCallback(() => {
    isSlashingRef.current = false;
    storeRef.current.setSlashActive(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);

  //  ESC to pause / resume 
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (storeRef.current.shopOpen) return;
      const phase = storeRef.current.game.phase;
      if (phase === 'playing') storeRef.current.pauseGame();
      else if (phase === 'paused') storeRef.current.resumeGame();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  //  Main Loop 
  const loop = useCallback((timestamp: number) => {
    const s = storeRef.current;
    if (s.game.phase !== 'playing' || s.shopOpen) {
      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    const upg = (id: string) => s.upgrades[id] ?? 0;

    const rawDt = Math.min((timestamp - lastFrameRef.current) / 1000, 0.05);
    lastFrameRef.current = timestamp;
    const dt = rawDt * s.game.timeScale;
    timeRef.current += rawDt;
    const now = timestamp / 1000;

    //  Decay systems 
    s.tickCombo(dt);
    s.tickCritical(rawDt);
    s.decayShake();

    // Restore time scale
    if (s.game.timeScale < 1 && !s.game.criticalActive) {
      s.setTimeScale(Math.min(1, s.game.timeScale + rawDt * chronoRecoveryRef.current));
    }
    if (s.game.timeScale >= 1) chronoRecoveryRef.current = 1.5;

    //  Flash decay 
    flashAlphaRef.current = Math.max(0, flashAlphaRef.current - rawDt * 4);

    //  Slash detection 
    const slashPoints = s.slash.points;
    s.pruneSlash(now - 0.18);

    if (isSlashingRef.current && slashPoints.length >= 2) {
      const p0 = slashPoints[slashPoints.length - 2]?.pos;
      const p1 = slashPoints[slashPoints.length - 1]?.pos;

      if (p0 && p1) {
        const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        const velocity = distance(p0, p1);

        s.cookies.forEach((cookie) => {
          if (cookie.state !== 'falling') return;
          if (hitCookiesRef.current.has(cookie.id)) return;

          const hitRadius = cookie.type === 'golden'
            ? cookie.radius + upg('fortune_magnet') * 8
            : cookie.radius;

          if (!checkSlashHit(cookie.pos, hitRadius, p0, p1)) return;
          hitCookiesRef.current.add(cookie.id);

          if (cookie.type === 'bomb') {
            s.updateCookie(cookie.id, { state: 'exploded' });
            if (upg('blast_rune') > 0 && !blastRuneUsedRef.current) {
              blastRuneUsedRef.current = true;
              flashAlphaRef.current = 0.15;
            } else {
              s.takeDamage(1);
              s.breakCombo();
              s.triggerShake(8);
              flashAlphaRef.current = 0.3;
            }
            makeExplosion(cookie.pos, 30).forEach(s.addParticle);
            makeNeonFragments(cookie.pos, 12).forEach(s.addParticle);
          } else if (cookie.type === 'fake') {
            s.updateCookie(cookie.id, { state: 'sliced' });
            s.addReiki(-10);
            s.breakCombo(true);
            s.triggerShake(3);
            makeCrumbs(cookie.pos, 'fake', 8).forEach(s.addParticle);
          } else if (cookie.type === 'boss') {
            const newHp = cookie.hp - 1;
            if (newHp <= 0) {
              s.updateCookie(cookie.id, { state: 'sliced', hp: 0 });
              s.addScore(500);
              s.addReiki(100);
              s.incrementCombo();
              makeCriticalBurst(cookie.pos, 30).forEach(s.addParticle);
              makeNeonFragments(cookie.pos, 20).forEach(s.addParticle);
              flashAlphaRef.current = 0.5;
            } else {
              s.updateCookie(cookie.id, { hp: newHp });
              s.triggerShake(3);
              makeImpactSparks(cookie.pos, 8).forEach(s.addParticle);
            }
          } else {
            // NORMAL / GOLDEN
            s.updateCookie(cookie.id, { state: 'sliced' });

            const critFast = 0.25 + upg('crumb_accelerator') * 0.10;
            const critSlow = 0.08 + upg('crumb_accelerator') * 0.08;
            const isCritical = Math.random() < (velocity > 200 ? critFast : critSlow);
            const isGolden = cookie.type === 'golden';

            const baseScore = isGolden ? 150 : 50;
            const ghostDouble = Math.random() < upg('ghost_multiplier') * 0.15 ? 2 : 1;
            const scoreBonus = (isCritical ? baseScore * 2 : baseScore) * ghostDouble;

            s.addScore(scoreBonus);
            s.addReiki(isGolden ? 30 : 10);
            s.incrementCombo();

            sliceCountRef.current++;
            const overflowLevel = upg('spirit_overflow');
            if (overflowLevel > 0 && sliceCountRef.current % 10 === 0) {
              s.addReiki(10 * overflowLevel);
            }

            makeCrumbs(cookie.pos, cookie.type, isGolden ? 18 : 12).forEach(s.addParticle);
            makeGoo(cookie.pos, cookie.type, 6).forEach(s.addParticle);
            makeSlashParticles(cookie.pos, angle, 8).forEach(s.addParticle);
            makeImpactSparks(cookie.pos, 6).forEach(s.addParticle);

            if (isCritical) {
              const chronoRecovery = 1.5 / (1 + upg('chrono_slice') * 0.6);
              s.triggerCritical();
              s.setTimeScale(0.25);
              chronoRecoveryRef.current = chronoRecovery;
              s.triggerShake(6);
              flashAlphaRef.current = 0.6;
              makeCriticalBurst(cookie.pos, 25).forEach(s.addParticle);
            } else if (isGolden) {
              s.setTimeScale(0.5);
              s.triggerShake(4);
              flashAlphaRef.current = 0.35;
              makeNeonFragments(cookie.pos, 10).forEach(s.addParticle);
            }

            const half1: CookieHalf = {
              id: uid(), pos: { ...cookie.pos },
              vel: { x: Math.cos(angle - Math.PI / 2) * 80 - 20, y: -120 + Math.sin(angle) * 40 },
              rotation: cookie.rotation, rotationSpeed: cookie.rotationSpeed + 2,
              alpha: 1, half: 'top', cookieType: cookie.type, slashAngle: angle,
            };
            const half2: CookieHalf = {
              id: uid(), pos: { ...cookie.pos },
              vel: { x: Math.cos(angle + Math.PI / 2) * 80 + 20, y: -80 + Math.sin(angle) * 40 },
              rotation: cookie.rotation, rotationSpeed: cookie.rotationSpeed - 2,
              alpha: 1, half: 'bottom', cookieType: cookie.type, slashAngle: angle,
            };
            s.addHalf(half1);
            s.addHalf(half2);
          }
        });
      }
    }

    // ── Move cookies ──
    const toRemove: string[] = [];
    const canvas = canvasRef.current;
    const canvasH = canvas?.height ?? 600;
    const canvasW = canvas?.width ?? 800;

    s.cookies.forEach((cookie) => {
      const step = stepCookie(cookie, dt, canvasH);
      if (step.action === 'remove') {
        toRemove.push(cookie.id);
      } else if (step.action === 'missed') {
        toRemove.push(cookie.id);
        s.breakCombo(true);
        s.takeDamage(0);
      } else {
        s.updateCookie(cookie.id, step.patch);
      }
    });
    toRemove.forEach(s.removeCookie);

    //  Move halves 
    const halvesToRemove: string[] = [];
    s.halves.forEach((half) => {
      if (!stepHalf(half, dt, canvasH)) halvesToRemove.push(half.id);
    });
    halvesToRemove.forEach(s.removeHalf);

    //  Tick particles 
    const particlesToRemove: string[] = [];
    s.particles.forEach((p) => {
      if (!tickParticle(p, dt, timeRef.current)) {
        particlesToRemove.push(p.id);
        recycleParticle(p);
      }
    });
    particlesToRemove.forEach(s.removeParticle);

    //  Spawn sakura 
    sakuraTimerRef.current += rawDt;
    if (sakuraTimerRef.current > 0.3) {
      sakuraTimerRef.current = 0;
      s.addParticle(makeSakuraPetal(canvasW));
    }

    //  Spawn director 
    const director = directorRef.current;
    const cookieType = director.tick(rawDt);
    if (cookieType) {
      s.addCookie(spawnCookie(cookieType as import('../types').CookieType, canvasW, director.getSpeed()));
    }

    if (director.isWaveComplete() && s.cookies.filter((c) => c.state === 'falling').length === 0) {
      s.nextWave();
      director.reset(s.game.wave + 1);
      blastRuneUsedRef.current = false;
    }

    //  Render 
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        renderFrame({
          ctx,
          width: canvas.width,
          height: canvas.height,
          cookies: s.cookies,
          halves: s.halves,
          particles: s.particles,
          slash: s.slash,
          game: s.game,
          now,
          time: timeRef.current,
          flashAlpha: flashAlphaRef.current,
        });
      }
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [canvasRef]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loop]);

  const startGame = useCallback((mode: GameMode = 'endless', dailySeed?: number, dailyDate?: string) => {
    storeRef.current.resetGame(mode, dailyDate ?? null);
    storeRef.current.setPhase('playing');

    if (mode === 'daily' && dailySeed !== undefined) {
      // Use seeded RNG factory: each wave gets its own deterministic RNG derived from the daily seed
      const rngFactory = (wave: number) => makeSeededRng(dailySeed * 100 + wave);
      directorRef.current = new SpawnDirector(1, rngFactory);
    } else {
      directorRef.current = new SpawnDirector(1);
    }

    resetEntityId();
    flashAlphaRef.current = 0;
    timeRef.current = 0;
    lastFrameRef.current = performance.now();
    sliceCountRef.current = 0;
    blastRuneUsedRef.current = false;
    chronoRecoveryRef.current = 1.5;
  }, []);

  return { startGame };
}
