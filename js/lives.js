import { ctx, canvas } from "./config.js";
import { state } from "./state.js";

// ❤️ рисование одного сердечка
function drawHeart(x, y, size) {
  const topCurveHeight = size * 0.3;

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(x, y + topCurveHeight);

  // левая часть
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);

  ctx.bezierCurveTo(
    x - size / 2,
    y + (size + topCurveHeight) / 2,
    x,
    y + (size + topCurveHeight) / 2,
    x,
    y + size,
  );

  // правая часть
  ctx.bezierCurveTo(
    x,
    y + (size + topCurveHeight) / 2,
    x + size / 2,
    y + (size + topCurveHeight) / 2,
    x + size / 2,
    y + topCurveHeight,
  );

  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);

  ctx.closePath();

  // 💖 градиент
  const grad = ctx.createLinearGradient(x, y, x, y + size);
  grad.addColorStop(0, "#ff00ff");
  grad.addColorStop(1, "#660066");

  ctx.shadowColor = "#ff4d6d";
  ctx.shadowBlur = 12;

  ctx.fillStyle = grad;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.restore();
}

// ❤️ основной рендер жизней
export function drawLives() {
  const lives = state.lives;

  const size = 54; // увеличено в 3 раза
  const spacing = 12;

  const totalWidth = lives * size + (lives - 1) * spacing;

  // 🎯 центр по горизонтали
  const startX = (canvas.width - totalWidth) / 2;

  // 📍 снизу экрана
  const y = canvas.height - size - 50;

  for (let i = 0; i < lives; i++) {
    drawHeart(startX + i * (size + spacing), y, size);
  }
}
