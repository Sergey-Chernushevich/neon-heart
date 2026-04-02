import { ctx, canvas } from "./config.js";
import {
  STAR_COUNT,
  GRID_SCROLL_SPEED,
  GRID_SCROLL_PERIOD,
} from "./constants.js";

let gridOffset = 0;

const stars = Array.from({ length: STAR_COUNT }, () => ({
  x:       Math.random(),
  y:       Math.random() * 0.6,
  r:       Math.random() * 1.4 + 0.3,
  twinkle: Math.random() * Math.PI * 2,
  speed:   Math.random() * 0.02 + 0.008,
}));

function drawStars(W, H, now) {
  stars.forEach((s) => {
    ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(now * s.speed + s.twinkle));
    ctx.fillStyle   = "#ffffff";
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawHorizonGlow(W, H, horizonY, glowPulse, now) {
  const glow = ctx.createLinearGradient(0, horizonY - H * 0.18, 0, horizonY + H * 0.18);
  glow.addColorStop(0,   "rgba(180,0,255,0)");
  glow.addColorStop(0.5, `rgba(180,0,255,${0.18 * glowPulse})`);
  glow.addColorStop(1,   "rgba(180,0,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, horizonY - H * 0.18, W, H * 0.36);

  const linePulse = 0.7 + 0.3 * Math.sin(now / 600);
  ctx.save();
  ctx.shadowColor = "#ff00ff";
  ctx.shadowBlur  = 30 * linePulse;
  ctx.strokeStyle = `rgba(255,0,255,${0.55 * linePulse})`;
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(W, horizonY);
  ctx.stroke();
  ctx.restore();
}

function drawTopGrid(W, horizonY, vp) {
  ctx.save();
  ctx.strokeStyle = "rgba(180,0,255,0.18)";
  ctx.lineWidth   = 0.8;

  const COLS = 16;
  const ROWS = 10;

  for (let i = 0; i <= COLS; i++) {
    ctx.beginPath();
    ctx.moveTo((i / COLS) * W, 0);
    ctx.lineTo(vp.x, vp.y);
    ctx.stroke();
  }

  for (let i = 0; i <= ROWS; i++) {
    const t  = i / ROWS;
    const ty = t * horizonY;
    const pw = W * (1 - t * 0.72);
    const px = (W - pw) / 2;
    ctx.beginPath();
    ctx.moveTo(px, ty);
    ctx.lineTo(px + pw, ty);
    ctx.stroke();
  }

  ctx.restore();
}

function drawBottomGrid(W, H, horizonY, vp, now) {
  ctx.save();

  const COLS = 14;
  const ROWS = 12;

  const alpha = 0.55 + 0.15 * Math.sin(now / 700);
  ctx.strokeStyle = `rgba(220,0,255,${alpha * 0.4})`;
  ctx.lineWidth   = 0.9;

  for (let i = 0; i <= COLS; i++) {
    ctx.beginPath();
    ctx.moveTo(vp.x, vp.y);
    ctx.lineTo((i / COLS) * W, H);
    ctx.stroke();
  }

  for (let i = 0; i <= ROWS; i++) {
    const rawT = (i / ROWS + gridOffset / (GRID_SCROLL_PERIOD * ROWS)) % 1;
    const t    = rawT * rawT; // quadratic easing — distant lines appear denser
    const y    = horizonY + t * (H - horizonY);
    const pw   = W * (y - horizonY) / (H - horizonY);
    const px   = (W - pw) / 2;

    ctx.strokeStyle = `rgba(220,0,255,${0.08 + 0.55 * t})`;
    ctx.lineWidth   = 0.6 + t * 1.2;
    ctx.beginPath();
    ctx.moveTo(px, y);
    ctx.lineTo(px + pw, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawSideGlow(W, H, glowPulse) {
  const makeGrad = (x0, x1) => {
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, `rgba(120,0,200,${0.22 * glowPulse})`);
    g.addColorStop(1, "rgba(120,0,200,0)");
    return g;
  };

  ctx.fillStyle = makeGrad(0, W * 0.18);
  ctx.fillRect(0, 0, W * 0.18, H);

  ctx.fillStyle = makeGrad(W, W * 0.82);
  ctx.fillRect(W * 0.82, 0, W * 0.18, H);
}

export function drawBackground() {
  const W   = canvas.width;
  const H   = canvas.height;
  const now = Date.now();

  gridOffset = (gridOffset + GRID_SCROLL_SPEED) % GRID_SCROLL_PERIOD;

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0,    "#06001a");
  bg.addColorStop(0.45, "#0d0035");
  bg.addColorStop(0.75, "#1a0050");
  bg.addColorStop(1,    "#0d0035");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  drawStars(W, H, now);

  const horizonY  = H * 0.52;
  const glowPulse = 0.6 + 0.4 * Math.sin(now / 900);
  const vp        = { x: W / 2, y: horizonY };

  drawHorizonGlow(W, H, horizonY, glowPulse, now);
  drawTopGrid(W, horizonY, vp);
  drawBottomGrid(W, H, horizonY, vp, now);
  drawSideGlow(W, H, glowPulse);
}
