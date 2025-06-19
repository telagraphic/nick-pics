/**
 * Handles page transitions and menu animations
 * @class PageTransition
 */
class PageTransition {
  /**
   * Creates an instance of PageTransition
   * Initializes menu element and sets up event listeners
   */
  constructor() {
    this.menu = document.querySelector(".menu");
    this.menuLinks = document.querySelectorAll(".menu__link");
    this.links = document.querySelectorAll("a");
    this.main = document.querySelector("main");
    this.init();
  }

  /**
   * Checks if the menu element is currently visible
   * @returns {boolean} True if menu is visible (opacity not 0)
   */
  isMenuVisible() {
    if (!this.menu) return false;
    const style = window.getComputedStyle(this.menu);
    return style.opacity !== "0";
  }

  /**
   * Animates the menu fade out
   * @returns {Promise<void>} Resolves when animation completes or if menu is not visible
   */
  fadeOutMenu() {
    return new Promise((resolve) => {
      if (!this.isMenuVisible()) return resolve();
      gsap.to(this.menu, {
        delay: 0.5,
        opacity: 0,
        duration: 1,
        onComplete: resolve,
      });
    });
  }

  /**
   * Animates the menu links fade out
   * @returns {Promise<void>} Resolves when animation completes or if menu links is not visible
   */
  fadeOutLinks() {
    return new Promise((resolve) => {
      gsap.to(this.menuLinks, {
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        onComplete: resolve,
      });
    });
  }

  /**
   * Animates the main element fade out
   * @returns {Promise<void>} Resolves when animation completes or if main element is not visible
   */
  fadeOutMain() {
    return new Promise((resolve) => {
      gsap.to(this.main, {
        opacity: 0,
        duration: 0.5,
        onComplete: resolve,
      });
    });
  }

  /**
   * Animates the main element fade in
   * @returns {Promise<void>} Resolves when animation completes or if main element is not visible
   */
  fadeInMain() {
    return new Promise((resolve) => {
      gsap.to(this.main, {
        opacity: 1,
        duration: 1,
        onComplete: resolve,
      });
    });
  }

  /**
   * Sets up click event listeners for menu links
   * Handles navigation to new pages
   */
  setupLinkListeners() {
    this.links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.getAttribute("href");
        const linkClass = link.getAttribute("class");
        
        if (page && page !== window.location.pathname) {
          if (linkClass === "menu__link") {
            // Store navigation type for menu links
            sessionStorage.setItem("navigationType", "menu");
            this.fadeOutLinks().then(() => {
              window.location.href = page;
              console.log("menu navigation");
            });
          } else {
            // Store navigation type for other links
            sessionStorage.setItem("navigationType", "main");
            this.fadeOutMain().then(() => {
              window.location.href = page;
              console.log("link navigation");
            });
          }
        }
      });
    });
  }

  /**
   * Handles the page load animation sequence
   * Sets initial menu visibility and triggers fade out
   * Uses localStorage to track first visit and sessionStorage for navigation type
   */
  handlePageLoad() {
    const hasVisited = localStorage.getItem("hasVisited");
    const navigationType = sessionStorage.getItem("navigationType");
    
    // Remove any temporary flash-prevention styles
    const tempStyles = document.querySelectorAll('style');
    tempStyles.forEach(style => {
      if (style.textContent.includes('.menu { opacity: 0 !important; }')) {
        style.remove();
      }
    });
    
    // Set initial state immediately to prevent flash
    if (this.menu && this.main) {
      if (!hasVisited) {
        // First visit: hide menu, set flag
        this.menu.style.opacity = 0;
        localStorage.setItem("hasVisited", "true");
      } else {
        // Subsequent visits: handle based on navigation type
        if (navigationType === "menu") {
          // Menu navigation: show menu and fade out
          this.menu.style.opacity = 1;
          this.main.style.opacity = 1;
          this.fadeOutMenu();
        } else if (navigationType === "main") {
          // Main navigation: keep menu hidden, fade in main
          this.menu.style.opacity = 0;
          this.main.style.opacity = 0;
          // Use requestAnimationFrame to ensure DOM is ready
          requestAnimationFrame(() => {
            this.fadeInMain();
          });
        } else {
          // Direct page load (refresh, bookmark, etc.): show menu and fade out
          this.menu.style.opacity = 1;
          this.main.style.opacity = 1;
          this.fadeOutMenu();
        }
      }
    }
    
    // Clear navigation type after handling
    sessionStorage.removeItem("navigationType");
  }

  /**
   * Initializes the PageTransition instance
   * Sets up all necessary event listeners
   */
  init() {
    window.addEventListener("DOMContentLoaded", () => this.handlePageLoad());
    this.setupLinkListeners();
  }
}

/**
 * Exports a singleton instance of PageTransition
 * @type {PageTransition}
 */
export default new PageTransition();
