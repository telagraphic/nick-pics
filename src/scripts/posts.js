document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

  function postAnimation(element, animationConfig) {
    let hasAnimated = false;
    
    // Set initial state
    gsap.set(element, animationConfig.initial);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            
            // Use GSAP's fromTo to ensure proper animation
            gsap.fromTo(element,
              animationConfig.initial,
              {
                ...animationConfig.animation,
                onComplete: () => observer.unobserve(element)
              }
            );
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "50px"
      }
    );

    observer.observe(element);
  }

  let titles = gsap.utils.toArray(".post__title-header");
  let footers = gsap.utils.toArray(".post__footer");
  let medias = gsap.utils.toArray(".post__media, .post__media-swiper, .post__media-video");
  
  titles.forEach((title) => {
    postAnimation(title, {
      initial: {opacity: 0, yPercent: 100 },
      animation: {
        duration: 0.8,
        opacity: 1,
        yPercent: 0,
        ease: "back.out(1.7)"
      }
    });
  });

  medias.forEach((media) => {
    postAnimation(media, {
      initial: {opacity: 0, autoAlpha: 0 },
      animation: {
        duration: 1,
        opacity: 1,
        autoAlpha: 1,
        ease: "back.out(1.7)"
      }
    });
  });

  footers.forEach((footer) => {
    postAnimation(footer, {
      initial: { opacity: 0, yPercent: -100 },
      animation: {
        duration: 0.75,
        opacity: 1,
        yPercent: 0,
        ease: "power2.out"
      }
    });
  });
});
