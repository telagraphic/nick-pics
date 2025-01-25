function initKeyboardNavigation() {
  // Get all snap sections (assuming they have a class 'snap-section')
  const sections = document.querySelectorAll(".post");
  let currentIndex = 0;

  document.addEventListener("keydown", (e) => {
    // Handle up and down arrow keys
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault(); // Prevent default scroll behavior

      // Update current index based on arrow direction
      if (e.key === "ArrowUp" && currentIndex > 0) {
        currentIndex--;
      } else if (e.key === "ArrowDown" && currentIndex < sections.length - 1) {
        currentIndex++;
      }

      // Smooth scroll to the target section
      sections[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });

  // Update current index when user manually scrolls
  document.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    currentIndex = Array.from(sections).findIndex((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top >= 0;
    });
    if (currentIndex === -1) currentIndex = sections.length - 1;
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initKeyboardNavigation);
