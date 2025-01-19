const titleElements = document.querySelectorAll(".post__title");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio < 0.5) {
        const title = entry.target.querySelector(".post__title");
        if (title) {
          title.scrollLeft = 0;
        }
      }
    });
  },
  {
    threshold: [0, 0.5, 1.0],
    rootMargin: "0px",
  }
);

titleElements.forEach((title) => {
  const article = title.closest("article");
  if (article) {
    observer.observe(article);
  }
});
