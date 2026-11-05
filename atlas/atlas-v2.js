/**
 * atlas-v2.js – Atlas v2 prototype: mounts the Miu system as a Prism-3D drill stack and keeps chapters ↔ drill level in sync.
 * Chapter click = drill there; drill (double-click / breadcrumb) = scroll to that chapter. 2D view renders the current level flat.
 * Created: 2026-10-17
 * Last updated: 2026-10-17
 */

const PRISM_URL = "./vendor/mermaid-prism/mermaid-prism.js";
const ACCENTS = { ember: "#ff7a1a", blue: "#60a5fa" };
const LEVEL_NAMES = ["Miu", "Subsystem", "Flow"];
const TRACE = `atlas-v2-${Math.random().toString(36).slice(2, 10)}`;

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const desktopMq = matchMedia("(min-width: 64rem)");

function log(level, event, fields = {}) {
  const line = { ts: new Date().toISOString(), level, module: "atlas-v2", event, trace_id: TRACE, ...fields };
  (level === "error" ? console.error : level === "warn" ? console.warn : console.info)(JSON.stringify(line));
}

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const stageEl = $("#v2-stage");
const mountEl = $("#v2-mount");
const statsEl = $("#v2-stats");
const chaptersEl = $("#v2-chapters");
const chapters = $$(".v2-chapter");

const docText = $("#v2-doc").textContent;
/** name → mermaid code of one diagram section (for the 2D view). */
const sections = (() => {
  const out = {};
  const parts = docText.split(/^\s*%%\s*@prism\s+diagram\s+/m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf("\n");
    out[part.slice(0, nl).trim()] = part.slice(nl + 1).replace(/^\s*%%\s*@prism\s+drill.*$/gm, "");
  }
  return out;
})();

const state = {
  prism: null,
  rootModel: null,
  drill: null,
  flat: null,
  view: "3d",
  path: [],
  pathNames: ["miu"],
  accent: document.documentElement.dataset.accent === "blue" ? "blue" : "ember",
  revolve: false,
  syncing: false,
};

/* ── helpers ── */

const pathKey = (ids) => ids.join("/");

function modelStats(model) {
  if (!model || model.kind !== "flowchart") return { nodes: 0, edges: 0 };
  return { nodes: model.nodes.length, edges: model.edges.filter((e) => e.stroke !== "invisible").length };
}

function chapterFor(key) {
  return chapters.find((c) => c.dataset.path === key && !c.dataset.tabId) ?? null;
}

function setActiveChapter(key) {
  let active = chapterFor(key);
  for (let k = key; !active && k.includes("/"); ) {
    k = k.slice(0, k.lastIndexOf("/"));
    active = chapterFor(k);
  }
  for (const c of chapters) c.dataset.active = String(c === active);
  const top = key.split("/")[0];
  for (const a of $$(".v2-tabs a")) a.setAttribute("aria-current", String(a.dataset.tab === top));
  const tab = $(`.v2-tabs a[aria-current="true"]`);
  tab?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
  return active;
}

function scrollToChapter(el) {
  if (!el) return;
  const behavior = reducedMotion.matches ? "auto" : "smooth";
  if (desktopMq.matches) {
    chaptersEl.scrollTo({ top: el.offsetTop - 14, behavior });
  }
  // Mobile: the stage stays in view; the active chapter is only marked, not scrolled to.
}

function updateStats(model) {
  const { nodes, edges } = modelStats(model);
  statsEl.innerHTML = `<b>${nodes} nodes</b> · ${edges} edges`;
}

/* ── drill (3D) ── */

