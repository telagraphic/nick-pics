document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText);

  const timelineSection = document.querySelectorAll(".timeline-section");
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const post = entry.target;
      const title = post.querySelector(".post__title");
      const tags = post.querySelector(".post__tags");
      const date = post.querySelector(".post__date");

      // Set initial state
      gsap.set([title, tags, date], { opacity: 0 });

      // Create timeline for this post
      const postTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut" }
      });

      // Build the animation sequence
      postTimeline
        .to(title, {
          opacity: 1,
          duration: 0.5
        })
        .to(tags, {
          opacity: 1,
          duration: 0.5
        }, "-=0.2")
        .to(date, {
          opacity: 1,
          duration: 0.5
        }, "-=0.2");

      if (entry.isIntersecting) {
        postTimeline.play();
      } else {
        postTimeline.reverse();
      }
    });
  }, observerOptions);

  // Observe each section
  timelineSection.forEach(section => {
    observer.observe(section);
  });
});
