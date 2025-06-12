document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  
  const posts = document.querySelectorAll(".post");
  console.log(posts);

  posts.forEach((post) => {
    const title = post.querySelector(".post__title");
    const tags = post.querySelector(".post__tags");
    const date = post.querySelector(".post__date");

     // animate the entire line up
     // and delay the animation for the tags and date until the title is done
     // use one timeline for each post
     // complete the animation, no enter back in animations
     // 

  });
});
