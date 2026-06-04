import { BG } from './constants/colors';

/** [x, y, width, height] as ratios of canvas dimensions */
const BUILDINGS: readonly [number, number, number, number][] = [
  [0, 0.78, 0.06, 0.3],
  [0.05, 0.72, 0.04, 0.28],
  [0.1, 0.65, 0.08, 0.35],
  [0.18, 0.73, 0.05, 0.27],
  [0.24, 0.68, 0.06, 0.32],
  [0.3, 0.75, 0.04, 0.25],
  [0.35, 0.62, 0.07, 0.38],
  [0.43, 0.7, 0.05, 0.3],
  [0.5, 0.6, 0.09, 0.4],
  [0.6, 0.72, 0.06, 0.28],
  [0.67, 0.65, 0.05, 0.35],
  [0.73, 0.7, 0.08, 0.3],
  [0.82, 0.63, 0.06, 0.37],
  [0.89, 0.72, 0.05, 0.28],
  [0.95, 0.68, 0.05, 0.32],
];

const GRID_SIZE = 60;
const HORIZON_Y = 0.78;
const GRID_TOP_Y = 0.55;
const WINDOW_ROWS = 5;
const WINDOW_COLS = 2;

export type BackgroundContext = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export type SeasonalBgOverride = {
  skyTop: string;
  skyMid: string;
  skyBot: string;
  gridStroke: string;
};

export type BackgroundContextWithTime = BackgroundContext & {
  time: number;
  /** Optional seasonal background colour overrides */
  seasonalBg?: SeasonalBgOverride;
};

/**
 * Draw sky
 * @param ctx Canvas context
 * @param width Width
 * @param height Height
 * @param override Optional seasonal colour overrides
 */
function drawSky({ ctx, width, height }: BackgroundContext, override?: SeasonalBgOverride): void {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, override?.skyTop ?? BG.skyTop);
  sky.addColorStop(0.5, override?.skyMid ?? BG.skyMid);
  sky.addColorStop(1, override?.skyBot ?? BG.skyBot);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draw grid floor
 * @param ctx Canvas context
 * @param width Width
 * @param height Height
 * @param override Optional seasonal colour overrides
 */
function drawGridFloor({ ctx, width, height }: BackgroundContext, override?: SeasonalBgOverride): void {
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = override?.gridStroke ?? BG.gridStroke;
  ctx.lineWidth = 1;

  for (let x = 0; x < width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, height * GRID_TOP_Y);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = height * GRID_TOP_Y; y < height; y += GRID_SIZE * 0.5) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw city silhouette
 * @param ctx Canvas context
 * @param width Width
 * @param height Height
 */
function drawCitySilhouette({ ctx, width, height }: BackgroundContext): void {
  ctx.save();

  // Buildings
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = BG.buildingFill;
  for (const [bx, by, bw, bh] of BUILDINGS) {
    ctx.fillRect(bx * width, by * height, bw * width, bh * height);
  }

  // Windows
  ctx.fillStyle = BG.windowFill;
  ctx.globalAlpha = 0.3;
  for (const [bx, by, bw] of BUILDINGS) {
    for (let wy = 0; wy < WINDOW_ROWS; wy++) {
      for (let wx = 0; wx < WINDOW_COLS; wx++) {
        if (Math.random() < 0.6) {
          ctx.fillRect(
            bx * width + bw * width * 0.2 + wx * bw * width * 0.45,
            by * height + wy * 14,
            bw * width * 0.25,
            6,
          );
        }
      }
    }
  }

  ctx.restore();
}

/**
 * Draw neon horizon
 * @param ctx Canvas context
 * @param w Width
 * @param h Height
 * @param time Time
 */
function drawNeonHorizon(
  { ctx, width, height, time }:
    BackgroundContext & { time: number }
): void {
  ctx.save();
  const horizon = ctx.createLinearGradient(0, 0, width, 0);
  horizon.addColorStop(0, 'transparent');
  horizon.addColorStop(0.3, BG.horizonPink);
  horizon.addColorStop(0.5, BG.horizonPurple);
  horizon.addColorStop(0.7, BG.horizonCyan);
  horizon.addColorStop(1, 'transparent');

  ctx.strokeStyle = horizon;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.7 + Math.sin(time * 2) * 0.15;
  ctx.shadowBlur = 15;
  ctx.shadowColor = BG.horizonPink;
  ctx.beginPath();
  ctx.moveTo(0, height * HORIZON_Y);
  ctx.lineTo(width, height * HORIZON_Y);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw background
 * @param ctx Canvas context
 * @param context Background context (may include seasonal overrides)
 */
export function drawBackground(context: BackgroundContextWithTime): void {
  const { seasonalBg } = context;
  drawSky(context, seasonalBg);
  drawGridFloor(context, seasonalBg);
  drawCitySilhouette(context);
  drawNeonHorizon(context);
}
