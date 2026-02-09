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

  // Initialize on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initHero();
      setupSmoothScroll();
    });
  } else {
    initHero();
    setupSmoothScroll();
  }

  // Support Zensical's instant navigation
  // Re-initialize when navigating to a new page
  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      initHero();
    });
  }
})();
