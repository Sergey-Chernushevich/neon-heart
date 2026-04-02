import { ctx, canvas } from "./config.js";
import { state, paddle } from "./state.js";
import { drawBackground } from "./background.js";
import { roundRect } from "./utils.js";
import {
  drawStartScreen,
  drawLevelCompleteScreen,
  drawGameOverScreen,
  drawFinalScreen,
} from "./screens.js";
import { drawLives } from "./lives.js";

export function draw() {
  drawBackground();
  drawPaddle();
  drawBalls();
  drawBricks();
  drawPowerUps();
  drawParticles();
  drawLives();

  if (state.gameState === "start") drawStartScreen();
  if (state.gameState === "levelComplete") drawLevelCompleteScreen();
  if (state.gameState === "gameover") drawGameOverScreen();
  if (state.gameState === "final") drawFinalScreen();
}

// ── Paddle ────────────────────────────────────────────────────────────────────

function drawPaddle() {
  const now = Date.now();
  const { x, y, width: w, height: h } = paddle;

  const shift = (Math.sin(now / 600) + 1) / 2;
  const g = ctx.createLinearGradient(x, y, x + w, y);
  g.addColorStop(0, "#0033ff");
  g.addColorStop(Math.max(0, shift - 0.25), "#00eaff");
  g.addColorStop(shift, "#ffffff");
  g.addColorStop(Math.min(1, shift + 0.25), "#ff00ff");
  g.addColorStop(1, "#0033ff");

  ctx.shadowColor = "#00eaff";
  ctx.shadowBlur = 14 + 6 * Math.sin(now / 300);
  ctx.fillStyle = g;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  const blik = ctx.createLinearGradient(x, y, x, y + h * 0.55);
  blik.addColorStop(0, "rgba(255,255,255,0.55)");
  blik.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = blik;
  roundRect(ctx, x + 2, y + 2, w - 4, h * 0.5, h / 2);
  ctx.fill();

  for (let i = 0; i < 5; i++) {
    const phase = (now / 800 + i / 5) % 1;
    const sx = x + phase * w;
    const sy = y + h / 2 + Math.sin(now / 200 + i * 1.3) * (h * 0.25);
    const radius = 2 + 1.5 * Math.sin(now / 150 + i * 2.1);
    ctx.globalAlpha = 0.4 + 0.5 * Math.sin(now / 180 + i);
    ctx.beginPath();
    ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? "#00ffff" : "#ff00ff";
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ── Balls ─────────────────────────────────────────────────────────────────────

function drawBalls() {
  state.balls.forEach((ball) => {
    if (ball.trail) {
      ball.trail.forEach((pos, i) => {
        const t = i / ball.trail.length;
        ctx.globalAlpha = t * 0.45;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, ball.radius * 0.9 * t, 0, Math.PI * 2);
        ctx.fillStyle = "#00eaff";
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    const gradient = ctx.createRadialGradient(
      ball.x - ball.radius * 0.3,
      ball.y - ball.radius * 0.3,
      ball.radius * 0.1,
      ball.x,
      ball.y,
      ball.radius,
    );
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.4, "#00eaff");
    gradient.addColorStop(1, "#0033ff");

    ctx.shadowColor = "#00eaff";
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = "#00eaff";
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  });
}

// ── Bricks ────────────────────────────────────────────────────────────────────

const BRICK_COLORS = ["#ff00ff", "#00ffff", "#0fff00", "#ff0f00", "#ff8c00"];
const BRICK_DARKS = ["#660066", "#006666", "#006600", "#660000", "#663300"];

function drawBricks() {
  state.bricks.forEach((b, index) => {
    if (!b.alive) return;

    const i = b.type ? b.type - 1 : index % BRICK_COLORS.length;
    const color = BRICK_COLORS[i];
    const dark = BRICK_DARKS[i];

    const gradient = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, dark);

    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = gradient;
    ctx.fillRect(b.x, b.y, b.width, b.height);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillRect(b.x + 2, b.y + 2, b.width - 4, 3);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.width - 1, b.height - 1);
  });
}

// ── Power-ups ─────────────────────────────────────────────────────────────────

const POWERUP_META = {
  expand: { colorInner: "#00ff99", colorOuter: "#005533", label: "BIG" },
  slow: { colorInner: "#ffee00", colorOuter: "#665500", label: "SLW" },
  multiball: { colorInner: "#ff4444", colorOuter: "#660000", label: "x3" },
};

function drawPowerUps() {
  const now = Date.now();

  state.powerUps.forEach((p) => {
    const cx = p.x + p.size / 2;
    const cy = p.y + p.size / 2;
    const r = p.size / 2;
    const { colorInner, colorOuter, label } =
      POWERUP_META[p.type] ?? POWERUP_META.multiball;

    const pulse = 0.85 + 0.15 * Math.sin(now / 280 + p.x);
    ctx.save();

    ctx.globalAlpha = 0.2 * pulse;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.0, 0, Math.PI * 2);
    ctx.fillStyle = colorInner;
    ctx.fill();

    ctx.globalAlpha = 0.35 * pulse;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.45, 0, Math.PI * 2);
    ctx.fillStyle = colorInner;
    ctx.fill();

    ctx.globalAlpha = 1;
    const grad = ctx.createRadialGradient(
      cx - r * 0.3,
      cy - r * 0.3,
      r * 0.05,
      cx,
      cy,
      r,
    );
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.35, colorInner);
    grad.addColorStop(1, colorOuter);

    ctx.shadowColor = colorInner;
    ctx.shadowBlur = 20 * pulse;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = colorInner;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.globalAlpha = 0.4;
    const blik = ctx.createLinearGradient(
      cx - r * 0.5,
      cy - r,
      cx - r * 0.5,
      cy,
    );
    blik.addColorStop(0, "rgba(255,255,255,0.9)");
    blik.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.ellipse(cx, cy - r * 0.25, r * 0.5, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = blik;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 4;
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.round(r * 0.95)}px Arial`;
    ctx.fillText(label, cx, cy + 1);
    ctx.shadowBlur = 0;
    ctx.restore();
  });
}

// ── Particles ─────────────────────────────────────────────────────────────────

function drawParticles() {
  ctx.fillStyle = "#ffffff";
  state.particles.forEach((p) => ctx.fillRect(p.x, p.y, 2, 2));
}
