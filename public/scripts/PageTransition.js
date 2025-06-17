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
   * Sets up click event listeners for menu links
   * Handles navigation to new pages
   */
  setupLinkListeners() {
    this.menuLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.getAttribute("href");
        if (page && page !== window.location.pathname) {
          this.fadeOutLinks().then(() => {
            window.location.href = page;
          });
        }
      });
    });
  }

  /**
   * Handles the page load animation sequence
   * Sets initial menu visibility and triggers fade out
   * Uses localStorage to track first visit
   */
  handlePageLoad() {
    const hasVisited = localStorage.getItem("hasVisited");
    if (this.menu) {
      if (!hasVisited) {
        // First visit: hide menu, set flag
        this.menu.style.opacity = 0;
        localStorage.setItem("hasVisited", "true");
      } else {
        // Subsequent visits: show menu and fade out
        this.menu.style.opacity = 1;
        this.fadeOutMenu();
      }
    }
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
