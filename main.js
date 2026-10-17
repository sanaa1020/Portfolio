// ============================================================
//  Sana, Portfolio: interactions
// ============================================================

(function () {
  "use strict";

  // ---- Current year in footer ----
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // ---- Nav: add border after scrolling past the top ----
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add("nav--scrolled");
    } else {
      nav.classList.remove("nav--scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Scroll reveal with IntersectionObserver ----
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // ---- Dark mode toggle (respects system preference, persists choice) ----
  var toggle = document.getElementById("themeToggle");
  var root = document.documentElement;
  var STORAGE_KEY = "sana-theme";

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      if (toggle) toggle.querySelector(".theme-toggle__icon").textContent = "☀";
    } else {
      root.removeAttribute("data-theme");
      if (toggle) toggle.querySelector(".theme-toggle__icon").textContent = "☾";
    }
  }

  // Initial theme: saved choice > system preference > light
  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    saved = null;
  }

  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      var next = isDark ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* ignore storage errors */
      }
    });
  }
})();

// ============================================================
//  Mouse trail (cherry-red particles)
// ============================================================
(function () {
  "use strict";

  var canvas = document.getElementById("trail");
  if (!canvas) return;

  // Skip on touch-only devices and when reduced motion is requested
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  if (reduce || isTouch) {
    canvas.style.display = "none";
    return;
  }

  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var particles = [];
  var w = 0;
  var h = 0;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  // Cherry-red palette
  var colors = ["#9e2a2a", "#7a1f1f", "#c23b3b", "#d96a6a"];

  function spawn(x, y) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8 + 0.4,
      r: 3 + Math.random() * 4,
      life: 1,
      color: colors[(Math.random() * colors.length) | 0],
    });
    // cap the array for performance
    if (particles.length > 160) particles.splice(0, particles.length - 160);
  }

  var lastX = null;
  var lastY = null;
  window.addEventListener(
    "mousemove",
    function (e) {
      // Spawn a few particles between the previous and current point
      if (lastX !== null) {
        var dx = e.clientX - lastX;
        var dy = e.clientY - lastY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var steps = Math.min(4, Math.max(1, (dist / 8) | 0));
        for (var i = 0; i < steps; i++) {
          var t = i / steps;
          spawn(lastX + dx * t, lastY + dy * t);
        }
      } else {
        spawn(e.clientX, e.clientY);
      }
      lastX = e.clientX;
      lastY = e.clientY;
    },
    { passive: true }
  );

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = Math.max(0, p.life) * 0.85;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// ============================================================
//  Clickable cherries (pop on click)
// ============================================================
(function () {
  "use strict";

  var cherries = document.querySelectorAll(".cherry");
  if (!cherries.length) return;

  cherries.forEach(function (cherry) {
    cherry.addEventListener("click", function () {
      cherry.classList.remove("is-popped");
      // force reflow so the animation retriggers on repeated clicks
      void cherry.offsetWidth;
      cherry.classList.add("is-popped");
    });
    cherry.addEventListener("animationend", function () {
      cherry.classList.remove("is-popped");
    });
  });
})();

// ============================================================
//  Image carousel (Achievements)
// ============================================================
(function () {
  "use strict";

  var carousel = document.getElementById("carousel");
  var track = document.getElementById("carouselTrack");
  var dotsWrap = document.getElementById("carouselDots");
  if (!carousel || !track) return;

  var slides = track.children;
  var count = slides.length;
  if (!count) return;

  var index = 0;

  // Build dots
  var dots = [];
  for (var i = 0; i < count; i++) {
    (function (i) {
      var dot = document.createElement("button");
      dot.className = "carousel__dot";
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Go to image " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    })(i);
  }

  function render() {
    track.style.transform = "translateX(" + -index * 100 + "%)";
    for (var i = 0; i < dots.length; i++) {
      if (i === index) {
        dots[i].classList.add("is-active");
        dots[i].setAttribute("aria-selected", "true");
      } else {
        dots[i].classList.remove("is-active");
        dots[i].setAttribute("aria-selected", "false");
      }
    }
  }

  function goTo(i) {
    index = (i + count) % count;
    render();
  }
  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }

  var prevBtn = document.getElementById("carouselPrev");
  var nextBtn = document.getElementById("carouselNext");
  if (prevBtn) prevBtn.addEventListener("click", prev);
  if (nextBtn) nextBtn.addEventListener("click", next);

  // Keyboard arrows when the carousel is focused/hovered
  carousel.setAttribute("tabindex", "0");
  carousel.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      prev();
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      next();
      e.preventDefault();
    }
  });

  // Touch swipe
  var startX = 0;
  var swiping = false;
  track.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
      swiping = true;
    },
    { passive: true }
  );
  track.addEventListener(
    "touchend",
    function (e) {
      if (!swiping) return;
      swiping = false;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) next();
        else prev();
      }
    },
    { passive: true }
  );

  // Autoplay, paused on hover/focus and when reduced motion is preferred
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timer = null;
  function start() {
    if (reduce || timer) return;
    timer = setInterval(next, 4500);
  }
  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);

  render();
  start();
})();
