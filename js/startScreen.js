function drawScreenImage(img, overlayAlpha = 0.25) {
  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // лёгкое затемнение поверх чтобы текст читался
  ctx.fillStyle = `rgba(0,0,0,${overlayAlpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
export const drawStartScreen = function () {
  drawScreenImage(imgStart, 0.25);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  const alpha = pulseAlpha(1.6, 0.5);

  drawCenteredImage(imgTitleStart, cx, cy - canvas.height * 0.1, 0.5, alpha);

  ctx.save();
  ctx.textAlign = "center";
  ctx.globalAlpha = alpha;

  ctx.fillStyle = "#00fff0";
  ctx.shadowColor = "#00fff0";
  ctx.shadowBlur = 20;

  ctx.font = `${Math.round(canvas.width * 0.02)}px Arial`;
  ctx.fillText("НАЖМИ ЧТОБЫ ИГРАТЬ", cx, cy + canvas.height * 0.38);

  ctx.restore();
};
