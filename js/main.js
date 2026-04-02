import { state } from "./state.js";
import { createLevel, levels } from "./levels.js";
import { resetBall, update } from "./physics.js";
import { draw } from "./render.js";
import { initInput, pointerX } from "./input.js";
import { sounds, startMusic, stopMusic } from "./sound.js";
import { drawMuteButton, isMuteClick, toggleMute } from "./muteButton.js";

function loseLife() {
  state.lives--;

  if (state.lives <= 0) {
    stopMusic();
    sounds.lose.currentTime = 0;
    sounds.lose.play();
    state.gameState = "gameover";
  } else {
    resetBall();
  }
}

function handleClick(cx, cy) {
  if (isMuteClick(cx, cy)) {
    toggleMute();
    return;
  }

  switch (state.gameState) {
    case "start":
      state.currentLevel = 0;
      state.score        = 0;
      state.lives        = 3;
      createLevel(state.currentLevel);
      resetBall();
      startMusic();
      state.gameState = "play";
      break;

    case "levelComplete":
      state.currentLevel++;
      if (state.currentLevel >= levels.length) {
        stopMusic();
        sounds.win.currentTime = 0;
        sounds.win.play();
        state.gameState = "final";
      } else {
        createLevel(state.currentLevel);
        resetBall();
        startMusic();
        state.gameState = "play";
      }
      break;

    case "gameover":
      state.gameState = "start";
      break;

    case "final":
      alert("Redirect to store");
      break;
  }
}

initInput(handleClick);

let prevGameState = state.gameState;

function loop() {
  if (state.gameState === "play") update(pointerX, loseLife);

  if (state.gameState === "levelComplete" && prevGameState === "play") {
    stopMusic();
    sounds.win.currentTime = 0;
    sounds.win.play();
  }

  prevGameState = state.gameState;

  draw();
  drawMuteButton();
  requestAnimationFrame(loop);
}

loop();
