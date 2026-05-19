import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store';
import { SpawnDirector } from '../systems/spawn-director';
import {
  makeCrumbs,
  makeGoo,
  makeSlashParticles,
  makeCriticalBurst,
  makeExplosion,
  makeNeonFragments,
  makeSakuraPetal,
  makeImpactSparks,
} from './particles/particle-factory';
import { renderFrame } from '@/core/rendering';
import type { CookieEntity, CookieHalf, Vec2 } from '../types';
import { recycleParticle } from './particles';

let _entityId = 0;
const uid = () => `e${++_entityId}`;

function distance(a: Vec2, b: Vec2): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── Slash Hit Detection ──────────────────────────────────────────────────────

function checkSlashHit(
  cookiePos: Vec2,
  cookieRadius: number,
  p0: Vec2,
  p1: Vec2
): boolean {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return distance(cookiePos, p0) < cookieRadius;
  const t = Math.max(0, Math.min(1, ((cookiePos.x - p0.x) * dx + (cookiePos.y - p0.y) * dy) / len2));
  const closest = { x: p0.x + t * dx, y: p0.y + t * dy };
  return distance(cookiePos, closest) < cookieRadius + 10;
}

// ─── Cookie Factory ───────────────────────────────────────────────────────────

function spawnCookie(
  type: ReturnType<SpawnDirector['getConfig']>['wave'] extends number ? import('../types').CookieType : never,
  canvasWidth: number,
  speed: number
): CookieEntity {
  const x = 60 + Math.random() * (canvasWidth - 120);
  const isBoss = type === 'boss';
  return {
    id: uid(),
    type: type as import('../types').CookieType,
    pos: { x, y: -40 },
    vel: { x: (Math.random() - 0.5) * 60, y: speed },
    radius: isBoss ? 55 : type === 'golden' ? 34 : 28,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 3,
    state: 'falling',
    hp: isBoss ? 8 : 1,
    maxHp: isBoss ? 8 : 1,
    phase: 0,
    spawnTime: performance.now() / 1000,
    scale: 1,
    glowIntensity: type === 'golden' || type === 'boss' ? 1 : 0,
  };
}

