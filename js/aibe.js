/* ==========================================================================
   AIBE — site behavior
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


  /* --------------------------------------------------------------- events */
  // Reads AIBE_EVENTS from js/events.js. Splits upcoming from past against
  // today, groups by month, and builds the filter set from the data.
  function wireEvents() {
    const root = $("[data-events]");
    if (!root || typeof AIBE_EVENTS === "undefined") return;

    const TYPES = typeof AIBE_EVENT_TYPES !== "undefined" ? AIBE_EVENT_TYPES : {};
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);

    const all = AIBE_EVENTS
      .map((e) => {
        const start = new Date(e.date + "T" + (e.start || "00:00") + ":00");
        const end = e.end ? new Date(e.date + "T" + e.end + ":00") : null;
        return Object.assign({}, e, { _start: start, _end: end });
      })
      .filter((e) => !isNaN(e._start))
      .sort((a, b) => a._start - b._start);

    const upcoming = all.filter((e) => (e._end || e._start) >= startOfToday);
    const past = all.filter((e) => (e._end || e._start) < startOfToday).reverse();

    const fmtDay   = (d) => d.toLocaleDateString("en-US", { weekday: "short" });
    const fmtMon   = (d) => d.toLocaleDateString("en-US", { month: "short" });
    const fmtMonth = (d) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const fmtTime  = (d) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
                             .replace(":00", "").replace(" ", "\u202f");
    const timeRange = (e) => e._end ? fmtTime(e._start) + "\u2013" + fmtTime(e._end) : fmtTime(e._start);
    const typeLabel = (t) => (TYPES[t] && TYPES[t].label) || t;

    const esc = (str) => String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    /* ---- iCalendar ---- */
    const pad = (n) => String(n).padStart(2, "0");
    // Floating local time: calendar apps show it at the stated wall-clock time,
    // which is what you want for an event in one room on one campus.
    const ical = (d) => d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
                        "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00";
    const icalUTC = (d) => d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) +
                        "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + "Z";
    const fold = (line) => {
      const out = [];
      while (line.length > 72) { out.push(line.slice(0, 72)); line = " " + line.slice(72); }
      out.push(line);
      return out.join("\r\n");
    };
    const icalText = (str) => String(str || "")
      .replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

    function vevent(e, i) {
      const end = e._end || new Date(e._start.getTime() + 90 * 60000);
      return [
        "BEGIN:VEVENT",
        fold("UID:aibe-" + e.date + "-" + i + "@aibe.illinois"),
        "DTSTAMP:" + icalUTC(new Date()),
        "DTSTART:" + ical(e._start),
        "DTEND:" + ical(end),
        fold("SUMMARY:" + icalText("AIBE \u00b7 " + e.title)),
        fold("DESCRIPTION:" + icalText(e.blurb)),
        fold("LOCATION:" + icalText(e.location || "")),
        "END:VEVENT"
      ].join("\r\n");
    }

    function download(events, filename) {
      const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "CALSCALE:GREGORIAN",
                    "PRODID:-//AIBE at Illinois//Events//EN"]
        .concat(events.map(vevent)).concat(["END:VCALENDAR"]).join("\r\n");
      const url = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    /* ---- markup ---- */
    function eventRow(e, idx) {
      const link = e.link
        ? '<a class="btn btn--ghost btn--sm" href="' + esc(e.link) + '" target="_blank" rel="noopener">Sign up</a>'
        : "";
      return '' +
        '<li class="ev" data-type="' + esc(e.type) + '">' +
          '<div class="ev__date" aria-hidden="true">' +
            '<span class="ev__mon">' + fmtMon(e._start) + '</span>' +
            '<span class="ev__num">' + e._start.getDate() + '</span>' +
            '<span class="ev__dow">' + fmtDay(e._start) + '</span>' +
          '</div>' +
          '<div class="ev__body">' +
            '<p class="ev__tag">' + esc(typeLabel(e.type)) + '</p>' +
            '<h3 class="ev__title">' + esc(e.title) + '</h3>' +
            '<p class="ev__meta">' +
              '<span class="sr-only">' + e._start.toDateString() + ', </span>' +
              timeRange(e) + ' &middot; ' + esc(e.location || "Location TBA") +
            '</p>' +
            (e.blurb ? '<p class="ev__blurb">' + esc(e.blurb) + '</p>' : "") +
            '<div class="ev__actions">' +
              '<button class="btn btn--ghost btn--sm" type="button" data-ics="' + idx + '">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>' +
                'Add to calendar</button>' +
              link +
            '</div>' +
          '</div>' +
        '</li>';
    }

    function renderList(target, list, emptyMsg) {
      if (!target) return;
      if (!list.length) {
        target.innerHTML = '<p class="ev-empty">' + emptyMsg + '</p>';
        return;
      }
      let html = "", month = "";
      list.forEach((e) => {
        const m = fmtMonth(e._start);
        if (m !== month) {
          if (month) html += "</ul>";
          html += '<h3 class="ev-month">' + m + "</h3><ul class=\"ev-list\">";
          month = m;
        }
        html += eventRow(e, all.indexOf(e));
      });
      html += "</ul>";
      target.innerHTML = html;
    }

    renderList($("[data-events-upcoming]"), upcoming,
      "Nothing on the calendar right now. The next semester's slate goes up before classes start \u2014 Discord gets it first.");
    renderList($("[data-events-past]"), past,
      "Nothing has happened yet. Check back once the semester is under way.");

    /* ---- next up ---- */
    const nextBox = $("[data-events-next]");
    if (nextBox) {
      if (upcoming.length) {
        const e = upcoming[0];
        const days = Math.round((new Date(e._start).setHours(0, 0, 0, 0) - startOfToday) / 86400000);
        const when = days === 0 ? "Today" : days === 1 ? "Tomorrow" :
                     days < 7 ? "In " + days + " days" :
                     e._start.toLocaleDateString("en-US", { month: "long", day: "numeric" });
        nextBox.innerHTML =
          '<p class="eyebrow" style="color:var(--teal-bright)">Next up &middot; ' + esc(when) + '</p>' +
          '<h2 class="t-h2" style="color:#fff;max-width:20ch">' + esc(e.title) + '</h2>' +
          '<p class="t-lead" style="color:#C2D4EA;margin-top:16px;max-width:52ch">' + esc(e.blurb || "") + '</p>' +
          '<p class="next__when">' +
            esc(e._start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })) +
            ' &middot; ' + timeRange(e) + ' &middot; ' + esc(e.location || "Location TBA") + '</p>' +
          '<div class="btn-row" style="margin-top:26px">' +
            '<button class="btn btn--primary" type="button" data-ics="' + all.indexOf(e) + '">Add to calendar</button>' +
            '<a class="btn btn--ghost" href="#upcoming">See the whole semester</a>' +
          '</div>';
      } else {
        nextBox.innerHTML =
          '<p class="eyebrow" style="color:var(--teal-bright)">Next up</p>' +
          '<h2 class="t-h2" style="color:#fff;max-width:20ch">Nothing scheduled yet.</h2>' +
          '<p class="t-lead" style="color:#C2D4EA;margin-top:16px;max-width:50ch">The slate for next semester goes up before classes start. Discord gets it first.</p>' +
          '<div class="btn-row" style="margin-top:26px"><a class="btn btn--discord" data-link="discord">Join our Discord</a></div>';
        wireLinks();
      }
    }

    /* ---- filters ---- */
    const bar = $("[data-events-filters]");
    if (bar && upcoming.length) {
      const present = [];
      upcoming.forEach((e) => { if (present.indexOf(e.type) < 0) present.push(e.type); });
      bar.innerHTML = '<button class="chip" type="button" data-filter="all" aria-pressed="true">Everything</button>' +
        present.map((t) =>
          '<button class="chip" type="button" data-filter="' + esc(t) + '" aria-pressed="false">' +
          esc((TYPES[t] && TYPES[t].short) || typeLabel(t)) + "</button>").join("");

      bar.addEventListener("click", (ev) => {
        const btn = ev.target.closest("[data-filter]");
        if (!btn) return;
        const want = btn.dataset.filter;
        $$(".chip", bar).forEach((c) => c.setAttribute("aria-pressed", String(c === btn)));
        const scope = $("[data-events-upcoming]");
        $$(".ev", scope).forEach((li) => {
          li.hidden = !(want === "all" || li.dataset.type === want);
        });
        // A month heading with nothing left under it goes too.
        $$(".ev-month", scope).forEach((h) => {
          const ul = h.nextElementSibling;
          h.hidden = !ul || !$$(".ev", ul).some((li) => !li.hidden);
          if (ul) ul.hidden = h.hidden;
        });
        const shown = $$(".ev", scope).filter((li) => !li.hidden).length;
        const note = $("[data-events-count]");
        if (note) note.textContent = shown === upcoming.length
          ? upcoming.length + " events scheduled"
          : shown + " of " + upcoming.length + " events";
      });
    }

    const count = $("[data-events-count]");
    if (count) count.textContent = upcoming.length
      ? upcoming.length + " events scheduled"
      : "Calendar coming soon";

    /* ---- add-to-calendar buttons ---- */
    root.addEventListener("click", (ev) => {
      const btn = ev.target.closest("[data-ics]");
      if (!btn) return;
      const e = all[parseInt(btn.dataset.ics, 10)];
      if (!e) return;
      download([e], "aibe-" + e.date + ".ics");
      const was = btn.innerHTML;
      btn.innerHTML = "Downloaded \u2713";
      setTimeout(() => { btn.innerHTML = was; }, 2200);
    });

    const allBtn = $("[data-ics-all]");
    if (allBtn) {
      if (!upcoming.length) { allBtn.setAttribute("aria-disabled", "true"); }
      else allBtn.addEventListener("click", () => download(upcoming, "aibe-calendar.ics"));
    }

    /* ---- draft notice ---- */
    if (typeof AIBE_DRAFT !== "undefined" && !AIBE_DRAFT) {
      const d = $("[data-events-draft]");
      if (d) d.remove();
    }
  }

  /* ----------------------------------------------------------------- year */
  function wireYear() {
    $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireLinks(); wireNav(); wireReveal(); wireSpine();
    wireCounters(); wireHero(); wireEvents(); wireYear();
  });
})();