async function mountDrill(targetPath = []) {
  const t0 = performance.now();
  destroyViews();
  stageEl.dataset.state = "loading";
  const { renderDrill3d } = state.prism;
  const drill = await renderDrill3d(mountEl, state.rootModel, {
    scheme: "dark",
    accent: ACCENTS[state.accent],
    revolve: state.revolve && !reducedMotion.matches,
    locale: "en",
    rootLabel: "atlas",
    levelNames: LEVEL_NAMES,
    chromeTop: 14,
    hints: true,
    traceId: TRACE,
  });
  state.drill = drill;
  state.path = [];
  drill.onLevel((_stage, s) => onLevel(s));
  stageEl.dataset.state = "ready";
  log("info", "drill_mounted", { duration_ms: Math.round(performance.now() - t0), target: pathKey(targetPath) });
  if (targetPath.length) await drillTo(targetPath);
  else onLevel(drill.stack.getState());
}

function onLevel(s) {
  const crumbs = s.path ?? [];
  const ids = crumbs.slice(1).map((c) => c.id);
  state.path = ids;
  state.pathNames = crumbs.map((c) => c.model?.name || "miu");
  const model = crumbs.at(-1)?.model ?? state.rootModel;
  updateStats(model);
  const active = setActiveChapter(pathKey(ids));
  log("info", "level", { path: pathKey(ids) || "(root)", depth: ids.length, from_chapter: state.syncing });
  if (!state.syncing) scrollToChapter(active);
}

async function drillTo(target) {
  const d = state.drill;
  if (!d) return;
  state.syncing = true;
  try {
    let common = 0;
    while (common < target.length && common < state.path.length && target[common] === state.path[common]) common++;
    if (common < state.path.length) await d.popTo(common);
    for (const id of target.slice(common)) {
      const ok = await d.push(id);
      if (!ok) { log("warn", "drill_push_failed", { id, target: pathKey(target) }); break; }
    }
  } finally {
    state.syncing = false;
  }
}

/* ── flat (2D) ── */

async function mountFlat() {
  destroyViews();
  stageEl.dataset.state = "loading";
  const name = state.pathNames.at(-1) || "miu";
  const code = sections[name] ?? sections.miu;
  state.flat = await state.prism.render(mountEl, code, {
    theme: "atlas-v2",
    scheme: "dark",
    mode: "2d",
    accent: ACCENTS[state.accent],
    locale: "en",
    animate: !reducedMotion.matches,
    height: "fill",
    label: `Miu atlas · ${name}`,
    traceId: TRACE,
  });
  stageEl.dataset.state = "ready";
  log("info", "flat_mounted", { diagram: name });
}

function destroyViews() {
  try { state.drill?.destroy(); } catch (e) { log("warn", "drill_destroy_failed", { error_message: String(e) }); }
  try { state.flat?.destroy?.(); } catch (e) { log("warn", "flat_destroy_failed", { error_message: String(e) }); }
  state.drill = null;
  state.flat = null;
  mountEl.replaceChildren();
}

/* ── controls ── */

function setAccent(name) {
  if (!ACCENTS[name]) return;
  state.accent = name;
  document.documentElement.dataset.accent = name;
  for (const b of $$(".v2-dot")) b.setAttribute("aria-pressed", String(b.dataset.accent === name));
  state.drill?.setAccent(ACCENTS[name]);
  if (state.flat) mountFlat().catch(fail);
  const url = new URL(location.href);
  url.searchParams.set("accent", name);
  history.replaceState(null, "", url);
  log("info", "accent", { accent: name });
}

async function setView(view) {
  if (view === state.view || !state.prism) return;
  state.view = view;
  stageEl.dataset.view = view;
  for (const b of $$("[data-view]")) b.setAttribute("aria-pressed", String(b.dataset.view === view));
  $("[data-revolve]").disabled = view === "2d";
  if (view === "2d") await mountFlat();
  else await mountDrill(state.path.slice());
  log("info", "view", { view, path: pathKey(state.path) });
}

