class Gallery {
  constructor() {
    this.grid = document.querySelector(".gallery__grid");
    this.originalItems = Array.from(this.grid.querySelectorAll(".gallery__grid-item"));
    this.originalGridImages = Array.from(this.grid.querySelectorAll(".gallery__grid-item-image"));
    this.baseLag = 0.3; // Minimum starting lag
    this.lagFactor = 0.15; // Used to compute lag based on distance from center
    this.columns = [];
    this.numColumns = 0;
    this.columnContainers = [];
    this.currentColumnCount = null;
    this.setupScrollSmoother();
    
    this.preloadImages().then(() => {  
      this.init();
    });
    this.resizeHandler();
  }

  /**
   * Initialize layout and scroll effects
   */
  init() {
    this.clearGrid();
    this.groupItemsByColumn();
    this.buildGrid();
    this.applyLagEffects();
  }

  setupScrollSmoother() {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    this.smoother = ScrollSmoother.create({
      smooth: 1,
      effects: true,
      normalizeScroll: true,
    });
  }

  /**
   * Apply ScrollSmoother lag effects to each column
   * @param {Array} columnContainers - Array of column elements and lag values
   */
  applyLagEffects() {
    this.columnContainers.forEach(({ element, lag }) => {
      this.smoother.effects(element, { speed: 1, lag });
    });
  }

  /**
   * Group grid items into columns based on computed CSS grid-template-columns
   * @returns {Object} An object containing the grouped columns and total column count
   */
  groupItemsByColumn() {
    const gridStyles = window.getComputedStyle(this.grid);
    const columnsRaw = gridStyles.getPropertyValue("grid-template-columns");
    const numColumns = columnsRaw.split(" ").filter(Boolean).length;

    const columns = Array.from({ length: numColumns }, () => []);

    this.grid.querySelectorAll(".gallery__grid-item").forEach((item, index) => {
      columns[index % numColumns].push(item);
    });

    this.columns = columns;
    this.numColumns = numColumns;
    this.currentColumnCount = numColumns;
  }

  /**
   * Build the DOM layout with column wrappers and grid items
   * @param {Array[]} columns - Array of item groups per column
   * @param {number} numColumns - Total number of columns
   * @returns {Array} Array of objects containing column elements and lag values
   */
  buildGrid() {
    const fragment = document.createDocumentFragment();
    const mid = (this.numColumns - 1) / 2;
    const maxDistance =
      this.numColumns % 2 === 1 ? Math.floor(this.numColumns / 2) : this.numColumns / 2;

    this.columnContainers = [];

    this.columns.forEach((column, i) => {
      const distance = Math.abs(i - mid);
      const lag = this.baseLag + (maxDistance - distance + 1) * this.lagFactor;

      const columnContainer = document.createElement("div");
      columnContainer.className = "gallery__grid-column";

      column.forEach((item) => columnContainer.appendChild(item));

      fragment.appendChild(columnContainer);
      this.columnContainers.push({ element: columnContainer, lag });
    });

    this.grid.appendChild(fragment);
  }

  /**
   * Reset the grid, remove the innerHTML generated columns and revert to original flex items layout
   */
  clearGrid() {
    this.grid.querySelectorAll(".gallery__grid-column").forEach((col) => col.remove());
    this.grid.innerHTML = "";

    this.originalItems.forEach((item) => this.grid.appendChild(item));
  }

  /**
   * Helper to get current column count from computed CSS
   * @returns {number} Number of columns
   */
  getColumnCount() {
    const styles = getComputedStyle(this.grid);
    return styles.getPropertyValue("grid-template-columns").split(" ").filter(Boolean).length;
  }

  preloadImages() {
    const imagePromises = this.originalGridImages.map((item) => {
      return new Promise((resolve, reject) => {
        if (item.complete) {
          resolve(item);
        } else {
          item.onload = () => resolve(item);
          item.onerror = () => reject(item);
        }
      });
    });

    return Promise.allSettled(imagePromises).then((results) => {
      const failedImages = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);
      
      if (failedImages.length > 0) {
        console.warn('Some images failed to load:', failedImages);
      }
    });
  }

  resizeHandler() {
    window.addEventListener("resize", () => {
      const newColumnCount = this.getColumnCount();
      if (newColumnCount !== this.currentColumnCount) {
        this.init();
      }
    });
  }
}

const gallery = new Gallery();
gallery.init();