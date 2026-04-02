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

export function startMusic() {
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {});
}

export function stopMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}
