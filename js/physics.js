import { state, paddle } from "./state.js";
import { canvas } from "./config.js";
import { sounds } from "./sound.js";
import { createParticles } from "./particles.js";
import { spawnPowerUp, applyPowerUp } from "./powerups.js";
import {
  SUBSTEPS,
  BALL_RADIUS,
  BALL_INITIAL_VY,
  BALL_INITIAL_VX,
  BALL_VX_RANGE,
  BALL_TRAIL_LENGTH,
  EXPAND_FACTOR,
} from "./constants.js";

export function resetBall() {
  if (paddle.y === 0) {
    paddle.y = canvas.height - canvas.height * 0.1;
    paddle.x = canvas.width / 2 - paddle.width / 2;
  }

  state.balls = [
    {
      x:      paddle.x + paddle.width / 2,
      y:      paddle.y - 10,
      vx:     Math.random() * BALL_VX_RANGE - BALL_VX_RANGE / 2 || BALL_INITIAL_VX,
      vy:     BALL_INITIAL_VY,
      radius: BALL_RADIUS,
      trail:  [],
    },
  ];
}

function updatePaddle(pointerX) {
  paddle.y  = canvas.height - canvas.height * 0.2;
  paddle.x += (pointerX - paddle.x - paddle.width / 2) * paddle.speed;
  paddle.x  = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
}

function collideBallWithWalls(ball) {
  if (ball.x < ball.radius) {
    ball.x  = ball.radius;
    ball.vx = Math.abs(ball.vx);
  }
  if (ball.x > canvas.width - ball.radius) {
    ball.x  = canvas.width - ball.radius;
    ball.vx = -Math.abs(ball.vx);
  }
  if (ball.y < ball.radius) {
    ball.y  = ball.radius;
    ball.vy = Math.abs(ball.vy);
  }
}

function collideBallWithPaddle(ball, dy) {
  if (
    ball.vy > 0 &&
    ball.y + ball.radius >= paddle.y &&
    ball.y + ball.radius <= paddle.y + paddle.height + Math.abs(dy) &&
    ball.x >= paddle.x - ball.radius &&
    ball.x <= paddle.x + paddle.width + ball.radius
  ) {
    sounds.hit.currentTime = 0;
    sounds.hit.play();

    ball.y  = paddle.y - ball.radius;
    ball.vy = -Math.abs(ball.vy);

    // angle depends on where on the paddle the ball hits
    const hitOffset = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    ball.vx = hitOffset * 6;
    return true;
  }
  return false;
}

function collideBallWithBricks(ball) {
  for (const brick of state.bricks) {
    if (!brick.alive) continue;

    const nearX  = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width));
    const nearY  = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height));
    const distX  = ball.x - nearX;
    const distY  = ball.y - nearY;

    if (distX * distX + distY * distY > ball.radius * ball.radius) continue;

    brick.alive   = false;
    state.score  += 10;

    sounds.brick.currentTime = 0;
    sounds.brick.play();
    createParticles(ball.x, ball.y);
    spawnPowerUp(brick.x + brick.width / 2, brick.y);

    const overlapX = ball.radius - Math.abs(distX);
    const overlapY = ball.radius - Math.abs(distY);

    if (overlapX < overlapY) {
      ball.vx *= -1;
      ball.x  += distX > 0 ? overlapX : -overlapX;
    } else {
      ball.vy *= -1;
      ball.y  += distY > 0 ? overlapY : -overlapY;
    }
    return true;
  }
  return false;
}

function updateBalls(loseLife) {
  for (let i = state.balls.length - 1; i >= 0; i--) {
    const ball = state.balls[i];

    if (ball.trail) {
      ball.trail.push({ x: ball.x, y: ball.y });
      if (ball.trail.length > BALL_TRAIL_LENGTH) ball.trail.shift();
    }

    let dead = false;

    for (let step = 0; step < SUBSTEPS; step++) {
      // Split movement into substeps to prevent tunneling through thin objects
      const dx = ball.vx / SUBSTEPS;
      const dy = ball.vy / SUBSTEPS;

      ball.x += dx;
      ball.y += dy;

      collideBallWithWalls(ball);

      if (ball.y - ball.radius > canvas.height) {
        state.balls.splice(i, 1);
        dead = true;
        break;
      }

      if (collideBallWithPaddle(ball, dy)) break;
      collideBallWithBricks(ball);
    }

    if (dead) continue;
  }

  if (state.balls.length === 0) loseLife();
}

function updatePowerUps() {
  for (let i = state.powerUps.length - 1; i >= 0; i--) {
    const p    = state.powerUps[i];
    p.y       += p.speed;
    const puCx = p.x + p.size / 2;
    const puCy = p.y + p.size / 2;

    const caught =
      puCy + p.size / 2 >= paddle.y &&
      puCy - p.size / 2 <= paddle.y + paddle.height &&
      puCx >= paddle.x &&
      puCx <= paddle.x + paddle.width;

    if (caught) {
      applyPowerUp(p.type);
      state.powerUps.splice(i, 1);
      continue;
    }

    if (p.y > canvas.height) state.powerUps.splice(i, 1);
  }
}

function updateParticles() {
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (--p.life <= 0) state.particles.splice(i, 1);
  }
}

function updateEffects() {
  if (state.effects.expand > 0) {
    if (--state.effects.expand === 0) paddle.width /= EXPAND_FACTOR;
  }
  if (state.effects.slow > 0) state.effects.slow--;
}

export function update(pointerX, loseLife) {
  updatePaddle(pointerX);
  updateBalls(loseLife);

  if (state.bricks.length > 0 && state.bricks.every((b) => !b.alive)) {
    state.gameState = "levelComplete";
  }

  updatePowerUps();
  updateParticles();
  updateEffects();
}
