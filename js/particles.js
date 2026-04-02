import { state } from "./state.js";

const PARTICLE_COUNT    = 10;
const PARTICLE_LIFETIME = 30;
const PARTICLE_SPEED    = 4;

export function createParticles(x, y) {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    state.particles.push({
      x,
      y,
      vx:   (Math.random() - 0.5) * PARTICLE_SPEED,
      vy:   (Math.random() - 0.5) * PARTICLE_SPEED,
      life: PARTICLE_LIFETIME,
    });
  }
}
