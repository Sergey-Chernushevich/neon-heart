export const sounds = {
  hit:   new Audio("../assets/sounds/hit.mp3"),
  brick: new Audio("../assets/sounds/brick.mp3"),
  power: new Audio("../assets/sounds/power.mp3"),
  win:   new Audio("../assets/sounds/sound_win.wav"),
  lose:  new Audio("../assets/sounds/sound_lose.wav"),
};

export const bgMusic    = new Audio("../assets/sounds/music_bg.mp3");
bgMusic.loop   = true;
bgMusic.volume = 0.35;

export function startMusic() {
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {});
}

export function stopMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}
