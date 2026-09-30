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
    setupScrollArrow();
    initHeroSketch();
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
   * Scroll-down arrow for 100vh heroes — click scrolls to content below
   */
  function setupScrollArrow() {
    const arrow = document.querySelector(".md-hero__scroll-arrow");
    if (!arrow) return;

    arrow.addEventListener("click", function () {
      const hero = document.querySelector(".md-hero");
      const target = hero ? hero.nextElementSibling : null;
      if (target) {
        const header = document.querySelector(".md-header");
        const headerHeight = header ? header.offsetHeight : 0;
        const top =
          target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: "smooth" });
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      }
    });

    // Fade out as user scrolls
    const onScroll = () => {
      const fade = Math.max(0, 1 - window.scrollY / 150);
      arrow.style.opacity = fade * 0.6;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
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
   * Set up scroll-pause for the hero sketch iframe.
   * Hides the iframe when off-screen so the browser can throttle it.
   */
  function initHeroSketch() {
    var iframe = document.querySelector("iframe.md-hero__sketch");
    if (!iframe) return;

    // Respect reduced-motion — hide sketch entirely
    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      iframe.style.display = "none";
      return;
    }

    // Remove dot-grid loading state once sketch paints
    iframe.addEventListener("load", function () {
      iframe.classList.remove("h2i-dots");
    }, { once: true });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          entry.target.style.visibility = entry.isIntersecting
            ? "visible"
            : "hidden";
        });
      },
      { threshold: 0 }
    );

    observer.observe(iframe);
    window.__heroSketchObserver = observer;
  }

  /**
   * Clean up hero functionality when navigating away
   */
  function cleanupHero() {
    const header = document.querySelector(".md-header");
    if (header) {
      header.classList.remove("md-header--scrolled");
    }

    // Remove immersive mode class
    document.documentElement.classList.remove("h2i-hero-dark");

    // Call stored cleanup functions
    if (typeof window.__heroScrollCleanup === "function") {
      window.__heroScrollCleanup();
      delete window.__heroScrollCleanup;
    }

    if (typeof window.__heroParallaxCleanup === "function") {
      window.__heroParallaxCleanup();
      delete window.__heroParallaxCleanup;
    }

    // Clean up sketch iframe observer
    if (window.__heroSketchObserver) {
      window.__heroSketchObserver.disconnect();
      delete window.__heroSketchObserver;
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
   * Replace <img> tags pointing to 3D model files (.stl, .step, .stp)
   * with an iframe embed from 3dviewer.net, which handles rendering.
   * Works with files dragged into Obsidian's attachments folder.
   */
  function embed3DModels() {
    var selector = [
      ".stl",
      ".step",
      ".stp",
      ".obj",
      ".3ds",
      ".ply",
      ".gltf",
      ".glb",
    ]
      .map(function (ext) {
        return 'img[src$="' + ext + '"], img[src$="' + ext.toUpperCase() + '"]';
      })
      .join(", ");

    document.querySelectorAll(selector).forEach(function (img) {
      var src = img.getAttribute("src");
      if (!src) return;

      // Build absolute URL so the external viewer can fetch the file
      var fileUrl = new URL(src, window.location.href).href;
      var embedUrl =
        "https://3dviewer.net/embed.html#model=" + encodeURIComponent(fileUrl);

      var wrapper = document.createElement("div");
      wrapper.className = "model-viewer-3d";

      var iframe = document.createElement("iframe");
      iframe.setAttribute("src", embedUrl);
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute("loading", "lazy");
      iframe.setAttribute("frameborder", "0");
      wrapper.appendChild(iframe);

      var parent = img.parentElement;
      if (parent && parent.tagName === "P" && parent.children.length === 1) {
        parent.replaceWith(wrapper);
      } else {
        img.replaceWith(wrapper);
      }
    });
  }

  /**
   * Convert bare YouTube links into embedded iframes.
   *
   * Supports:
   *   https://youtu.be/VIDEO_ID
   *   https://www.youtube.com/watch?v=VIDEO_ID
   *
   * A bare URL on its own line becomes <p><a href="...">...</a></p>.
   * This function replaces that paragraph with a 16:9 iframe embed.
   */
  function embedYouTubeLinks() {
    document
      .querySelectorAll('a[href*="youtube.com/watch"], a[href*="youtu.be/"]')
      .forEach(function (link) {
        var href = link.getAttribute("href");
        if (!href) return;

        var videoId = null;
        var url;
        try {
          url = new URL(href);
        } catch (e) {
          return;
        }

        if (url.hostname === "youtu.be") {
          videoId = url.pathname.slice(1).split("?")[0];
        } else if (
          url.hostname === "www.youtube.com" ||
          url.hostname === "youtube.com"
        ) {
          videoId = url.searchParams.get("v");
        }

        if (!videoId) return;

        var embedUrl = "https://www.youtube.com/embed/" + videoId;

        var wrapper = document.createElement("div");
        wrapper.className = "youtube-embed";

        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", embedUrl);
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute(
          "allow",
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        );
        wrapper.appendChild(iframe);

        var parent = link.parentElement;
        if (
          parent &&
          parent.tagName === "P" &&
          parent.children.length === 1 &&
          parent.textContent.trim() === link.textContent.trim()
        ) {
          parent.replaceWith(wrapper);
        } else {
          link.replaceWith(wrapper);
        }
      });
  }

  /**
   * Convert bare Autodesk A360 links into full-width embedded viewers.
   *
   * Detects <a> tags whose href points to a360.co and replaces the
   * containing <p> (or just the link) with a responsive iframe embed.
   */
  function embedAutodeskLinks() {
    document.querySelectorAll('a[href*="a360.co"]').forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;

      // Build the embed URL — append mode=embed if not already present
      var embedUrl =
        href + (href.indexOf("?") === -1 ? "?" : "&") + "mode=embed";

      var wrapper = document.createElement("div");
      wrapper.className = "autodesk-embed";

      var iframe = document.createElement("iframe");
      iframe.setAttribute("src", embedUrl);
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute("loading", "lazy");
      iframe.setAttribute("frameborder", "0");
      wrapper.appendChild(iframe);

      // If the link is the only child of a <p>, replace the whole paragraph
      var parent = link.parentElement;
      if (
        parent &&
        parent.tagName === "P" &&
        parent.children.length === 1 &&
        parent.textContent.trim() === link.textContent.trim()
      ) {
        parent.replaceWith(wrapper);
      } else {
        link.replaceWith(wrapper);
      }
    });
  }

  /**
   * Convert <img> tags pointing to non-image, non-video, non-3D files
   * into styled download links.
   *
   * When a file (e.g. PDF, ZIP, DOCX) is dragged into Obsidian it creates
   * ![](attachments/file.pdf) which renders as a broken <img>. This function
   * replaces those with a download card showing the file name, extension badge,
   * and a download icon.
   */
  function convertAttachmentLinks() {
    // Extensions already handled natively or by other functions
    var imageExts = [
      ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".ico", ".avif",
    ];
    var videoExts = [".mp4", ".webm", ".ogg", ".mov"];
    var modelExts = [
      ".stl", ".step", ".stp", ".obj", ".3ds", ".ply", ".gltf", ".glb",
    ];
    var handled = [].concat(imageExts, videoExts, modelExts);

    document.querySelectorAll("img[src]").forEach(function (img) {
      var src = img.getAttribute("src");
      if (!src) return;

      var lower = src.toLowerCase();
      // Skip if the extension is already handled
      for (var i = 0; i < handled.length; i++) {
        if (lower.endsWith(handled[i])) return;
      }

      // Extract file name from path
      var parts = src.split("/");
      var fileName = decodeURIComponent(parts[parts.length - 1]);

      // Extract extension for the badge
      var dotIndex = fileName.lastIndexOf(".");
      var ext = dotIndex !== -1 ? fileName.substring(dotIndex + 1).toUpperCase() : "FILE";

      // Build download card
      var card = document.createElement("a");
      card.href = src;
      card.className = "attachment-download";
      card.setAttribute("download", "");
      card.setAttribute("title", "Download " + fileName);

      card.innerHTML =
        '<span class="attachment-download__icon">' +
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
            '<polyline points="7 10 12 15 17 10"/>' +
            '<line x1="12" y1="15" x2="12" y2="3"/>' +
          "</svg>" +
        "</span>" +
        '<span class="attachment-download__info">' +
          '<span class="attachment-download__name">' + fileName + "</span>" +
          '<span class="attachment-download__ext">' + ext + "</span>" +
        "</span>";

      // Replace the img (or its parent <p> if it's the only child)
      var parent = img.parentElement;
      if (parent && parent.tagName === "P" && parent.children.length === 1) {
        parent.replaceWith(card);
      } else {
        img.replaceWith(card);
      }
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

  /**
   * Mark navigation tabs and sidebar items for archived (past-year) courses.
   * Matches any element whose label contains a year pattern like "25/26".
   */
  function markArchivedCourses() {
    var yearTag = /\d{2}\/\d{2}/;

    // Top header tabs — class on both <a> and parent <li> for CSS selectors
    document.querySelectorAll(".md-tabs__link").forEach(function (link) {
      if (yearTag.test(link.textContent)) {
        link.classList.add("archived-course");
        var item = link.closest(".md-tabs__item");
        if (item) item.classList.add("archived-course");
      }
    });

    // Primary sidebar top-level items (the course section headings)
    document.querySelectorAll(".md-nav--primary > .md-nav__list > .md-nav__item").forEach(function (item) {
      var label = item.querySelector(":scope > .md-nav__link, :scope > label > .md-ellipsis");
      if (label && yearTag.test(label.textContent)) {
        item.classList.add("archived-course");
      }
    });
  }

  /**
   * Split the header site name into wordmark + tagline.
   * "H2I - Learning Materials by André Rocha" → two styled spans.
   * Runs once — the header DOM persists across SPA navigations.
   */
  function splitWordmark() {
    var el = document.querySelector(".md-header__topic .md-ellipsis");
    if (!el || el.querySelector(".h2i-wordmark")) return; // already split

    var text = el.textContent.trim();
    var parts = text.split(" - ");
    if (parts.length < 2) return;

    var wordmark = parts[0].trim();
    var tagline = parts.slice(1).join(" - ").trim().replace(" by ", " \u00B7 ");
    el.innerHTML =
      '<span class="h2i-wordmark">' + wordmark + "</span>" +
      '<span class="h2i-tagline">' + tagline + "</span>";
  }

  // Initialize on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      splitWordmark();
      initHero();
      initGanttZoom();
      setupSmoothScroll();
      convertVideoImages();
      embedYouTubeLinks();
      embedAutodeskLinks();
      embed3DModels();
      convertAttachmentLinks();
      markArchivedCourses();
    });
  } else {
    splitWordmark();
    initHero();
    initGanttZoom();
    setupSmoothScroll();
    convertVideoImages();
    embedYouTubeLinks();
    embedAutodeskLinks();
    embed3DModels();
    convertAttachmentLinks();
    markArchivedCourses();
  }

  // Support Zensical's instant navigation
  // Re-initialize when navigating to a new page
  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      initHero();
      initGanttZoom();
      convertVideoImages();
      embedYouTubeLinks();
      embedAutodeskLinks();
      embed3DModels();
      convertAttachmentLinks();
      markArchivedCourses();
    });
  }
})();

