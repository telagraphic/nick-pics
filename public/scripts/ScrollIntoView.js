/**
 *  events listeners
 *  tracking the current index state
 *
 *  scrolls the element into view
 *
 */

class ScrollIntoView {
  constructor() {
    this.sections = document.querySelectorAll(".timeline-section");
    this.postElementIndex = 0;
    this.key = null;
    this.isScrolling = false;
    this.pendingScroll = null;
  }

  updateOnKeydown() { 
    document.addEventListener("keydown", (e) => {
      this.key = e.key;
      if (key === "ArrowUp" || key === "ArrowDown") {
        e.preventDefault();
        this.scrollToSection();
      }
    });
  }

  updateOnScroll() {
    document.addEventListener("scroll", () => {
      this.postElementIndex = Array.from(this.sections).findIndex((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top >= 0;
      });
      if (this.postElementIndex === -1) this.postElementIndex = this.sections.length - 1;
    });
  }

  scrollToSection() {
    if (this.sections.length === 0) return;

    if (this.key === "ArrowUp" && this.postElementIndex > 0) {
      this.postElementIndex--;
    } else if (this.key === "ArrowDown" && this.postElementIndex < this.sections.length - 1) {
      this.postElementIndex++;
    }

    this.sections[this.postElementIndex].scrollIntoView({ behavior: "smooth" });
  }

  init() {
    this.updateOnKeydown();
    this.updateOnScroll();
  }
}

export default ScrollIntoView;
