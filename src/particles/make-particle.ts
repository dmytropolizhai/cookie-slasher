import type { ParticleType, Vec2, Particle } from "@/types";

const pool: Particle[] = [];

let _particleId = 0;
/**
 * Generates a unique particle ID by incrementing last particle id
 */
const uid = (): string => `p${++_particleId}`;
export function rand(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

/**
 * Reusable particle objects
 */
function acquire(): Particle {
    return (
        pool.pop() ?? {
            id: uid(),
            type: 'crumb',
            pos: { x: 0, y: 0 },
            vel: { x: 0, y: 0 },
            size: 4,
            alpha: 1,
            color: '#fff',
            life: 1,
            maxLife: 1,
            rotation: 0,
            rotationSpeed: 0,
            gravity: 0,
            shrink: 0,
        }
    );
}

export function makeParticle(
    type: ParticleType,
    pos: Vec2,
    vel: Vec2,
    size: number,
    color: string,
    maxLife: number,
    extras?: Partial<Particle>
): Particle {
    const p = acquire();
    p.id = uid();
    p.type = type;
    p.pos = { ...pos };
    p.vel = { ...vel };
    p.size = size;
    p.alpha = 1;
    p.color = color;
    p.life = 1;
    p.maxLife = maxLife;
    p.rotation = rand(0, Math.PI * 2);
    p.rotationSpeed = rand(-4, 4);
    p.gravity = 180;
    p.shrink = 0;
    Object.assign(p, extras);
    return p;
}