import Plyr from "plyr";

// Check if device is iOS or mobile
const isiOS = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent);
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

function initPlayer() {
  const videos = document.querySelectorAll(".plyr-video");
  const players = Array.from(videos).map((video) => {
    const desktopSource = video.querySelector(".desktop-source");
    const mobileSource = video.querySelector(".mobile-source");

    if (isMobile) {
      if (desktopSource) desktopSource.remove();
    } else {
      if (mobileSource) mobileSource.remove();
    }

    const player = new Plyr(video, {
      debug: false,
      controls: ["play-large", "fullscreen"],
      loadSprite: true,
      iconUrl: "/plyr.svg",
      clickToPlay: true,
      muted: false,
      autopause: true,
      playsinline: true,
      resetOnEnd: true,
      fullscreen: {
        enabled: true,
        fallback: true,
        iosNative: true,
      },
      // Add control display settings
      controlsDisplayed: true,
      hideControls: false
    });

    // Create intersection observer with adjusted threshold
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const playPromise = player.play();

            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  console.log("Autoplay started");
                })
                .catch((error) => {
                  console.log("Autoplay prevented:", error);
                });
            }
          } else {
            player.pause(); // Ensure the video pauses when out of view
          }
        });
      },
      { threshold: 0.5 } // Adjust threshold to trigger when 50% of the video is in view
    );

    // Add touch event handling
    if (player.elements.container) {
      let touchStartTime = 0;

      player.elements.container.addEventListener("touchstart", () => {
        touchStartTime = Date.now();
      });

      player.elements.container.addEventListener("touchend", (e) => {
        // Only handle quick taps (less than 200ms)
        if (Date.now() - touchStartTime < 200) {
          e.preventDefault();
          if (player.playing) {
            player.pause();
          } else {
            player.play();
          }
        }
      });

      observer.observe(player.elements.container);
    }

    // Stop video from looping by listening to the 'ended' event
    player.on('ended', () => {
      player.pause(); // Pause the video when it ends
      player.currentTime = 0; // Reset the video to the start
    });

    return player;
  });
}

// Initialize when DOM is ready and when page is fully loaded
document.addEventListener("DOMContentLoaded", initPlayer);
window.addEventListener("load", initPlayer);