// ─── Game Loop Hook ───────────────────────────────────────────────────────────

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

  // ── ESC to pause / resume ──
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

  // ── Main Loop ──
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

    // ── Decay systems ──
    s.tickCombo(dt);
    s.tickCritical(rawDt);
    s.decayShake();

    // Restore time scale
    if (s.game.timeScale < 1 && !s.game.criticalActive) {
      s.setTimeScale(Math.min(1, s.game.timeScale + rawDt * chronoRecoveryRef.current));
    }
    if (s.game.timeScale >= 1) chronoRecoveryRef.current = 1.5;

    // ── Flash decay ──
    flashAlphaRef.current = Math.max(0, flashAlphaRef.current - rawDt * 4);

    // ── Slash detection ──
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

          // fortune_magnet: +8px to golden cookie effective radius
          const hitRadius = cookie.type === 'golden'
            ? cookie.radius + upg('fortune_magnet') * 8
            : cookie.radius;

          if (checkSlashHit(cookie.pos, hitRadius, p0, p1)) {
            hitCookiesRef.current.add(cookie.id);

            if (cookie.type === 'bomb') {
              // BOMB — blast_rune negates the first hit per wave
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
              // FAKE
              s.updateCookie(cookie.id, { state: 'sliced' });
              s.addReiki(-10);
              s.breakCombo(true);
              s.triggerShake(3);
              makeCrumbs(cookie.pos, 'fake', 8).forEach(s.addParticle);
            } else if (cookie.type === 'boss') {
              // BOSS multi-hit
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

              // crumb_accelerator: higher crit chance on fast slashes
              const critFast = 0.25 + upg('crumb_accelerator') * 0.10;
              const critSlow = 0.08 + upg('crumb_accelerator') * 0.08;
              const isCritical = Math.random() < (velocity > 200 ? critFast : critSlow);
              const isGolden = cookie.type === 'golden';

              const baseScore = isGolden ? 150 : 50;
              // ghost_multiplier: 15% chance to double score
              const ghostDouble = Math.random() < upg('ghost_multiplier') * 0.15 ? 2 : 1;
              const scoreBonus = (isCritical ? baseScore * 2 : baseScore) * ghostDouble;

              s.addScore(scoreBonus);
              s.addReiki(isGolden ? 30 : 10);
              s.incrementCombo();

              // spirit_overflow: +10 reiki per level every 10 slices
              sliceCountRef.current++;
              const overflowLevel = upg('spirit_overflow');
              if (overflowLevel > 0 && sliceCountRef.current % 10 === 0) {
                s.addReiki(10 * overflowLevel);
              }

              // Particles
              makeCrumbs(cookie.pos, cookie.type, isGolden ? 18 : 12).forEach(s.addParticle);
              makeGoo(cookie.pos, cookie.type, 6).forEach(s.addParticle);
              makeSlashParticles(cookie.pos, angle, 8).forEach(s.addParticle);
              makeImpactSparks(cookie.pos, 6).forEach(s.addParticle);

              if (isCritical) {
                // chrono_slice: slow-mo recovery is 60% slower per level
                const chronoRecovery = 1.5 / (1 + upg('chrono_slice') * 0.6);
                s.triggerCritical();
                s.setTimeScale(0.25);
                // store the recovery rate override via a ref — handled below in restore block
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

              // Halves
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
          }
        });
      }
    }

    // ── Move cookies ──
    const toRemove: string[] = [];
    const canvas = canvasRef.current;
    const h = canvas?.height ?? 600;

    s.cookies.forEach((cookie) => {
      if (cookie.state !== 'falling') {
        toRemove.push(cookie.id);
        return;
      }
      const newPos = {
        x: cookie.pos.x + cookie.vel.x * dt,
        y: cookie.pos.y + cookie.vel.y * dt,
      };
      const newRot = cookie.rotation + cookie.rotationSpeed * dt;
      const newVelX = cookie.vel.x * 0.995;

      if (newPos.y > h + 60) {
        toRemove.push(cookie.id);
        // Missed cookie
        if (cookie.type !== 'bomb' && cookie.type !== 'fake') {
          s.breakCombo(true);
          s.takeDamage(0); // no HP damage on miss for now, just combo break
        }
      } else {
        s.updateCookie(cookie.id, {
          pos: newPos,
          rotation: newRot,
          vel: { x: newVelX, y: cookie.vel.y },
        });
      }
    });
    toRemove.forEach(s.removeCookie);

    // ── Move halves ──
    const halvesToRemove: string[] = [];
    s.halves.forEach((half) => {
      const newPos = { x: half.pos.x + half.vel.x * dt, y: half.pos.y + half.vel.y * dt };
      const newVelY = half.vel.y + 400 * dt;
      const newAlpha = half.alpha - dt * 0.9;
      if (newAlpha <= 0 || newPos.y > h + 100) {
        halvesToRemove.push(half.id);
        return;
      }
      const newRot = half.rotation + half.rotationSpeed * dt;
      // Direct mutation for performance (halves are transient)
      half.pos = newPos;
      half.vel = { x: half.vel.x, y: newVelY };
      half.alpha = newAlpha;
      half.rotation = newRot;
    });
    halvesToRemove.forEach(s.removeHalf);

    // ── Tick particles ──
    const particlesToRemove: string[] = [];
    const canvasW = canvas?.width ?? 800;
    s.particles.forEach((p) => {
      p.life -= dt / p.maxLife;
      if (p.life <= 0) {
        particlesToRemove.push(p.id);
        recycleParticle(p);
        return;
      }
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;
      p.vel.y += p.gravity * dt;
      p.rotation += p.rotationSpeed * dt;
      // Sakura drift
      if (p.type === 'sakura') {
        p.vel.x += Math.sin(timeRef.current * 1.5 + p.pos.x * 0.01) * 15 * dt;
        p.vel.x *= 0.99;
      }
      if (p.shrink > 0) {
        p.size = Math.max(0.5, p.size - p.shrink * dt);
      }
    });
    particlesToRemove.forEach(s.removeParticle);

    // ── Spawn sakura ──
    sakuraTimerRef.current += rawDt;
    if (sakuraTimerRef.current > 0.3) {
      sakuraTimerRef.current = 0;
      s.addParticle(makeSakuraPetal(canvasW));
    }

    // ── Spawn director ──
    const director = directorRef.current;
    const cookieType = director.tick(rawDt);
    if (cookieType) {
      const speed = director.getSpeed();
      const cookie = spawnCookie(cookieType as import('../types').CookieType, canvasW, speed);
      s.addCookie(cookie);
    }

    if (director.isWaveComplete() && s.cookies.filter((c) => c.state === 'falling').length === 0) {
      s.nextWave();
      director.reset(s.game.wave + 1);
      blastRuneUsedRef.current = false;
    }

    // ── Render ──
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

  const startGame = useCallback(() => {
    storeRef.current.resetGame();
    storeRef.current.setPhase('playing');
    directorRef.current.reset(1);
    _entityId = 0;
    flashAlphaRef.current = 0;
    timeRef.current = 0;
    lastFrameRef.current = performance.now();
    sliceCountRef.current = 0;
    blastRuneUsedRef.current = false;
    chronoRecoveryRef.current = 1.5;
  }, []);

  return { startGame };
}
