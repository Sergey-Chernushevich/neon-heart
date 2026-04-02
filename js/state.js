import {
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_SPEED,
} from "./constants.js";

export const state = {
  gameState:    "start",
  lives:        3,
  currentLevel: 0,
  score:        0,

  bricks:    [],
  balls:     [],
  powerUps:  [],
  particles: [],

  effects: {
    expand: 0,
    slow:   0,
  },
};

export const paddle = {
  width:  PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  x:      0,
  y:      0,
  speed:  PADDLE_SPEED,
};