/**
 * H2I Chat — "Colega do Lado" Assistant
 *
 * Informal chatbot widget for students. Connects to a FastAPI backend
 * via Cloudflare Tunnel. Persists across SPA navigations.
 */
(function () {
  "use strict";

  // ---- Configuration ----
  var H2I_CHAT_CONFIG = {
    apiEndpoint: "https://chat.hacktoimprove.com",
    maxMessageLength: 1000,
    sessionKey: "h2i-chat-session"
  };

  // ---- State (closure-scoped) ----
  var state = {
    phase: "idle",        // idle | ask-name | ask-turma | ask-numero | ask-share | ask-topic | chatting
    name: "",
    gender: "neutral",    // m | f | neutral
    topic: "",
    topicLabel: "",
    turma: "",            // J | L | M — confirmed by the backend against the class list
    token: "",            // from POST /identify; /chat answers only with it
    share: false,         // consent: may Zé mention this chat to the turma?
    conversationId: "",
    messages: [],          // { role: "user"|"bot", text: string }
    pageContext: null,
    isOpen: false,
    isSending: false
  };

  // ---- Course map ----
  var COURSES = {
    dpi:      { label: "Design de Produto e Intera\u00e7\u00e3o I", slug: "DesignDeProdutoEInteracao" },
    di:       { label: "Design de Inova\u00e7\u00e3o",              slug: "DesignDeInovacao" },
    dpiv:     { label: "Design de Produto IV \u00b7 25/26", slug: "DesignDeProdutoIV" },
    pd:       { label: "Prototipagem Digital \u00b7 25/26", slug: "PrototipagemDigital" },
    recursos: { label: "Recursos",                        slug: "Recursos" },
    geral:    { label: "Geral",                           slug: "" }
  };

  var TOPIC_ORDER = ["dpi", "di", "dpiv", "pd", "recursos", "geral"];
  var TURMAS = ["J", "L", "M"];   // the same students take both courses

  // ---- What Zé says between steps: short, a colleague's, never the same twice
  // in a row. {c} = how students call the course (alternating), {n} = the name.
  var COURSE_SHORT = { dpi: ["DPI", "DP"], di: ["DI"], dpiv: ["Produto IV"],
                       pd: ["Prototipagem Digital", "Prototipagem"], recursos: ["Recursos"], geral: [""] };
  var SAY = {
    hello: [
      "Ah, \u00e9s tu, {n}! \ud83d\ude0a",
      "Ol\u00e1, {n}!",
      "{n}! Tudo bem?",
      "Boas, {n}. \ud83d\ude0a",
      "Ei, {n}."
    ],
    shareYes: [
      "Fixe. Que cadeira?",
      "Combinado. \u00c9 sobre que cadeira?",
      "Ok! Ent\u00e3o, qual \u00e9 a cadeira?"
    ],
    shareNo: [
      "Tranquilo, fica entre n\u00f3s. Que cadeira?",
      "Sem problema, fica entre n\u00f3s. \u00c9 sobre que cadeira?"
    ],
    open: [
      "Bora, {c}. Diz l\u00e1.",
      "{c}, ent\u00e3o. O que \u00e9 que te est\u00e1 a fazer confus\u00e3o?",
      "Ok, {c}. Manda.",
      "{c}\u2026 diz l\u00e1 o que precisas.",
      "{c}. Em que ponto est\u00e1s?",
      "Ah, {c}. Pergunta \u00e0 vontade."
    ],
    openPast: [
      "{c}? Isso j\u00e1 foi o ano passado\u2026 mas diz, que eu ainda me lembro de alguma coisa.",
      "{c}, do ano passado\u2026 vamos l\u00e1 ver se ainda me lembro. Diz."
    ],
    openRecursos: [
      "Recursos\u2026 Fusion, Arduino, p5? Diz l\u00e1.",
      "Ok, recursos. O que \u00e9 que procuras?"
    ],
    // on a page of the chosen course: it's obvious, no need to name it
    openHere: [
      "Diz l\u00e1.",
      "Ok, manda.",
      "Em que ponto est\u00e1s?",
      "O que \u00e9 que te est\u00e1 a fazer confus\u00e3o?",
      "Diz, diz."
    ],
    openGeral: [
      "Ok, \u00e0 vontade. O que \u00e9?",
      "Diz l\u00e1, que eu vejo em que cadeira est\u00e1."
    ],
    late: [
      "A esta hora? \ud83d\ude34 ",
      "Ainda por aqui a esta hora? "
    ],
    early: [
      "T\u00e3o cedo\u2026 \u2615 "
    ],
    back: [
      "Onde \u00e9 que \u00edamos\u2026",
      "Onde \u00e9 que \u00edamos\u2026 ah, {c}.",
      "{c}, ainda. Diz."
    ]
  };
  var lastSaid = {};

  function say(kind, vars) {
    var opts = SAY[kind], i;
    do { i = Math.floor(Math.random() * opts.length); } while (opts.length > 1 && i === lastSaid[kind]);
    lastSaid[kind] = i;
    return opts[i].replace(/\{(\w)\}/g, function (_, k) { return escapeHtml((vars || {})[k] || ""); });
  }

  /** The line after picking a course — with a yawn at night, a coffee at dawn. */
  function shortName(key) {
    var names = COURSE_SHORT[key] || [(COURSES[key] && COURSES[key].label) || ""];
    return names[Math.floor(Math.random() * names.length)];
  }

  function opener(key) {
    var c = shortName(key);
    var here = (state.pageContext || detectCourseContext()).course === key;
    var line = key === "geral" ? say("openGeral")
      : here && Math.random() < 0.6 ? say("openHere")
      : key === "recursos" ? say("openRecursos")
      : (key === "dpiv" || key === "pd") ? say("openPast", { c: c })
      : say("open", { c: c });
    var h = new Date().getHours();
    if ((h >= 23 || h < 6) && Math.random() < 0.6) line = say("late") + line;
    else if (h >= 6 && h < 8 && Math.random() < 0.5) line = say("early") + line;
    return line;
  }

  // ---- DOM refs ----
  var els = {};

  // =========================================================================
  //  Initialization
  // =========================================================================

  function initChat() {
    ensureChatWidget();
    loadSession();
    updateChatContext();
  }

  /** Create widget DOM once — idempotent across SPA navigations. */
  function ensureChatWidget() {
    if (document.querySelector(".h2i-chat")) return;

    var root = document.createElement("div");
    root.className = "h2i-chat";
    root.innerHTML =
      '<button class="h2i-chat__toggle" type="button" aria-label="Abrir chat">' +
        '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>' +
        "</svg>" +
      "</button>" +
      '<div class="h2i-chat__panel">' +
        '<div class="h2i-chat__header">' +
          '<div class="h2i-chat__avatar">Z</div>' +
          '<div class="h2i-chat__header-info">' +
            '<div class="h2i-chat__header-title">Z\u00e9</div>' +
            '<div class="h2i-chat__header-subtitle">Colega virtual \u00b7 IA</div>' +
          '</div>' +
          '<button class="h2i-chat__close" type="button" aria-label="Fechar chat">' +
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
              '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>' +
            "</svg>" +
          "</button>" +
        "</div>" +
        '<div class="h2i-chat__messages"></div>' +
        '<div class="h2i-chat__input-area">' +
          '<textarea class="h2i-chat__input" rows="1" placeholder="Escreve aqui\u2026"' +
            ' maxlength="' + H2I_CHAT_CONFIG.maxMessageLength + '"></textarea>' +
          '<button class="h2i-chat__send" type="button" aria-label="Enviar" disabled>' +
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
              '<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>' +
            "</svg>" +
          "</button>" +
        "</div>" +
        '<div class="h2i-chat__disclaimer">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:-1px;margin-right:4px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' +
          "O Z\u00e9 \u00e9 experimental e pode dar respostas incorretas. " +
          "\u00c9 um auxiliar n\u00e3o vinculativo que n\u00e3o substitui a leitura dos " +
          "documentos e conte\u00fados fornecidos nesta plataforma." +
        "</div>" +
      "</div>";

    document.body.appendChild(root);

    els.root     = root;
    els.toggle   = root.querySelector(".h2i-chat__toggle");
    els.panel    = root.querySelector(".h2i-chat__panel");
    els.close    = root.querySelector(".h2i-chat__close");
    els.messages = root.querySelector(".h2i-chat__messages");
    els.input    = root.querySelector(".h2i-chat__input");
    els.send     = root.querySelector(".h2i-chat__send");

    // ---- Event listeners ----
    els.toggle.addEventListener("click", toggleChat);
    els.close.addEventListener("click", closeChat);
    els.send.addEventListener("click", function () { sendMessage(); });

    els.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    els.input.addEventListener("input", function () {
      els.send.disabled = !els.input.value.trim() || state.isSending;
      // Auto-resize
      els.input.style.height = "auto";
      els.input.style.height = Math.min(els.input.scrollHeight, 100) + "px";
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.isOpen) closeChat();
    });
  }

  // =========================================================================
  //  Toggle / Close
  // =========================================================================

  function toggleChat() {
    if (state.isOpen) { closeChat(); return; }

    state.isOpen = true;
    els.root.classList.add("h2i-chat--open");

    if (state.phase === "idle") startOnboarding();

    els.input.focus();
    scrollToBottom();
  }

  function closeChat() {
    state.isOpen = false;
    els.root.classList.remove("h2i-chat--open");
  }

  // =========================================================================
  //  Onboarding
  // =========================================================================

  var GREETING =
    "Ol\u00e1! \ud83d\udc4b Sou o <strong>Z\u00e9</strong>, o teu colega do lado \u2014 " +
    "estou aqui para te ajudar com as mat\u00e9rias das aulas." +
    "<br><br><small>Sou um colega virtual (IA): s\u00f3 conhe\u00e7o os materiais deste site " +
    "e posso enganar-me. S\u00f3 falo com estudantes das turmas. As perguntas ficam registadas " +
    "sem o teu nome \u2014 s\u00f3 em caso de abuso o professor pode saber de quem s\u00e3o.</small>" +
    "<br><br>Como te chamas?";

  function startOnboarding() {
    state.phase = "ask-name";
    appendMessage("bot", GREETING);
    saveSession();
  }

  function handleNameResponse(name) {
    state.name = name.trim();
    state.gender = inferGender(state.name);
    state.phase = "ask-turma";
    showTurmaQuestion();
    saveSession();
  }

  /**
   * Simple Portuguese gender heuristic based on first name.
   * Returns "m", "f", or "neutral".
   */
  function inferGender(name) {
    var n = name.toLowerCase().trim().split(/\s+/)[0];

    var male = [
      "duarte", "henrique", "jorge", "jos\u00e9", "jose", "nuno", "rui",
      "sim\u00e3o", "simao", "tom\u00e9", "tome", "vicente", "afonso",
      "guilherme", "gon\u00e7alo", "goncalo", "vasco", "xavier"
    ];
    var female = [
      "in\u00eas", "ines", "beatriz", "raquel", "isabel", "catarina",
      "madalena", "leonor", "alice", "matilde", "carmen", "flor",
      "pilar", "mercedes", "dolores"
    ];

    if (male.indexOf(n) !== -1) return "m";
    if (female.indexOf(n) !== -1) return "f";
    if (n.endsWith("a")) return "f";
    if (n.endsWith("o") || n.endsWith("or") || n.endsWith("el")) return "m";
    return "neutral";
  }

  function showTopicSelection() {
    var html = '<div class="h2i-chat__topics">';
    for (var i = 0; i < TOPIC_ORDER.length; i++) {
      var key = TOPIC_ORDER[i];
      html +=
        '<button class="h2i-chat__topic-btn" data-topic="' + key + '">' +
        COURSES[key].label + "</button>";
    }
    html += "</div>";
    appendMessage("bot", html);

    // Bind click events on topic buttons
    var btns = els.messages.querySelectorAll(".h2i-chat__topic-btn");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        handleTopicSelection(btn.getAttribute("data-topic"));
      });
    });
  }

  function handleTopicSelection(key) {
    var course = COURSES[key];
    if (!course) return;
    state.topic = key;
    state.topicLabel = course.label;
    appendMessage("user", escapeHtml(course.label));
    disableButtons("[data-topic]");
    startChatting();
  }

  function disableButtons(selector) {
    els.messages.querySelectorAll(selector).forEach(function (btn) {
      btn.disabled = true;
      btn.style.opacity = "0.5";
    });
  }

  function buttons(attr, items) {
    var html = '<div class="h2i-chat__topics">';
    for (var i = 0; i < items.length; i++) {
      html += '<button class="h2i-chat__topic-btn" ' + attr + '="' + escapeHtml(items[i][0]) +
        '">' + escapeHtml(items[i][1]) + "</button>";
    }
    return html + "</div>";
  }

  function bindButtons(attr, handler) {
    els.messages.querySelectorAll("[" + attr + "]:not([disabled])").forEach(function (btn) {
      btn.addEventListener("click", function () { handler(btn.getAttribute(attr)); });
    });
  }

  function showTurmaQuestion() {
    appendMessage("bot", "E de que turma \u00e9s?" +
      buttons("data-turma", TURMAS.map(function (t) { return [t, "Turma " + t]; })));
    bindButtons("data-turma", handleTurmaSelection);
  }

  function handleTurmaSelection(turma) {
    state.turma = String(turma).toUpperCase();
    appendMessage("user", escapeHtml("Turma " + state.turma));
    disableButtons("[data-turma]");
    identify("");
  }

  // The backend checks name + turma (+ student number when in doubt) against
  // the class list. Only a student on it gets a token; /chat needs the token.
  function identify(numero) {
    state.isSending = true;
    showTyping();
    fetch(H2I_CHAT_CONFIG.apiEndpoint + "/identify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: state.name, turma: state.turma, numero: numero || "" })
    })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      hideTyping();
      state.isSending = false;
      if (d.ok) {
        state.token = d.token;
        state.name = d.name || state.name;
        state.turma = d.turma || state.turma;
        appendMessage("bot", say("hello", { n: state.name }));
        state.phase = "ask-share";
        showShareQuestion();
      } else if (d.status === "need_number") {
        state.phase = "ask-numero";
        appendMessage("bot", escapeHtml(d.say));
      } else {
        forgetIdentity();
        appendMessage("bot", escapeHtml(d.say ||
          "Desculpa, mas n\u00e3o te estou a conhecer\u2026 podes repetir, sff?"));
      }
      saveSession();
    })
    .catch(function (err) {
      hideTyping();
      handleError(err);
    });
  }

  function forgetIdentity() {
    state.token = "";
    state.turma = "";
    state.name = "";
    state.conversationId = "";
    state.phase = "ask-name";
  }

  // Consent before Zé mentions this student to anyone else.
  var SHARE_QUESTION =
    "S\u00f3 mais uma coisa\u2026 \ud83d\ude0a \u00c0s vezes os colegas da turma perguntam-me " +
    "as mesmas coisas. Posso dizer-lhes que tamb\u00e9m falaste comigo sobre isso? " +
    "S\u00f3 digo o teu nome e o tema \u2014 nunca os pormenores.";

  function showShareQuestion() {
    appendMessage("bot", SHARE_QUESTION +
      buttons("data-share", [["1", "Pode ser"], ["0", "Prefiro que n\u00e3o"]]));
    bindButtons("data-share", function (v) { handleShare(v === "1"); });
  }

  function handleShare(yes) {
    state.share = !!yes;
    appendMessage("user", yes ? "Pode ser" : "Prefiro que n\u00e3o");
    disableButtons("[data-share]");
    state.phase = "ask-topic";
    appendMessage("bot", say(yes ? "shareYes" : "shareNo"));
    showTopicSelection();
    saveSession();
  }

  function startChatting() {
    state.phase = "chatting";
    appendMessage("bot", opener(state.topic));
    els.input.focus();
    saveSession();
  }

  // =========================================================================
  //  Course context detection (from URL)
  // =========================================================================

  function detectCourseContext() {
    // Path under the site root, e.g. "DesignDeInovacao/Sumarios/aula2/".
    // Sent whole as page_slug; the backend resolves it against its index,
    // so the course list here never has to mirror the site's folders.
    var path = window.location.pathname
      .replace(/^.*?\/classes\//, "").replace(/^\/+/, "");
    var top = path.split("/")[0].toLowerCase();
    var courseKey = top === "resources" ? "recursos" : null;
    for (var k in COURSES) {
      if (COURSES[k].slug && COURSES[k].slug.toLowerCase() === top) { courseKey = k; break; }
    }
    return { course: courseKey, page: path || null };
  }

  /** Called on every SPA navigation — only updates context, never re-creates DOM. */
  function updateChatContext() {
    state.pageContext = detectCourseContext();
  }

  // =========================================================================
  //  Messaging
  // =========================================================================

  function sendMessage(text) {
    text = text || els.input.value.trim();
    if (!text || state.isSending) return;
    if (text.length > H2I_CHAT_CONFIG.maxMessageLength) {
      text = text.substring(0, H2I_CHAT_CONFIG.maxMessageLength);
    }

    // Handle onboarding name phase
    if (state.phase === "ask-name") {
      els.input.value = "";
      els.input.style.height = "auto";
      els.send.disabled = true;
      appendMessage("user", escapeHtml(text));
      handleNameResponse(text);
      return;
    }

    // Typed instead of clicked during onboarding
    if (state.phase === "ask-turma" || state.phase === "ask-share" || state.phase === "ask-numero") {
      els.input.value = "";
      els.input.style.height = "auto";
      els.send.disabled = true;
      if (state.phase === "ask-turma") {
        // J/L/M are the buttons; X is the test turma, typed ("TX"), never offered
        var t = text.toUpperCase().match(/([JLMX])\s*$/);
        if (t) { handleTurmaSelection(t[1]); } else { appendMessage("user", escapeHtml(text)); disableButtons("[data-turma]"); showTurmaQuestion(); }
      } else if (state.phase === "ask-numero") {
        appendMessage("user", escapeHtml(text));
        identify(text.replace(/\D/g, ""));
      } else {
        handleShare(/^\s*(sim|pode|ok|claro|s)\b/i.test(text));
      }
      return;
    }

    if (state.phase !== "chatting") return;

    // Regular chat message
    appendMessage("user", escapeHtml(text));
    els.input.value = "";
    els.input.style.height = "auto";
    els.send.disabled = true;

    state.messages.push({ role: "user", text: text });
    saveSession();
    sendToBackend(text);
  }

  function appendMessage(role, html) {
    var div = document.createElement("div");
    div.className = "h2i-chat__message h2i-chat__message--" + role;
    div.innerHTML = html;
    els.messages.appendChild(div);
    scrollToBottom();
    return div;
  }

  /** Zé's reply as text nodes (never innerHTML); only site links become <a>. */
  function renderBotText(el, text) {
    el.textContent = "";
    el.classList.add("h2i-chat__message--text");
    var re = /(?:https?:\/\/)?(?:www\.)?hacktoimprove\.com\/[^\s<>"')\]]*/g;
    var last = 0, m;
    while ((m = re.exec(text)) !== null) {
      var url = m[0].replace(/[.,;:!?\u00bb]+$/, "");
      el.appendChild(document.createTextNode(text.slice(last, m.index)));
      var a = document.createElement("a");
      a.href = /^https?:/.test(url) ? url : "https://" + url;
      a.textContent = url;
      el.appendChild(a);
      last = m.index + url.length;
      re.lastIndex = last;
    }
    el.appendChild(document.createTextNode(text.slice(last)));
  }

  function showTyping() {
    var div = document.createElement("div");
    div.className = "h2i-chat__typing";
    div.id = "h2i-chat-typing";
    div.innerHTML =
      '<span class="h2i-chat__typing-dot"></span>' +
      '<span class="h2i-chat__typing-dot"></span>' +
      '<span class="h2i-chat__typing-dot"></span>';
    els.messages.appendChild(div);
    scrollToBottom();
  }

  function hideTyping() {
    var el = document.getElementById("h2i-chat-typing");
    if (el) el.remove();
  }

  function scrollToBottom() {
    if (els.messages) els.messages.scrollTop = els.messages.scrollHeight;
  }

  // =========================================================================
  //  Backend communication (POST + SSE stream via ReadableStream)
  // =========================================================================

  function sendToBackend(text) {
    state.isSending = true;
    showTyping();

    var ctx = state.pageContext || detectCourseContext();
    var body = {
      name: state.name,
      gender: state.gender,
      message: text,
      course_context: state.topic,
      page_slug: ctx.page || "",
      conversation_id: state.conversationId || "",
      token: state.token || "",
      partilhar: !!state.share
    };

    fetch(H2I_CHAT_CONFIG.apiEndpoint + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    .then(function (response) {
      if (response.status === 401) {
        // token expired or not ours: introduce yourself again
        return response.json().then(function (d) {
          hideTyping();
          state.isSending = false;
          forgetIdentity();
          appendMessage("bot", escapeHtml((d && d.say) ||
            "Desculpa, mas n\u00e3o te estou a conhecer\u2026 podes repetir, sff?") +
            "<br><br>Como te chamas?");
          saveSession();
        });
      }
      if (!response.ok) throw new Error("HTTP " + response.status);

      var convId = response.headers.get("X-Conversation-Id");
      if (convId) state.conversationId = convId;
      // "afinal é DPI": the backend switched course — follow it
      var course = response.headers.get("X-Course");
      if (course && COURSES[course] && course !== state.topic) {
        state.topic = course;
        state.topicLabel = COURSES[course].label;
      }

      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var botText = "";

      hideTyping();
      var bubble = document.createElement("div");
      bubble.className = "h2i-chat__message h2i-chat__message--bot";
      els.messages.appendChild(bubble);

      // SSE: a network read can end mid-line, so keep the partial line in
      // `buffer`; an event ends at a blank line and its data: lines join
      // with "\n" (that is how the reply keeps its paragraphs).
      var buffer = "";
      var dataLines = [];

      function endEvent() {
        if (!dataLines.length) return false;
        var data = dataLines.join("\n");
        dataLines = [];
        if (data === "[DONE]") return true;
        botText += data;
        renderBotText(bubble, botText);
        scrollToBottom();
        return false;
      }

      function read() {
        return reader.read().then(function (result) {
          if (result.done) { endEvent(); finish(); return; }

          buffer += decoder.decode(result.value, { stream: true });
          var lines = buffer.split("\n");
          buffer = lines.pop();
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].replace(/\r$/, "");
            if (line === "") {
              if (endEvent()) { finish(); return; }
            } else if (line.indexOf("data:") === 0) {
              var v = line.substring(5);
              dataLines.push(v.charAt(0) === " " ? v.substring(1) : v);
            }
          }
          return read();
        });
      }

      function finish() {
        state.isSending = false;
        els.send.disabled = !els.input.value.trim();
        if (botText) state.messages.push({ role: "bot", text: botText });
        else bubble.remove();   // Zé chose not to answer (off topic, again)
        saveSession();
      }

      return read();
    })
    .catch(function (err) {
      hideTyping();
      handleError(err);
    });
  }

  function handleError(err) {
    state.isSending = false;
    els.send.disabled = !els.input.value.trim();
    console.warn("[H2I Chat]", err);
    appendMessage("bot",
      "\ud83d\ude05 Desculpa, n\u00e3o consegui ligar-me ao servidor. " +
      "Tenta outra vez daqui a pouco, ou pergunta diretamente ao professor."
    );
  }

  // =========================================================================
  //  Session persistence (sessionStorage)
  // =========================================================================

  function loadSession() {
    try {
      var raw = sessionStorage.getItem(H2I_CHAT_CONFIG.sessionKey);
      if (!raw) return;
      var d = JSON.parse(raw);
      state.name           = d.name           || "";
      state.gender         = d.gender         || "neutral";
      state.topic          = d.topic          || "";
      state.topicLabel     = d.topicLabel     || "";
      state.turma          = d.turma          || "";
      state.token          = d.token          || "";
      state.share          = !!d.share;
      state.phase          = d.phase          || "idle";
      state.conversationId = d.conversationId || "";
      state.messages       = d.messages       || [];
      if (state.phase !== "idle") restoreChat();
    } catch (e) { /* start fresh */ }
  }

  function saveSession() {
    try {
      sessionStorage.setItem(H2I_CHAT_CONFIG.sessionKey, JSON.stringify({
        name:           state.name,
        gender:         state.gender,
        topic:          state.topic,
        topicLabel:     state.topicLabel,
        turma:          state.turma,
        token:          state.token,
        share:          state.share,
        phase:          state.phase,
        conversationId: state.conversationId,
        messages:       state.messages.slice(-50)
      }));
    } catch (e) { /* storage full — ignore */ }
  }

  /** Re-render stored state into the messages pane. */
  function restoreChat() {
    els.messages.innerHTML = "";

    if (state.phase === "ask-name") {
      appendMessage("bot", GREETING);
    } else if (state.phase === "ask-turma") {
      appendMessage("bot", GREETING);
      appendMessage("user", escapeHtml(state.name));
      showTurmaQuestion();
    } else if (state.phase === "ask-numero") {
      appendMessage("bot", "Qual \u00e9 o teu n\u00famero de estudante?");
    } else if (state.phase === "ask-share") {
      showShareQuestion();
    } else if (state.phase === "ask-topic") {
      appendMessage("bot", "Sobre que cadeira queres falar?");
      showTopicSelection();
    } else if (state.phase === "chatting") {
      // Brief context line, then replay messages
      appendMessage("bot", say("back", { c: shortName(state.topic) }));
      for (var i = 0; i < state.messages.length; i++) {
        var m = state.messages[i];
        if (m.role === "bot") renderBotText(appendMessage("bot", ""), m.text);
        else appendMessage(m.role, escapeHtml(m.text));
      }
    }
  }

  // =========================================================================
  //  Utilities
  // =========================================================================

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // =========================================================================
  //  Bootstrap
  // =========================================================================

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChat);
  } else {
    initChat();
  }

  // SPA navigation — update context only (widget persists)
  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      updateChatContext();
    });
  }
})();