async function onChapterClick(ch) {
  const key = ch.dataset.path ?? "";
  const target = key ? key.split("/") : [];
  setActiveChapter(key);
  if (!desktopMq.matches) stageEl.scrollIntoView({ block: "start", behavior: reducedMotion.matches ? "auto" : "smooth" });
  if (state.view === "3d") await drillTo(target);
  else {
    state.path = target;
    state.pathNames = ["miu", ...target.map((_, i) => nameAt(target.slice(0, i + 1)))];
    await mountFlat();
    updateStats(state.rootModel?.diagrams?.[state.pathNames.at(-1)] ?? state.rootModel);
  }
}

/** Follows in-document drill targets: ["memory","core"] → "blocks". */
function nameAt(ids) {
  let model = state.rootModel;
  for (const id of ids) {
    const node = model?.nodes?.find((n) => n.id === id);
    const next = node?.drillTo && state.rootModel.diagrams?.[node.drillTo];
    if (!next) return model?.name || "miu";
    model = next;
  }
  return model?.name || "miu";
}

function wire() {
  for (const b of $$(".v2-dot")) b.addEventListener("click", () => setAccent(b.dataset.accent));
  for (const b of $$("[data-view]")) b.addEventListener("click", () => setView(b.dataset.view).catch(fail));
  $("[data-revolve]").addEventListener("click", (e) => {
    const want = e.currentTarget.getAttribute("aria-pressed") !== "true";
    state.revolve = state.drill ? state.drill.setRevolve(want) : want;
    e.currentTarget.setAttribute("aria-pressed", String(state.revolve));
  });
  const panelsBtn = $("[data-panels]");
  const applyPanels = (on) => {
    stageEl.dataset.panels = on ? "on" : "off";
    panelsBtn.setAttribute("aria-pressed", String(on));
  };
  applyPanels(desktopMq.matches);
  panelsBtn.addEventListener("click", () => applyPanels(stageEl.dataset.panels !== "on"));
  desktopMq.addEventListener("change", (e) => applyPanels(e.matches));

  for (const ch of chapters) {
    const btn = $(".v2-dive", ch);
    if (btn) { btn.hidden = false; btn.addEventListener("click", () => onChapterClick(ch).catch(fail)); }
  }
  for (const a of $$(".v2-tabs a")) {
    a.addEventListener("click", (e) => {
      const ch = document.getElementById(a.getAttribute("href").slice(1));
      if (!ch) return;
      e.preventDefault();
      if (desktopMq.matches) scrollToChapter(ch);
      else ch.scrollIntoView({ block: "start", behavior: reducedMotion.matches ? "auto" : "smooth" });
      onChapterClick(ch).catch(fail);
    });
  }
}

function fail(err) {
  log("error", "stage_failed", { error_message: String(err?.message ?? err), stack_trace: err?.stack });
  stageEl.dataset.state = "error";
  $("#v2-fallback-note").textContent = "Interactive view failed to load. Static map shown; chapters below stay readable.";
}

async function boot() {
  const t0 = performance.now();
  wire();
  setAccent(state.accent);
  try {
    state.prism = await import(PRISM_URL);
    state.prism.setLogSink?.((rec) => {
      if (rec.level === "warn" || rec.level === "error") log(rec.level, "prism", { prism_event: rec.event, detail: rec });
    });
    state.rootModel = await state.prism.parseMermaid(docText);
    log("info", "doc_parsed", { diagrams: Object.keys(state.rootModel.diagrams ?? {}).length + 1 });
    const webgl = await state.prism.supportsWebGL();
    if (!webgl) {
      log("warn", "no_webgl_fallback_2d");
      state.view = "2d";
      for (const b of $$("[data-view]")) b.setAttribute("aria-pressed", String(b.dataset.view === "2d"));
      $('[data-view="3d"]').disabled = true;
      await mountFlat();
    } else {
      const initial = new URLSearchParams(location.search).get("drill");
      await mountDrill(initial ? initial.split("/").filter(Boolean) : []);
      if (initial) scrollToChapter($('.v2-chapter[data-active="true"]'));
    }
    log("info", "boot_done", { duration_ms: Math.round(performance.now() - t0), view: state.view });
  } catch (err) {
    fail(err);
  }
}

boot();
