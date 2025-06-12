// Initialize ScrollSmoother
function initScrollSmoother() {
  // Create ScrollSmoother instance
  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5, // Adjust this value to control smoothness
    effects: true
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initScrollSmoother);
