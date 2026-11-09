/* ==========================================================================
   AIBE — site behaviour
   Edit LINKS below and every button on every page updates.
   ========================================================================== */

const LINKS = {
  // Paste the Discord invite here, e.g. "https://discord.gg/abc123"
  discord:   "",
  // Paste the Instagram profile URL here, e.g. "https://instagram.com/aibe.uiuc"
  instagram: "",
  // Paste the join / interest form URL here (Google Form, Illinois Connection, etc.)
  joinForm:  "",
  // Paste the newsletter signup URL here
  newsletter: "",
  // Club email
  email:     "aibe.uiuc@gmail.com",
  // Illinois Connection RSO page
  rso:       ""
};

(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------------------------------------------------------------- links */
  function wireLinks() {
    $$("[data-link]").forEach((el) => {
      const key = el.dataset.link;
      const url = key === "email" ? (LINKS.email ? "mailto:" + LINKS.email : "") : LINKS[key];
      if (url) {
        el.setAttribute("href", url);
        el.removeAttribute("aria-disabled");
        if (key !== "email" && !url.startsWith("mailto:")) {
          el.setAttribute("target", "_blank");
          el.setAttribute("rel", "noopener");
        }
        const live = el.querySelector("[data-when-live]");
        if (live) el.textContent = live.dataset.whenLive || live.textContent;
      } else {
        el.setAttribute("href", "#");
        el.setAttribute("aria-disabled", "true");
        el.setAttribute("title", "Link coming soon");
        el.addEventListener("click", (e) => e.preventDefault());
      }
    });
    $$("[data-link-text='email']").forEach((el) => { el.textContent = LINKS.email; });
  }

  /* ------------------------------------------------------------------ nav */
  function wireNav() {
    const nav = $(".nav");
    if (!nav) return;
    const burger = $(".nav__burger", nav);
    const hero = $(".hero");

    if (burger) {
      burger.addEventListener("click", () => {
        const open = nav.dataset.open === "true";
        nav.dataset.open = String(!open);
        burger.setAttribute("aria-expanded", String(!open));
      });
      $$(".nav__link, .nav__cta", nav).forEach((a) =>
        a.addEventListener("click", () => {
          nav.dataset.open = "false";
          burger.setAttribute("aria-expanded", "false");
        })
      );
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && nav.dataset.open === "true") {
          nav.dataset.open = "false";
          burger.setAttribute("aria-expanded", "false");
          burger.focus();
        }
      });
    }

    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle("nav--stuck", y > 24);
      if (hero) {
        const threshold = hero.offsetHeight - 76;
        nav.classList.toggle("nav--over", y < threshold);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  /* --------------------------------------------------------------- reveal */
  function wireReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;
    if (reduced.matches || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -11% 0px", threshold: 0.06 }
    );
    items.forEach((el) => io.observe(el));

    // Automatic stagger for direct children of [data-stagger]
    $$("[data-stagger]").forEach((group) => {
      const step = parseInt(group.dataset.stagger, 10) || 70;
      Array.from(group.children).forEach((child, i) => {
        if (child.hasAttribute("data-reveal")) child.style.setProperty("--d", i * step + "ms");
      });
    });
  }

  /* ---------------------------------------------------------------- spine */
  function wireSpine() {
    const spine = $(".spine");
    if (!spine) return;
    const sections = $$("section[id][data-spine]");
    if (sections.length < 2) { spine.remove(); return; }

    const list = $(".spine__list", spine);
    const fill = $(".spine__fill", spine);
    const dots = sections.map((sec) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "spine__dot";
      a.href = "#" + sec.id;
      a.setAttribute("aria-label", "Jump to " + (sec.dataset.spine || sec.id));
      a.innerHTML = '<i aria-hidden="true"></i><b>' + (sec.dataset.spine || sec.id) + "</b>";
      li.appendChild(a);
      list.appendChild(li);
      return a;
    });

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      fill.style.height = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + "%";
      let active = 0;
      sections.forEach((sec, i) => {
        if (sec.getBoundingClientRect().top <= window.innerHeight * 0.42) active = i;
      });
      dots.forEach((d, i) => d.setAttribute("aria-current", String(i === active)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---------------------------------------------------------------- stats */
  function wireCounters() {
    const nums = $$("[data-count]");
    if (!nums.length) return;
    if (reduced.matches || !("IntersectionObserver" in window)) {
      nums.forEach((n) => { n.textContent = n.dataset.count + (n.dataset.suffix || ""); });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        io.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        const dur = 1100;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
  }

  /* ----------------------------------------------------------- hero media */
  // Ambient "growth trajectory" field: the logo's rising line + nodes, in motion.
  // Used on its own, or as the backdrop until assets/hero.mp4 is available.
  function heroCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, raf = 0, nodes = [], bars = [], running = false;

    const NAVY = "#02162E";
    const TEAL = [79, 209, 178];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      const density = Math.round((w * h) / 26000);
      const count = Math.max(26, Math.min(88, density));
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.14,
          vy: (Math.random() - 0.5) * 0.14,
          r: Math.random() * 1.7 + 0.8,
          a: Math.random() * 0.45 + 0.28
        });
      }
      // Rising bars — the chart inside the mark. Kept to the open right half,
      // where the hero scrim is lightest and no copy sits on top of them.
      bars = [];
      const bw = Math.max(26, w * 0.03);
      for (let i = 0; i < 5; i++) {
        bars.push({
          x: w * 0.6 + i * bw * 1.9,
          base: h * (0.2 + i * 0.1),
          amp: h * 0.035,
          phase: i * 0.9
        });
      }
    }

    function frame(t) {
      const time = t * 0.001;
      ctx.fillStyle = NAVY;
      ctx.fillRect(0, 0, w, h);

      // glow
      const g = ctx.createRadialGradient(w * 0.78, h * 0.78, 0, w * 0.78, h * 0.78, Math.max(w, h) * 0.7);
      g.addColorStop(0, "rgba(18,134,115,.46)");
      g.addColorStop(0.5, "rgba(12,74,96,.18)");
      g.addColorStop(1, "rgba(2,22,46,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.62, h * 0.08, 0, w * 0.62, h * 0.08, Math.max(w, h) * 0.6);
      g2.addColorStop(0, "rgba(30,96,158,.34)");
      g2.addColorStop(1, "rgba(2,22,46,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // bars
      bars.forEach((b, i) => {
        const hgt = b.base + Math.sin(time * 0.55 + b.phase) * b.amp;
        const grad = ctx.createLinearGradient(0, h, 0, h - hgt);
        grad.addColorStop(0, "rgba(18,134,115,0)");
        grad.addColorStop(1, "rgba(79,209,178," + (0.16 + i * 0.03) + ")");
        ctx.fillStyle = grad;
        const bw = Math.max(22, w * 0.024);
        ctx.beginPath();
        ctx.roundRect(b.x, h - hgt, bw, hgt, [bw * 0.3, bw * 0.3, 0, 0]);
        ctx.fill();
      });

      // network
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -40) n.x = w + 40; if (n.x > w + 40) n.x = -40;
        if (n.y < -40) n.y = h + 40; if (n.y > h + 40) n.y = -40;
      }
      const maxD = Math.min(190, Math.max(110, w * 0.11));
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > maxD * maxD) continue;
          const o = (1 - Math.sqrt(d2) / maxD) * 0.28;
          ctx.strokeStyle = "rgba(" + TEAL[0] + "," + TEAL[1] + "," + TEAL[2] + "," + o + ")";
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = "rgba(" + TEAL[0] + "," + TEAL[1] + "," + TEAL[2] + "," + n.a + ")";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // the trajectory — the logo's rising line, sweeping
      const pts = [
        [w * 0.34, h * 0.9], [w * 0.5, h * 0.66], [w * 0.64, h * 0.74],
        [w * 0.78, h * 0.4], [w * 0.9, h * 0.47], [w * 1.04, h * 0.14]
      ].map((p, i) => [p[0], p[1] + Math.sin(time * 0.42 + i * 0.8) * h * 0.016]);

      ctx.strokeStyle = "rgba(79,209,178,.62)";
      ctx.lineWidth = 2.4;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i - 1], c = pts[i];
        ctx.bezierCurveTo((p[0] + c[0]) / 2, p[1], (p[0] + c[0]) / 2, c[1], c[0], c[1]);
      }
      ctx.stroke();

      pts.forEach((p, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(time * 1.5 - i * 0.7);
        ctx.fillStyle = "rgba(79,209,178," + (0.25 + pulse * 0.6) + ")";
        ctx.beginPath();
        ctx.arc(p[0], p[1], 3.4 + pulse * 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(79,209,178,.22)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 9 + pulse * 7, 0, Math.PI * 2);
        ctx.stroke();
      });

      if (running) raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduced.matches) { frame(0); return; }

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
    const stop  = () => { running = false; cancelAnimationFrame(raf); };
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((e) => (e[0].isIntersecting ? start() : stop()), { threshold: 0 }).observe(canvas);
    } else { start(); }
    start();
  }

  function wireHero() {
    const media = $(".hero__media");
    if (!media) return;
    const canvas = $("canvas", media);
    if (canvas) heroCanvas(canvas);

    const video = $("video", media);
    if (video) {
      // Only hand over to the video once it can actually play.
      const ok = () => { if (video.readyState >= 3) media.dataset.video = "on"; };
      video.addEventListener("canplay", ok, { once: true });
      video.addEventListener("error", () => media.removeAttribute("data-video"));
      if (reduced.matches) { video.removeAttribute("autoplay"); video.pause(); }
      else { const p = video.play(); if (p && p.catch) p.catch(() => {}); }
    }

    // Gentle parallax — transform only, so it stays on the compositor.
    if (!reduced.matches) {
      const layer = media;
      let ticking = false;
      window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = Math.min(window.scrollY, window.innerHeight);
          layer.style.transform = "translate3d(0," + y * 0.16 + "px,0) scale(" + (1 + y * 0.00012) + ")";
          ticking = false;
        });
      }, { passive: true });
    }

    // Draw the underline on the hero's accent word once it's painted.
    const accent = $(".hero h1 .accent");
    if (accent) requestAnimationFrame(() => accent.style.setProperty("--underline", "100%"));
  }

  /* ----------------------------------------------------------------- year */
  function wireYear() {
    $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireLinks(); wireNav(); wireReveal(); wireSpine();
    wireCounters(); wireHero(); wireYear();
  });
})();
