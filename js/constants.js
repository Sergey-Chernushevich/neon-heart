// ── Ball ──────────────────────────────────────────────────────────────────────
export const BALL_RADIUS       = 8;
export const BALL_INITIAL_VY   = -20;
export const BALL_INITIAL_VX   = 2;   // fallback when random produces 0
export const BALL_VX_RANGE     = 4;   // random(-range/2, range/2)
export const BALL_MAX_COUNT    = 100;
export const BALL_TRAIL_LENGTH = 10;

// ── Paddle ────────────────────────────────────────────────────────────────────
export const PADDLE_WIDTH     = 120;
export const PADDLE_HEIGHT    = 15;
export const PADDLE_SPEED     = 0.2;
export const PADDLE_MAX_WIDTH = 400;

// ── Physics ───────────────────────────────────────────────────────────────────
export const SUBSTEPS = 4;

// ── Power-ups ─────────────────────────────────────────────────────────────────
export const POWERUP_SPAWN_CHANCE = 0.3;
export const POWERUP_SIZE         = 30;
export const POWERUP_SPEED        = 10;
export const EXPAND_FACTOR        = 1.25;
export const EXPAND_DURATION      = 600;
export const SLOW_FACTOR          = 0.9;
export const SLOW_DURATION        = 480;

// ── Background ────────────────────────────────────────────────────────────────
export const STAR_COUNT         = 120;
export const GRID_SCROLL_SPEED  = 0.4;
export const GRID_SCROLL_PERIOD = 80;
