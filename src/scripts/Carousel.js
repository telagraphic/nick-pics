class Carousel {
  constructor(element) {
    this.carousel = element;
    this.carouselWrapper = this.carousel.querySelector(".carousel__wrapper");
    this.slides = gsap.utils.toArray(this.carousel.querySelectorAll(".carousel__slide"));
    this.prev = this.carousel.querySelector(".prev");
    this.next = this.carousel.querySelector(".next");
    this.nav = this.carousel.querySelector(".carousel__nav");
    this.navDiv = this.carousel.querySelector(".carousel__nav div");
    this.navPrev = this.carousel.querySelector(".carousel__nav .prev");
    this.navNext = this.carousel.querySelector(".carousel__nav .next");
    this.navPrevText = this.carousel.querySelector(".carousel__nav .prev-text");
    this.horzontalLoop = null;
    this.activeSlide;
    this.firstRun = true;
    this.init();
  }

  /**
   * Initializes the carousel
   * Sets up the horizontal loop and event listeners
   */
  init() {
    gsap.set(this.carouselWrapper, { overflow: "visible", "scroll-snap-type": "none" });
    // gsap.set(this.slides, { opacity: (i) => (i === 0 ? 1 : 1) });
    
    // Create horizontalLoop first
    this.horzontalLoop = this.setupHorizontalLoop(this.slides, {
      paused: true,
      paddingRight: 0,
      center: true,
      draggable: true,
      onChange: (slide, index) => {
        if (this.activeSlide) {
          this.activeSlide.classList.remove("carousel__slide--active");
        }
        slide.classList.add("carousel__slide--active");
        this.activeSlide = slide;

        gsap
          .timeline({ defaults: { ease: "power1.inOut" } })
          .to(this.activeSlide, { opacity: 1, ease: "power2.inOut" }, 0)
          .progress(this.firstRun ? 1 : 0);
      },
    });

    // Now we can use it
    this.horzontalLoop.toIndex(0, { duration: 0 });
    this.firstRun = false;
    this.updateOnArrowKey();
  }

  /**
   * Destroys the carousel instance
   * Cleans up GSAP animations and event listeners
   */
  destroy() {
    if (this.horzontalLoop) {
      this.horzontalLoop.kill();
    }
    
    // Remove event listeners
    document.removeEventListener("keydown", this.handleKeydown);
    
    // Clear references
    this.carousel = null;
    this.carouselWrapper = null;
    this.slides = null;
    this.prev = null;
    this.next = null;
    this.nav = null;
    this.navDiv = null;
    this.navPrev = null;
    this.navNext = null;
    this.navPrevText = null;
    this.horzontalLoop = null;
    this.activeSlide = null;
  }

  /**
   * Updates the image position and z-index for each slide
   * Creates parallax movement on the images
   */
  slideImgUpdate(){
    this.slides.forEach( (slide, index) => {
      const rect = slide.getBoundingClientRect();
      const prog = gsap.utils.mapRange(-rect.width, innerWidth, 0, 1, rect.x);
      const val = gsap.utils.clamp(0, 1, prog );
      
      const img = slide.querySelector("img");
      const isOutOfView = rect.x < -rect.width || rect.x > innerWidth;
      const isFirstSlide = index === 0;
      
      // Manage z-index for first slide to prevent overlapping slides when wrapping back to first slide
      if (isFirstSlide) {
        slide.style.zIndex = !isOutOfView ? '1000' : '1';
      } else {
        slide.style.zIndex = '1';
      }
      
      // Handle transforms
      if (isOutOfView) {
        gsap.set(img, {
          xPercent: 0,
          clearProps: "transform"
        });
      } else {
        gsap.set(img, {
          xPercent: gsap.utils.interpolate(0, -50, val)
        });
      }
    });
  }
  
  /**
   * Handles the arrow key press event
   * Navigates to the next or previous slide
   */
  handleKeydown = (e) => {
    if (e.key === "ArrowRight") {
      this.horzontalLoop.next({ duration: 1, ease: "expo" });
    }
    if (e.key === "ArrowLeft") {
      this.horzontalLoop.previous({ duration: 1, ease: "expo" });
    }
  }

  /**
   * Updates the carousel on arrow key press
   * Adds event listener for arrow key presses
   */
  updateOnArrowKey() {
    document.addEventListener("keydown", this.handleKeydown);
  }

  /**
   * Sets up the horizontal loop
   * Creates the timeline for the carousel
   * Uses https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop
   */
  setupHorizontalLoop(items, config) {
    let timeline;
    items = gsap.utils.toArray(items);
    config = config || {};
    gsap.context(() => {
      // use a context so that if this is called from within another context or a gsap.matchMedia(), we can perform proper cleanup like the "resize" event handler on the window
      let onChange = config.onChange,
        lastIndex = 0,
        tl = gsap.timeline({
          repeat: config.repeat,
          onUpdate: onChange
            ? () => {
                this.slideImgUpdate(); // custom function added to create parallax movement on the images

                let i = tl.closestIndex();
                if (lastIndex !== i) {
                  lastIndex = i;
                  onChange(items[i], i);
                }
              }
            : undefined,
          paused: config.paused,
          defaults: { ease: "none" },
          onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
        }),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        spaceBefore = [],
        xPercents = [],
        curIndex = 0,
        indexIsDirty = false,
        center = config.center,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
        timeOffset = 0,
        container =
          center === true
            ? items[0].parentNode
            : gsap.utils.toArray(center)[0] || items[0].parentNode,
        totalWidth,
        getTotalWidth = () =>
          items[length - 1].offsetLeft +
          (xPercents[length - 1] / 100) * widths[length - 1] -
          startX +
          spaceBefore[0] +
          items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") +
          (parseFloat(config.paddingRight) || 0),
        populateWidths = () => {
          let b1 = container.getBoundingClientRect(),
            b2;
          items.forEach((el, i) => {
            widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
            xPercents[i] = snap(
              (parseFloat(gsap.getProperty(el, "x", "px")) / widths[i]) * 100 +
                gsap.getProperty(el, "xPercent")
            );
            b2 = el.getBoundingClientRect();
            spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
            b1 = b2;
          });
          gsap.set(items, {
            // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
            xPercent: (i) => xPercents[i],
          });
          totalWidth = getTotalWidth();
        },
        timeWrap,
        populateOffsets = () => {
          timeOffset = center ? (tl.duration() * (container.offsetWidth / 2)) / totalWidth : 0;
          center &&
            times.forEach((t, i) => {
              times[i] = timeWrap(
                tl.labels["label" + i] + (tl.duration() * widths[i]) / 2 / totalWidth - timeOffset
              );
            });
        },
        getClosest = (values, value, wrap) => {
          let i = values.length,
            closest = 1e10,
            index = 0,
            d;
          while (i--) {
            d = Math.abs(values[i] - value);
            if (d > wrap / 2) {
              d = wrap - d;
            }
            if (d < closest) {
              closest = d;
              index = i;
            }
          }
          return index;
        },
        populateTimeline = () => {
          let i, item, curX, distanceToStart, distanceToLoop;
          tl.clear();
          for (i = 0; i < length; i++) {
            item = items[i];
            curX = (xPercents[i] / 100) * widths[i];
            distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
            distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
            tl.to(
              item,
              {
                xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
                duration: distanceToLoop / pixelsPerSecond,
              },
              0
            )
              .fromTo(
                item,
                { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
                {
                  xPercent: xPercents[i],
                  duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
                  immediateRender: false,
                },
                distanceToLoop / pixelsPerSecond
              )
              .add("label" + i, distanceToStart / pixelsPerSecond);
            times[i] = distanceToStart / pixelsPerSecond;
          }
          timeWrap = gsap.utils.wrap(0, tl.duration());
        },
        refresh = (deep) => {
          let progress = tl.progress();
          tl.progress(0, true);
          populateWidths();
          deep && populateTimeline();
          populateOffsets();
          deep && tl.draggable && tl.paused()
            ? tl.time(times[curIndex], true)
            : tl.progress(progress, true);
        },
        onResize = () => refresh(true),
        proxy;
      gsap.set(items, { x: 0 });
      populateWidths();
      populateTimeline();
      populateOffsets();
      window.addEventListener("resize", onResize);
      function toIndex(index, vars) {
        vars = vars || {};
        Math.abs(index - curIndex) > length / 2 && (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
          time = times[newIndex];
        if (time > tl.time() !== index > curIndex && index !== curIndex) {
          // if we're wrapping the timeline's playhead, make the proper adjustments
          time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        if (time < 0 || time > tl.duration()) {
          vars.modifiers = { time: timeWrap };
        }
        curIndex = newIndex;
        vars.overwrite = true;
        gsap.killTweensOf(proxy);
        return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars);
      }
      tl.toIndex = (index, vars) => toIndex(index, vars);
      tl.closestIndex = (setCurrent) => {
        let index = getClosest(times, tl.time(), tl.duration());
        if (setCurrent) {
          curIndex = index;
          indexIsDirty = false;
        }
        return index;
      };
      tl.current = () => (indexIsDirty ? tl.closestIndex(true) : curIndex);
      tl.next = (vars) => toIndex(tl.current() + 1, vars);
      tl.previous = (vars) => toIndex(tl.current() - 1, vars);
      tl.times = times;
      tl.progress(1, true).progress(0, true); // pre-render for performance
      if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
      }
      if (config.draggable && typeof Draggable === "function") {
        proxy = document.createElement("div");
        let wrap = gsap.utils.wrap(0, 1),
          ratio,
          startProgress,
          draggable,
          dragSnap,
          lastSnap,
          initChangeX,
          wasPlaying,
          align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)),
          syncIndex = () => tl.closestIndex(true);
        typeof InertiaPlugin === "undefined" &&
          console.warn(
            "InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club"
          );
        draggable = Draggable.create(proxy, {
          trigger: items[0].parentNode,
          type: "x",
          onPressInit() {
            let x = this.x;
            gsap.killTweensOf(tl);
            wasPlaying = !tl.paused();
            tl.pause();
            startProgress = tl.progress();
            refresh();
            ratio = 1 / totalWidth;
            initChangeX = startProgress / -ratio - x;
            gsap.set(proxy, { x: startProgress / -ratio });
          },
          onDrag: align,
          onThrowUpdate: align,
          overshootTolerance: 0,
          inertia: true,
          snap(value) {
            //note: if the user presses and releases in the middle of a throw, due to the sudden correction of proxy.x in the onPressInit(), the velocity could be very large, throwing off the snap. So sense that condition and adjust for it. We also need to set overshootTolerance to 0 to prevent the inertia from causing it to shoot past and come back
            if (Math.abs(startProgress / -ratio - this.x) < 10) {
              return lastSnap + initChangeX;
            }
            let time = -(value * ratio) * tl.duration(),
              wrappedTime = timeWrap(time),
              snapTime = times[getClosest(times, wrappedTime, tl.duration())],
              dif = snapTime - wrappedTime;
            Math.abs(dif) > tl.duration() / 2 && (dif += dif < 0 ? tl.duration() : -tl.duration());
            lastSnap = (time + dif) / tl.duration() / -ratio;
            return lastSnap;
          },
          onRelease() {
            syncIndex();
            draggable.isThrowing && (indexIsDirty = true);
          },
          onThrowComplete: () => {
            syncIndex();
            wasPlaying && tl.play();
          },
        })[0];
        tl.draggable = draggable;
      }
      tl.closestIndex(true);
      lastIndex = curIndex;
      onChange && onChange(items[curIndex], curIndex);
      timeline = tl;
      return () => window.removeEventListener("resize", onResize); // cleanup
    });
    return timeline;
  }
}

// export default Carousel;
// window.Carousel = Carousel;

export class CarouselManager {
  constructor() {
    this.instances = new Map();
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { threshold: 0.1 }
    );
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!this.instances.has(entry.target)) {
          const instance = new Carousel(entry.target);
          this.instances.set(entry.target, instance);
        }
      } else {
        if (this.instances.has(entry.target)) {
          this.instances.get(entry.target).destroy();
          this.instances.delete(entry.target);
        }
      }
    });
  }

  init() {
    const carousels = document.querySelectorAll(".carousel");
    carousels.forEach((carousel) => this.observer.observe(carousel));
  }
}