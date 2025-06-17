// class Menu {
//   constructor() {
//     this.menu = document.querySelector(".menu");
//     this.menuButton = document.querySelector(".menu-button");
//     this.menuDisplay = false;
//   }

//   setupEventListeners() {
//     this.menuButton.addEventListener("click", this.toggleMenu());

//     document.addEventListener("keydown", (e) => {
//       if (e.key === "m") {
//         this.toggleMenu();
//       }
//     });
//   }

//   toggleMenu() {
//     this.menuDisplay = this.menu.classList.contains("menu--open");

//     if (!this.menuDisplay) {
//       this.menu.classList.add("menu--open");
//     } else {
//       menu.classList.remove("menu--open");
//     }

//     this.animateMenu();
//     this.aimateButton();
//   }

//   animateMenu() {
//     gsap.to(this.menu, {
//       visibility: this.menuDisplay ? "hidden" : "visible",
//       duration: 0.25,
//       ease: "power2.inOut",
//     });
//   }

//   animateButton() {
//     gsap.to(this.menuButton, {
//       backgroundColor: this.menuDisplay ? "black" : "white",
//       duration: 0.25,
//       ease: "power2.inOut",
//     });
//   }

//   init() {
//     document.addEventListener("DOMContentLoaded", () => {
//       this.setupEventListeners();
//     });
//   }
// }

// export default Menu;

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu");
  const menuButton = document.querySelector(".menu-button");
  const menuItems = document.querySelectorAll(".menu__item");

  // Set initial states
  gsap.set(menu, { opacity: 0 });
  // gsap.set(menuItems, { opacity: 0 });
  gsap.set(menuButton, { backgroundColor: "black" });

  function clickEvent() {
    menuButton.addEventListener("click", () => {
      toggleMenu();
    });
  }

  function toggleMenu() {
    const isOpen = menu.classList.contains("menu--open");

    if (!isOpen) {
      menu.classList.add("menu--open");
      // Small delay to ensure class is added before animation
      requestAnimationFrame(() => {
        animateMenu(true);
        animateButton(false);
      });
    } else {
      menu.classList.remove("menu--open");
      animateMenu(false);
      animateButton(true);
    }
  }

  function animateMenu(isOpen) {
    const menuTimeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
    });

    if (isOpen) {
      menuTimeline
        .to(menu, {
          opacity: 1,
          duration: 0.5,
          delay: 0.25,
        })
        .to(
          menuItems,
          {
            opacity: 1,
            duration: 0.25,
            stagger: 0.05,
          },
          "-=0.3"
        );
    } else {
      menuTimeline
        .to(menuItems, {
          opacity: 0,
          duration: 0.25,
        })
        .to(
          menu,
          {
            opacity: 0,
            duration: 0.5,
          },
          "-=0.1"
        );
    }
  }

  function animateButton(isOpen) {
    gsap.to(menuButton, {
      backgroundColor: isOpen ? "black" : "white",
      duration: 0.25,
      delay: 0.5,
      ease: "power2.inOut",
    });
  }

  function keyboardEvent() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "m") {
        toggleMenu();
      }

      if (e.key === "Escape") {
        menu.classList.remove("menu--open");
        animateMenu(false);
        animateButton(true);
      }
    });
  }

  function hideButton(toggle) {
    gsap.to(menuButton, {
      opacity: toggle ? 0 : 1,
      duration: 0.55,
      ease: "power2.inOut",
    });
  }

  clickEvent();
  keyboardEvent();
});
