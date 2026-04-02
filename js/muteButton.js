import { ctx, canvas } from "./config.js";
import { bgMusic } from "./sound.js";

export let muted = false;

const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

export function toggleMute() {
  muted        = !muted;
  bgMusic.muted = muted;
}

export function getMuteBtn() {
  const base = Math.min(canvas.width, canvas.height) * 0.019;
  const r    = isTouchDevice ? base * 2 : base;
  return { x: canvas.width - r - 14, y: r + 14, r };
}

export function isMuteClick(cx, cy) {
  const { x, y, r } = getMuteBtn();
  return (cx - x) ** 2 + (cy - y) ** 2 <= r * r;
}

export function drawMuteButton() {
  const { x, y, r } = getMuteBtn();
  const s = r * 0.48;

  ctx.save();
  ctx.globalAlpha = 0.5;

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle   = "rgba(120,120,120,0.6)";
  ctx.fill();
  ctx.strokeStyle = muted ? "#ff8888" : "#cccccc";
  ctx.lineWidth   = 1;
  ctx.stroke();

  ctx.translate(x, y);
  ctx.fillStyle   = muted ? "#ff8888" : "#cccccc";
  ctx.strokeStyle = muted ? "#ff8888" : "#cccccc";
  ctx.lineCap     = "round";

  ctx.beginPath();
  ctx.moveTo(-s * 0.9, -s * 0.45);
  ctx.lineTo(-s * 0.3, -s * 0.45);
  ctx.lineTo( s * 0.1, -s * 0.85);
  ctx.lineTo( s * 0.1,  s * 0.85);
  ctx.lineTo(-s * 0.3,  s * 0.45);
  ctx.lineTo(-s * 0.9,  s * 0.45);
  ctx.closePath();
  ctx.fill();

  if (!muted) {
    ctx.lineWidth = s * 0.22;
    ctx.beginPath();
    ctx.arc(s * 0.1, 0, s * 0.55, -Math.PI * 0.42, Math.PI * 0.42);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.1, 0, s * 0.95, -Math.PI * 0.38, Math.PI * 0.38);
    ctx.stroke();
  } else {
    ctx.lineWidth   = s * 0.28;
    ctx.strokeStyle = "#ff6666";
    ctx.beginPath();
    ctx.moveTo(s * 0.35, -s * 0.75);
    ctx.lineTo(s * 1.0,   s * 0.75);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s * 1.0,  -s * 0.75);
    ctx.lineTo(s * 0.35,  s * 0.75);
    ctx.stroke();
  }

  ctx.restore();
}
