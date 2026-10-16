/**
 * prism-lab.js – Renders the Atlas architecture diagrams (Mermaid text in each figure) with the vendored mermaid-prism bundle.
 * Created: 2026-10-17
 * Last updated: 2026-10-17
 *
 * Contract per figure (.lab-fig):
 *   data-modes="2d" | "3d" | "2d 3d"   first entry = initial mode; two entries = segmented switch
 *   data-player="on" | "off"           flow player bar (default off)
 *   <script type="text/plain" class="lab-code">  Mermaid source (diagram text is untrusted; Prism renders text only)
 *   .lab-fallback                      original atlas markup, visible until Prism mounts and again on failure
 */

const MODULE = "prism-lab";
const VENDOR = "./vendor/mermaid-prism/mermaid-prism.js";
/** Long LR chains turn top-to-bottom on phones (data-narrow="TB"); same text, only the direction changes. */
const NARROW_QUERY = "(max-width: 40rem)";

function log(level, message, fields = {}) {
  const payload = { timestamp: new Date().toISOString(), module: MODULE, level, message, ...fields };
  if (level === "ERROR") console.error(payload);
  else if (level === "WARN") console.warn(payload);
  else console.info(payload);
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let prismPromise = null;
function loadPrism() {
  if (!prismPromise) {
    const t0 = performance.now();
    prismPromise = import(VENDOR).then((mod) => {
      mod.setLogSink((e) => {
        if (e.level === "error") console.error({ module: "mermaid-prism", ...e });
        else if (e.level === "warn") console.warn({ module: "mermaid-prism", ...e });
      });
      log("INFO", "prism_loaded", { duration_ms: Math.round(performance.now() - t0) });
      return mod;
    });
  }
  return prismPromise;
}

async function renderFigure(fig, mode) {
  const id = fig.id || "fig";
  let code = fig.querySelector(".lab-code")?.textContent?.trim();
  const mount = fig.querySelector(".lab-mount");
  const narrow = fig.dataset.narrow === "TB" && window.matchMedia(NARROW_QUERY).matches;
  if (code && narrow) code = code.replace(/^flowchart\s+LR\b/, "flowchart TB");
  if (!code || !mount) {
    log("WARN", "figure_incomplete", { figure_id: id });
    return;
  }
  const trace = `${id}-${mode}-${Date.now().toString(36)}`;
  const t0 = performance.now();
  fig.dataset.state = "loading";
  try {
    const prism = await loadPrism();
    fig._prismHandle?.destroy();
    fig._prismHandle = null;
    mount.replaceChildren();
    const handle = await prism.render(mount, code, {
      theme: "atlas",
      scheme: "dark",
      mode,
      accent: "#60a5fa",
      locale: "en",
      player: fig.dataset.player === "on",
      animate: !reducedMotion(),
      label: fig.querySelector("figcaption")?.textContent?.trim() || undefined,
      traceId: trace,
    });
    fig._prismHandle = handle;
    fig.dataset.state = "ready";
    fig.dataset.mode = handle.mode;
    syncSwitch(fig, handle.mode);
    log("INFO", "figure_rendered", {
      trace_id: trace,
      figure_id: id,
      mode_requested: mode,
      mode_actual: handle.mode,
      has_player: Boolean(handle.player),
      duration_ms: Math.round(performance.now() - t0),
    });
  } catch (err) {
    fig.dataset.state = "error";
    mount.replaceChildren();
    log("ERROR", "figure_render_failed", {
      trace_id: trace,
      figure_id: id,
      mode_requested: mode,
      error_message: String(err?.message ?? err),
      stack_trace: err?.stack ?? null,
    });
  }
}

function syncSwitch(fig, mode) {
  fig.querySelectorAll(".lab-modes button").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.mode === mode));
  });
}

function setupSwitch(fig, modes) {
  const bar = fig.querySelector(".lab-modes");
  if (!bar) return;
  if (modes.length < 2) {
    bar.hidden = true;
    return;
  }
  bar.hidden = false;
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-mode]");
    if (!btn || btn.dataset.mode === fig.dataset.mode) return;
    log("INFO", "mode_switch", { figure_id: fig.id, to: btn.dataset.mode });
    renderFigure(fig, btn.dataset.mode);
  });
}

const NEAR_PX = 400;

function boot() {
  const figs = [...document.querySelectorAll(".lab-fig")];
  log("INFO", "lab_boot", { figure_count: figs.length, reduced_motion: reducedMotion() });
  const start = (fig, via) => {
    if (fig.dataset.state) return;
    io.unobserve(fig);
    log("DEBUG", "figure_start", { figure_id: fig.id, via });
    renderFigure(fig, fig.dataset.modes.split(" ")[0]).finally(scheduleSweep);
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) start(entry.target, "observer");
    },
    { rootMargin: `${NEAR_PX}px 0px` }
  );
  // Mounting a figure changes the heights above its neighbours; an observer entry can be missed while
  // layout shifts mid-scroll. A cheap rect sweep after each mount and on scroll catches those.
  let sweepQueued = false;
  function sweep() {
    sweepQueued = false;
    const limit = window.innerHeight + NEAR_PX;
    for (const fig of figs) {
      if (fig.dataset.state) continue;
      const r = fig.getBoundingClientRect();
      if (r.bottom > -NEAR_PX && r.top < limit) start(fig, "sweep");
    }
  }
  function scheduleSweep() {
    if (sweepQueued) return;
    sweepQueued = true;
    requestAnimationFrame(sweep);
  }
  window.addEventListener("scroll", scheduleSweep, { passive: true });
  for (const fig of figs) {
    const modes = (fig.dataset.modes || "2d").split(/\s+/).filter((m) => m === "2d" || m === "3d");
    fig.dataset.modes = modes.join(" ") || "2d";
    setupSwitch(fig, modes);
    io.observe(fig);
  }
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
