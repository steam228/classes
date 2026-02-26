/**
 * Hero Header JavaScript for Zensical
 *
 * Handles:
 * - Scroll detection for transparent header transition
 * - Smooth scroll behavior
 * - Parallax effect (optional)
 * - Hero page navigation highlighting
 */

(function () {
  "use strict";

  /**
   * Initialize hero functionality when document is ready
   * Uses Zensical's document$ observable for instant navigation support
   */
  function initHero() {
    const hasHero = document.documentElement.classList.contains("has-hero");

    if (!hasHero) {
      // Clean up if navigating away from a hero page
      cleanupHero();
      return;
    }

    setupScrollHandler();
    setupParallax();
    setupHeroNavigation();
  }

  function initGanttZoom() {
    const containers = document.querySelectorAll(".gantt-zoom");
    if (!containers.length) return;

    const lightbox = ensureGanttLightbox();
    const bindSvg = (svg) => {
      if (!svg || svg.dataset.ganttZoomBound === "true") return;

      svg.dataset.ganttZoomBound = "true";
      svg.setAttribute("role", "button");
      svg.setAttribute("tabindex", "0");

      const open = () => openGanttLightbox(svg, lightbox);
      svg.addEventListener("click", open);
      svg.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
    };

    containers.forEach((container) => {
      const svg = container.querySelector("svg");
      if (svg) bindSvg(svg);

      if (container.dataset.ganttObserverBound === "true") return;
      container.dataset.ganttObserverBound = "true";

      const observer = new MutationObserver(() => {
        const nextSvg = container.querySelector("svg");
        if (nextSvg) {
          bindSvg(nextSvg);
          observer.disconnect();
        }
      });

      observer.observe(container, {
        subtree: true,
        childList: true,
      });
    });
  }

  function ensureGanttLightbox() {
    let lightbox = document.querySelector(".gantt-lightbox");
    if (lightbox) return lightbox;

    lightbox = document.createElement("div");
    lightbox.className = "gantt-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML =
      '<div class="gantt-lightbox__backdrop" aria-hidden="true"></div>' +
      '<div class="gantt-lightbox__content" role="dialog" aria-modal="true" aria-label="Gantt chart">' +
      '<button class="gantt-lightbox__close" type="button" aria-label="Close">x</button>' +
      '<div class="gantt-lightbox__inner"></div>' +
      "</div>";

    document.body.appendChild(lightbox);

    const close = () => {
      lightbox.classList.remove("gantt-lightbox--open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("gantt-lightbox-open");
      const inner = lightbox.querySelector(".gantt-lightbox__inner");
      if (inner) inner.innerHTML = "";
    };

    const backdrop = lightbox.querySelector(".gantt-lightbox__backdrop");
    const closeButton = lightbox.querySelector(".gantt-lightbox__close");

    if (backdrop) backdrop.addEventListener("click", close);
    if (closeButton) closeButton.addEventListener("click", close);

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        lightbox.classList.contains("gantt-lightbox--open")
      ) {
        close();
      }
    });

    return lightbox;
  }

  function openGanttLightbox(svg, lightbox) {
    const inner = lightbox.querySelector(".gantt-lightbox__inner");
    if (!inner) return;

    inner.innerHTML = "";
    const clone = svg.cloneNode(true);
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    clone.setAttribute("aria-hidden", "true");
    inner.appendChild(clone);

    lightbox.classList.add("gantt-lightbox--open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("gantt-lightbox-open");
  }

  /**
   * Handle scroll events to toggle header transparency
   */
  function setupScrollHandler() {
    const header = document.querySelector(".md-header");
    if (!header) return;

    const heroImage = document.querySelector(".md-hero__image");
    if (!heroImage) return;

    // Calculate the point at which header should become solid
    const getThreshold = () => {
      const heroHeight = heroImage.offsetHeight;
      const headerHeight = header.offsetHeight;
      // Transition starts when hero image is about to leave viewport
      return Math.max(50, heroHeight - headerHeight - 100);
    };

    let threshold = getThreshold();
    let ticking = false;
    let lastScrollY = window.scrollY;

    const updateHeader = () => {
      const scrollY = window.scrollY;

      if (scrollY > threshold) {
        header.classList.add("md-header--scrolled");
      } else {
        header.classList.remove("md-header--scrolled");
      }

      ticking = false;
    };

    const onScroll = () => {
      lastScrollY = window.scrollY;

      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    // Initial check
    updateHeader();

    // Attach scroll listener
    window.addEventListener("scroll", onScroll, { passive: true });

    // Update threshold on resize
    window.addEventListener(
      "resize",
      () => {
        threshold = getThreshold();
        updateHeader();
      },
      { passive: true },
    );

    // Store cleanup function
    window.__heroScrollCleanup = () => {
      window.removeEventListener("scroll", onScroll);
    };
  }

  /**
   * Optional parallax effect for hero image
   */
  function setupParallax() {
    const heroImage = document.querySelector(".md-hero__image");
    if (!heroImage) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      const heroHeight = heroImage.offsetHeight;

      if (scrollY <= heroHeight) {
        // Subtle parallax: background moves at 0.3x scroll speed
        const offset = scrollY * 0.3;
        heroImage.style.backgroundPosition = `center calc(50% + ${offset}px)`;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Store cleanup function
    window.__heroParallaxCleanup = () => {
      window.removeEventListener("scroll", onScroll);
      heroImage.style.backgroundPosition = "";
    };
  }

  /**
   * Set up hero in-page navigation highlighting
   */
  function setupHeroNavigation() {
    const navLinks = document.querySelectorAll(".md-hero__nav-link");
    if (!navLinks.length) return;

    // Highlight active section based on scroll position
    const sections = [];
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const section = document.querySelector(href);
        if (section) {
          sections.push({ link, section });
        }
      }
    });

    if (!sections.length) return;

    let ticking = false;

    const updateActiveLink = () => {
      const scrollY = window.scrollY + 100; // Offset for header

      let activeSection = null;

      for (const { link, section } of sections) {
        if (section.offsetTop <= scrollY) {
          activeSection = link;
        }
      }

      navLinks.forEach((link) =>
        link.classList.remove("md-hero__nav-link--active"),
      );
      if (activeSection) {
        activeSection.classList.add("md-hero__nav-link--active");
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateActiveLink);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateActiveLink();
  }

  /**
   * Clean up hero functionality when navigating away
   */
  function cleanupHero() {
    const header = document.querySelector(".md-header");
    if (header) {
      header.classList.remove("md-header--scrolled");
    }

    // Call stored cleanup functions
    if (typeof window.__heroScrollCleanup === "function") {
      window.__heroScrollCleanup();
      delete window.__heroScrollCleanup;
    }

    if (typeof window.__heroParallaxCleanup === "function") {
      window.__heroParallaxCleanup();
      delete window.__heroParallaxCleanup;
    }
  }

  /**
   * Smooth scroll to anchor with offset for fixed header
   */
  function setupSmoothScroll() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const header = document.querySelector(".md-header");
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = target.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Update URL without jumping
      history.pushState(null, null, targetId);
    });
  }

  /**
   * Convert <img> tags pointing to video files into <video> elements.
   *
   * Workflow:
   *   1. In Obsidian, drag a video file → it inserts a standard Markdown
   *      image link:  ![](attachments/foo.mp4)
   *   2. At build time, Zensical's LinksProcessor automatically fixes the
   *      <img src> path (e.g. → ../attachments/foo.mp4) because <img>
   *      elements go through the Markdown element tree.
   *   3. This function replaces those <img> elements with <video> elements
   *      so browsers can play them. No path math needed — the src is
   *      already correct.
   */
  function convertVideoImages() {
    const selector = [".mp4", ".webm", ".ogg", ".mov"]
      .map((ext) => `img[src$="${ext}"], img[src$="${ext.toUpperCase()}"]`)
      .join(", ");

    document.querySelectorAll(selector).forEach(function (img) {
      const src = img.getAttribute("src");
      if (!src) return;

      const video = document.createElement("video");
      video.autoplay = true;
      video.loop = true;
      video.muted = true; // required for autoplay in most browsers
      video.setAttribute("width", "600");
      video.style.maxWidth = "100%";
      video.style.display = "block";

      const source = document.createElement("source");
      source.setAttribute("src", src);
      source.setAttribute("type", "video/mp4");
      video.appendChild(source);

      // If the img is the only child of a <p>, replace the whole paragraph
      const parent = img.parentElement;
      if (parent && parent.tagName === "P" && parent.children.length === 1) {
        parent.replaceWith(video);
      } else {
        img.replaceWith(video);
      }
    });
  }

  // Initialize on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initHero();
      initGanttZoom();
      setupSmoothScroll();
      convertVideoImages();
    });
  } else {
    initHero();
    initGanttZoom();
    setupSmoothScroll();
    convertVideoImages();
  }

  // Support Zensical's instant navigation
  // Re-initialize when navigating to a new page
  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      initHero();
      initGanttZoom();
      convertVideoImages();
    });
  }
})();
