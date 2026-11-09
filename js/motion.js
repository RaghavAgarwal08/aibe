/* ==========================================================================
   AIBE — motion
   Scroll-linked parallax, 3D pointer tilt, word reveals, pinned scenes,
   magnetic buttons and horizontal decks.

   Everything here is transform/opacity only, driven by one shared rAF loop,
   and switches off entirely under prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp  = (a, b, t) => a + (b - a) * t;

  /* ======================================================= shared scroll == */
  // One rAF loop drives every scroll-linked effect on the page.
  const scrollFx = [];
  let queued = false;

  function requestTick() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(runScrollFx);
  }
  function runScrollFx() {
    queued = false;
    const vh = window.innerHeight;
    for (let i = 0; i < scrollFx.length; i++) {
      const fx = scrollFx[i];
      if (!fx.visible) continue;
      const r = fx.el.getBoundingClientRect();
      // 0 when the element's centre is at the bottom of the screen, 1 at the top
      const p = clamp(1 - (r.top + r.height / 2) / (vh + r.height / 2), 0, 1);
      fx.apply(p, r, vh);
    }
  }
  function track(el, apply) {
    const fx = { el, apply, visible: false };
    scrollFx.push(fx);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          fx.visible = entries[0].isIntersecting;
          if (fx.visible) requestTick();
        },
        { rootMargin: "120px 0px" }
      ).observe(el);
    } else {
      fx.visible = true;
    }
  }
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);

  /* ============================================================ parallax == */
  // data-parallax="-0.18"  — negative drifts up, positive drifts down.
  function initParallax() {
    $$("[data-parallax]").forEach((el) => {
      const depth = parseFloat(el.dataset.parallax) || 0.15;
      const spin  = parseFloat(el.dataset.parallaxSpin) || 0;
      const zoom  = parseFloat(el.dataset.parallaxZoom) || 0;
      el.style.willChange = "transform";
      track(el, (p, r, vh) => {
        const shift = (p - 0.5) * depth * vh;
        let t = "translate3d(0," + shift.toFixed(2) + "px,0)";
        if (spin) t += " rotate(" + ((p - 0.5) * spin).toFixed(2) + "deg)";
        if (zoom) t += " scale(" + (1 + p * zoom).toFixed(4) + ")";
        el.style.transform = t;
      });
    });
  }

  /* ======================================================== scroll depth == */
  // data-depth turns vertical scroll into a 3D push/rotate on the element.
  function initDepth() {
    $$("[data-depth]").forEach((el) => {
      const amt = parseFloat(el.dataset.depth) || 1;
      const parent = el.parentElement;
      if (parent && !parent.style.perspective) parent.style.perspective = "1200px";
      el.style.willChange = "transform";
      el.style.transformStyle = "preserve-3d";
      track(el, (p) => {
        const t = (p - 0.5) * 2;                 // -1 .. 1
        el.style.transform =
          "perspective(1200px) rotateX(" + (-t * 7 * amt).toFixed(2) + "deg)" +
          " translate3d(0,0," + (-Math.abs(t) * 70 * amt).toFixed(1) + "px)" +
          " scale(" + (1 - Math.abs(t) * 0.04 * amt).toFixed(4) + ")";
      });
    });
  }

  /* ========================================================== 3D tilt ===== */
  // Pointer-following tilt with a moving sheen. Desktop pointers only.
  function initTilt() {
    if (!finePointer.matches) return;
    $$("[data-tilt]").forEach((el) => {
      const max = parseFloat(el.dataset.tilt) || 7;
      let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0, active = false;

      if (!$(".tilt__sheen", el)) {
        const sheen = document.createElement("span");
        sheen.className = "tilt__sheen";
        sheen.setAttribute("aria-hidden", "true");
        el.appendChild(sheen);
      }
      const sheen = $(".tilt__sheen", el);
      el.style.transformStyle = "preserve-3d";

      const render = () => {
        raf = 0;
        cx = lerp(cx, tx, active ? 0.18 : 0.12);
        cy = lerp(cy, ty, active ? 0.18 : 0.12);
        el.style.transform =
          "perspective(900px) rotateX(" + (-cy * max).toFixed(2) + "deg) rotateY(" +
          (cx * max).toFixed(2) + "deg) translate3d(0," + (active ? -6 : 0) + "px,0)";
        if (sheen) {
          sheen.style.opacity = active ? "1" : "0";
          sheen.style.transform =
            "translate3d(" + (cx * 34).toFixed(1) + "%," + (cy * 34).toFixed(1) + "%,0)";
        }
        if (Math.abs(cx - tx) > 0.001 || Math.abs(cy - ty) > 0.001) {
          raf = requestAnimationFrame(render);
        }
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(render); };

      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
        active = true;
        kick();
      });
      el.addEventListener("pointerleave", () => {
        tx = 0; ty = 0; active = false; kick();
      });
    });
  }

  /* ========================================================== magnetic ==== */
  function initMagnetic() {
    if (!finePointer.matches) return;
    $$("[data-magnetic]").forEach((el) => {
      const pull = parseFloat(el.dataset.magnetic) || 0.3;
      let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
      const render = () => {
        raf = 0;
        cx = lerp(cx, tx, 0.2); cy = lerp(cy, ty, 0.2);
        el.style.transform = "translate3d(" + cx.toFixed(2) + "px," + cy.toFixed(2) + "px,0)";
        if (Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05) raf = requestAnimationFrame(render);
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(render); };
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        tx = (e.clientX - r.left - r.width / 2) * pull;
        ty = (e.clientY - r.top - r.height / 2) * pull;
        kick();
      });
      el.addEventListener("pointerleave", () => { tx = 0; ty = 0; kick(); });
    });
  }

  /* ======================================================= word reveal ==== */
  // Wraps every word so headlines can rotate up out of the baseline.
  function splitWords(el) {
    if (el.dataset.split === "done") return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) if (n.nodeValue.trim()) nodes.push(n);
    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((chunk) => {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) { frag.appendChild(document.createTextNode(chunk)); return; }
        const outer = document.createElement("span");
        outer.className = "w";
        const inner = document.createElement("span");
        inner.className = "w__i";
        inner.textContent = chunk;
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      node.parentNode.replaceChild(frag, node);
    });
    el.dataset.split = "done";
  }

  function initWordReveal() {
    const heads = $$("[data-words]");
    if (!heads.length) return;

    // A headline stranded at opacity 0 is the worst failure this file can
    // cause, so every path that can go wrong falls back to showing the text.
    if (!("IntersectionObserver" in window)) {
      heads.forEach((el) => el.classList.add("words-in"));
      return;
    }
    heads.forEach((el) => {
      splitWords(el);
      $$(".w__i", el).forEach((w, i) => { w.style.transitionDelay = i * 55 + "ms"; });
    });
    // threshold 0, not a percentage: a percentage is unreachable for a headline
    // taller than the viewport, and rootMargin already holds the reveal back
    // until the heading is properly in view.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("words-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    heads.forEach((el) => io.observe(el));

    // Last resort: nothing on screen stays hidden once the reader is there.
    setTimeout(() => {
      heads.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("words-in");
      });
    }, 2500);
  }

  /* ========================================================= pinned scene = */
  // A sticky visual whose active frame changes as you scroll past each step.
  function initScenes() {
    $$("[data-scene]").forEach((scene) => {
      const steps  = $$("[data-scene-step]", scene);
      const frames = $$("[data-scene-frame]", scene);
      if (!steps.length || !frames.length) return;

      const setActive = (i) => {
        if (scene.dataset.active === String(i)) return;
        scene.dataset.active = String(i);
        steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
        frames.forEach((f, k) => f.classList.toggle("is-active", k === i));
      };
      setActive(0);

      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(steps.indexOf(e.target));
        });
      }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
      steps.forEach((s) => io.observe(s));
    });
  }

  /* ============================================================== decks === */
  // Horizontal scroll-snap rails with arrows, drag and keyboard support.
  function initDecks() {
    $$("[data-deck]").forEach((deck) => {
      const rail = $("[data-deck-rail]", deck);
      const prev = $("[data-deck-prev]", deck);
      const next = $("[data-deck-next]", deck);
      const bar  = $("[data-deck-bar]", deck);
      if (!rail) return;

      const step = () => {
        const card = $(".deck__card", rail);
        return card ? card.getBoundingClientRect().width + 18 : rail.clientWidth * 0.8;
      };
      const sync = () => {
        const max = rail.scrollWidth - rail.clientWidth;
        if (prev) prev.disabled = rail.scrollLeft < 8;
        if (next) next.disabled = rail.scrollLeft > max - 8;
        if (bar) bar.style.transform = "scaleX(" + (max > 0 ? clamp(rail.scrollLeft / max, 0, 1) : 1) + ")";
      };
      if (prev) prev.addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: reduced.matches ? "auto" : "smooth" }));
      if (next) next.addEventListener("click", () => rail.scrollBy({ left: step(), behavior: reduced.matches ? "auto" : "smooth" }));
      rail.addEventListener("scroll", sync, { passive: true });
      window.addEventListener("resize", sync);
      sync();

      // Drag to pan with a mouse; touch already works natively.
      let down = false, startX = 0, startLeft = 0, moved = false;
      rail.addEventListener("pointerdown", (e) => {
        if (e.pointerType !== "mouse") return;
        down = true; moved = false;
        startX = e.clientX; startLeft = rail.scrollLeft;
        rail.setPointerCapture(e.pointerId);
      });
      rail.addEventListener("pointermove", (e) => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 3) { moved = true; rail.classList.add("is-dragging"); }
        rail.scrollLeft = startLeft - dx;
      });
      const release = () => { down = false; rail.classList.remove("is-dragging"); };
      rail.addEventListener("pointerup", release);
      rail.addEventListener("pointercancel", release);
      rail.addEventListener("click", (e) => { if (moved) e.preventDefault(); }, true);
    });
  }

  /* ============================================================ marquee === */
  // Scroll-direction-aware marquee: speeds up and reverses with the page.
  function initDriftRows() {
    const rows = $$("[data-drift]");
    if (!rows.length) return;
    rows.forEach((row) => {
      const dir = parseFloat(row.dataset.drift) || 1;
      track(row, (p) => {
        row.style.transform = "translate3d(" + ((p - 0.5) * -160 * dir).toFixed(1) + "px,0,0)";
      });
    });
  }

  /* ============================================================== boot ==== */
  function boot() {
    if (reduced.matches) {
      // Nothing moves, but anything that reveals must still be visible.
      $$("[data-words]").forEach((el) => el.classList.add("words-in"));
      $$("[data-scene]").forEach((scene) => {
        $$("[data-scene-step]", scene).forEach((s) => s.classList.add("is-active"));
        const f = $("[data-scene-frame]", scene);
        if (f) f.classList.add("is-active");
      });
      initDecks();
      return;
    }
    initParallax();
    initDepth();
    initTilt();
    initMagnetic();
    initWordReveal();
    initScenes();
    initDecks();
    initDriftRows();
    requestTick();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
