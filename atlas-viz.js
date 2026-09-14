/**
 * atlas-viz.js – Cascade SVG pulse + MMA day-climate scrubber for Project Atlas.
 * Created: 2026-09-12
 * Last updated: 2026-09-12
 */
(function () {
  "use strict";

  const log = (level, message, fields) => {
    const payload = Object.assign(
      {
        timestamp: new Date().toISOString(),
        module: "atlas-viz",
        level: level,
        message: message,
      },
      fields || {}
    );
    if (level === "ERROR") console.error(payload);
    else if (level === "WARN") console.warn(payload);
    else console.info(payload);
  };

  function initCascadePulse() {
    const edges = document.querySelectorAll(".cascade-svg .edge-pulse");
    if (!edges.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let i = 0;
    setInterval(() => {
      edges.forEach((e, idx) => e.classList.toggle("is-lit", idx === i % edges.length));
      i += 1;
    }, 900);
    log("INFO", "cascade_pulse_started", { edge_count: edges.length });
  }

  /** Illustrative synthetic day: topic density + ERIP over 16 waking hours. */
  const CLIMATE = [
    { h: "07", label: "morning digests", topics: { presence: 0.55, markets: 0.15, memory: 0.25, robotics: 0.1, print: 0.05 }, erip: { e: 0.42, r: 0.55, i: 0.7, p: 0.35 } },
    { h: "08", label: "operator check-in", topics: { presence: 0.7, markets: 0.2, memory: 0.2, robotics: 0.1, print: 0.05 }, erip: { e: 0.5, r: 0.72, i: 0.68, p: 0.4 } },
    { h: "09", label: "markets thread", topics: { presence: 0.35, markets: 0.85, memory: 0.3, robotics: 0.1, print: 0.05 }, erip: { e: 0.48, r: 0.6, i: 0.55, p: 0.62 } },
    { h: "10", label: "cascade search", topics: { presence: 0.3, markets: 0.4, memory: 0.9, robotics: 0.15, print: 0.05 }, erip: { e: 0.45, r: 0.58, i: 0.75, p: 0.7 } },
    { h: "11", label: "holiday-shelf recall", topics: { presence: 0.25, markets: 0.2, memory: 0.95, robotics: 0.1, print: 0.05 }, erip: { e: 0.62, r: 0.65, i: 0.8, p: 0.55 } },
    { h: "12", label: "quiet pulse", topics: { presence: 0.5, markets: 0.1, memory: 0.2, robotics: 0.1, print: 0.1 }, erip: { e: 0.35, r: 0.45, i: 0.6, p: 0.3 } },
    { h: "13", label: "print monitor", topics: { presence: 0.4, markets: 0.1, memory: 0.15, robotics: 0.15, print: 0.85 }, erip: { e: 0.4, r: 0.5, i: 0.55, p: 0.75 } },
    { h: "14", label: "Rasp-Bear cruise", topics: { presence: 0.35, markets: 0.05, memory: 0.25, robotics: 0.95, print: 0.2 }, erip: { e: 0.55, r: 0.48, i: 0.6, p: 0.8 } },
    { h: "15", label: "place gist", topics: { presence: 0.3, markets: 0.05, memory: 0.55, robotics: 0.8, print: 0.1 }, erip: { e: 0.5, r: 0.52, i: 0.72, p: 0.7 } },
    { h: "16", label: "harness propose", topics: { presence: 0.45, markets: 0.1, memory: 0.4, robotics: 0.35, print: 0.1 }, erip: { e: 0.38, r: 0.55, i: 0.78, p: 0.85 } },
    { h: "17", label: "markets reopen", topics: { presence: 0.4, markets: 0.75, memory: 0.35, robotics: 0.2, print: 0.05 }, erip: { e: 0.52, r: 0.62, i: 0.58, p: 0.6 } },
    { h: "18", label: "voice + face", topics: { presence: 0.85, markets: 0.15, memory: 0.3, robotics: 0.15, print: 0.05 }, erip: { e: 0.7, r: 0.82, i: 0.65, p: 0.45 } },
    { h: "19", label: "long read page", topics: { presence: 0.45, markets: 0.1, memory: 0.7, robotics: 0.1, print: 0.05 }, erip: { e: 0.4, r: 0.55, i: 0.7, p: 0.5 } },
    { h: "20", label: "relational pulse", topics: { presence: 0.75, markets: 0.1, memory: 0.35, robotics: 0.1, print: 0.05 }, erip: { e: 0.68, r: 0.88, i: 0.72, p: 0.4 } },
    { h: "21", label: "EOD theme graph", topics: { presence: 0.35, markets: 0.2, memory: 0.9, robotics: 0.2, print: 0.1 }, erip: { e: 0.45, r: 0.58, i: 0.8, p: 0.75 } },
    { h: "22", label: "wind down", topics: { presence: 0.55, markets: 0.05, memory: 0.4, robotics: 0.1, print: 0.05 }, erip: { e: 0.35, r: 0.6, i: 0.65, p: 0.3 } },
  ];

  const TOPIC_KEYS = ["presence", "markets", "memory", "robotics", "print"];
  /** Bright topic palette. ERIP meters stay amber-only so they never look like topics. */
  const TOPIC_COLORS = {
    presence: "#34d399",
    markets: "#60a5fa",
    memory: "#c4b5fd",
    robotics: "#38bdf8",
    print: "#a78bfa",
  };

  function buildRidges(svg) {
    const W = 640;
    const H = 200;
    const padL = 36;
    const padR = 12;
    const padT = 18;
    const padB = 28;
    const plotW = W - padL - padR;
    const band = (H - padT - padB) / TOPIC_KEYS.length;
    const n = CLIMATE.length;

    const ns = "http://www.w3.org/2000/svg";
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Example day climate: topic intensity by hour");

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const gGrid = document.createElementNS(ns, "g");
    gGrid.setAttribute("class", "climate-grid");
    for (let i = 0; i < n; i++) {
      const x = padL + (i / (n - 1)) * plotW;
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", x);
      line.setAttribute("x2", x);
      line.setAttribute("y1", padT);
      line.setAttribute("y2", H - padB);
      gGrid.appendChild(line);
      const t = document.createElementNS(ns, "text");
      t.setAttribute("x", x);
      t.setAttribute("y", H - 8);
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("class", "climate-hour");
      t.textContent = CLIMATE[i].h;
      gGrid.appendChild(t);
    }
    svg.appendChild(gGrid);

    TOPIC_KEYS.forEach((key, row) => {
      const baseY = padT + row * band + band * 0.85;
      const amp = band * 0.7;
      let d = "";
      CLIMATE.forEach((slot, i) => {
        const x = padL + (i / (n - 1)) * plotW;
        const y = baseY - (slot.topics[key] || 0) * amp;
        d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
      });
      for (let i = n - 1; i >= 0; i--) {
        const x = padL + (i / (n - 1)) * plotW;
        d += "L" + x.toFixed(1) + " " + baseY.toFixed(1) + " ";
      }
      d += "Z";
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", d.trim());
      path.setAttribute("fill", TOPIC_COLORS[key]);
      path.setAttribute("fill-opacity", "0.32");
      path.setAttribute("stroke", TOPIC_COLORS[key]);
      path.setAttribute("stroke-width", "1.6");
      path.setAttribute("stroke-opacity", "0.95");
      path.setAttribute("class", "climate-ridge climate-ridge--" + key);
      svg.appendChild(path);

      const lab = document.createElementNS(ns, "text");
      lab.setAttribute("x", 4);
      lab.setAttribute("y", baseY - amp * 0.35);
      lab.setAttribute("class", "climate-topic-lab");
      lab.setAttribute("fill", TOPIC_COLORS[key]);
      lab.textContent = key;
      svg.appendChild(lab);
    });

    const playhead = document.createElementNS(ns, "line");
    playhead.setAttribute("class", "climate-playhead");
    playhead.setAttribute("y1", padT - 4);
    playhead.setAttribute("y2", H - padB);
    playhead.setAttribute("x1", padL);
    playhead.setAttribute("x2", padL);
    svg.appendChild(playhead);

    return { padL: padL, plotW: plotW, n: n, playhead: playhead };
  }

  function setEripBars(root, erip) {
    ["e", "r", "i", "p"].forEach((k) => {
      const fill = root.querySelector('[data-erip="' + k + '"] .erip-fill');
      if (fill) fill.style.width = Math.round((erip[k] || 0) * 100) + "%";
      const val = root.querySelector('[data-erip="' + k + '"] .erip-val');
      if (val) val.textContent = (erip[k] || 0).toFixed(2);
    });
  }

  function initClimate() {
    const details = document.getElementById("mma-day-climate");
    const root = details?.querySelector(".day-climate") || document.querySelector(".day-climate");
    if (!root) return;
    const svg = root.querySelector(".climate-svg");
    const labelEl = root.querySelector("[data-climate-label]");
    const hourEl = root.querySelector("[data-climate-hour]");
    const playBtn = root.querySelector("[data-climate-play]");
    const scrub = root.querySelector("[data-climate-scrub]");
    if (!svg) return;

    const geom = buildRidges(svg);
    let idx = 0;
    let playing = false;
    let timer = null;
    let builtFocus = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function render(i) {
      idx = Math.max(0, Math.min(geom.n - 1, i));
      const slot = CLIMATE[idx];
      const x = geom.padL + (idx / (geom.n - 1)) * geom.plotW;
      geom.playhead.setAttribute("x1", x);
      geom.playhead.setAttribute("x2", x);
      if (labelEl) labelEl.textContent = slot.label;
      if (hourEl) hourEl.textContent = slot.h + ":00";
      if (scrub) scrub.value = String(idx);
      setEripBars(root, slot.erip);
      root.querySelectorAll(".climate-ridge").forEach((p) => p.classList.remove("is-focus"));
      const top = TOPIC_KEYS.slice().sort((a, b) => (slot.topics[b] || 0) - (slot.topics[a] || 0))[0];
      root.querySelector(".climate-ridge--" + top)?.classList.add("is-focus");
      builtFocus = true;
    }

    function tick() {
      render((idx + 1) % geom.n);
    }

    function start() {
      if (reduce || timer) return;
      timer = setInterval(tick, 1100);
      playing = true;
      if (playBtn) {
        playBtn.setAttribute("aria-pressed", "true");
        playBtn.textContent = "Pause";
      }
      log("INFO", "climate_play_start", { hour_index: idx });
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
      playing = false;
      if (playBtn) {
        playBtn.setAttribute("aria-pressed", "false");
        playBtn.textContent = "Play day";
      }
    }

    playBtn?.addEventListener("click", () => {
      if (playing) stop();
      else start();
    });
    scrub?.addEventListener("input", (e) => {
      stop();
      render(Number(e.target.value) || 0);
    });

    render(0);

    function onOpen() {
      if (!details) return;
      if (details.open) {
        if (!builtFocus) render(idx);
        if (!reduce && !playing) start();
        log("INFO", "climate_details_opened", {});
      } else {
        stop();
      }
    }

    if (details) {
      details.addEventListener("toggle", onOpen);
      if (details.open) onOpen();
    }

    log("INFO", "climate_viz_ready", { hours: geom.n, reduced_motion: reduce, gated_by_details: !!details });
  }

  function boot() {
    try {
      initCascadePulse();
      initClimate();
    } catch (err) {
      log("ERROR", "atlas_viz_boot_failed", {
        error_message: String(err && err.message ? err.message : err),
        stack_trace: err && err.stack ? err.stack : null,
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
