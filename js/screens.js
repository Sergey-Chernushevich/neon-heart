import { ctx, canvas } from "./config.js";
import { drawBackground } from "./background.js";

const imgLogoStart         = new Image();
const imgLogoLevelComplete = new Image();
const imgLogoGameOver      = new Image();

imgLogoStart.src         = "../assets/images/screen_start.png";
imgLogoLevelComplete.src = "../assets/images/screen_levelcomplete.png";
imgLogoGameOver.src      = "../assets/images/screen_gameover.png";

function drawOverlay(alpha = 0.55) {
  ctx.fillStyle = `rgba(0,0,0,${alpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function pulseAlpha(speed = 1.8, amplitude = 0.45) {
  return 1 - amplitude + amplitude * Math.sin(Date.now() / (1000 / speed / Math.PI));
}

function drawLogo(img, maxW = 0.75, cy = 0.38) {
  if (!img.complete || img.naturalWidth === 0) return;
  const w = canvas.width * maxW;
  const h = img.naturalHeight * (w / img.naturalWidth);
  ctx.drawImage(img, (canvas.width - w) / 2, canvas.height * cy - h / 2, w, h);
}

function drawPulseText(text, cy = 0.68) {
  const alpha = pulseAlpha(1.5, 0.5);
  ctx.save();
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.globalAlpha  = alpha;
  ctx.shadowColor  = "#ffffff";
  ctx.shadowBlur   = 24 * alpha;
  ctx.fillStyle    = "#ffffff";
  ctx.font         = `${Math.round(canvas.width * 0.015)}px Arial`;
  ctx.fillText(text, canvas.width / 2, canvas.height * cy);
  ctx.globalAlpha = 1;
  ctx.shadowBlur  = 0;
  ctx.restore();
}

export function drawStartScreen() {
  drawBackground();
  drawOverlay(0.45);
  drawLogo(imgLogoStart, 0.72, 0.35);
  drawPulseText("НАЖМИ ЧТОБЫ ИГРАТЬ", 0.72);
}

export function drawLevelCompleteScreen() {
  drawBackground();
  drawOverlay(0.45);
  drawLogo(imgLogoLevelComplete, 0.6, 0.35);
  drawPulseText("НАЖМИ ЧТОБЫ ПРОДОЛЖИТЬ", 0.68);
}

export function drawGameOverScreen() {
  drawBackground();
  drawOverlay(0.45);
  drawLogo(imgLogoGameOver, 0.7, 0.35);
  drawPulseText("НАЖМИ ЧТОБЫ НАЧАТЬ СНОВА", 0.68);
}

export function drawFinalScreen() {
  drawBackground();
  drawOverlay(0.45);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  ctx.save();
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor  = "#ffdd00";
  ctx.shadowBlur   = 40;
  ctx.fillStyle    = "#ffdd00";
  ctx.font         = `${Math.round(canvas.width * 0.09)}px Arial`;
  ctx.fillText("ТЫ ПОБЕДИЛ!", cx, cy - canvas.height * 0.1);

  ctx.shadowColor = "#ff00ff";
  ctx.shadowBlur  = 20;
  ctx.fillStyle   = "#ff00ff";
  ctx.font        = `${Math.round(canvas.width * 0.03)}px Arial`;
  ctx.fillText("Сыграй полную версию!", cx, cy);
  ctx.restore();

  drawPulseText("▶ СКАЧАТЬ ИГРУ ◀", 0.68);
}
