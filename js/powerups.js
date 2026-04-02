import { state, paddle } from "./state.js";
import { sounds } from "./sound.js";
import {
  POWERUP_SPAWN_CHANCE,
  POWERUP_SIZE,
  POWERUP_SPEED,
  EXPAND_FACTOR,
  EXPAND_DURATION,
  PADDLE_MAX_WIDTH,
  SLOW_FACTOR,
  SLOW_DURATION,
  BALL_MAX_COUNT,
} from "./constants.js";

const POWERUP_TYPES = ["expand", "slow", "multiball"];

export function spawnPowerUp(x, y) {
  if (Math.random() > POWERUP_SPAWN_CHANCE) return;

  const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
  state.powerUps.push({ x, y, type, size: POWERUP_SIZE, speed: POWERUP_SPEED });
}

export function applyPowerUp(type) {
  sounds.power.currentTime = 0;
  sounds.power.play();

  if (type === "expand") {
    if (paddle.width < PADDLE_MAX_WIDTH) {
      paddle.width = Math.min(paddle.width * EXPAND_FACTOR, PADDLE_MAX_WIDTH);
      state.effects.expand = EXPAND_DURATION;
    }
    return;
  }

  if (type === "slow") {
    state.balls.forEach((b) => {
      b.vx *= SLOW_FACTOR;
      b.vy *= SLOW_FACTOR;
    });
    state.effects.slow = SLOW_DURATION;
    return;
  }

  if (type === "multiball") {
    const slots = BALL_MAX_COUNT - state.balls.length;
    if (slots <= 0) return;

    const spawned = [];
    state.balls.forEach((b) => {
      spawned.push({ ...b, vx: -b.vx });
      spawned.push({ ...b, vy: -b.vy });
    });
    state.balls.push(...spawned.slice(0, slots));
  }
}
