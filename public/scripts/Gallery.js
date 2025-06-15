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
    this.clearGrid(); // Safely clear grid content
    this.groupItemsByColumn(); // Group items and get column count
    // this.currentColumnCount = numColumns; // Store for layout change detection
    this.buildGrid(); // Build new layout
    this.applyLagEffects(); // Apply scroll effects
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
      this.smoother.effects(element, { speed: 1, lag }); // Apply per-column lag
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

    const columns = Array.from({ length: numColumns }, () => []); // Initialize column arrays

    // Distribute grid items into column buckets
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
    const fragment = document.createDocumentFragment(); // Efficient DOM batch insertion
    const mid = (this.numColumns - 1) / 2; // Center index (can be fractional)
    const maxDistance =
      this.numColumns % 2 === 1 ? Math.floor(this.numColumns / 2) : this.numColumns / 2;

    this.columnContainers = [];

    // Loop over each column
    this.columns.forEach((column, i) => {
      const distance = Math.abs(i - mid); // Distance from center
      const lag = this.baseLag + (maxDistance - distance + 1) * this.lagFactor; // Lag increases toward center

      const columnContainer = document.createElement("div"); // New column wrapper
      columnContainer.className = "gallery__grid-column";

      // Append items to column container
      column.forEach((item) => columnContainer.appendChild(item));

      fragment.appendChild(columnContainer); // Add to fragment
      this.columnContainers.push({ element: columnContainer, lag }); // Store for ScrollSmoother
    });

    this.grid.appendChild(fragment); // Insert all at once
    // this.columnContainers = this.columnContainers;
    // return columnContainers;
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