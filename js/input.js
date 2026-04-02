import { canvas } from "./config.js";

export let pointerX  = 0;
let        clickHandler = null;

export function initInput(handler) {
  clickHandler = handler;

  canvas.addEventListener("mousemove", (e) => {
    pointerX = e.clientX;
  });

  canvas.addEventListener("touchmove", (e) => {
    pointerX = e.touches[0].clientX;
  }, { passive: true });

  canvas.addEventListener("click", (e) => {
    // Ignore synthetic click events fired after touchstart
    const isSynthetic = e.sourceCapabilities?.firesTouchEvents;
    if (!isSynthetic) clickHandler?.(e.clientX, e.clientY);
  });

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    pointerX = e.touches[0].clientX;
    clickHandler?.(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });
}
