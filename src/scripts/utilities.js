/**
 * Helper methods
 * 
 */

/**
 * Check if the viewport is mobile
 * @returns {boolean}
 */

export function isMobileViewport() {
  return window.innerWidth < 768 || "ontouchstart" in window;
}