const base = new URL("../assets/sounds/", import.meta.url).href;

export const sounds = {
  hit: new Audio(`${base}hit.mp3`),
  brick: new Audio(`${base}brick.mp3`),
  power: new Audio(`${base}power.mp3`),
  win: new Audio(`${base}sound_win.wav`),
  lose: new Audio(`${base}sound_lose.wav`),
};

export const bgMusic = new Audio(`${base}music_bg.mp3`);
bgMusic.loop = true;
bgMusic.volume = 0.35;

let unlocked = false;
let shouldStartMusic = false;

function unlockAudio() {
  if (unlocked) return;
  unlocked = true;

  // трюк с AudioContext
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
    src.onended = () => ctx.close();
  } catch (_) {}

  if (shouldStartMusic) {
    setTimeout(() => {
      bgMusic.play().catch(() => {});
    }, 150); // можно 100–300
  }
}

document.addEventListener("touchstart", unlockAudio, {
  once: true,
  capture: true,
});

document.addEventListener("mousedown", unlockAudio, {
  once: true,
  capture: true,
});

export function startMusic() {
  shouldStartMusic = true;

  // если уже разблокировано — запускаем сразу (с задержкой)
  if (unlocked) {
    setTimeout(() => {
      bgMusic.play().catch(() => {});
    }, 150);
  }
}

export function stopMusic() {
  shouldStartMusic = false;
  bgMusic.pause();
  bgMusic.currentTime = 0;
}
