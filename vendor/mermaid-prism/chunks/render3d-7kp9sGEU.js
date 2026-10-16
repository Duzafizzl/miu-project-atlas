import { i as e, n as t, r as n } from "./log-CNcbKWHK.js";
import { n as r, t as i } from "./timeline-Dg5AkARd.js";
import { t as a } from "./player-BMx4cLWN.js";
var o = 64, s = (e) => e.split("\n")[0].trim();
function c(e, t) {
	if (!e.groups.some((e) => e.id === t)) return null;
	let n = /* @__PURE__ */ new Set([t]), r = !0;
	for (; r;) {
		r = !1;
		for (let t of e.groups) t.parentId && n.has(t.parentId) && !n.has(t.id) && (n.add(t.id), r = !0);
	}
	let i = e.nodes.filter((e) => e.groupId && n.has(e.groupId)).map((e) => e.groupId === t ? {
		...e,
		groupId: void 0
	} : e), a = new Set(i.map((e) => e.id)), o = e.groups.filter((e) => e.id !== t && n.has(e.id)).map((e) => e.parentId === t ? {
		...e,
		parentId: void 0
	} : e);
	return {
		kind: "flowchart",
		direction: e.direction,
		nodes: i,
		edges: e.edges.filter((e) => a.has(e.from) && a.has(e.to)),
		groups: o
	};
}
function l(r) {
	let i = r.traceId ?? e(), a = Math.min(32, Math.max(1, r.maxDepth ?? 32)), l = r.root.diagrams ?? {}, u = [{
		id: "",
		label: r.rootLabel ?? r.root.name ?? "",
		model: r.root,
		via: "root"
	}], d = null, f = !1, p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), h = () => u[u.length - 1], g = () => h().model.kind === "flowchart" ? h().model : null, _ = (e) => g()?.nodes.find((t) => t.id === e), v = (e) => g()?.groups.find((t) => t.id === e), y = (e) => {
		let t = _(e);
		if (t) return Math.max(0, t.levels ?? (t.drill || t.drillTo ? 1 : 0));
		let n = v(e);
		return n ? Math.max(1, n.levels ?? 1) : 0;
	}, b = () => {
		let e = g();
		if (!e) return 0;
		let t = 0;
		for (let n of e.nodes) t = Math.max(t, y(n.id));
		for (let n of e.groups) n.parentId || (t = Math.max(t, y(n.id)));
		return t;
	}, x = () => ({
		path: [...u],
		depth: u.length - 1,
		totalDepth: u.length - 1 + b(),
		loading: d
	}), S = () => {
		let e = x();
		for (let r of p) try {
			r(e);
		} catch (e) {
			n("error", "prism.drill.subscriber_error", {
				trace_id: i,
				...t(e)
			});
		}
	}, C = (e, t, r) => (n(e === "NOT_DRILLABLE" ? "debug" : "warn", "prism.drill.push_failed", {
		trace_id: i,
		node_id: r,
		depth: u.length - 1,
		error_code: e
	}), {
		ok: !1,
		code: e,
		message: t
	}), w = (e) => u.some((t) => t.model === e || e.name && t.model.name === e.name), T = (e) => {
		let t = _(e);
		return t?.drillTo && l[t.drillTo] || v(e) ? !0 : !!(t && r.hook && (t.drill || (t.levels ?? 0) > 0));
	}, E = (e) => {
		let t = u.slice(1).map((e) => e.id), n = [...t, e].join("\0"), i = m.get(n);
		if (i) return m.delete(n), m.set(n, i), i;
		let a = (async () => {
			let n = await r.hook(e, t);
			if (n == null) return null;
			if (typeof n == "string") {
				if (!r.parse) throw Object.assign(/* @__PURE__ */ Error("drill hook returned Mermaid text but no parse function was given"), { drillCode: "PARSE_FAILED" });
				try {
					return await r.parse(n);
				} catch (e) {
					throw Object.assign(e instanceof Error ? e : Error(String(e)), { drillCode: "PARSE_FAILED" });
				}
			}
			return n;
		})();
		return m.set(n, a), m.size > o && m.delete(m.keys().next().value), a.catch(() => m.delete(n)), a;
	};
	return {
		get current() {
			return h();
		},
		getState: x,
		canDrill: T,
		levelsOf: y,
		async push(e) {
			if (f) return C("NOT_DRILLABLE", "stack destroyed", e);
			if (d) return C("BUSY", `already loading ${d}`, e);
			if (u.length - 1 >= a) return C("MAX_DEPTH", `max depth ${a}`, e);
			let o = performance.now(), p = _(e), m = v(e), h = null, y = "document", b = p ? s(p.label) : m ? s(m.label) : e;
			if (p?.drillTo && l[p.drillTo]) h = l[p.drillTo];
			else if (m && g()) h = c(g(), e), y = "subgraph";
			else if (p && r.hook) {
				y = "host", d = e, S();
				try {
					h = await E(e);
				} catch (r) {
					let a = r.drillCode ?? "HOOK_FAILED";
					return n("error", "prism.drill.hook_error", {
						trace_id: i,
						node_id: e,
						error_code: a,
						...t(r)
					}), C(a, r instanceof Error ? r.message : String(r), e);
				} finally {
					d = null, S();
				}
				if (f) return C("NOT_DRILLABLE", "stack destroyed", e);
				if (!h) return C("HOOK_EMPTY", "host has no deeper level", e);
			} else return C("NOT_DRILLABLE", `"${e}" has no deeper level`, e);
			if (!h) return C("NOT_DRILLABLE", `"${e}" has no deeper level`, e);
			if (w(h)) return C("CYCLE", `"${e}" leads back into the current path`, e);
			b ||= h.name ?? e;
			let x = {
				id: e,
				label: b,
				model: h,
				via: y
			};
			return u = [...u, x], n("info", "prism.drill.push", {
				trace_id: i,
				node_id: e,
				via: y,
				depth: u.length - 1,
				duration_ms: Math.round(performance.now() - o)
			}), S(), {
				ok: !0,
				crumb: x
			};
		},
		pop() {
			if (f || u.length <= 1) return null;
			let e = u[u.length - 1];
			return u = u.slice(0, -1), n("info", "prism.drill.pop", {
				trace_id: i,
				node_id: e.id,
				depth: u.length - 1
			}), S(), e;
		},
		popTo(e) {
			if (f) return;
			let t = Math.max(0, Math.min(u.length - 1, Math.floor(Number.isFinite(e) ? e : 0)));
			t !== u.length - 1 && (u = u.slice(0, t + 1), n("info", "prism.drill.pop", {
				trace_id: i,
				depth: t,
				jump: !0
			}), S());
		},
		subscribe(e) {
			return p.add(e), () => p.delete(e);
		},
		destroy() {
			f = !0, p.clear(), m.clear();
		}
	};
}
//#endregion
//#region src/ui/drill-chrome.ts
var u = {
	en: {
		coach3d: "Drag to rotate · Scroll to zoom · Double-click to dive in",
		coach2d: "Drag to pan · Pinch or scroll to zoom · Double-click to dive in",
		root: "Overview",
		level: "Level {i} / {n}",
		zoomIn: "Zoom in",
		zoomOut: "Zoom out",
		fit: "Fit diagram",
		iso: "Isometric view",
		revolve: "Revolve",
		breadcrumb: "Drill path",
		ruler: "Levels",
		controls: "View controls",
		notDrillable: "No deeper level here",
		loadFailed: "Could not open this level"
	},
	de: {
		coach3d: "Ziehen zum Drehen · Scroll zum Zoomen · Doppelklick zum Hineingehen",
		coach2d: "Ziehen zum Verschieben · Pinch/Scroll zum Zoomen · Doppelklick zum Hineingehen",
		root: "Übersicht",
		level: "Ebene {i} / {n}",
		zoomIn: "Hineinzoomen",
		zoomOut: "Herauszoomen",
		fit: "Einpassen",
		iso: "Iso-Ansicht",
		revolve: "Drehen",
		breadcrumb: "Drill-Pfad",
		ruler: "Ebenen",
		controls: "Ansicht",
		notDrillable: "Hier gibt es keine tiefere Ebene",
		loadFailed: "Ebene konnte nicht geöffnet werden"
	}
}, d = "http://www.w3.org/2000/svg", f = (e, t) => {
	let n = document.createElementNS(d, e);
	for (let [e, r] of Object.entries(t)) n.setAttribute(e, r);
	return n;
};
function p() {
	let e = f("svg", {
		width: "14",
		height: "20",
		viewBox: "0 0 14 20",
		fill: "none",
		"aria-hidden": "true"
	});
	return e.append(f("rect", {
		x: "1",
		y: "1",
		width: "12",
		height: "18",
		rx: "6",
		stroke: "currentColor",
		"stroke-width": "1.3"
	}), f("line", {
		class: "pd-wheel",
		x1: "7",
		y1: "5",
		x2: "7",
		y2: "8",
		stroke: "currentColor",
		"stroke-width": "1.6",
		"stroke-linecap": "round"
	})), e;
}
var m = (e) => {
	try {
		return globalThis.localStorage?.getItem(e) ?? null;
	} catch {
		return null;
	}
}, h = (e, t) => {
	try {
		globalThis.localStorage?.setItem(e, t);
	} catch {}
};
function g(e, t) {
	let r = u[t.locale === "de" ? "de" : "en"], i = document.createElement("div");
	i.className = "prism-drill", i.dataset.scheme = t.scheme ?? "dark", t.accent && i.style.setProperty("--pd-accent", t.accent), t.top !== void 0 && i.style.setProperty("--pd-top", `${Math.max(0, t.top)}px`), t.bottom !== void 0 && i.style.setProperty("--pd-bottom", `${Math.max(0, t.bottom)}px`);
	let a = document.createElement("nav");
	a.className = "pd-crumbs pd-glass", a.setAttribute("aria-label", r.breadcrumb), a.hidden = !0;
	let o = document.createElement("div");
	o.className = "pd-ruler pd-glass", o.setAttribute("role", "group"), o.setAttribute("aria-label", r.ruler), o.hidden = !0;
	let s = document.createElement("div");
	s.className = "pd-controls pd-glass", s.setAttribute("role", "toolbar"), s.setAttribute("aria-label", r.controls), s.setAttribute("aria-orientation", "vertical");
	let c = (e, t, n) => {
		let r = document.createElement("button");
		return r.type = "button", r.textContent = e, r.title = t, r.setAttribute("aria-label", t), r.addEventListener("click", n), s.appendChild(r), r;
	}, l = !1, d = null;
	t.onZoom && (c("+", r.zoomIn, () => t.onZoom(1.35)), c("−", r.zoomOut, () => t.onZoom(1 / 1.35))), t.onFit && c("⤢", r.fit, () => t.onFit()), t.mode === "3d" && (t.onIso || t.onRevolve) && s.appendChild(document.createElement("hr")), t.mode === "3d" && t.onIso && c("◇", r.iso, () => t.onIso()), t.mode === "3d" && t.onRevolve && (d = c("⟳", r.revolve, () => {
		l = t.onRevolve(!l), d.setAttribute("aria-pressed", String(l));
	}), d.setAttribute("aria-pressed", "false")), s.childElementCount || (s.hidden = !0);
	let f = t.storageKey ?? `prism.hints.${t.mode}.v1`, g = null, _ = null;
	if (t.hints !== !1 && m(f) !== "1") {
		g = document.createElement("div"), g.className = "pd-coach pd-glass", g.setAttribute("role", "note");
		let e = document.createElement("span");
		e.textContent = t.mode === "3d" ? r.coach3d : r.coach2d, g.append(p(), e), requestAnimationFrame(() => g?.classList.add("pd-in")), _ = setTimeout(() => w.dismissHint("timeout"), 6e3);
	}
	let v = e, y = (e) => {
		e.type === "keydown" && [
			"Shift",
			"Meta",
			"Alt",
			"Control",
			"Tab"
		].includes(e.key) || w.dismissHint(e.type);
	};
	if (g) for (let e of [
		"pointerdown",
		"wheel",
		"keydown"
	]) v.addEventListener(e, y, {
		passive: !0,
		capture: !0
	});
	let b = document.createElement("div");
	b.className = "pd-note pd-glass", b.setAttribute("role", "status");
	let x = null;
	i.append(a, o, s, b), g && i.appendChild(g), e.appendChild(i);
	let S = (e, n, r) => {
		let i = document.createElement(r ? "span" : "button");
		return i.className = "pd-crumb", i.textContent = e, r ? i.setAttribute("aria-current", "page") : (i.type = "button", i.addEventListener("click", () => t.onCrumb(n))), i;
	}, C = !1, w = {
		el: i,
		update(e) {
			if (C) return;
			let n = Math.max(e.depth, e.totalDepth);
			a.hidden = n === 0, a.replaceChildren(), e.path.forEach((t, n) => {
				if (n) {
					let e = document.createElement("span");
					e.className = "pd-sep", e.textContent = "›", e.setAttribute("aria-hidden", "true"), a.appendChild(e);
				}
				a.appendChild(S(t.label || (n === 0 ? r.root : "…"), n, n === e.depth));
			});
			let s = document.createElement("span");
			s.className = "pd-level", s.textContent = r.level.replace("{i}", String(e.depth + 1)).replace("{n}", String(n + 1)), a.appendChild(s), o.hidden = n === 0, o.replaceChildren();
			for (let i = 0; i <= n; i++) {
				let n = i < e.path.length, a = document.createElement(n && i !== e.depth ? "button" : "div");
				a.className = "pd-rung" + (n ? "" : " pd-below");
				let s = document.createElement("b");
				s.textContent = `L${i}`;
				let c = document.createElement("span");
				c.textContent = t.levelNames?.[i] ?? (n ? e.path[i].label || (i === 0 ? r.root : "") : e.preview?.[i - e.path.length] || "…"), a.append(s, c), i === e.depth && a.setAttribute("aria-current", "step"), n && i !== e.depth && (a.type = "button", a.addEventListener("click", () => t.onCrumb(i))), o.appendChild(a);
			}
			i.setAttribute("aria-busy", String(!!e.loading));
		},
		setScheme(e) {
			i.dataset.scheme = e;
		},
		setAccent(e) {
			i.style.setProperty("--pd-accent", e);
		},
		setRevolve(e) {
			l = e, d?.setAttribute("aria-pressed", String(e));
		},
		dismissHint(e) {
			if (!g) return;
			let r = g;
			g = null, h(f, "1"), _ && clearTimeout(_);
			for (let e of [
				"pointerdown",
				"wheel",
				"keydown"
			]) v.removeEventListener(e, y, { capture: !0 });
			r.classList.remove("pd-in"), r.classList.add("pd-out"), setTimeout(() => r.remove(), 320), n("debug", "prism.drill.hint_dismissed", {
				trace_id: t.traceId,
				reason: e,
				mode: t.mode
			});
		},
		notify(e) {
			C || (b.textContent = e, b.classList.add("pd-in"), x && clearTimeout(x), x = setTimeout(() => b.classList.remove("pd-in"), 2400));
		},
		destroy() {
			if (!C) {
				C = !0, _ && clearTimeout(_), x && clearTimeout(x);
				for (let e of [
					"pointerdown",
					"wheel",
					"keydown"
				]) v.removeEventListener(e, y, { capture: !0 });
				i.remove();
			}
		}
	};
	return w;
}
//#endregion
//#region src/render3d/drill.ts
var _ = (e) => e === "auto" ? globalThis.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark" : e;
async function v(e) {
	let [{ layoutModel: t }, { createMeasurer: n }] = await Promise.all([import("./atlas-entry-BdxuckZP.js").then((e) => e.d), import("./atlas-entry-BdxuckZP.js").then((e) => e.u)]);
	return t(e, n(document.body));
}
async function y(e) {
	let { parseMermaid: t } = await import("./atlas-entry-BdxuckZP.js").then((e) => e.p);
	return t(e);
}
function b(e, t) {
	let n = {};
	if (e.kind !== "flowchart") return n;
	let r = e;
	for (let e of r.nodes) t.canDrill(e.id) && (n[e.id] = Math.max(1, t.levelsOf(e.id)));
	for (let e of r.groups) t.canDrill(e.id) && (n[e.id] = Math.max(1, t.levelsOf(e.id)));
	return n;
}
var x = 8;
function S(e, t, n) {
	let r = [], i = /* @__PURE__ */ new Set(), a = (e) => !!(e.drillTo || e.drill || (e.levels ?? 0) > 0), o = e, s = !0;
	for (; o && o.kind === "flowchart" && r.length < x;) {
		let e = o.nodes, c = (s && n ? e.find((e) => e.id === n && a(e)) : void 0) ?? e.find((e) => e.drillTo && t[e.drillTo]) ?? e.find(a);
		if (s = !1, !c || (r.push(c.label.replace(/\n/g, " ")), !c.drillTo || i.has(c.drillTo))) break;
		i.add(c.drillTo), o = t[c.drillTo];
	}
	return r;
}
async function C(r, i, a = {}) {
	let o = a.traceId ?? e(), s = a.locale ?? "en", c = u[s === "de" ? "de" : "en"], d = a.layout ?? v, f = a.scheme ?? "dark", p = a.accent, m = !!a.revolve, h = l({
		root: i,
		rootLabel: a.rootLabel ?? i.name ?? c.root,
		hook: a.drill,
		parse: a.parse ?? y,
		traceId: o
	});
	getComputedStyle(r).position === "static" && (r.style.position = "relative"), r.setAttribute("aria-description", c.coach3d);
	let x = document.createElement("div");
	x.style.cssText = "position:absolute;inset:0;", r.appendChild(x);
	let C = null, w = !1, T = !1, E = /* @__PURE__ */ new Set(), D = g(r, {
		mode: "3d",
		locale: s,
		scheme: _(f),
		hints: a.hints,
		top: a.chromeTop,
		bottom: a.chromeBottom ?? (a.playerBar === !1 ? 16 : 92),
		levelNames: a.levelNames,
		traceId: o,
		onCrumb: (e) => void F.popTo(e),
		onZoom: (e) => C?.zoomBy(e),
		onFit: () => C?.fit(),
		onIso: () => C?.isoView(),
		onRevolve: (e) => F.setRevolve(e)
	}), k = i.diagrams ?? {}, A = null, j = (e) => D.update({
		...e,
		preview: S(e.path[e.path.length - 1].model, k, A)
	}), M = h.subscribe(j);
	j(h.getState());
	let N = async (e, t, n) => {
		let r = n ?? await d(e);
		A = null;
		let i = await O(x, r, {
			...a,
			scheme: f,
			accent: p,
			revolve: m,
			traceId: o,
			model: e,
			levels: b(e, h),
			entry: t,
			onFocus: (e) => {
				A = e, j(h.getState());
			},
			onDrill: (e) => void F.push(e),
			onDrillOut: () => h.getState().depth !== 0 && (F.pop(), !0)
		});
		C = i;
		let s = h.getState();
		for (let e of E) e(i, s);
		return i;
	}, P = async (e, r) => {
		if (w || T) return !1;
		w = !0;
		let i = performance.now();
		try {
			return r(), C?.destroy(), C = null, await N(h.current.model, e ? { from: e } : "iso"), n("info", "prism.drill3d.out", {
				trace_id: o,
				depth: h.getState().depth,
				duration_ms: Math.round(performance.now() - i)
			}), !0;
		} catch (e) {
			return n("error", "prism.drill3d.out_failed", {
				trace_id: o,
				...t(e)
			}), D.notify(c.loadFailed), !1;
		} finally {
			w = !1;
		}
	}, F = {
		mode: "3d",
		stack: h,
		get stage() {
			return C;
		},
		async push(e) {
			if (w || T) return !1;
			if (!h.canDrill(e)) return D.notify(c.notDrillable), !1;
			w = !0;
			let r = performance.now();
			try {
				let i = await h.push(e);
				if (!i.ok) return D.notify(i.code === "NOT_DRILLABLE" ? c.notDrillable : c.loadFailed), !1;
				let a = i.crumb.model, s;
				try {
					if (a.kind !== "flowchart") throw Error(`"${a.kind}" levels render in 2D only`);
					s = await d(a);
				} catch (r) {
					return h.pop(), n("warn", "prism.drill3d.level_rejected", {
						trace_id: o,
						node_id: e,
						...t(r)
					}), D.notify(c.loadFailed), !1;
				}
				await C?.dive(e), C?.destroy(), C = null;
				try {
					await N(a, "unfold", s);
				} catch (r) {
					return h.pop(), n("error", "prism.drill3d.mount_failed", {
						trace_id: o,
						node_id: e,
						...t(r)
					}), D.notify(c.loadFailed), await N(h.current.model, { from: e }), !1;
				}
				return n("info", "prism.drill3d.in", {
					trace_id: o,
					node_id: e,
					via: i.crumb.via,
					depth: h.getState().depth,
					duration_ms: Math.round(performance.now() - r)
				}), !0;
			} finally {
				w = !1;
			}
		},
		pop() {
			let e = h.getState().path;
			return e.length < 2 ? Promise.resolve(!1) : P(e[e.length - 1].id, () => h.pop());
		},
		popTo(e) {
			let t = h.getState().path;
			return e < 0 || e >= t.length - 1 ? Promise.resolve(!1) : P(t[e + 1].id, () => h.popTo(e));
		},
		setScheme(e) {
			f = e, C?.setTheme(a.theme ?? "graphite", e), D.setScheme(_(e));
		},
		setAccent(e) {
			p = e, C?.setAccent(e);
		},
		setRevolve(e) {
			return m = C ? C.setRevolve(e) : e, D.setRevolve(m), m;
		},
		onLevel(e) {
			return E.add(e), () => E.delete(e);
		},
		destroy() {
			T || (T = !0, M(), C?.destroy(), C = null, D.destroy(), h.destroy(), x.remove(), E.clear(), n("info", "prism.drill3d.destroy", { trace_id: o }));
		}
	};
	try {
		await N(i, "iso");
	} catch (e) {
		throw F.destroy(), e;
	}
	return n("info", "prism.drill3d.ok", {
		trace_id: o,
		total_depth: h.getState().totalDepth
	}), F;
}
//#endregion
//#region src/render3d/index.ts
var w = class extends Error {
	code;
	constructor(e, t) {
		super(t), this.code = e, this.name = "Prism3dError";
	}
}, T = null;
function E() {
	if (T !== null) return T;
	try {
		if (typeof document > "u") return T = !1;
		let e = globalThis;
		if (!e.WebGLRenderingContext && !e.WebGL2RenderingContext) return T = !1;
		let t = document.createElement("canvas"), n = t.getContext("webgl2") ?? t.getContext("webgl");
		return n ? (n.getExtension("WEBGL_lose_context")?.loseContext(), T = !0) : T = !1;
	} catch {
		return T = !1;
	}
}
function D(e, t, n, o) {
	let s = t?.kind === "flowchart" ? t : r(e), c = i(s, e, n, o === void 0 ? {} : { vocabulary: o });
	return c.steps.length >= 2 ? a(c, { traceId: n }) : null;
}
async function O(r, i, a = {}) {
	let o = a.traceId ?? e(), s = performance.now(), c = {
		trace_id: o,
		node_count: i.nodes.length,
		edge_count: i.edges.length,
		group_count: i.groups.length
	};
	n("info", "prism.render3d.start", c);
	let l = (e, r, i) => {
		throw n("error", "prism.render3d.error", {
			...c,
			error_code: e,
			duration_ms: Math.round(performance.now() - s),
			...i ? t(i) : { error_message: r }
		}), new w(e, r);
	};
	i.kind !== "flowchart" && l("UNSUPPORTED_KIND", `mermaid-prism 3D: "${i.kind}" diagrams render in 2D only`), E() || l("WEBGL_UNAVAILABLE", "mermaid-prism 3D: WebGL is not available in this browser");
	let u = null;
	try {
		u = D(i, a.model, o, a.vocabulary);
		let { createStage: e } = await import("./stage-ChXwXfIR.js"), t = e(r, i, a, o, u);
		return n("info", "prism.render3d.ok", {
			...c,
			duration_ms: Math.round(performance.now() - s),
			step_count: u?.getState().stepCount ?? 0
		}), t;
	} catch (e) {
		return u?.destroy(), l("STAGE_FAILED", e instanceof Error ? e.message : String(e), e);
	}
}
//#endregion
export { C as renderDrill3d, O as renderScene3d, E as supportsWebGL };
