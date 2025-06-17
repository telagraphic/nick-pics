import Swiper from "/node_modules/swiper/swiper-bundle.mjs";
import { Navigation, Pagination } from "/node_modules/swiper/modules/index.mjs";
// import Swiper and modules styles
import "/node_modules/swiper/swiper.css";
import "/node_modules/swiper/modules/navigation.css";
import "/node_modules/swiper/modules/pagination.css";

const swiper = new Swiper(".post__media-swiper", {
  modules: [Navigation, Pagination],
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  keyboard: {
    enabled: true,
  }
});
