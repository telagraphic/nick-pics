document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

  function createSplitTextAnimation(element, animationConfig) {
    let splitText = new SplitText(element, {
      types: "words",
    });

    gsap.set(splitText.words, animationConfig.initial);

    let hasAnimated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            gsap.to(splitText.words, {
              ...animationConfig.animation,
              onComplete: () => {
                hasAnimated = true;
                observer.unobserve(element);
              }
            });
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px"
      }
    );

    observer.observe(element);
  }

  // Select all title headers and footers
  let titles = gsap.utils.toArray(".post__title-header");
  let footers = gsap.utils.toArray(".post__footer");
  
  titles.forEach((title) => {
    createSplitTextAnimation(title, {
      initial: { opacity: 0, y: 50 },
      animation: {
        duration: 0.8,
        opacity: 1,
        y: 0,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }
    });
  });

  footers.forEach((footer) => {
    createSplitTextAnimation(footer, {
      initial: { opacity: 0, yPercent: -100 },
      animation: {
        duration: 0.75,
        opacity: 1,
        yPercent: 0,
        stagger: 0.01,
        ease: "power2.out"
      }
    });
  });

  // Force a refresh after all ScrollTriggers are created
  ScrollTrigger.refresh(true);
});
