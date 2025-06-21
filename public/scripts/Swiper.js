console.log('Script loaded');

let swiperInstance = null; // Store swiper instance globally

function waitForSwiper() {
  return new Promise((resolve) => {
    const checkSwiper = () => {
      if (typeof Swiper !== 'undefined') {
        console.log('Swiper found');
        resolve();
      } else {
        console.log('Swiper not found, checking again...');
        setTimeout(checkSwiper, 50);
      }
    };
    checkSwiper();
  });
}

async function initSwiper() {
  
  try {
    await waitForSwiper();
    
    const swiperElement = document.querySelector('.swiper');
    
    if (!swiperElement) {
      console.error('No .swiper element found');
      return;
    }
    
    // Try without modules first
    swiperInstance = new Swiper('.swiper', {
      slidesPerView: 1,
      loop: true,
      keyboard: {
        enabled: true,
      },
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        type: 'bullets',
      },
    });
  

  } catch (error) {
    console.error('Swiper initialization error:', error); 
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSwiper);
} else {
  initSwiper();
}

