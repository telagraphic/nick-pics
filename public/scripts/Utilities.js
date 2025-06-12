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

export function debounce(callback, wait = 100) {
  let timeoutId = null;

  return (...args) => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}