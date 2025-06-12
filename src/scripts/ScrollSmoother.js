// import { gsap } from "gsap";
// import { ScrollSmoother } from "gsap/ScrollSmoother";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

export class SmoothScroll {
  constructor(wrapper = "#smooth-wrapper", content = "#smooth-content", options = {}) {
    this.wrapper = wrapper;
    this.content = content;
    this.smoother = null;
    this.options = {
      smooth: 1.5,
      effects: true,
      normalizeScroll: true,
      smoothTouch: 0.1,
      ...options,
    };
  }

  create() {
    if (this.smoother) {
      console.warn("ScrollSmoother already exists");
      return;
    }

    try {
      this.smoother = ScrollSmoother.create({
        wrapper: this.wrapper,
        content: this.content,
        ...this.options,
      });
    } catch (error) {
      console.error("Failed to create ScrollSmoother:", error);
    }
  }

  pause() {
    if (this.smoother) {
      this.smoother.paused(true);
    }
  }

  resume() {
    if (this.smoother) {
      this.smoother.paused(false);
    }
  }

  kill() {
    if (this.smoother) {
      this.smoother.kill();
      this.smoother = null;
    }
  }

  getInstance() {
    return this.smoother;
  }

  isActive() {
    return this.smoother !== null;
  }
}
