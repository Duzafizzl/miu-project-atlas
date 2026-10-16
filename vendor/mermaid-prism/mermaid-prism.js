import { r as e } from "./chunks/rolldown-runtime-BZwVK1dO.js";
import { a as t, c as n, d as r, f as i, i as a, l as o, n as s, o as c, t as l, u } from "./chunks/timeline-ys46lYsu.js";
import { n as d, r as f, t as p } from "./chunks/player-bar-Dmh0XA62.js";
import { t as m } from "./chunks/player-CQ6iMkSf.js";
//#region src/adapters/sanitize.ts
var h = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: "\"",
	apos: "'",
	nbsp: "\xA0",
	ndash: "–",
	mdash: "—",
	hellip: "…",
	rarr: "→",
	larr: "←",
	harr: "↔",
	uarr: "↑",
	darr: "↓",
	middot: "·",
	bull: "•",
	copy: "©",
	reg: "®",
	trade: "™",
	deg: "°",
	times: "×",
	euro: "€",
	laquo: "«",
	raquo: "»",
	lsquo: "‘",
	rsquo: "’",
	ldquo: "“",
	rdquo: "”",
	hash: "#",
	num: "#",
	semi: ";",
	colon: ":"
}, g = /\ufb02\u00b0\u00b0(\d+)\u00b6\u00df/g, _ = /\ufb02\u00b0([A-Za-z][A-Za-z0-9]*)\u00b6\u00df/g;
function v(e) {
	return e.replace(g, "&#$1;").replace(_, "&$1;");
}
function y(e) {
	return !Number.isFinite(e) || e <= 0 || e > 1114111 || e >= 55296 && e <= 57343 ? "�" : String.fromCodePoint(e);
}
function b(e) {
	return e.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (e, t) => {
		if (t[0] === "#") {
			let e = t[1] === "x" || t[1] === "X";
			return y(parseInt(t.slice(e ? 2 : 1), e ? 16 : 10));
		}
		return h[t.toLowerCase()] ?? e;
	});
}
var x = /<br\s*\/?\s*>/gi, S = /<!--[\s\S]*?-->/g, C = /<\/?[A-Za-z!][^<>]*>/g, w = /<\/?[A-Za-z][^<>]*$/, T = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
function E(e) {
	if (e == null) return "";
	let t = v(String(e));
	t = t.replace(/\r\n?/g, "\n"), t = t.replace(x, "\n"), t = t.replace(S, "");
	let n;
	do
		n = t, t = t.replace(C, "");
	while (t !== n);
	return t = t.replace(w, ""), t = b(t), t = t.replace(T, ""), t.split("\n").map((e) => e.replace(/[ \t]+/g, " ").trim()).join("\n").replace(/^\n+|\n+$/g, "");
}
function D(e) {
	let t = /^"?`([\s\S]*)`"?$/.exec(e);
	return t ? t[1] ?? "" : e;
}
function O(e) {
	return E(D(e == null ? "" : String(e)));
}
function k(e, t) {
	if (typeof e != "string") return;
	let n = b(v(e)).trim();
	if (!n) return;
	let r;
	try {
		r = new URL(n);
	} catch {
		return;
	}
	let i = r.protocol.toLowerCase();
	if (i !== "http:" && i !== "https:") return;
	let a = t === "_blank" || t === "_self" ? t : void 0;
	return a ? {
		href: r.href,
		target: a
	} : { href: r.href };
}
//#endregion
//#region src/adapters/tone.ts
var A = [
	[/ok|success|done|pass|green/i, "ok"],
	[/warn|pending|amber|yellow/i, "warn"],
	[/danger|error|fail|critical|red/i, "danger"],
	[/accent|primary|active|blue/i, "accent"]
], j = {
	red: "#ff0000",
	crimson: "#dc143c",
	firebrick: "#b22222",
	darkred: "#8b0000",
	tomato: "#ff6347",
	salmon: "#fa8072",
	pink: "#ffc0cb",
	hotpink: "#ff69b4",
	deeppink: "#ff1493",
	orange: "#ffa500",
	darkorange: "#ff8c00",
	coral: "#ff7f50",
	gold: "#ffd700",
	yellow: "#ffff00",
	amber: "#ffbf00",
	khaki: "#f0e68c",
	green: "#008000",
	lime: "#00ff00",
	limegreen: "#32cd32",
	seagreen: "#2e8b57",
	forestgreen: "#228b22",
	darkgreen: "#006400",
	olive: "#808000",
	teal: "#008080",
	cyan: "#00ffff",
	aqua: "#00ffff",
	turquoise: "#40e0d0",
	blue: "#0000ff",
	navy: "#000080",
	royalblue: "#4169e1",
	dodgerblue: "#1e90ff",
	steelblue: "#4682b4",
	skyblue: "#87ceeb",
	lightblue: "#add8e6",
	purple: "#800080",
	violet: "#ee82ee",
	magenta: "#ff00ff",
	fuchsia: "#ff00ff",
	white: "#ffffff",
	black: "#000000",
	gray: "#808080",
	grey: "#808080",
	silver: "#c0c0c0"
};
function M(e) {
	for (let [t, n] of A) if (e.some((e) => t.test(e))) return n;
}
function N(e) {
	let t = e.replace(/^#/, "");
	if (/^[0-9a-f]{3,4}$/i.test(t)) {
		let [e, n, r] = [
			0,
			1,
			2
		].map((e) => parseInt(t.charAt(e).repeat(2), 16));
		return {
			r: e,
			g: n,
			b: r
		};
	}
	if (/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(t)) return {
		r: parseInt(t.slice(0, 2), 16),
		g: parseInt(t.slice(2, 4), 16),
		b: parseInt(t.slice(4, 6), 16)
	};
}
function ee(e) {
	let t = parseFloat(e);
	return e.trim().endsWith("%") ? t / 100 * 255 : t;
}
function te(e) {
	let t = e.trim().toLowerCase().replace(/\s*!important$/, "");
	if (t.startsWith("#")) return N(t);
	let n = /^rgba?\(([^)]*)\)$/.exec(t);
	if (n) {
		let e = n[1].split(/[\s,/]+/).filter(Boolean);
		if (e.length < 3) return;
		let [t, r, i] = e.slice(0, 3).map(ee);
		return [
			t,
			r,
			i
		].every((e) => Number.isFinite(e)) ? {
			r: t,
			g: r,
			b: i
		} : void 0;
	}
	let r = /^hsla?\(([^)]*)\)$/.exec(t);
	if (r) {
		let e = r[1].split(/[\s,/]+/).filter(Boolean), t = parseFloat(e[0] ?? ""), n = parseFloat(e[1] ?? "") / 100, i = parseFloat(e[2] ?? "") / 100;
		return [
			t,
			n,
			i
		].every((e) => Number.isFinite(e)) ? ne(t, n, i) : void 0;
	}
	let i = j[t];
	return i ? N(i) : void 0;
}
function ne(e, t, n) {
	let r = (t) => (t + e / 30) % 12, i = t * Math.min(n, 1 - n), a = (e) => n - i * Math.max(-1, Math.min(r(e) - 3, Math.min(9 - r(e), 1)));
	return {
		r: a(0) * 255,
		g: a(8) * 255,
		b: a(4) * 255
	};
}
function re({ r: e, g: t, b: n }) {
	let [r, i, a] = [
		e / 255,
		t / 255,
		n / 255
	], o = Math.max(r, i, a), s = Math.min(r, i, a), c = (o + s) / 2, l = o - s;
	if (l === 0) return {
		h: 0,
		s: 0,
		l: c
	};
	let u = l / (1 - Math.abs(2 * c - 1)), d;
	return d = o === r ? (i - a) / l % 6 : o === i ? (a - r) / l + 2 : (r - i) / l + 4, d *= 60, d < 0 && (d += 360), {
		h: d,
		s: u,
		l: c
	};
}
function P(e) {
	let t = te(e);
	if (!t) return;
	let { h: n, s: r, l: i } = re(t);
	if (!(r < .2 || i < .08 || i > .97)) {
		if (n < 15 || n >= 290) return "danger";
		if (n < 65) return "warn";
		if (n < 170) return "ok";
		if (n < 260) return "accent";
	}
}
function F(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) for (let e of String(n).split(";")) {
		let n = e.indexOf(":");
		n <= 0 || t.set(e.slice(0, n).trim().toLowerCase(), e.slice(n + 1).trim());
	}
	return t;
}
function I(e) {
	let t = F(e);
	for (let e of [
		"stroke",
		"fill",
		"background",
		"background-color",
		"color"
	]) {
		let n = t.get(e), r = n ? P(n) : void 0;
		if (r) return r;
	}
}
function L({ classes: e, inlineStyles: t, classStyles: n }) {
	return M(e) ?? I(t) ?? I(e.flatMap((e) => [...n(e)])) ?? "neutral";
}
//#endregion
//#region src/adapters/flowchart.ts
function ie(e) {
	let t = e;
	return !!t && typeof t.getVertices == "function" && typeof t.getEdges == "function" && typeof t.getSubGraphs == "function" && typeof t.getDirection == "function" && typeof t.getClasses == "function";
}
function R(e) {
	return e instanceof Map ? [...e.values()] : Object.values(e);
}
function z(e, t) {
	return e instanceof Map ? e.get(t) : Object.prototype.hasOwnProperty.call(e, t) ? e[t] : void 0;
}
var ae = {
	square: "rect",
	rect: "rect",
	round: "round",
	rounded: "round",
	stadium: "stadium",
	diamond: "diamond",
	question: "diamond",
	diam: "diamond",
	decision: "diamond",
	circle: "circle",
	circ: "circle",
	doublecircle: "circle",
	"dbl-circ": "circle",
	cylinder: "cylinder",
	cyl: "cylinder",
	database: "cylinder",
	db: "cylinder",
	hexagon: "hexagon",
	hex: "hexagon",
	subroutine: "subroutine",
	subproc: "subroutine",
	lean_right: "parallelogram",
	lean_left: "parallelogram",
	lean_r: "parallelogram",
	lean_l: "parallelogram",
	"lean-r": "parallelogram",
	"lean-l": "parallelogram",
	trapezoid: "parallelogram",
	inv_trapezoid: "parallelogram",
	"trap-b": "parallelogram",
	"trap-t": "parallelogram"
};
function oe(e) {
	return e ? ae[e] ?? "other" : "rect";
}
function se(e) {
	switch ((e ?? "TB").trim().toUpperCase()) {
		case "BT": return "BT";
		case "LR": return "LR";
		case "RL": return "RL";
		default: return "TB";
	}
}
function ce(e) {
	switch (e) {
		case "dotted": return "dotted";
		case "thick": return "thick";
		case "invisible": return "invisible";
		default: return "solid";
	}
}
function le(e) {
	let t = e ?? "arrow_point";
	return t === "arrow_open" ? {
		arrowStart: !1,
		arrowEnd: !1
	} : t.startsWith("double_arrow_") ? {
		arrowStart: !0,
		arrowEnd: !0
	} : {
		arrowStart: !1,
		arrowEnd: t.startsWith("arrow_")
	};
}
var ue = /* @__PURE__ */ new Set(["clickable", "default"]);
function de(e) {
	return (e ?? []).map(String).filter((e) => e && !ue.has(e));
}
function fe(e) {
	let [t = "", ...n] = e.split("\n"), r = n.join("\n").trim();
	return r ? {
		label: t,
		meta: r
	} : { label: t };
}
function pe(e, t) {
	let n = e.getClasses(), r = (e) => z(n, e)?.styles ?? [], i = e.getSubGraphs() ?? [], a = new Set(i.map((e) => e.id)), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
	for (let e of i) for (let t of e.nodes ?? []) a.has(t) ? !s.has(t) && t !== e.id && s.set(t, e.id) : o.has(t) || o.set(t, e.id);
	let c = i.map((e) => {
		let t = de(e.classes), n = {
			id: String(e.id),
			label: O(e.title ?? e.id),
			tone: L({
				classes: t,
				inlineStyles: e.styles ?? [],
				classStyles: r
			})
		}, i = s.get(e.id);
		return i && (n.parentId = i), n;
	}), l = [];
	for (let n of R(e.getVertices())) {
		if (a.has(n.id)) continue;
		let e = de(n.classes), i = {
			id: String(n.id),
			...fe(O(n.text ?? n.id)),
			shape: oe(n.type),
			classes: e,
			tone: L({
				classes: e,
				inlineStyles: n.styles ?? [],
				classStyles: r
			})
		};
		n.icon && (i.icon = O(n.icon));
		let s = o.get(n.id);
		if (s && (i.groupId = s), n.link !== void 0) {
			let e = k(n.link, n.linkTarget);
			e ? i.link = e : u("warn", "prism.parse.link_dropped", {
				trace_id: t,
				node_id: n.id
			});
		}
		l.push(i);
	}
	let d = /* @__PURE__ */ new Set([...l.map((e) => e.id), ...c.map((e) => e.id)]), f = /* @__PURE__ */ new Set(), p = [];
	return (e.getEdges() ?? []).forEach((e, n) => {
		let r = String(e.start), i = String(e.end);
		if (!d.has(r) || !d.has(i)) {
			u("warn", "prism.parse.edge_dropped", {
				trace_id: t,
				from: r,
				to: i,
				reason: "unknown_endpoint"
			});
			return;
		}
		let a = e.id ? String(e.id) : `L_${r}_${i}_${n}`;
		for (let t = 1; f.has(a); t++) a = `${e.id ?? `L_${r}_${i}`}_${n}_${t}`;
		f.add(a);
		let o = O(e.text ?? ""), s = {
			id: a,
			from: r,
			to: i,
			stroke: ce(e.stroke),
			...le(e.type)
		};
		o && (s.label = o), p.push(s);
	}), {
		kind: "flowchart",
		direction: se(e.getDirection()),
		nodes: l,
		edges: p,
		groups: c
	};
}
var me = /^[A-Za-z0-9_\-.:]+$/, he = /^(\d+(?:\.\d+)?)(ms|s|m)$/, ge = /^\s*%%\s*@prism\b(.*)$/, _e = 5e3, ve = /^[A-Za-z][A-Za-z0-9_]{0,31}$/, ye = /* @__PURE__ */ new Set([
	"yes",
	"no",
	"error",
	"timeout",
	"retry",
	"wait",
	"done",
	"decision",
	"spark",
	"gate",
	"lock",
	"park",
	"radio",
	"catch",
	"lane",
	"blackbox",
	"kick",
	"regulate",
	"gauge-return",
	"scan",
	"eye",
	"settle",
	"filter",
	"fan"
]);
function be(e) {
	let t = he.exec(e);
	if (!t) return null;
	let n = Number(t[1]), r = t[2] === "ms" ? n : t[2] === "s" ? n * 1e3 : n * 6e4;
	return !Number.isFinite(r) || r <= 0 ? null : Math.min(c, Math.round(r));
}
function xe(e) {
	return e.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
}
function Se(e, t) {
	let n = e.trim().split(/\s+/).filter(Boolean);
	return n.length < t ? "missing_args" : n.length > t ? "extra_args" : n;
}
function Ce(e) {
	let t = Se(e, 3);
	if (typeof t == "string") return {
		ok: !1,
		reason: t
	};
	let [n = "", r = "", i = ""] = t;
	return !me.test(n) || !me.test(r) ? {
		ok: !1,
		reason: "bad_id"
	} : ve.test(i) ? {
		ok: !0,
		edge: {
			from: n,
			to: r,
			kind: i
		}
	} : {
		ok: !1,
		reason: "bad_kind"
	};
}
function we(e) {
	let t = Se(e, 2);
	if (typeof t == "string") return {
		ok: !1,
		reason: t
	};
	let [n = "", r = ""] = t;
	return me.test(n) ? ve.test(r) ? {
		ok: !0,
		node: {
			id: n,
			role: r
		}
	} : {
		ok: !1,
		reason: "bad_role"
	} : {
		ok: !1,
		reason: "bad_id"
	};
}
function Te(e) {
	if (/^\s*off\s*$/.test(e)) return {
		ok: !0,
		fxOff: !0
	};
	let t = Se(e, 2);
	if (typeof t == "string") return {
		ok: !1,
		reason: t
	};
	let [n = "", r = ""] = t;
	if (!ye.has(r)) return {
		ok: !1,
		reason: "bad_effect"
	};
	let i = n.indexOf("->");
	if (i >= 0) {
		let e = n.slice(0, i), t = n.slice(i + 2);
		return !me.test(e) || !me.test(t) ? {
			ok: !1,
			reason: "bad_id"
		} : {
			ok: !0,
			fx: {
				target: {
					from: e,
					to: t
				},
				effect: r
			}
		};
	}
	return me.test(n) ? {
		ok: !0,
		fx: {
			target: { node: n },
			effect: r
		}
	} : {
		ok: !1,
		reason: "bad_id"
	};
}
function Ee(e) {
	let t = e.trim(), n = /^(\S+)\s*(.*)$/.exec(t);
	if (!n) return {
		ok: !1,
		reason: "empty"
	};
	if (n[1] === "edge") return Ce(n[2] ?? "");
	if (n[1] === "node") return we(n[2] ?? "");
	if (n[1] === "fx") return Te(n[2] ?? "");
	if (n[1] !== "wait") return {
		ok: !1,
		reason: "unknown_verb"
	};
	let r = /^(\S+)\s+(\S+)\s*(.*)$/.exec(n[2] ?? "");
	if (!r) return {
		ok: !1,
		reason: "missing_args"
	};
	let [, i = "", a = "", o = ""] = r;
	if (!me.test(i)) return {
		ok: !1,
		reason: "bad_id"
	};
	let s = be(a);
	if (s === null) return {
		ok: !1,
		reason: "bad_duration"
	};
	let c = o.trim();
	if (!c) return {
		ok: !0,
		hint: {
			targetId: i,
			ms: s
		}
	};
	let l;
	if (c.startsWith("\"")) {
		let e = /^"([^"]*)"$/.exec(c);
		if (!e) return {
			ok: !1,
			reason: "bad_reason_quotes"
		};
		l = e[1] ?? "";
	} else {
		if (/\s/.test(c)) return {
			ok: !1,
			reason: "reason_needs_quotes"
		};
		l = c;
	}
	let u = xe(l);
	return {
		ok: !0,
		hint: u ? {
			targetId: i,
			ms: s,
			reason: u
		} : {
			targetId: i,
			ms: s
		}
	};
}
function De(e, t) {
	let n = {
		waits: [],
		edges: [],
		nodes: [],
		fx: [],
		fxOff: !1
	};
	if (typeof e != "string" || !e.includes("@prism")) return n;
	let r = e.split(/\r?\n/);
	for (let e = 0; e < Math.min(r.length, _e); e++) {
		let i = ge.exec(r[e]);
		if (!i) continue;
		let a = Ee(i[1] ?? "");
		a.ok ? "hint" in a ? n.waits.push(a.hint) : "edge" in a ? n.edges.push(a.edge) : "node" in a ? n.nodes.push(a.node) : "fx" in a ? n.fx.push(a.fx) : n.fxOff = !0 : u("warn", "prism.directive.invalid", {
			trace_id: t,
			line: e + 1,
			error_code: a.reason,
			line_length: r[e].length
		});
	}
	return n.waits.length + n.edges.length + n.nodes.length + n.fx.length + +!!n.fxOff && u("debug", "prism.directive.ok", {
		trace_id: t,
		wait_count: n.waits.length,
		edge_count: n.edges.length,
		node_count: n.nodes.length,
		fx_count: n.fx.length,
		fx_off: n.fxOff
	}), n;
}
function Oe(e, t, n) {
	let r = e;
	if (e.kind === "flowchart" && (t.edges.length || t.nodes.length)) {
		let i = e.edges.map((e) => ({ ...e })), a = e.nodes.map((e) => ({ ...e }));
		for (let e of t.edges) {
			let t = i.filter((t) => t.from === e.from && t.to === e.to);
			if (!t.length) u("warn", "prism.directive.unmatched", {
				trace_id: n,
				verb: "edge",
				from_id: e.from,
				to_id: e.to,
				error_code: "UNKNOWN_EDGE"
			});
			else for (let n of t) n.kind = e.kind;
		}
		for (let e of t.nodes) {
			let t = a.find((t) => t.id === e.id);
			t ? t.kind = e.role : u("warn", "prism.directive.unmatched", {
				trace_id: n,
				verb: "node",
				node_id: e.id,
				error_code: "UNKNOWN_ID"
			});
		}
		r = {
			...e,
			edges: i,
			nodes: a
		};
	} else e.kind === "sequence" && (t.edges.length || t.nodes.length) && u("debug", "prism.directive.skipped", {
		trace_id: n,
		diagram_type: "sequence",
		edge_count: t.edges.length,
		node_count: t.nodes.length
	});
	return t.waits.length && (r = {
		...r,
		waits: t.waits
	}), t.fx.length && (r = {
		...r,
		fx: t.fx
	}), t.fxOff && (r = {
		...r,
		fxOff: !0
	}), r;
}
//#endregion
//#region src/adapters/mermaid.ts
var ke = null, Ae = Promise.resolve();
function je() {
	return ke || (ke = import("./chunks/mermaid.core-TGRI-K3P.js").then((e) => {
		let t = e.default;
		return t.initialize({
			startOnLoad: !1,
			securityLevel: "strict"
		}), t;
	}), ke.catch(() => {
		ke = null;
	})), ke;
}
function Me(e) {
	let t = Ae.then(async () => {
		let t = await (await je()).mermaidAPI.getDiagramFromText(e);
		return {
			type: String(t.type),
			db: t.db
		};
	});
	return Ae = t.catch(() => void 0), t;
}
//#endregion
//#region src/adapters/sequence.ts
function Ne(e) {
	let t = e;
	return !!t && typeof t.getActors == "function" && typeof t.getMessages == "function";
}
var Pe = {
	SOLID: 0,
	DOTTED: 1,
	NOTE: 2,
	SOLID_CROSS: 3,
	DOTTED_CROSS: 4,
	SOLID_OPEN: 5,
	DOTTED_OPEN: 6,
	LOOP_START: 10,
	LOOP_END: 11,
	ALT_START: 12,
	ALT_ELSE: 13,
	ALT_END: 14,
	OPT_START: 15,
	OPT_END: 16,
	ACTIVE_START: 17,
	ACTIVE_END: 18,
	PAR_START: 19,
	PAR_AND: 20,
	PAR_END: 21,
	RECT_START: 22,
	RECT_END: 23,
	SOLID_POINT: 24,
	DOTTED_POINT: 25,
	AUTONUMBER: 26,
	CRITICAL_START: 27,
	CRITICAL_OPTION: 28,
	CRITICAL_END: 29,
	BREAK_START: 30,
	BREAK_END: 31,
	PAR_OVER_START: 32,
	BIDIRECTIONAL_SOLID: 33,
	BIDIRECTIONAL_DOTTED: 34
}, Fe = {
	LEFTOF: 0,
	RIGHTOF: 1,
	OVER: 2
}, Ie = {
	LOOP_START: "loop",
	ALT_START: "alt",
	OPT_START: "opt",
	PAR_START: "par",
	PAR_OVER_START: "par",
	CRITICAL_START: "critical",
	BREAK_START: "break",
	RECT_START: "rect"
}, Le = /* @__PURE__ */ new Set([
	"ALT_ELSE",
	"PAR_AND",
	"CRITICAL_OPTION"
]), Re = /* @__PURE__ */ new Set([
	"LOOP_END",
	"ALT_END",
	"OPT_END",
	"PAR_END",
	"CRITICAL_END",
	"BREAK_END",
	"RECT_END"
]), ze = /* @__PURE__ */ new Set(["AUTONUMBER"]);
function Be(e) {
	if (typeof e == "string") return e;
	if (e && typeof e == "object" && typeof e.actor == "string") return e.actor;
}
function Ve(e) {
	return e === "SOLID_POINT" || e === "DOTTED_POINT" ? "async" : e.includes("DOTTED") ? "reply" : "sync";
}
function He(e, t) {
	let n = e.LINETYPE ?? Pe, r = e.PLACEMENT ?? Fe, i = new Map(Object.entries(n).map(([e, t]) => [t, e])), a = e.getActors(), o = e.getActorKeys?.() ?? (a instanceof Map ? [...a.keys()] : Object.keys(a)), s = [];
	for (let e of o) {
		let t = a instanceof Map ? a.get(e) : a[e];
		t && s.push({
			id: String(t.name ?? e),
			label: O(t.description ?? t.name ?? e) || String(e),
			role: t.type === "actor" ? "actor" : "participant"
		});
	}
	let c = new Set(s.map((e) => e.id)), l = [], d = [], f = [], p = [], m = 0, h = 0, g = (e, n) => {
		for (let t = l.length - 1; t >= 0; t--) {
			let r = l[t];
			if (n === "activate" ? r.to === e : r.from === e) {
				r[n] = !0;
				return;
			}
		}
		u("warn", "prism.parse.activation_unmapped", {
			trace_id: t,
			participant: e,
			kind: n
		});
	}, _ = (e) => {
		e.block.endIndex = m - 1, e.block.endIndex < e.block.startIndex && (f.splice(f.indexOf(e.block), 1), u("debug", "prism.parse.block_empty", {
			trace_id: t,
			block_kind: e.block.kind
		}));
	};
	for (let n of e.getMessages() ?? []) {
		let e = i.get(Number(n.type)) ?? "", a = Be(n.from), o = Be(n.to), s = O(n.message ?? "");
		if (ze.has(e)) continue;
		if (e === "NOTE") {
			if (!a) continue;
			let e = n.placement === r.LEFTOF ? "left" : n.placement === r.RIGHTOF ? "right" : "over", t = o && o !== a && e === "over" ? [a, o] : [a];
			d.push({
				id: `note_${n.id ?? m}`,
				index: m++,
				over: t,
				placement: e,
				text: s
			});
			continue;
		}
		let v = Ie[e];
		if (v) {
			let e = {
				id: `block_${h++}`,
				kind: v,
				label: v === "rect" ? "" : s,
				startIndex: m,
				endIndex: m,
				sections: []
			};
			(v === "alt" || v === "par" || v === "critical") && e.sections.push({
				label: s,
				startIndex: m
			}), f.push(e), p.push({ block: e });
			continue;
		}
		if (Le.has(e)) {
			let e = p[p.length - 1];
			e && e.block.sections.push({
				label: s,
				startIndex: m
			});
			continue;
		}
		if (Re.has(e)) {
			let e = p.pop();
			e && _(e);
			continue;
		}
		if (e === "ACTIVE_START") {
			let e = l[l.length - 1];
			if (e?.activate && e.to === a) continue;
			g(a, "activate");
			continue;
		}
		if (e === "ACTIVE_END") {
			g(a, "deactivate");
			continue;
		}
		if (!a || !o) {
			u("debug", "prism.parse.signal_skipped", {
				trace_id: t,
				line_type: e || n.type
			});
			continue;
		}
		if (!c.has(a) || !c.has(o)) {
			u("warn", "prism.parse.message_dropped", {
				trace_id: t,
				from: a,
				to: o,
				reason: "unknown_participant"
			});
			continue;
		}
		let y = {
			id: `msg_${n.id ?? m}`,
			index: m++,
			from: a,
			to: o,
			label: s,
			kind: Ve(e)
		};
		n.activate && (y.activate = !0), l.push(y);
	}
	for (; p.length;) _(p.pop());
	return {
		kind: "sequence",
		participants: s,
		messages: l,
		notes: d,
		blocks: f
	};
}
//#endregion
//#region src/adapters/index.ts
var Ue = class extends Error {
	diagramType;
	constructor(e) {
		super(`mermaid-prism: diagram type "${e}" is not supported yet`), this.diagramType = e, this.name = "UnsupportedDiagramError";
	}
}, We = /* @__PURE__ */ new Set([
	"flowchart",
	"flowchart-v2",
	"flowchart-elk",
	"graph"
]), Ge = /* @__PURE__ */ new Set(["sequence", "sequenceDiagram"]);
function Ke(e) {
	return e.kind === "flowchart" ? {
		node_count: e.nodes.length,
		edge_count: e.edges.length
	} : {
		node_count: e.participants.length,
		edge_count: e.messages.length
	};
}
async function qe(e, t = {}) {
	let n = t.traceId ?? r(), i = performance.now(), a = "unknown";
	u("debug", "prism.parse.start", {
		trace_id: n,
		code_length: typeof e == "string" ? e.length : 0
	});
	try {
		if (typeof e != "string") throw TypeError("mermaid-prism: diagram code must be a string");
		let { type: t, db: r } = await Me(e);
		a = t;
		let o;
		if (We.has(t)) {
			if (!ie(r)) throw Error(`mermaid-prism: flowchart DB shape changed (type "${t}")`);
			o = pe(r, n);
		} else if (Ge.has(t)) {
			if (!Ne(r)) throw Error(`mermaid-prism: sequence DB shape changed (type "${t}")`);
			o = He(r, n);
		} else throw new Ue(t);
		return o = Oe(o, De(e, n), n), u("info", "prism.parse.ok", {
			trace_id: n,
			diagram_type: o.kind,
			mermaid_type: t,
			...Ke(o),
			duration_ms: Math.round(performance.now() - i)
		}), o;
	} catch (e) {
		let t = e instanceof Ue;
		throw u(t ? "warn" : "error", "prism.parse.error", {
			trace_id: n,
			error_code: t ? "UNSUPPORTED_DIAGRAM" : "PARSE_FAILED",
			diagram_type: a,
			duration_ms: Math.round(performance.now() - i),
			...o(e)
		}), e;
	}
}
var Je = async () => {
	let t = (await import("./chunks/elk.bundled-Be7oW7l-.js").then((t) => /* @__PURE__ */ e(t.default, 1))).default;
	return new t();
}, Ye = null;
function Xe() {
	return Ye || (Ye = Promise.resolve().then(() => Je()), Ye.catch(() => {
		Ye = null;
	})), Ye;
}
//#endregion
//#region src/layout/bounds.ts
function Ze() {
	return {
		minX: Infinity,
		minY: Infinity,
		maxX: -Infinity,
		maxY: -Infinity
	};
}
function B(e, t) {
	Qe(e, {
		x: t.x,
		y: t.y
	}), Qe(e, {
		x: t.x + t.width,
		y: t.y + t.height
	});
}
function Qe(e, t) {
	Number.isFinite(t.x) && Number.isFinite(t.y) && (e.minX = Math.min(e.minX, t.x), e.minY = Math.min(e.minY, t.y), e.maxX = Math.max(e.maxX, t.x), e.maxY = Math.max(e.maxY, t.y));
}
function $e(e) {
	let t = Ze();
	e.nodes.forEach((e) => B(t, e)), e.groups.forEach((e) => B(t, e));
	for (let n of e.edges) n.points.forEach((e) => Qe(t, e)), n.label && B(t, n.label);
	let n = e.sequence;
	return n && (n.participants.forEach((e) => B(t, e)), n.messages.forEach((e) => B(t, e.label)), n.messages.forEach((e) => {
		Qe(t, {
			x: e.fromX,
			y: e.y
		}), Qe(t, {
			x: e.toX,
			y: e.y
		});
	}), n.activations.forEach((e) => B(t, e)), n.notes.forEach((e) => B(t, e)), n.blocks.forEach((e) => B(t, e)), n.participants.length && Qe(t, {
		x: n.participants[0].lifelineX,
		y: n.lifelineBottom
	})), t;
}
function V(e, t, n) {
	return {
		...e,
		x: e.x + t,
		y: e.y + n
	};
}
function et(e) {
	let t = $e(e);
	if (!Number.isFinite(t.minX)) return {
		...e,
		width: 0,
		height: 0
	};
	let n = -t.minX, r = -t.minY, i = {
		...e,
		width: t.maxX - t.minX,
		height: t.maxY - t.minY,
		nodes: e.nodes.map((e) => V(e, n, r)),
		groups: e.groups.map((e) => V(e, n, r)),
		edges: e.edges.map((e) => {
			let t = {
				...e,
				points: e.points.map((e) => ({
					x: e.x + n,
					y: e.y + r
				}))
			};
			return e.label && (t.label = V(e.label, n, r)), t;
		})
	}, a = e.sequence;
	return a && (i.sequence = {
		participants: a.participants.map((e) => ({
			...V(e, n, r),
			lifelineX: e.lifelineX + n
		})),
		messages: a.messages.map((e) => ({
			...e,
			y: e.y + r,
			fromX: e.fromX + n,
			toX: e.toX + n,
			label: V(e.label, n, r)
		})),
		activations: a.activations.map((e) => V(e, n, r)),
		notes: a.notes.map((e) => V(e, n, r)),
		blocks: a.blocks.map((e) => ({
			...V(e, n, r),
			dividers: e.dividers.map((e) => ({
				...e,
				y: e.y + r
			}))
		})),
		lifelineTop: a.lifelineTop + r,
		lifelineBottom: a.lifelineBottom + r
	}), i;
}
//#endregion
//#region src/layout/flowchart.ts
var H = {
	nodeNode: 40,
	betweenLayers: 64,
	groupHeaderGap: 16,
	groupSide: 20,
	groupBottom: 20,
	edgeNode: 24,
	edgeEdge: 16
}, tt = {
	TB: "DOWN",
	BT: "UP",
	LR: "RIGHT",
	RL: "LEFT"
};
function nt(e) {
	return {
		"elk.algorithm": "layered",
		"elk.direction": tt[e],
		"elk.edgeRouting": "ORTHOGONAL",
		"elk.hierarchyHandling": "INCLUDE_CHILDREN",
		"elk.spacing.nodeNode": String(H.nodeNode),
		"elk.layered.spacing.nodeNodeBetweenLayers": String(H.betweenLayers),
		"elk.spacing.edgeNode": String(H.edgeNode),
		"elk.layered.spacing.edgeNodeBetweenLayers": String(H.edgeNode),
		"elk.spacing.edgeEdge": String(H.edgeEdge),
		"elk.layered.spacing.edgeEdgeBetweenLayers": String(H.edgeEdge),
		"elk.edgeLabels.placement": "CENTER",
		"elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
		"elk.padding": "[top=0,left=0,bottom=0,right=0]",
		"org.eclipse.elk.json.shapeCoords": "ROOT",
		"org.eclipse.elk.json.edgeCoords": "ROOT"
	};
}
function rt(e) {
	let t = new Map(e.map((e) => [e.id, e])), n = /* @__PURE__ */ new Map(), r = (e, i) => {
		let a = n.get(e.id);
		if (a !== void 0) return a;
		let o = e.parentId ? t.get(e.parentId) : void 0, s = o && !i.has(o.id) ? r(o, i.add(e.id)) + 1 : 0;
		return n.set(e.id, s), s;
	};
	for (let t of e) r(t, /* @__PURE__ */ new Set());
	return n;
}
function it(e, t) {
	let n = new Set(e.groups.map((e) => e.id)), r = /* @__PURE__ */ new Map(), i = {
		id: "__prism_root__",
		layoutOptions: nt(e.direction),
		children: [],
		edges: []
	};
	for (let n of e.groups) {
		let e = t.groupHeader(n), i = Math.ceil(e.height + H.groupHeaderGap), a = Math.ceil(e.width + H.groupSide * 2), o = Math.ceil(i + H.groupBottom);
		r.set(n.id, {
			id: n.id,
			children: [],
			layoutOptions: {
				"elk.padding": `[top=${i},left=${H.groupSide},bottom=${H.groupBottom},right=${H.groupSide}]`,
				"elk.nodeSize.constraints": "MINIMUM_SIZE",
				"elk.nodeSize.minimum": `(${a}, ${o})`
			}
		});
	}
	for (let t of e.groups) (t.parentId && n.has(t.parentId) ? r.get(t.parentId) : i).children.push(r.get(t.id));
	for (let a of e.nodes) {
		let e = t.node(a), o = {
			id: a.id,
			width: Math.max(1, e.width),
			height: Math.max(1, e.height)
		};
		(a.groupId && n.has(a.groupId) ? r.get(a.groupId) : i).children.push(o);
	}
	let a = /* @__PURE__ */ new Map();
	for (let n of e.edges) {
		let e = {
			id: n.id,
			sources: [n.from],
			targets: [n.to]
		};
		if (n.label) {
			let r = t.text(n.label, "edgeLabel");
			a.set(n.id, r), e.labels = [{
				id: `${n.id}__label`,
				text: n.label,
				width: r.width,
				height: r.height
			}];
		}
		i.edges.push(e);
	}
	return {
		graph: i,
		edgeLabelSizes: a
	};
}
function at(e, t) {
	for (let n of e.children ?? []) t.set(n.id, n), at(n, t);
}
function ot(e, t) {
	for (let n of e.edges ?? []) t.set(n.id, n);
	for (let n of e.children ?? []) ot(n, t);
}
function st(e) {
	let t = [], n = (e) => {
		let n = t[t.length - 1];
		(!n || Math.abs(n.x - e.x) > 1e-6 || Math.abs(n.y - e.y) > 1e-6) && t.push({
			x: e.x,
			y: e.y
		});
	};
	for (let t of e.sections ?? []) {
		n(t.startPoint);
		for (let e of t.bendPoints ?? []) n(e);
		n(t.endPoint);
	}
	return t;
}
function ct(e) {
	return {
		x: e.x ?? 0,
		y: e.y ?? 0,
		width: e.width ?? 0,
		height: e.height ?? 0
	};
}
async function lt(e, t, n) {
	if (e.nodes.length === 0 && e.groups.length === 0) return {
		kind: "flowchart",
		width: 0,
		height: 0,
		nodes: [],
		groups: [],
		edges: []
	};
	let { graph: r, edgeLabelSizes: i } = it(e, t), a = await (await Xe()).layout(r), o = /* @__PURE__ */ new Map();
	at(a, o);
	let s = /* @__PURE__ */ new Map();
	ot(a, s);
	let c = e.nodes.map((e) => ({
		node: e,
		...ct(o.get(e.id) ?? { id: e.id })
	})), l = rt(e.groups), d = e.groups.map((e) => ({
		group: e,
		depth: l.get(e.id) ?? 0,
		...ct(o.get(e.id) ?? { id: e.id })
	})), f = [];
	for (let t of e.edges) {
		let e = s.get(t.id), r = e ? st(e) : [];
		r.length < 2 && u("warn", "prism.layout.edge_unrouted", {
			trace_id: n,
			edge_id: t.id
		});
		let a = {
			edge: t,
			points: r
		}, o = e?.labels?.[0], c = i.get(t.id);
		o && c && (a.label = {
			x: o.x ?? 0,
			y: o.y ?? 0,
			width: o.width ?? c.width,
			height: o.height ?? c.height
		}), f.push(a);
	}
	return et({
		kind: "flowchart",
		width: 0,
		height: 0,
		nodes: c,
		groups: d,
		edges: f
	});
}
//#endregion
//#region src/layout/sequence.ts
var U = {
	minColumn: 160,
	labelPad: 48,
	headGap: 24,
	firstRowGap: 32,
	row: 44,
	labelArrowGap: 12,
	noteGap: 12,
	noteOverPad: 16,
	noteRowGap: 20,
	activationWidth: 10,
	activationOffset: 5,
	activationMin: 12,
	blockPad: 12,
	blockHeader: 24,
	blockMinChip: 60,
	lifelineTail: 24
}, ut = {
	width: 32,
	height: 32
}, dt = {
	width: 0,
	height: 0
};
function ft(e, t, n) {
	return t ? e.text(t, n) : dt;
}
function pt(e) {
	return e.map((t, n) => e.reduce((e, r, i) => {
		if (i === n) return e;
		let a = r.startIndex <= t.startIndex && t.endIndex <= r.endIndex, o = r.startIndex === t.startIndex && r.endIndex === t.endIndex;
		return a && (!o || i < n) ? e + 1 : e;
	}, 0));
}
function mt(e, t) {
	let n = e.participants, r = new Map(n.map((e, t) => [e.id, t])), i = n.map((e) => t.text(e.label, "participant")), a = Math.max(0, ...i.map((e) => e.height)), o = [...e.messages.filter((e) => r.has(e.from) && r.has(e.to)).map((e) => ({
		kind: "message",
		m: e
	})), ...e.notes.filter((e) => e.over.length && e.over.every((e) => r.has(e))).map((e) => ({
		kind: "note",
		n: e
	}))].sort((e, t) => (e.kind === "message" ? e.m.index : e.n.index) - (t.kind === "message" ? t.m.index : t.n.index)), s = (e) => e.kind === "message" ? e.m.index : e.n.index, c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
	for (let e of o) e.kind === "message" ? c.set(e.m.id, ft(t, e.m.label, "edgeLabel")) : l.set(e.n.id, ft(t, e.n.text, "note"));
	let u = n.slice(1).map((e, t) => Math.max(U.minColumn, (i[t].width + i[t + 1].width) / 2 + U.headGap)), d = (e, t, n) => {
		if (t <= e || e < 0 || t > u.length) return;
		let r = u.slice(e, t).reduce((e, t) => e + t, 0);
		if (r >= n) return;
		let i = (n - r) / (t - e);
		for (let n = e; n < t; n++) u[n] += i;
	}, f = o.flatMap((e) => {
		if (e.kind === "message") {
			let t = r.get(e.m.from), n = r.get(e.m.to), i = c.get(e.m.id).width;
			return t === n ? [[
				t,
				t + 1,
				ut.width + 8 + i + U.labelPad / 2
			]] : [[
				Math.min(t, n),
				Math.max(t, n),
				i + U.labelPad
			]];
		}
		let t = e.n, n = l.get(t.id).width, i = t.over.map((e) => r.get(e));
		return t.placement === "right" ? [[
			i[0],
			i[0] + 1,
			U.noteGap + n + U.noteGap
		]] : t.placement === "left" ? [[
			i[0] - 1,
			i[0],
			U.noteGap + n + U.noteGap
		]] : [];
	});
	for (let [e, t, n] of f) t - e === 1 && d(e, t, n);
	for (let [e, t, n] of f) t - e > 1 && d(e, t, n);
	let p = [];
	n.forEach((e, t) => {
		p.push(t === 0 ? i[0].width / 2 : p[t - 1] + u[t - 1]);
	});
	let m = (e) => p[r.get(e)], h = n.map((e, t) => ({
		participant: e,
		lifelineX: p[t],
		x: p[t] - i[t].width / 2,
		y: 0,
		width: i[t].width,
		height: a
	})), g = (e) => o.findIndex((t) => s(t) >= e), _ = (e) => {
		for (let t = o.length - 1; t >= 0; t--) if (s(o[t]) <= e) return t;
		return -1;
	}, v = e.blocks.map((e) => ({
		block: e,
		first: g(e.startIndex),
		last: _(e.endIndex)
	})).filter((e) => e.first >= 0 && e.last >= e.first), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), S = [], C = [], w = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), E = a + U.firstRowGap;
	o.forEach((e, t) => {
		v.forEach((e, n) => {
			if (e.first === t) y.set(n, E), E += U.blockHeader + U.blockPad;
			else if (e.first < t && t <= e.last) {
				for (let r of e.block.sections.slice(1)) if (g(r.startIndex) === t) {
					let e = x.get(n) ?? [];
					e.push({
						y: E,
						label: r.label
					}), x.set(n, e), E += U.blockHeader;
				}
			}
		});
		let n = E;
		if (e.kind === "message") {
			let r = e.m, i = c.get(r.id), a = m(r.from), o = m(r.to), s = r.from === r.to, l, u;
			s ? (u = n + U.labelArrowGap, l = {
				x: a + ut.width + 8,
				y: u + ut.height / 2 - i.height / 2,
				...i
			}, E += U.row * 2 + i.height, w.set(t, {
				minX: a,
				maxX: Math.max(l.x + i.width, a + ut.width)
			})) : (u = n + i.height + U.labelArrowGap, l = {
				x: (a + o) / 2 - i.width / 2,
				y: n,
				...i
			}, E += U.row + i.height, w.set(t, {
				minX: Math.min(a, o, l.x),
				maxX: Math.max(a, o, l.x + i.width)
			})), T.set(r.id, u), S.push({
				message: r,
				y: u,
				fromX: a,
				toX: o,
				self: s,
				label: l
			});
		} else {
			let r = e.n, i = l.get(r.id), a = r.over.map(m), o, s = i.width;
			if (r.placement === "right") o = a[0] + U.noteGap;
			else if (r.placement === "left") o = a[0] - U.noteGap - i.width;
			else {
				let e = Math.min(...a), t = Math.max(...a);
				s = Math.max(i.width, a.length > 1 ? t - e + U.noteOverPad * 2 : i.width), o = (e + t) / 2 - s / 2;
			}
			C.push({
				note: r,
				x: o,
				y: n,
				width: s,
				height: i.height
			}), E += Math.max(U.row, i.height + U.noteRowGap), w.set(t, {
				minX: o,
				maxX: o + s
			});
		}
		for (let e = v.length - 1; e >= 0; e--) v[e].last === t && (E += U.blockPad, b.set(e, E));
	});
	let D = E, O = [], k = /* @__PURE__ */ new Map(), A = (e, t, n, r) => {
		O.push({
			participantId: e,
			x: m(e) - U.activationWidth / 2 + r * U.activationOffset,
			y: t,
			width: U.activationWidth,
			height: Math.max(U.activationMin, n - t)
		});
	};
	for (let e of S) {
		let t = e.message;
		if (t.deactivate) {
			let n = k.get(t.from), r = n?.pop();
			r !== void 0 && A(t.from, r, e.y, n.length);
		}
		if (t.activate) {
			let n = k.get(t.to) ?? [];
			n.push(e.y), k.set(t.to, n);
		}
	}
	for (let [e, t] of k) for (; t.length;) A(e, t.pop(), D, t.length);
	let j = pt(v.map((e) => e.block)), M = v.map((e, t) => t).sort((e, t) => j[t] - j[e]), N = /* @__PURE__ */ new Map();
	for (let e of M) {
		let n = v[e], r = Infinity, i = -Infinity;
		for (let e = n.first; e <= n.last; e++) {
			let t = w.get(e);
			t && (r = Math.min(r, t.minX), i = Math.max(i, t.maxX));
		}
		for (let [t, a] of N) {
			let o = v[t];
			t !== e && o.first >= n.first && o.last <= n.last && j[t] > j[e] && (r = Math.min(r, a.x), i = Math.max(i, a.x + a.width));
		}
		r -= U.blockPad, i += U.blockPad;
		let a = ft(t, n.block.label, "label").width + U.blockMinChip + U.blockPad * 2;
		if (i - r < a) {
			let e = (a - (i - r)) / 2;
			r -= e, i += e;
		}
		let o = y.get(e);
		N.set(e, {
			x: r,
			y: o,
			width: i - r,
			height: b.get(e) - o
		});
	}
	return et({
		kind: "sequence",
		width: 0,
		height: 0,
		nodes: [],
		groups: [],
		edges: [],
		sequence: {
			participants: h,
			messages: S,
			activations: O,
			notes: C,
			blocks: v.map((e, t) => ({
				block: e.block,
				...N.get(t),
				dividers: x.get(t) ?? []
			})),
			lifelineTop: a,
			lifelineBottom: D + U.lifelineTail
		}
	});
}
//#endregion
//#region src/layout/index.ts
function ht(e) {
	return e.kind === "flowchart" ? {
		node_count: e.nodes.length,
		edge_count: e.edges.length
	} : {
		node_count: e.participants.length,
		edge_count: e.messages.length
	};
}
async function gt(e, t, n = {}) {
	let i = n.traceId ?? r(), a = performance.now(), s = {
		trace_id: i,
		diagram_type: e?.kind,
		...e ? ht(e) : {}
	};
	u("debug", "prism.layout.start", s);
	try {
		let n;
		if (e.kind === "flowchart") n = await lt(e, t, i);
		else if (e.kind === "sequence") n = mt(e, t);
		else throw Error(`mermaid-prism: cannot lay out diagram kind "${e.kind}"`);
		return u("info", "prism.layout.ok", {
			...s,
			width: Math.round(n.width),
			height: Math.round(n.height),
			duration_ms: Math.round(performance.now() - a)
		}), n;
	} catch (e) {
		throw u("error", "prism.layout.error", {
			...s,
			duration_ms: Math.round(performance.now() - a),
			...o(e)
		}), e;
	}
}
//#endregion
//#region src/render/geometry.ts
var W = {
	node: {
		padX: 16,
		padY: 12,
		icon: 28,
		iconGap: 10,
		dotSlot: 14,
		minW: 120,
		maxW: 280,
		minH: 44,
		minHIcon: 52,
		titleLine: 18,
		metaLine: 15,
		metaGap: 2
	},
	circle: {
		size: 48,
		gap: 8,
		line: 16,
		maxW: 160,
		minW: 64
	},
	diamond: {
		height: 36,
		glyph: 14,
		padL: 12,
		padR: 14,
		gap: 9
	},
	group: {
		header: 34,
		padX: 14,
		radius: 20
	},
	edge: {
		radius: 12,
		arrow: 8,
		labelPadX: 8,
		labelPadY: 3,
		labelLine: 15
	},
	participant: {
		padX: 16,
		padY: 11,
		minW: 96,
		line: 18,
		actorIcon: 22,
		actorGap: 8
	},
	note: {
		padX: 12,
		padY: 8,
		line: 16,
		maxW: 220
	}
}, _t = /* @__PURE__ */ new Set([
	"cylinder",
	"hexagon",
	"subroutine",
	"parallelogram"
]);
function vt(e) {
	let t = String(e.label ?? "").split("\n").map((e) => e.trim()).filter((e) => e.length > 0);
	return e.meta && e.meta.trim() ? {
		title: t.join(" "),
		meta: e.meta.trim()
	} : {
		title: t[0] ?? "",
		meta: t.slice(1).join(" · ")
	};
}
function yt(e) {
	return !!e.icon || _t.has(e.shape);
}
function bt(e, t, n) {
	let r = [];
	for (let i of e.split("\n")) {
		let e = i.split(/\s+/).filter(Boolean), a = "";
		for (let i of e) {
			let e = a ? `${a} ${i}` : i;
			if (n(e) <= t) {
				a = e;
				continue;
			}
			if (a && r.push(a), n(i) <= t) {
				a = i;
				continue;
			}
			let o = "";
			for (let e of i) n(o + e) > t && o ? (r.push(o), o = e) : o += e;
			a = o;
		}
		a && r.push(a);
	}
	return r.length ? r : [""];
}
function xt(e, t = W.edge.radius) {
	if (e.length === 0) return "";
	let n = e[0];
	if (e.length === 1) return `M${G(n.x)},${G(n.y)}`;
	let r = `M${G(n.x)},${G(n.y)}`;
	for (let n = 1; n < e.length - 1; n++) {
		let i = e[n - 1], a = e[n], o = e[n + 1], s = Math.hypot(a.x - i.x, a.y - i.y), c = Math.hypot(o.x - a.x, o.y - a.y);
		if (s < .01 || c < .01) continue;
		let l = Math.min(t, s / 2, c / 2), u = {
			x: (a.x - i.x) / s,
			y: (a.y - i.y) / s
		}, d = {
			x: (o.x - a.x) / c,
			y: (o.y - a.y) / c
		}, f = {
			x: a.x - u.x * l,
			y: a.y - u.y * l
		}, p = {
			x: a.x + d.x * l,
			y: a.y + d.y * l
		}, m = .62, h = {
			x: f.x + u.x * l * m,
			y: f.y + u.y * l * m
		}, g = {
			x: p.x - d.x * l * m,
			y: p.y - d.y * l * m
		};
		r += ` L${G(f.x)},${G(f.y)} C${G(h.x)},${G(h.y)} ${G(g.x)},${G(g.y)} ${G(p.x)},${G(p.y)}`;
	}
	let i = e[e.length - 1];
	return r += ` L${G(i.x)},${G(i.y)}`, r;
}
function St(e, t) {
	if (e.length < 2 || t <= 0) return e.slice();
	let n = e.slice(), r = n[n.length - 1], i = n[n.length - 2], a = Math.hypot(r.x - i.x, r.y - i.y);
	return a <= t || (n[n.length - 1] = {
		x: r.x - (r.x - i.x) / a * t,
		y: r.y - (r.y - i.y) / a * t
	}), n;
}
function Ct(e, t) {
	return St(e.slice().reverse(), t).reverse();
}
function wt(e, t, n = W.edge.arrow) {
	let r = Math.hypot(t.x - e.x, t.y - e.y) || 1, i = (t.x - e.x) / r, a = (t.y - e.y) / r, o = -a, s = i, c = {
		x: t.x - i * n,
		y: t.y - a * n
	}, l = n * .56, u = {
		x: c.x + o * l,
		y: c.y + s * l
	}, d = {
		x: c.x - o * l,
		y: c.y - s * l
	}, f = {
		x: t.x - i * n * .78,
		y: t.y - a * n * .78
	};
	return `M${G(t.x)},${G(t.y)} L${G(u.x)},${G(u.y)} Q${G(f.x)},${G(f.y)} ${G(d.x)},${G(d.y)} Z`;
}
function Tt(e) {
	if (e.length === 0) return {
		x: 0,
		y: 0
	};
	let t = 0;
	for (let n = 1; n < e.length; n++) t += kt(e[n - 1], e[n]);
	let n = t / 2;
	for (let t = 1; t < e.length; t++) {
		let r = e[t - 1], i = e[t], a = kt(r, i);
		if (n <= a && a > 0) return {
			x: r.x + (i.x - r.x) * n / a,
			y: r.y + (i.y - r.y) * n / a
		};
		n -= a;
	}
	return e[e.length - 1];
}
function Et(e, t, n) {
	if (e.length < 2) return Tt(e);
	let r = e.length - 1, i = null, a = -Infinity;
	for (let o = 1; o <= r; o++) {
		let s = e[o - 1], c = e[o], l = kt(s, c);
		if (l <= 0) continue;
		let u = Math.abs(c.x - s.x) >= Math.abs(c.y - s.y) ? t : n, d = o === 1 ? 4 : W.edge.radius, f = o === r ? W.edge.arrow + 6 : W.edge.radius, p = l - u - d - f;
		if (p > a) {
			a = p;
			let e = (d + (l - d - f) / 2) / l;
			i = {
				x: s.x + (c.x - s.x) * e,
				y: s.y + (c.y - s.y) * e
			};
		}
	}
	return a >= 0 && i ? i : Tt(e);
}
function Dt(e, t, n, r, i) {
	let a = Math.min(i * 1.25, n / 2, r / 2), o = .29, s = e + n, c = t + r;
	return [
		`M${G(e + a)},${G(t)}`,
		`L${G(s - a)},${G(t)}`,
		`C${G(s - a * o)},${G(t)} ${G(s)},${G(t + a * o)} ${G(s)},${G(t + a)}`,
		`L${G(s)},${G(c - a)}`,
		`C${G(s)},${G(c - a * o)} ${G(s - a * o)},${G(c)} ${G(s - a)},${G(c)}`,
		`L${G(e + a)},${G(c)}`,
		`C${G(e + a * o)},${G(c)} ${G(e)},${G(c - a * o)} ${G(e)},${G(c - a)}`,
		`L${G(e)},${G(t + a)}`,
		`C${G(e)},${G(t + a * o)} ${G(e + a * o)},${G(t)} ${G(e + a)},${G(t)}`,
		"Z"
	].join(" ");
}
function Ot(e) {
	if (typeof e != "string") return null;
	try {
		let t = new URL(e.trim());
		return t.protocol === "http:" || t.protocol === "https:" ? t.href : null;
	} catch {
		return null;
	}
}
function kt(e, t) {
	return Math.hypot(t.x - e.x, t.y - e.y);
}
function G(e) {
	return (Math.round(e * 100) / 100).toString();
}
//#endregion
//#region src/render/measure.ts
var At = 2, jt = "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", system-ui, \"Helvetica Neue\", \"Segoe UI\", Roboto, sans-serif", Mt = {
	label: {
		family: jt,
		size: 13,
		weight: 590,
		tracking: -.01,
		uppercase: !1
	},
	meta: {
		family: jt,
		size: 11,
		weight: 450,
		tracking: .01,
		uppercase: !1
	},
	edgeLabel: {
		family: jt,
		size: 11,
		weight: 500,
		tracking: .01,
		uppercase: !1
	},
	participant: {
		family: jt,
		size: 13,
		weight: 590,
		tracking: -.01,
		uppercase: !1
	},
	note: {
		family: jt,
		size: 12,
		weight: 450,
		tracking: 0,
		uppercase: !1
	},
	group: {
		family: jt,
		size: 12,
		weight: 600,
		tracking: 0,
		uppercase: !1
	}
}, Nt = {
	label: "label",
	meta: "meta",
	edgeLabel: "edge-label",
	participant: "participant",
	note: "note",
	group: "group-label"
};
function Pt(e) {
	let t = { ...Mt };
	if (!e || typeof getComputedStyle != "function") return t;
	let n;
	try {
		n = getComputedStyle(e);
	} catch {
		return t;
	}
	let r = (e) => n.getPropertyValue(e).trim(), i = r("--prism-font") || jt;
	for (let e of Object.keys(Mt)) {
		let n = Nt[e], a = Mt[e];
		t[e] = {
			family: r(`--prism-${n}-font`) || i,
			size: Ft(r(`--prism-${n}-size`), a.size),
			weight: Ft(r(`--prism-${n}-weight`), a.weight),
			tracking: Ft(r(`--prism-${n}-tracking`), a.tracking),
			uppercase: r(`--prism-${n}-transform`) === "uppercase"
		};
	}
	return t;
}
function Ft(e, t) {
	let n = parseFloat(e);
	return Number.isFinite(n) ? n : t;
}
function It() {
	try {
		if (typeof document > "u") return null;
		let e = document.createElement("canvas");
		return typeof Object.getPrototypeOf(e).getContext != "function" || typeof navigator < "u" && /jsdom/i.test(navigator.userAgent) ? null : e.getContext("2d");
	} catch {
		return null;
	}
}
function Lt(e) {
	let t = typeof performance < "u" ? performance.now() : 0, n = Pt(e), r = It(), i = /* @__PURE__ */ new Map();
	function a(e, t) {
		let a = n[t], o = a.uppercase ? e.toUpperCase() : e, s = `${t}\u0000${o}`, c = i.get(s);
		if (c !== void 0) return c;
		let l;
		return r ? (r.font = `${a.weight} ${a.size}px ${a.family}`, l = r.measureText(o).width) : l = o.length * a.size * (a.family.includes("Mono") || a.family.includes("mono") ? .6 : .56), l += a.tracking * a.size * Math.max(0, o.length - 1), l = Math.ceil(l * 100) / 100, i.set(s, l), l;
	}
	function o(e, t, n) {
		return bt(e, Math.max(8, n), (e) => a(e, t));
	}
	function s(e) {
		let t = W.node, n = t.padX * 2;
		return yt(e) && (n += t.icon + t.iconGap), e.tone !== "neutral" && (n += t.dotSlot), e.link && (n += t.dotSlot + 4), n;
	}
	function c(e, t) {
		let n = vt(e), r = n.title || String(e.id ?? ""), i = n.meta;
		if (e.shape === "circle") {
			let e = W.circle, n = t ?? Math.min(e.maxW, Math.max(e.minW, a(r, "label")));
			return {
				title: o(r, "label", n),
				meta: i ? o(i, "meta", n) : [],
				textWidth: n
			};
		}
		if (e.shape === "diamond") {
			let e = W.diamond, n = e.padL + e.glyph + e.gap + e.padR, a = (t ?? W.node.maxW) - n;
			return {
				title: o(i ? `${r} · ${i}` : r, "label", a),
				meta: [],
				textWidth: a
			};
		}
		let c = W.node, l = s(e), u = Math.max(a(r, "label"), i ? a(i, "meta") : 0), d = (t ?? Rt(Math.ceil(u + l) + At, c.minW, c.maxW)) - l;
		return {
			title: o(r, "label", d),
			meta: i ? o(i, "meta", d) : [],
			textWidth: d
		};
	}
	function l(e, t) {
		return e.reduce((e, n) => Math.max(e, a(n, t)), 0);
	}
	let d = {
		font: (e) => n[e],
		width: a,
		wrap: o,
		nodeText: c,
		node(e) {
			if (e.shape === "circle") {
				let t = W.circle, n = c(e), r = Math.max(t.size, Math.ceil(Math.max(l(n.title, "label"), l(n.meta, "meta")))), i = t.size + t.gap + n.title.length * t.line + n.meta.length * W.node.metaLine;
				return {
					width: Math.max(t.minW, r),
					height: i
				};
			}
			if (e.shape === "diamond") {
				let t = W.diamond, n = c(e), r = t.padL + t.glyph + t.gap + Math.ceil(l(n.title, "label")) + t.padR, i = Math.max(t.height, n.title.length * W.node.titleLine + 18);
				return {
					width: Math.max(96, r),
					height: i
				};
			}
			let t = W.node, n = c(e), r = Math.max(l(n.title, "label"), l(n.meta, "meta")), i = Rt(Math.ceil(r + s(e)) + At, t.minW, t.maxW), a = n.title.length * t.titleLine + (n.meta.length ? t.metaGap + n.meta.length * t.metaLine : 0), o = yt(e) ? t.minHIcon : t.minH;
			return {
				width: i,
				height: Math.max(o, Math.ceil(a + t.padY * 2))
			};
		},
		groupHeader(e) {
			let t = W.group;
			return {
				width: Math.ceil(a(e.label, "group") + t.padX * 2),
				height: t.header
			};
		},
		text(e, t) {
			if (t === "edgeLabel") {
				let t = W.edge;
				return {
					width: Math.ceil(a(e, "edgeLabel") + t.labelPadX * 2) + At,
					height: t.labelLine + t.labelPadY * 2
				};
			}
			if (t === "participant") {
				let t = W.participant;
				return {
					width: Math.max(t.minW, Math.ceil(a(e, "participant") + t.padX * 2)),
					height: t.line + t.padY * 2
				};
			}
			if (t === "note") {
				let t = W.note, n = o(e, "note", t.maxW - t.padX * 2);
				return {
					width: Math.ceil(l(n, "note") + t.padX * 2),
					height: n.length * t.line + t.padY * 2
				};
			}
			let n = e.split("\n"), r = t === "meta" ? W.node.metaLine : W.node.titleLine;
			return {
				width: Math.ceil(l(n, t)),
				height: n.length * r
			};
		}
	};
	return u("debug", "prism.measure.ready", {
		canvas: !!r,
		font_label: `${n.label.weight} ${n.label.size}px`,
		duration_ms: typeof performance < "u" ? Math.round((performance.now() - t) * 100) / 100 : 0
	}), d;
}
function Rt(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
//#endregion
//#region src/render/paths.ts
var zt = W.edge.arrow, Bt = zt * .7;
function Vt(e, t, n, r = W.edge.radius) {
	let i = e;
	n && (i = St(i, Bt)), t && (i = Ct(i, Bt));
	let a = [], o = e.length;
	return o >= 2 && (n && a.push(wt(e[o - 2], e[o - 1], zt)), t && a.push(wt(e[1], e[0], zt))), {
		d: xt(i, r),
		arrows: a,
		start: e[0] ?? {
			x: 0,
			y: 0
		},
		end: e[o - 1] ?? {
			x: 0,
			y: 0
		},
		mid: Tt(e)
	};
}
function Ht(e) {
	return Vt(e.points, e.edge.arrowStart, e.edge.arrowEnd);
}
function Ut(e, t) {
	if (!e.edge.label) return null;
	if (e.label) return e.label;
	let n = t?.width ?? 60, r = t?.height ?? 21, i = Et(e.points, n, r);
	return {
		x: i.x - n / 2,
		y: i.y - r / 2,
		width: n,
		height: r
	};
}
var Wt = 36, Gt = 20;
function Kt(e, t) {
	let n = (e, n) => t.find((t) => t.participantId === e && n >= t.y && n <= t.y + t.height), r = n(e.message.from, e.y);
	if (e.self) {
		let t = r ? r.x + r.width : e.fromX, i = e.y + Gt, a = n(e.message.to, i), o = a ? a.x + a.width : e.fromX;
		return [
			{
				x: t,
				y: e.y
			},
			{
				x: e.fromX + Wt,
				y: e.y
			},
			{
				x: e.fromX + Wt,
				y: i
			},
			{
				x: o,
				y: i
			}
		];
	}
	let i = e.toX >= e.fromX ? 1 : -1, a = n(e.message.to, e.y), o = r ? i > 0 ? r.x + r.width : r.x : e.fromX, s = a ? i > 0 ? a.x : a.x + a.width : e.toX;
	return [{
		x: o,
		y: e.y
	}, {
		x: s,
		y: e.y
	}];
}
function qt(e, t) {
	return Vt(Kt(e, t), !1, !0, 8);
}
//#endregion
//#region src/render/flow.ts
var Jt = "http://www.w3.org/2000/svg", Yt = 5, Xt = 10, Zt = 17, Qt = 4, $t = 14, en = (e) => e.returns ?? [], tn = (e) => new Set(e.skipped ?? []), nn = (e) => e.timeout === !0;
function rn(e, t) {
	if (t && t.kind === e.kind) return t;
	let n = e.sequence;
	return e.kind === "sequence" && n ? {
		kind: "sequence",
		participants: n.participants.map((e) => e.participant),
		messages: n.messages.map((e) => e.message),
		notes: n.notes.map((e) => e.note),
		blocks: n.blocks.map((e) => e.block)
	} : s(e, t?.waits);
}
function an(e, t, n) {
	let r = l(rn(e, t), e, n);
	return r.steps.length >= 2 ? m(r, { traceId: n }) : null;
}
var on = (e, t) => e.l < t.r && t.l < e.r && e.t < t.b && t.t < e.b;
function sn(e) {
	let { root: n, stage: r, scene: i, player: o, nodeEls: s, edgeEls: c, edgeLabelEls: l, activationEls: p } = e, m = o.timeline, h = d(e.locale), g = i.sequence, _ = m.kind === "sequence", v = document.createElementNS(Jt, "svg");
	v.setAttribute("class", "prism-layer prism-layer-flow"), v.setAttribute("width", String(i.width)), v.setAttribute("height", String(i.height)), v.setAttribute("viewBox", `0 0 ${i.width} ${i.height}`), v.setAttribute("overflow", "visible"), v.setAttribute("aria-hidden", "true");
	let y = document.createElement("div");
	y.className = "prism-layer prism-layer-flow-pills", r.append(v, y);
	let b = new Map(i.nodes.map((e) => [e.node.id, e])), x = new Map(i.edges.map((e) => [e.edge.id, e])), S = new Map((g?.messages ?? []).map((e) => [e.message.id, e])), C = new Map((g?.participants ?? []).map((e) => [e.participant.id, e.lifelineX])), w = /* @__PURE__ */ new Map(), T = (e) => {
		let t = w.get(e);
		if (t) return t;
		let n = c.get(e)?.querySelector(".prism-edge-line"), r = null;
		if (n && typeof n.getTotalLength == "function" && typeof n.getPointAtLength == "function") try {
			let e = n.getTotalLength();
			e > 0 && (r = {
				len: e,
				at: (e) => n.getPointAtLength(e)
			});
		} catch {
			r = null;
		}
		if (!r) {
			let t = x.get(e), n = S.get(e), i = t?.points ?? (n && g ? Kt(n, g.activations) : null);
			i && i.length >= 2 && (r = un(i));
		}
		return r && w.set(e, r), r;
	}, E = tn(m), D = (e, t) => {
		let n = x.get(e)?.edge;
		return !!(n && n.arrowStart && !n.arrowEnd) !== t;
	}, O = [], k = (e) => {
		for (; O.length <= e;) {
			let e = document.createElementNS(Jt, "circle");
			e.setAttribute("class", "prism-pulse prism-flow-token"), e.setAttribute("r", "4"), v.append(e), O.push(e);
		}
		return O[e];
	}, A = (e) => {
		for (let t = e; t < O.length; t++) O[t].style.display = "none";
	}, j = /* @__PURE__ */ new Map(), M = !1, N = (e) => {
		let t = j.get(e);
		t && (t.ring?.remove(), t.track?.remove(), t.pill.remove(), j.delete(e), M = !0);
	}, ee = (e) => {
		if (!_) {
			let t = b.get(e.id);
			if (!t) return null;
			if (t.node.shape === "circle") {
				let e = W.circle.size / 2 + Yt, n = t.x + t.width / 2, r = t.y + W.circle.size / 2;
				return {
					d: fn(n, r, e),
					pill: {
						x: n,
						y: r + e + Zt
					},
					side: "below"
				};
			}
			let n = t.x - Yt, r = t.y - Yt, i = t.width + 10, a = t.height + 10;
			return {
				d: dn(n, r, i, a, t.node.shape === "stadium" ? a / 2 : Math.min(a / 2, ln(t) + Yt)),
				pill: {
					x: n + i / 2,
					y: r + a + Zt
				},
				side: "below"
			};
		}
		let t = m.steps[e.step]?.edges[0], n = t ? S.get(t) : void 0, r = C.get(e.id);
		return !n || r === void 0 ? null : e.kind === "reply" ? {
			d: "",
			pill: {
				x: r + 14,
				y: n.y + 16
			},
			side: "right"
		} : {
			d: fn(r, n.y, 9),
			pill: {
				x: r + 9 + Xt,
				y: n.y
			},
			side: "right"
		};
	}, te = () => {
		let e = [], t = [...j.values()].sort((e, t) => e.base.y - t.base.y || e.base.x - t.base.x);
		for (let n of t) {
			let t = n.pill.offsetWidth, r = n.pill.offsetHeight, i = n.base.y;
			if (t && r) {
				let a = n.side === "below" ? n.base.x - t / 2 : n.side === "left" ? n.base.x - t : n.base.x, o = () => ({
					l: a,
					r: a + t,
					t: i - r / 2,
					b: i + r / 2
				});
				for (let t = 0; t < 8 && e.some((e) => on(e, o())); t++) i += r + Qt;
				e.push(o());
			}
			n.pill.style.top = `${i}px`;
		}
	}, ne = (e) => {
		let t = `${e.kind}:${e.start}`, n = j.get(e.id);
		if (n && n.key === t) return n;
		N(e.id);
		let r = ee(e);
		if (!r) return null;
		let i = null, a = null;
		r.d && (a = document.createElementNS(Jt, "path"), a.setAttribute("class", "prism-flow-ring-track"), a.setAttribute("d", r.d), i = document.createElementNS(Jt, "path"), i.setAttribute("class", "prism-flow-ring"), i.setAttribute("d", r.d), i.setAttribute("pathLength", "100"), i.dataset.id = e.id, i.dataset.kind = e.kind, nn(e) && (i.dataset.timeout = ""), v.append(a, i));
		let o = document.createElement("div");
		o.className = "prism-flow-pill", o.dataset.id = e.id, o.dataset.kind = e.kind, o.dataset.side = r.side, nn(e) && (o.dataset.timeout = ""), o.style.left = `${r.pill.x}px`, o.style.top = `${r.pill.y}px`;
		let s = document.createElement("span");
		s.className = "prism-flow-pill-dot";
		let c = document.createElement("span");
		c.className = "prism-flow-pill-text", o.append(s, c), y.append(o);
		let l = {
			ring: i,
			track: a,
			pill: o,
			text: c,
			key: t,
			base: r.pill,
			side: r.side
		};
		return M = !0, j.set(e.id, l), l;
	}, re = m.steps[0]?.arrive ?? 0, P = !1, F = "", I = (e, t, n) => e?.classList.toggle(t, n), L = () => {
		for (let e of [...c.values(), ...l.values()]) e.classList.remove("is-flow-trail", "is-flow-live", "is-flow-upcoming", "is-flow-skipped");
		for (let e of s.values()) e.classList.remove("is-flow-active", "is-flow-done", "is-flow-upcoming", "is-flow-waiting");
		for (let { el: e } of p) e.classList.remove("is-flow-waiting");
		A(0);
		for (let e of [...j.keys()]) N(e);
		F = "";
	}, ie = (e, n, r) => {
		let i = m.steps[e], o = a(m, e, n), u = new Set(r ? i.edges : []);
		for (let [e, t] of c) {
			let n = u.has(e), r = !n && o.has(e);
			for (let i of [t, l.get(e)]) I(i, "is-flow-live", n), I(i, "is-flow-trail", r), I(i, "is-flow-upcoming", !n && !r), I(i, "is-flow-skipped", !n && !r && E.has(e));
		}
		let d = t(m, e, n), f = new Set(n ? i.nodes : i.from);
		for (let [e, t] of s) {
			let n = f.has(e);
			I(t, "is-flow-active", n), I(t, "is-flow-done", !n && d.has(e)), I(t, "is-flow-upcoming", !_ && !n && !d.has(e));
		}
	}, R = (t) => {
		if (!P) {
			if (t.t === re && !t.playing) {
				n.dataset.flow = "idle";
				return;
			}
			P = !0, u("debug", "prism.flow2d.engaged", {
				trace_id: e.traceId,
				step: t.step
			});
		}
		n.dataset.flow = "on";
		let r = t.step, i = m.steps[r];
		if (!i) {
			L();
			return;
		}
		let a = t.t, o = i.travel > 0 && a < i.arrive, c = !o, l = e.reduced(), d = `${r}|${+!!c}`;
		d !== F && (ie(r, c, o), F = d);
		let g = 0;
		if (o) {
			let e = l ? 0 : cn((a - i.start) / i.travel), t = new Set(en(i));
			for (let n of i.edges) {
				let r = T(n);
				if (!r) continue;
				let i = (D(n, t.has(n)) ? 1 - e : e) * r.len, a = r.at(Math.max(0, Math.min(r.len, i))), o = k(g++);
				o.style.display = "", o.setAttribute("cx", a.x.toFixed(2)), o.setAttribute("cy", a.y.toFixed(2));
				let s = l ? 1 : Math.min(1, e * r.len / $t, (1 - e) * r.len / $t);
				o.style.opacity = Math.max(0, s).toFixed(3);
			}
		}
		A(g);
		let _ = /* @__PURE__ */ new Map();
		for (let e of m.waits) e.end <= e.start || a < e.start || a >= e.end || (!_.has(e.id) || e.kind === "directive" && _.get(e.id).kind !== "directive") && _.set(e.id, e);
		for (let e of [...j.keys()]) _.has(e) || N(e);
		let v = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set();
		for (let t of _.values()) {
			let n = ne(t);
			if (!n) continue;
			let r = t.spanEnd - t.spanStart, i = r > 0 ? cn((a - t.spanStart) / r) : 1;
			if (n.ring) {
				let e = Math.max(.001, i * 100);
				n.ring.style.strokeDasharray = `${e.toFixed(2)} 100`, n.ring.style.opacity = i > .004 ? "" : "0", n.ring.dataset.timeout !== void 0 && n.ring.classList.toggle("is-flow-expired", i >= .999);
			}
			let o = f(t, h, e.locale), s = l ? `${o} · ${Math.round(i * 100)} %` : o;
			if (n.text.textContent !== s && (n.text.textContent = s), n.pill.style.setProperty("--prism-flow-progress", i.toFixed(3)), n.pill.dataset.timeout !== void 0 && n.pill.classList.toggle("is-flow-expired", i >= .999), v.add(t.id), t.kind === "reply") {
				let e = S.get(m.steps[t.step]?.edges[0] ?? "")?.y;
				for (let { a: n, el: r } of p) n.participantId === t.id && (e === void 0 || n.y <= e + 2 && n.y + n.height >= e - 2) && y.add(r);
			}
		}
		M && (M = !1, te());
		for (let [e, t] of s) I(t, "is-flow-waiting", v.has(e));
		for (let { el: e } of p) I(e, "is-flow-waiting", y.has(e));
	}, z = o.subscribe(R);
	R(o.getState()), u("debug", "prism.flow2d.mount", {
		trace_id: e.traceId,
		step_count: m.steps.length,
		wait_count: m.waits.length,
		diagram_type: m.kind
	});
	let ae = !1;
	return {
		paint: R,
		destroy() {
			ae || (ae = !0, z(), L(), v.remove(), y.remove(), delete n.dataset.flow);
		}
	};
}
function cn(e) {
	return e < 0 ? 0 : e > 1 ? 1 : e;
}
function ln(e) {
	return e.node.shape === "round" ? 20 : e.node.shape === "diamond" ? 12 : 14;
}
function un(e) {
	let t = [0];
	for (let n = 1; n < e.length; n++) t.push(t[n - 1] + Math.hypot(e[n].x - e[n - 1].x, e[n].y - e[n - 1].y));
	let n = t[t.length - 1];
	return {
		len: n,
		at(r) {
			if (n <= 0) return e[0];
			let i = 1;
			for (; i < e.length - 1 && t[i] < r;) i++;
			let a = t[i] - t[i - 1], o = a > 0 ? (r - t[i - 1]) / a : 0, s = e[i - 1], c = e[i];
			return {
				x: s.x + (c.x - s.x) * o,
				y: s.y + (c.y - s.y) * o
			};
		}
	};
}
function dn(e, t, n, r, i) {
	let a = Math.max(0, Math.min(i, n / 2, r / 2)), o = (e) => (Math.round(e * 100) / 100).toString();
	return [
		`M${o(e + n / 2)},${o(t)}`,
		`H${o(e + n - a)}`,
		`A${o(a)},${o(a)} 0 0 1 ${o(e + n)},${o(t + a)}`,
		`V${o(t + r - a)}`,
		`A${o(a)},${o(a)} 0 0 1 ${o(e + n - a)},${o(t + r)}`,
		`H${o(e + a)}`,
		`A${o(a)},${o(a)} 0 0 1 ${o(e)},${o(t + r - a)}`,
		`V${o(t + a)}`,
		`A${o(a)},${o(a)} 0 0 1 ${o(e + a)},${o(t)}`,
		"Z"
	].join(" ");
}
function fn(e, t, n) {
	let r = (e) => (Math.round(e * 100) / 100).toString();
	return `M${r(e)},${r(t - n)} A${r(n)},${r(n)} 0 1 1 ${r(e)},${r(t + n)} A${r(n)},${r(n)} 0 1 1 ${r(e)},${r(t - n)} Z`;
}
//#endregion
//#region src/render/icons.ts
var pn = {
	globe: [
		"M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z",
		"M3.6 9h16.8M3.6 15h16.8",
		"M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9s1.2-6.5 3.6-9Z"
	],
	lock: [
		"M6.5 10.5h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19v-7a1.5 1.5 0 0 1 1.5-1.5Z",
		"M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3",
		"M12 14.5v2"
	],
	link: ["M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1", "M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"],
	window: [
		"M5 4.5h14A1.5 1.5 0 0 1 20.5 6v12a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18V6A1.5 1.5 0 0 1 5 4.5Z",
		"M3.5 9h17",
		"M6.5 6.8h.01M9 6.8h.01"
	],
	user: ["M12 12a4 4 0 1 0 0-8a4 4 0 1 0 0 8Z", "M4.5 20a7.5 7.5 0 0 1 15 0"],
	server: [
		"M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z",
		"M5 13h14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z",
		"M8 7.5h.01M8 16.5h.01"
	],
	database: [
		"M12 3c4.1 0 7.5 1.3 7.5 3s-3.4 3-7.5 3s-7.5-1.3-7.5-3s3.4-3 7.5-3Z",
		"M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6",
		"M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"
	],
	hexagon: ["M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9Z"],
	subroutine: ["M4.5 5h15v14h-15Z", "M8 5v14M16 5v14"],
	parallelogram: ["M8 5h12l-4 14H4Z"],
	check: ["M5 12.5l4.5 4.5L19 7.5"],
	external: [
		"M14 5h5v5",
		"M19 5l-8 8",
		"M17 13.5V18a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8.5A1.5 1.5 0 0 1 6 7h4.5"
	],
	bolt: ["M13 3L5 13.5h6L10 21l8-10.5h-6Z"],
	cloud: ["M7 18.5a4.5 4.5 0 0 1-.6-9a6 6 0 0 1 11.4 1.6A3.8 3.8 0 0 1 17.5 18.5Z"]
}, mn = {
	earth: "globe",
	world: "globe",
	shield: "lock",
	key: "lock",
	db: "database",
	storage: "database",
	browser: "window",
	app: "window",
	person: "user",
	users: "user",
	human: "user",
	host: "server",
	computer: "server",
	url: "link",
	chain: "link",
	zap: "bolt",
	flash: "bolt"
}, hn = {
	cylinder: "database",
	hexagon: "hexagon",
	subroutine: "subroutine",
	parallelogram: "parallelogram"
};
function gn(e) {
	return pn[e] ?? null;
}
function _n(e) {
	if (e.icon) {
		let t = String(e.icon).toLowerCase(), n = t.replace(/^[a-z0-9-]+:/, "").replace(/^fa-/, "").trim();
		if (t.startsWith("letter:")) return {
			kind: "letter",
			text: vn(String(e.icon).slice(7))
		};
		let r = pn[n] ? n : mn[n];
		return r && pn[r] ? {
			kind: "glyph",
			paths: pn[r]
		} : {
			kind: "letter",
			text: vn(e.label)
		};
	}
	let t = hn[e.shape];
	return t ? {
		kind: "glyph",
		paths: pn[t]
	} : null;
}
function vn(e) {
	return ([...String(e ?? "").trim()][0] ?? "•").toUpperCase();
}
//#endregion
//#region src/render/spring.ts
var yn = {
	response: .35,
	damping: 1
}, bn = {
	response: .5,
	damping: .86
}, K = {
	response: .42,
	damping: 1
}, xn = class {
	value;
	velocity = 0;
	target;
	config;
	constructor(e, t = yn) {
		this.value = e, this.target = e, this.config = t;
	}
	get settled() {
		return Math.abs(this.target - this.value) < 5e-4 && Math.abs(this.velocity) < .005;
	}
	set(e) {
		this.value = e, this.target = e, this.velocity = 0;
	}
	to(e, t, n) {
		this.target = e, t && (this.config = t), n !== void 0 && (this.velocity = n);
	}
	step(e) {
		let { response: t, damping: n } = this.config, r = (2 * Math.PI / Math.max(.01, t)) ** 2, i = 4 * Math.PI * n / Math.max(.01, t), a = Math.min(e, .064);
		for (; a > 0;) {
			let e = Math.min(a, 1 / 240), t = -r * (this.value - this.target) - i * this.velocity;
			this.velocity += t * e, this.value += this.velocity * e, a -= e;
		}
		this.settled && (this.value = this.target, this.velocity = 0);
	}
};
function Sn(e, t = .998) {
	return e / 1e3 * t / (1 - t);
}
function Cn(e, t, n = .55) {
	return t <= 0 ? 0 : e * t * n / (t + n * Math.abs(e));
}
var wn = class {
	ticks = /* @__PURE__ */ new Set();
	raf = 0;
	last = 0;
	dead = !1;
	add(e) {
		return this.ticks.add(e), this.wake(), () => this.ticks.delete(e);
	}
	wake() {
		this.dead || this.raf || typeof requestAnimationFrame != "function" || (this.last = 0, this.raf = requestAnimationFrame(this.frame));
	}
	destroy() {
		this.dead = !0, this.raf && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(this.raf), this.raf = 0, this.ticks.clear();
	}
	frame = (e) => {
		if (this.raf = 0, this.dead) return;
		let t = this.last ? (e - this.last) / 1e3 : 1 / 60;
		this.last = e;
		for (let e of [...this.ticks]) {
			let n = !1;
			try {
				n = e(t);
			} catch {
				n = !1;
			}
			n || this.ticks.delete(e);
		}
		this.ticks.size && (this.raf = requestAnimationFrame(this.frame));
	};
}, Tn = 4, En = class {
	el;
	stage;
	content;
	ticker;
	opts;
	x = new xn(0, K);
	y = new xn(0, K);
	s = new xn(1, K);
	fitScale = 1;
	interacted = !1;
	pointers = /* @__PURE__ */ new Map();
	drag = null;
	pinch = null;
	gestureStart = 1;
	suppressClick = !1;
	stopTick = null;
	cleanup = [];
	resize = null;
	constructor(e, t, n, r, i) {
		this.el = e, this.stage = t, this.content = n, this.ticker = r, this.opts = i, this.on(e, "pointerdown", this.onDown), this.on(e, "pointermove", this.onMove), this.on(e, "pointerup", this.onUp), this.on(e, "pointercancel", this.onUp), this.on(e, "wheel", this.onWheel, { passive: !1 }), this.on(e, "click", this.onClickCapture, { capture: !0 }), this.on(e, "dblclick", this.onDoubleClick), this.on(e, "gesturestart", this.onGestureStart), this.on(e, "gesturechange", this.onGestureChange), typeof ResizeObserver == "function" && (this.resize = new ResizeObserver(() => this.refit()), this.resize.observe(e));
	}
	fit(e = !1) {
		let t = this.el.clientWidth;
		this.fitScale = this.opts.fitScale(t);
		let n = this.fitScale, r = this.centered(t, this.content.width * n), i = this.centered(this.el.clientHeight, this.content.height * n);
		e && !this.opts.reducedMotion() ? (this.x.to(r, K), this.y.to(i, K), this.s.to(n, K), this.run()) : (this.x.set(r), this.y.set(i), this.s.set(n), this.apply());
	}
	get scale() {
		return this.s.value;
	}
	ensureVisible(e) {
		let t = this.s.value, n = this.el.clientWidth, r = this.el.clientHeight;
		if (!n || !r) return;
		let i = e.x * t + this.x.value, a = e.y * t + this.y.value, o = this.x.value, s = this.y.value;
		i < 24 ? o += 24 - i : i + e.width * t > n - 24 && (o -= i + e.width * t - (n - 24)), a < 24 ? s += 24 - a : a + e.height * t > r - 24 && (s -= a + e.height * t - (r - 24)), (o !== this.x.value || s !== this.y.value) && (this.opts.reducedMotion() ? (this.x.set(o), this.y.set(s), this.apply()) : (this.x.to(o, K), this.y.to(s, K), this.run()));
	}
	destroy() {
		this.stopTick?.(), this.settleTimer && clearTimeout(this.settleTimer), this.resize?.disconnect();
		for (let e of this.cleanup) e();
		this.cleanup = [];
	}
	on(e, t, n, r) {
		e.addEventListener(t, n, r), this.cleanup.push(() => e.removeEventListener(t, n, r));
	}
	centered(e, t) {
		return e > 0 ? (e - t) / 2 : this.opts.padding;
	}
	bounds(e) {
		let t = this.el.clientWidth, n = this.el.clientHeight, r = this.opts.padding, i = this.content.width * e, a = this.content.height * e, o = i + r * 2 <= t ? [this.centered(t, i), this.centered(t, i)] : [t - r - i, r], s = a + r * 2 <= n ? [this.centered(n, a), this.centered(n, a)] : [n - r - a, r];
		return {
			minX: o[0],
			maxX: o[1],
			minY: s[0],
			maxY: s[1]
		};
	}
	refit() {
		this.interacted ? this.settleIntoBounds(0, 0) : this.fit(!1);
	}
	apply() {
		this.stage.style.transform = `translate3d(${kn(this.x.value)}px, ${kn(this.y.value)}px, 0) scale(${An(this.s.value)})`;
	}
	run() {
		this.stopTick ||= this.ticker.add((e) => {
			this.x.step(e), this.y.step(e), this.s.step(e), this.apply();
			let t = !(this.x.settled && this.y.settled && this.s.settled);
			return t || (this.stopTick = null), t;
		});
	}
	halt() {
		this.stopTick?.(), this.stopTick = null, this.x.set(this.x.value), this.y.set(this.y.value), this.s.set(this.s.value);
	}
	markInteracted() {
		this.interacted || (this.interacted = !0, this.opts.onPanStart?.());
	}
	onDown = (e) => {
		if (e.pointerType !== "mouse" || e.button === 0) {
			if (this.halt(), this.pointers.set(e.pointerId, {
				x: e.clientX,
				y: e.clientY
			}), this.pointers.size === 1) this.drag = {
				id: e.pointerId,
				startX: e.clientX,
				startY: e.clientY,
				tx: this.x.value,
				ty: this.y.value,
				active: !1,
				history: []
			};
			else if (this.pointers.size === 2) {
				let [t, n] = [...this.pointers.values()], r = (t.x + n.x) / 2, i = (t.y + n.y) / 2, a = this.local(r, i);
				this.pinch = {
					dist: Math.hypot(n.x - t.x, n.y - t.y) || 1,
					scale: this.s.value,
					cx: r,
					cy: i,
					px: (a.x - this.x.value) / this.s.value,
					py: (a.y - this.y.value) / this.s.value
				}, this.drag = null, this.capture(e.pointerId);
			}
		}
	};
	onMove = (e) => {
		if (!this.pointers.has(e.pointerId)) return;
		if (this.pointers.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		}), this.pinch && this.pointers.size >= 2) {
			let [e, t] = [...this.pointers.values()], n = Math.hypot(t.x - e.x, t.y - e.y) || 1, r = this.local((e.x + t.x) / 2, (e.y + t.y) / 2), i = this.clampScale(this.pinch.scale * (n / this.pinch.dist));
			this.s.set(i), this.x.set(r.x - this.pinch.px * i), this.y.set(r.y - this.pinch.py * i), this.markInteracted(), this.apply();
			return;
		}
		let t = this.drag;
		if (!t || t.id !== e.pointerId) return;
		let n = e.clientX - t.startX, r = e.clientY - t.startY;
		if (!t.active) {
			if (Math.hypot(n, r) < Tn) return;
			t.active = !0, t.startX = e.clientX, t.startY = e.clientY, this.capture(e.pointerId), this.el.dataset.panning = "true", this.markInteracted();
			return;
		}
		let i = this.bounds(this.s.value), a = this.el.clientWidth || 1, o = this.el.clientHeight || 1;
		this.x.set(Dn(t.tx + n, i.minX, i.maxX, a)), this.y.set(Dn(t.ty + r, i.minY, i.maxY, o));
		let s = performance.now();
		for (t.history.push({
			t: s,
			x: e.clientX,
			y: e.clientY
		}); t.history.length > 2 && s - t.history[0].t > 100;) t.history.shift();
		this.apply();
	};
	onUp = (e) => {
		if (this.pointers.delete(e.pointerId), this.pinch) {
			this.pointers.size < 2 && (this.pinch = null, this.drag = null, this.settleIntoBounds(0, 0));
			return;
		}
		let t = this.drag;
		if (!t || t.id !== e.pointerId || (this.drag = null, !t.active)) return;
		delete this.el.dataset.panning, this.suppressClick = !0;
		let n = t.history, r = 0, i = 0;
		if (n.length >= 2) {
			let e = n[0], t = n[n.length - 1], a = (t.t - e.t) / 1e3;
			a > 0 && performance.now() - t.t < 80 && (r = (t.x - e.x) / a, i = (t.y - e.y) / a);
		}
		this.settleIntoBounds(r, i), u("debug", "prism.viewport.pan", {
			trace_id: this.opts.traceId,
			vx: Math.round(r),
			vy: Math.round(i),
			scale: An(this.s.value)
		});
	};
	settleIntoBounds(e, t) {
		let n = this.clampScale(this.s.value), r = this.bounds(n), i = this.opts.reducedMotion(), a = (e, t, n, r) => {
			let a = e.value + (i ? 0 : Sn(t)), o = On(a, n, r), s = o !== a && Math.abs(t) > 300;
			e.to(o, s ? bn : K, i ? 0 : t);
		};
		a(this.x, e, r.minX, r.maxX), a(this.y, t, r.minY, r.maxY), this.s.to(n, K), i ? (this.x.set(this.x.target), this.y.set(this.y.target), this.s.set(n), this.apply()) : this.run();
	}
	onWheel = (e) => {
		let t = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? this.el.clientHeight : 1, n = this.local(e.clientX, e.clientY);
		if (e.ctrlKey || e.metaKey) {
			e.preventDefault(), this.halt(), this.zoomAbout(n.x, n.y, this.s.value * Math.exp(-e.deltaY * t * .01)), this.markInteracted(), this.scheduleSettle();
			return;
		}
		let r = this.bounds(this.s.value), i = On(this.x.value - e.deltaX * t, r.minX, r.maxX), a = On(this.y.value - e.deltaY * t, r.minY, r.maxY);
		Math.abs(i - this.x.value) < .5 && Math.abs(a - this.y.value) < .5 || (e.preventDefault(), this.halt(), this.x.set(i), this.y.set(a), this.markInteracted(), this.apply());
	};
	settleTimer = null;
	scheduleSettle() {
		this.settleTimer && clearTimeout(this.settleTimer), this.settleTimer = setTimeout(() => {
			this.settleTimer = null, this.settleIntoBounds(0, 0);
		}, 140);
	}
	onGestureStart = (e) => {
		e.preventDefault(), this.gestureStart = this.s.value;
	};
	onGestureChange = (e) => {
		let t = e;
		if (typeof t.scale != "number") return;
		e.preventDefault();
		let n = this.local(t.clientX ?? 0, t.clientY ?? 0);
		this.zoomAbout(n.x, n.y, this.gestureStart * t.scale), this.markInteracted(), this.scheduleSettle();
	};
	onDoubleClick = (e) => {
		e.target?.closest?.("[data-prism-focusable]") || (this.interacted = !1, this.fit(!0));
	};
	onClickCapture = (e) => {
		this.suppressClick && (this.suppressClick = !1, e.stopPropagation(), e.preventDefault());
	};
	zoomAbout(e, t, n) {
		let r = this.s.value, i = this.clampScale(n), a = (e - this.x.value) / r, o = (t - this.y.value) / r;
		this.s.set(i), this.x.set(e - a * i), this.y.set(t - o * i), this.apply();
	}
	clampScale(e) {
		return On(e, Math.min(this.opts.minScale, this.fitScale), this.opts.maxScale);
	}
	local(e, t) {
		let n = this.el.getBoundingClientRect();
		return {
			x: e - n.left,
			y: t - n.top
		};
	}
	capture(e) {
		try {
			this.el.setPointerCapture(e);
		} catch {}
	}
};
function Dn(e, t, n, r) {
	return e < t ? t - Cn(t - e, r) : e > n ? n + Cn(e - n, r) : e;
}
function On(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
function kn(e) {
	return Math.round(e * 100) / 100;
}
function An(e) {
	return Math.round(e * 1e4) / 1e4;
}
//#endregion
//#region src/render/dom.ts
var jn = "http://www.w3.org/2000/svg", Mn = 32, Nn = .4, Pn = .65, Fn = 240;
function In(e, t, n = {}) {
	let i = sr(), a = n.traceId ?? r(), s = [], c = (e, t, n, r) => {
		e.addEventListener(t, n, r), s.push(() => e.removeEventListener(t, n, r));
	}, l = () => ir("(prefers-reduced-motion: reduce)"), d = J("div", "prism");
	d.dataset.theme = n.theme ?? "graphite", d.dataset.scheme = n.scheme ?? "auto", d.dataset.kind = t.kind, d.dataset.height = n.height ?? "auto", d.setAttribute("role", "figure"), d.setAttribute("aria-roledescription", "diagram"), d.setAttribute("aria-label", n.label ?? $n(t)), Qn(d, n.accent);
	let f = J("div", "prism-viewport"), m = J("div", "prism-stage");
	m.style.width = `${t.width}px`, m.style.height = `${t.height}px`;
	let h = J("div", "prism-layer prism-layer-groups"), g = Y("svg", "prism-layer prism-layer-under"), _ = J("div", "prism-layer prism-layer-bars"), v = Y("svg", "prism-layer prism-layer-edges"), y = J("div", "prism-layer prism-layer-labels"), b = J("div", "prism-layer prism-layer-nodes");
	for (let e of [g, v]) e.setAttribute("width", String(t.width)), e.setAttribute("height", String(t.height)), e.setAttribute("viewBox", `0 0 ${t.width} ${t.height}`), e.setAttribute("aria-hidden", "true"), e.setAttribute("overflow", "visible");
	m.append(h, g, _, v, y, b), f.append(m), d.append(f), e.append(d);
	let x = Lt(d), S = new wn(), C = [], w = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), O = [], k = (e, t, n) => w.set(e, {
		spring: new xn(0, yn),
		ids: t,
		kind: n
	});
	for (let e of er(t.groups)) {
		let n = zn(e, t);
		h.append(n), k(n, [e.group.id], "group");
	}
	for (let e of t.edges) {
		if (e.edge.stroke === "invisible") continue;
		let { group: t, label: n } = Bn(e, x);
		v.append(t), T.set(e.edge.id, t), k(t, [e.edge.id], "edge"), n && (y.append(n), E.set(e.edge.id, n), k(n, [e.edge.id], "edge"));
	}
	for (let e of t.nodes) {
		let t = Ln(e, x);
		b.append(t), D.set(e.node.id, t), C.push({
			id: e.node.id,
			el: t,
			rect: e
		}), k(t, [e.node.id], "node");
	}
	let A = t.sequence;
	if (A) {
		for (let e of A.blocks) {
			let t = Un(e);
			h.append(t), k(t, [], "group");
		}
		for (let e of A.participants) {
			let t = Y("line", "prism-lifeline");
			Xn(t, {
				x1: e.lifelineX,
				x2: e.lifelineX,
				y1: A.lifelineTop,
				y2: A.lifelineBottom
			}), t.dataset.participant = e.participant.id, g.append(t), k(t, [e.participant.id], "node");
		}
		for (let e of A.activations) {
			let t = J("div", "prism-activation");
			X(t, e), _.append(t), O.push({
				a: e,
				el: t
			}), k(t, [e.participantId], "node");
		}
		for (let e of A.messages) {
			let { group: t, label: n } = Vn(e, A.activations);
			v.append(t), T.set(e.message.id, t), k(t, [e.message.id], "edge"), y.append(n), E.set(e.message.id, n), k(n, [e.message.id], "edge");
		}
		for (let e of A.notes) {
			let t = J("div", "prism-note");
			X(t, e), t.dataset.over = e.note.over.join(",");
			for (let n of x.wrap(e.note.text, "note", e.width - W.note.padX * 2)) t.append(q(n, "prism-note-line"));
			b.append(t), k(t, e.note.over, "node");
		}
		for (let e of A.participants) {
			let t = Hn(e);
			b.append(t), D.set(e.participant.id, t), C.push({
				id: e.participant.id,
				el: t,
				rect: e
			}), k(t, [e.participant.id], "node");
		}
	}
	C.sort((e, t) => e.rect.y - t.rect.y || e.rect.x - t.rect.x), C[0]?.el.setAttribute("tabindex", "0");
	let j = (e) => {
		let n = e > 0 ? (e - 64) / Math.max(1, t.width) : 1, r = d.dataset.height === "fill" ? (f.clientHeight - 64) / Math.max(1, t.height) : 696 / Math.max(1, t.height);
		return Math.max(Nn, Math.min(1, n, r > 0 ? r : 1));
	}, M = () => {
		if (d.dataset.height === "fill") return;
		let n = j(e.clientWidth);
		d.style.setProperty("--prism-height", `${Math.round(t.height * n + 64)}px`);
	};
	M();
	let N = new En(f, m, t, S, {
		padding: Mn,
		minScale: .25,
		maxScale: 3,
		traceId: a,
		reducedMotion: l,
		fitScale: j
	});
	N.fit(!1);
	let ee = null;
	typeof ResizeObserver == "function" && (ee = new ResizeObserver(() => M()), ee.observe(e));
	let te = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map();
	for (let e of t.edges) e.edge.stroke !== "invisible" && (nr(te, e.edge.from, e), nr(ne, e.edge.to, e));
	function re(e) {
		let t = /* @__PURE__ */ new Set([e]), n = /* @__PURE__ */ new Set(), r = [];
		if (A) {
			for (let i of A.messages) (i.message.from === e || i.message.to === e) && (n.add(i.message.id), r.push(i.message.id), t.add(i.message.from), t.add(i.message.to));
			return {
				nodes: t,
				edges: n,
				route: r
			};
		}
		let i = (e, i, a, o) => {
			let s = [e], c = /* @__PURE__ */ new Set([e]);
			for (; s.length;) {
				let e = s.shift();
				for (let l of i.get(e) ?? []) {
					if (n.has(l.edge.id) && !o) continue;
					n.add(l.edge.id), o && r.push(l.edge.id);
					let e = a(l);
					t.add(e), c.has(e) || (c.add(e), s.push(e));
				}
			}
		};
		return i(e, te, (e) => e.edge.to, !0), i(e, ne, (e) => e.edge.from, r.length === 0), {
			nodes: t,
			edges: n,
			route: r
		};
	}
	let P = null, F = null, I = null;
	function L(e) {
		if (e !== null && !D.has(e) && (e = null), e === P) return;
		P = e;
		let n = e ? re(e) : null;
		d.dataset.focus = e ? "true" : "false";
		for (let [t, r] of D) r.classList.toggle("is-selected", t === e), r.classList.toggle("is-path", !!(n && n.nodes.has(t) && t !== e)), r.setAttribute("aria-pressed", t === e ? "true" : "false");
		for (let [e, t] of T) t.classList.toggle("is-active", !!n?.edges.has(e));
		for (let [e, t] of E) t.classList.toggle("is-active", !!n?.edges.has(e));
		let r = /* @__PURE__ */ new Set();
		if (n) {
			for (let e of t.nodes) if (n.nodes.has(e.node.id) && e.node.groupId) for (let n of tr(t.groups, e.node.groupId)) r.add(n);
		}
		for (let [e, t] of w) {
			let i = 0;
			n && (i = t.kind === "edge" ? +!t.ids.some((e) => n.edges.has(e)) : t.kind === "node" ? +!t.ids.some((e) => n.nodes.has(e)) : t.ids.length === 0 ? .5 : t.ids.some((e) => r.has(e)) ? 0 : .6), t.spring.to(i), l() && (t.spring.set(i), Zn(e, t.spring.value));
		}
		!l() && !I && (I = S.add((e) => {
			let t = !1;
			for (let [n, r] of w) r.spring.settled || (r.spring.step(e), Zn(n, r.spring.value), t ||= !r.spring.settled);
			return t || (I = null), t;
		})), F?.(), F = null, n && n.route.length && !l() && (F = ie(n.route)), u("info", "prism.focus", {
			trace_id: a,
			node_id: e,
			path_nodes: n?.nodes.size ?? 0,
			path_edges: n?.edges.size ?? 0
		});
	}
	function ie(e) {
		let t = e.map((e) => T.get(e)?.querySelector(".prism-edge-line")).filter((e) => !!(e && typeof e.getTotalLength == "function"));
		if (!t.length) return () => {};
		let n = Y("circle", "prism-pulse");
		n.setAttribute("r", "3"), v.append(n);
		let r = t.map((e) => rr(e)), i = 0, a = 0, o = 0, s = S.add((e) => {
			if (o > 0) return o -= e, n.style.opacity = "0", !0;
			let s = t[i], c = r[i];
			if (a += Fn * e, a >= c) return a = 0, i = (i + 1) % t.length, i === 0 && (o = .6), !0;
			let l = s.getPointAtLength(a);
			n.setAttribute("cx", l.x.toFixed(2)), n.setAttribute("cy", l.y.toFixed(2));
			let u = Math.min(1, a / 18, (c - a) / 18);
			return n.style.opacity = u.toFixed(3), !0;
		});
		return () => {
			s(), n.remove();
		};
	}
	let R = (e) => e instanceof Element ? e.closest("[data-prism-focusable]") : null;
	c(b, "click", ((e) => {
		if (e.target?.closest?.("a")) return;
		let t = R(e.target);
		if (!t) return;
		let n = t.dataset.id ?? null;
		L(n === P ? null : n);
	})), c(f, "click", ((e) => {
		!R(e.target) && !e.target?.closest?.("a") && L(null);
	})), c(b, "pointerover", (e) => {
		let t = R(e.target);
		if (t?.dataset.id) {
			for (let e of [...te.get(t.dataset.id) ?? [], ...ne.get(t.dataset.id) ?? []]) T.get(e.edge.id)?.classList.add("is-hover");
			if (A) for (let e of A.messages) (e.message.from === t.dataset.id || e.message.to === t.dataset.id) && T.get(e.message.id)?.classList.add("is-hover");
		}
	}), c(b, "pointerout", () => {
		for (let e of T.values()) e.classList.remove("is-hover");
	}), c(d, "focusin", ((e) => {
		let t = R(e.target);
		if (!t) return;
		for (let e of C) e.el.setAttribute("tabindex", e.el === t ? "0" : "-1");
		let n = C.find((e) => e.el === t);
		n && N.ensureVisible(n.rect);
	})), c(d, "keydown", ((e) => {
		if (e.key === "Escape") {
			P && (L(null), e.preventDefault());
			return;
		}
		let t = R(e.target);
		if (!t) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			let n = t.dataset.id ?? null;
			L(n === P ? null : n);
			return;
		}
		let n = Gn[e.key];
		if (!n) return;
		let r = C.find((e) => e.el === t);
		r && (e.preventDefault(), Kn(r, C, n)?.el.focus({ preventScroll: !0 }));
	}));
	let z = null, ae = null, oe = null, se = () => {
		let e = d.dataset.scheme;
		return e === "light" || e === "dark" ? e : d.dataset.theme === "reqvar" || ir("(prefers-color-scheme: dark)") ? "dark" : "light";
	};
	if (n.player !== !1) try {
		if (z = an(t, n.model, a), z) {
			let e = n.locale ?? "en";
			d.dataset.player = "", f.tabIndex = 0, f.setAttribute("aria-label", e === "de" ? "Diagramm · Leertaste spielt den Ablauf ab" : "Diagram · Space plays the flow"), oe = sn({
				root: d,
				stage: m,
				scene: t,
				player: z,
				nodeEls: D,
				edgeEls: T,
				edgeLabelEls: E,
				activationEls: O,
				reduced: l,
				locale: e,
				traceId: a
			}), ae = p(d, z, {
				locale: e,
				scheme: se(),
				keyTarget: d,
				traceId: a
			});
		}
	} catch (e) {
		u("error", "prism.flow2d.failed", {
			trace_id: a,
			...o(e)
		}), oe?.destroy(), ae?.destroy(), z?.destroy(), oe = null, ae = null, z = null, delete d.dataset.player;
	}
	n.animate !== !1 && Wn(d, D, h, T, E, l()), u("info", "prism.render.scene", {
		trace_id: a,
		renderer: "dom",
		diagram_type: t.kind,
		node_count: t.nodes.length + (A?.participants.length ?? 0),
		edge_count: t.edges.length + (A?.messages.length ?? 0),
		duration_ms: cr(sr() - i)
	});
	let ce = !1;
	return {
		mode: "2d",
		setTheme(e, t) {
			ce || (d.dataset.theme = e, t && (d.dataset.scheme = t), ae?.setScheme(se()), u("info", "prism.theme", {
				trace_id: a,
				theme: e,
				scheme: d.dataset.scheme
			}));
		},
		get player() {
			return ce ? void 0 : z ?? void 0;
		},
		focusNode(e) {
			ce || L(e);
		},
		destroy() {
			if (!ce) {
				ce = !0;
				try {
					oe?.destroy(), ae?.destroy(), z?.destroy(), F?.(), S.destroy(), N.destroy(), ee?.disconnect();
					for (let e of s) e();
					for (let e of typeof d.getAnimations == "function" ? d.getAnimations({ subtree: !0 }) : []) e.cancel();
				} catch (e) {
					u("warn", "prism.destroy.partial", {
						trace_id: a,
						...o(e)
					});
				}
				d.remove(), u("debug", "prism.destroy", { trace_id: a });
			}
		}
	};
}
function Ln(e, t) {
	let n = e.node, r = J("div", "prism-node");
	r.dataset.id = n.id, r.dataset.shape = n.shape, r.dataset.tone = n.tone, r.dataset.prismFocusable = "", r.setAttribute("role", "button"), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-pressed", "false"), X(r, e);
	let i = t.nodeText(n, e.width);
	r.setAttribute("aria-label", [
		i.title.join(" "),
		i.meta.join(" "),
		n.tone === "neutral" ? "" : `status ${n.tone}`
	].filter(Boolean).join(", "));
	let a = _n(n);
	if (n.shape === "circle") {
		let e = J("span", "prism-node-orb");
		e.append(Jn(a ?? {
			kind: "letter",
			text: ar(i.title[0] ?? n.label)
		})), r.append(e);
	} else if (n.shape === "diamond") r.append(J("span", "prism-node-diamond"));
	else if (a) {
		let e = J("span", "prism-node-icon");
		e.append(Jn(a)), r.append(e);
	}
	let o = J("span", "prism-node-text");
	for (let e of i.title) o.append(q(e, "prism-node-title"));
	for (let e of i.meta) o.append(q(e, "prism-node-meta"));
	if (r.append(o), n.shape !== "circle" && n.shape !== "diamond") {
		if (n.tone !== "neutral") {
			let e = J("span", "prism-node-status");
			e.setAttribute("aria-hidden", "true"), r.append(e);
		}
		let e = n.link ? Ot(n.link.href) : null;
		e && r.append(Rn(e, n));
	} else if (n.link) {
		let e = Ot(n.link.href);
		e && r.append(Rn(e, n));
	}
	return r;
}
function Rn(e, t) {
	let n = document.createElement("a");
	n.className = "prism-node-link", n.href = e, n.rel = "noopener noreferrer", t.link?.target === "_blank" && (n.target = "_blank"), n.setAttribute("aria-label", "Open link"), n.tabIndex = -1;
	let r = gn("external");
	return r && n.append(Yn(r)), n;
}
function zn(e, t) {
	let n = J("div", "prism-group");
	n.dataset.id = e.group.id, n.dataset.tone = e.group.tone, n.dataset.depth = String(Math.min(e.depth, 3)), n.setAttribute("role", "group"), n.setAttribute("aria-label", e.group.label), X(n, e);
	let r = J("div", "prism-group-header");
	e.group.tone !== "neutral" && r.append(J("span", "prism-group-dot")), r.append(q(e.group.label, "prism-group-title"));
	let i = t.nodes.filter((t) => t.node.groupId === e.group.id).length;
	return i && r.append(q(String(i), "prism-group-count")), n.append(r), n;
}
function Bn(e, t) {
	let n = Ht(e), r = Y("g", "prism-edge");
	r.dataset.id = e.edge.id, r.dataset.from = e.edge.from, r.dataset.to = e.edge.to, r.dataset.stroke = e.edge.stroke;
	let i = Y("path", "prism-edge-halo");
	i.setAttribute("d", n.d);
	let a = Y("path", "prism-edge-line");
	a.setAttribute("d", n.d);
	let o = Y("circle", "prism-edge-port");
	Xn(o, {
		cx: n.start.x,
		cy: n.start.y,
		r: 2
	}), r.append(i, a, o);
	for (let e of n.arrows) {
		let t = Y("path", "prism-edge-arrow");
		t.setAttribute("d", e), r.append(t);
	}
	let s = null;
	if (e.edge.label) {
		let n = Ut(e, t.text(e.edge.label, "edgeLabel"));
		n && (s = J("div", "prism-edge-label"), s.dataset.edge = e.edge.id, X(s, n), s.append(q(e.edge.label, "prism-edge-label-text")));
	}
	return {
		group: r,
		label: s
	};
}
function Vn(e, t) {
	let n = qt(e, t), r = Y("g", "prism-edge prism-message");
	r.dataset.id = e.message.id, r.dataset.from = e.message.from, r.dataset.to = e.message.to, r.dataset.kind = e.message.kind, r.dataset.stroke = e.message.kind === "reply" ? "dashed" : "solid";
	let i = Y("path", "prism-edge-halo");
	i.setAttribute("d", n.d);
	let a = Y("path", "prism-edge-line");
	a.setAttribute("d", n.d), r.append(i, a);
	for (let t of n.arrows) {
		let n = Y("path", e.message.kind === "async" ? "prism-edge-arrow is-open" : "prism-edge-arrow");
		n.setAttribute("d", t), r.append(n);
	}
	let o = J("div", "prism-edge-label prism-message-label");
	return o.dataset.edge = e.message.id, X(o, e.label), o.append(q(e.message.label, "prism-edge-label-text")), {
		group: r,
		label: o
	};
}
function Hn(e) {
	let t = J("div", "prism-node prism-participant");
	if (t.dataset.id = e.participant.id, t.dataset.shape = "participant", t.dataset.role = e.participant.role, t.dataset.tone = "neutral", t.dataset.prismFocusable = "", t.setAttribute("role", "button"), t.setAttribute("tabindex", "-1"), t.setAttribute("aria-pressed", "false"), t.setAttribute("aria-label", `${e.participant.role === "actor" ? "Actor" : "Participant"} ${e.participant.label}`), X(t, e), e.participant.role === "actor") {
		let e = J("span", "prism-node-icon"), n = gn("user");
		n && e.append(Yn(n)), t.append(e);
	}
	let n = J("span", "prism-node-text");
	return n.append(q(e.participant.label, "prism-node-title")), t.append(n), t;
}
function Un(e) {
	let t = J("div", "prism-block");
	t.dataset.kind = e.block.kind, X(t, e);
	let n = J("div", "prism-block-chip");
	n.append(q(e.block.kind, "prism-block-kind")), e.block.label && n.append(q(e.block.label, "prism-block-label")), t.append(n);
	for (let n of e.dividers) {
		let r = J("div", "prism-block-divider");
		r.style.top = `${n.y - e.y}px`;
		let i = J("div", "prism-block-chip is-section");
		i.append(q(e.block.kind === "par" ? "and" : "else", "prism-block-kind")), n.label && i.append(q(n.label, "prism-block-label")), r.append(i), t.append(r);
	}
	return t;
}
function Wn(e, t, n, r, i, a) {
	if (typeof e.animate == "function") try {
		if (a) {
			e.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: 200,
				easing: "ease"
			});
			return;
		}
		let o = "cubic-bezier(0.23, 1, 0.32, 1)", s = [{
			opacity: 0,
			filter: "blur(6px)",
			transform: "scale(0.98)"
		}, {
			opacity: 1,
			filter: "blur(0px)",
			transform: "scale(1)"
		}], c = 0;
		for (let e of n.children) e.animate(s, {
			duration: 520,
			delay: c,
			easing: o,
			fill: "backwards"
		}), c += 40;
		let l = [...t.values()].sort((e, t) => or(e.style.top) - or(t.style.top) || or(e.style.left) - or(t.style.left)), u = l.length > 1 ? Math.min(36, 480 / l.length) : 0;
		l.forEach((e, t) => e.animate(s, {
			duration: 460,
			delay: 60 + t * u,
			easing: o,
			fill: "backwards"
		}));
		let d = 60 + l.length * u + 160;
		for (let [e, t] of r) {
			let n = t.querySelector(".prism-edge-line"), r = t.dataset.stroke === "dotted" || t.dataset.stroke === "dashed", a = n ? rr(n) : 0;
			n && a > 0 && !r ? n.animate([{
				strokeDasharray: `${a} ${a}`,
				strokeDashoffset: a
			}, {
				strokeDasharray: `${a} ${a}`,
				strokeDashoffset: 0
			}], {
				duration: 560,
				delay: d,
				easing: "cubic-bezier(0.65, 0, 0.35, 1)",
				fill: "backwards"
			}) : t.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: 400,
				delay: d,
				easing: o,
				fill: "backwards"
			});
			for (let e of t.querySelectorAll(".prism-edge-arrow, .prism-edge-port")) e.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: 220,
				delay: d + (r ? 0 : 420),
				easing: o,
				fill: "backwards"
			});
			i.get(e)?.animate(s, {
				duration: 360,
				delay: d + 320,
				easing: o,
				fill: "backwards"
			});
		}
	} catch {}
}
var Gn = {
	ArrowRight: {
		x: 1,
		y: 0
	},
	ArrowLeft: {
		x: -1,
		y: 0
	},
	ArrowDown: {
		x: 0,
		y: 1
	},
	ArrowUp: {
		x: 0,
		y: -1
	}
};
function Kn(e, t, n) {
	let r = qn(e.rect), i = null, a = Infinity;
	for (let o of t) {
		if (o === e) continue;
		let t = qn(o.rect), s = t.x - r.x, c = t.y - r.y, l = s * n.x + c * n.y;
		if (l <= 1) continue;
		let u = l + Math.abs(s * n.y - c * n.x) * 2;
		u < a && (a = u, i = o);
	}
	return i;
}
function qn(e) {
	return {
		x: e.x + e.width / 2,
		y: e.y + e.height / 2
	};
}
function Jn(e) {
	if (e.kind === "glyph") return Yn(e.paths);
	let t = J("span", "prism-icon-letter");
	return t.textContent = e.text, t.setAttribute("aria-hidden", "true"), t;
}
function Yn(e) {
	let t = Y("svg", "prism-glyph");
	Xn(t, {
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		focusable: "false"
	});
	for (let n of e) {
		let e = Y("path", "");
		e.setAttribute("d", n), t.append(e);
	}
	return t;
}
function q(e, t) {
	let n = J("span", t);
	return n.textContent = e, n;
}
function J(e, t) {
	let n = document.createElement(e);
	return t && (n.className = t), n;
}
function Y(e, t) {
	let n = document.createElementNS(jn, e);
	return t && n.setAttribute("class", t), n;
}
function Xn(e, t) {
	for (let [n, r] of Object.entries(t)) e.setAttribute(n, String(r));
}
function X(e, t) {
	e.style.left = `${t.x}px`, e.style.top = `${t.y}px`, e.style.width = `${t.width}px`, e.style.height = `${t.height}px`;
}
function Zn(e, t) {
	let n = 1 - Pn * t;
	e.style.opacity = n > .999 ? "" : n.toFixed(3);
}
function Qn(e, t) {
	t && ((typeof CSS < "u" && typeof CSS.supports == "function" ? CSS.supports("color", t) : /^#[0-9a-f]{3,8}$/i.test(t)) ? e.style.setProperty("--prism-accent", t) : u("warn", "prism.accent.invalid", { accent_length: t.length }));
}
function $n(e) {
	if (e.kind === "sequence") {
		let t = e.sequence;
		return `Sequence diagram with ${t?.participants.length ?? 0} participants and ${t?.messages.length ?? 0} messages`;
	}
	return `Flowchart with ${e.nodes.length} nodes and ${e.edges.length} connections`;
}
function er(e) {
	return [...e].sort((e, t) => e.depth - t.depth);
}
function tr(e, t) {
	let n = [], r = t, i = /* @__PURE__ */ new Set();
	for (; r && !i.has(r);) i.add(r), n.push(r), r = e.find((e) => e.group.id === r)?.group.parentId;
	return n;
}
function nr(e, t, n) {
	let r = e.get(t);
	r ? r.push(n) : e.set(t, [n]);
}
function rr(e) {
	try {
		return typeof e.getTotalLength == "function" ? e.getTotalLength() : 0;
	} catch {
		return 0;
	}
}
function ir(e) {
	try {
		return typeof matchMedia == "function" && matchMedia(e).matches;
	} catch {
		return !1;
	}
}
function ar(e) {
	return ([...String(e).trim()][0] ?? "•").toUpperCase();
}
function or(e) {
	return parseFloat(e) || 0;
}
function sr() {
	return typeof performance < "u" ? performance.now() : Date.now();
}
function cr(e) {
	return Math.round(e * 100) / 100;
}
//#endregion
//#region src/render/fallback.ts
var lr = /* @__PURE__ */ new Set([
	"script",
	"iframe",
	"frame",
	"frameset",
	"object",
	"embed",
	"applet",
	"base",
	"link",
	"meta",
	"form",
	"input",
	"button",
	"textarea",
	"select",
	"option",
	"portal",
	"template",
	"noscript",
	"set",
	"animate",
	"animatemotion",
	"animatetransform",
	"handler",
	"listener"
]), ur = /* @__PURE__ */ new Set([
	"href",
	"xlink:href",
	"src",
	"action",
	"formaction",
	"poster",
	"background",
	"srcset"
]);
function dr(e) {
	let t = e.replace(/[\u0000-\u0020\u007f-\u009f]+/g, "").toLowerCase();
	return t === "" || t.startsWith("#") || t.startsWith("http://") || t.startsWith("https://") ? !0 : /^data:image\/(png|gif|jpe?g|webp);/.test(t);
}
function fr(e) {
	let t = {
		removedElements: 0,
		removedAttributes: 0
	}, n = [e, ...Array.from(e.querySelectorAll("*"))];
	for (let r of n) if (r !== e && lr.has(r.localName.toLowerCase())) r.remove(), t.removedElements++;
	else for (let e of Array.from(r.attributes)) {
		let n = e.name.toLowerCase();
		(n.startsWith("on") || ur.has(n) && !dr(e.value) || n === "style" && /expression\s*\(|javascript:|url\s*\(\s*['"]?\s*(?!#)[a-z]+:/i.test(e.value)) && (r.removeAttributeNode(e), t.removedAttributes++);
	}
	return t;
}
function pr(e, t = document) {
	let n = new DOMParser().parseFromString(`<!doctype html><body>${e}`, "text/html").body.querySelector("svg");
	if (!n || n.namespaceURI !== "http://www.w3.org/2000/svg") return null;
	let r = fr(n);
	return {
		svg: t.importNode(n, !0),
		report: r
	};
}
function mr(e, t = document) {
	let n = t.createElement("div");
	n.className = "prism-fallback-source", n.setAttribute("role", "group"), n.setAttribute("aria-label", "Diagram source");
	let r = t.createElement("p");
	r.className = "prism-fallback-error", r.textContent = "Diagram could not be rendered";
	let i = t.createElement("pre");
	return i.className = "prism-fallback-code", i.textContent = e, n.append(r, i), n;
}
//#endregion
//#region src/render/palette.ts
var hr = {
	stage: "#f5f5f7",
	grid: "rgba(0,0,0,0.055)",
	ink: "#1d1d1f",
	ink2: "rgba(29,29,31,0.56)",
	ink3: "rgba(29,29,31,0.32)",
	accent: "#007aff",
	ok: "#28a745",
	warn: "#e58a00",
	danger: "#e5352b",
	surfaceTop: "#ffffff",
	surfaceBottom: "#fbfbfc",
	border: "rgba(0,0,0,0.075)",
	lightEdge: "rgba(255,255,255,1)",
	shadow: "rgba(0,0,0,0.07)",
	group: "rgba(0,0,0,0.028)",
	groupBorder: "rgba(0,0,0,0.06)",
	edge: "rgba(29,29,31,0.3)",
	label: "#ffffff",
	note: "#ffffff",
	block: "rgba(0,0,0,0.018)"
}, gr = {
	stage: "#0f0f11",
	grid: "rgba(255,255,255,0.045)",
	ink: "#f5f5f7",
	ink2: "rgba(245,245,247,0.56)",
	ink3: "rgba(245,245,247,0.32)",
	accent: "#0a84ff",
	ok: "#30d158",
	warn: "#ff9f0a",
	danger: "#ff453a",
	surfaceTop: "#252528",
	surfaceBottom: "#1d1d20",
	border: "rgba(255,255,255,0.085)",
	lightEdge: "rgba(255,255,255,0.09)",
	shadow: "rgba(0,0,0,0.5)",
	group: "rgba(255,255,255,0.028)",
	groupBorder: "rgba(255,255,255,0.07)",
	edge: "rgba(245,245,247,0.28)",
	label: "#1c1c1f",
	note: "#1d1d20",
	block: "rgba(255,255,255,0.018)"
}, _r = {
	stage: "#090909",
	grid: "rgba(232,239,234,0.04)",
	ink: "#e8efea",
	ink2: "rgba(232,239,234,0.56)",
	ink3: "rgba(232,239,234,0.32)",
	accent: "#41dce1",
	ok: "#7dffa8",
	warn: "#ffbd3c",
	danger: "#fb7185",
	surfaceTop: "#14171c",
	surfaceBottom: "#0f1115",
	border: "rgba(232,239,234,0.085)",
	lightEdge: "rgba(232,239,234,0.07)",
	shadow: "rgba(0,0,0,0.55)",
	group: "rgba(65,220,225,0.022)",
	groupBorder: "rgba(232,239,234,0.075)",
	edge: "rgba(232,239,234,0.26)",
	label: "#101216",
	note: "#12141a",
	block: "rgba(232,239,234,0.015)"
};
function vr(e) {
	return e === "reqvar" ? {
		light: _r,
		dark: _r
	} : {
		light: hr,
		dark: gr
	};
}
//#endregion
//#region src/render/svg.ts
var yr = "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", system-ui, \"Helvetica Neue\", \"Segoe UI\", Roboto, sans-serif";
function br(e, t = {}) {
	let n = typeof performance < "u" ? performance.now() : 0, i = String(t.theme ?? "graphite"), a = t.scheme ?? "auto", o = t.measurer ?? Lt(null), s = vr(i), c = Lr(e.width), l = Lr(e.height), d = [], f = t.title ?? (e.kind === "sequence" ? "Sequence diagram" : "Flowchart");
	d.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${c}" height="${l}" viewBox="0 0 ${c} ${l}" role="img" aria-label="${Z(f)}" font-family="${Z(yr)}">`, `<title>${Z(f)}</title>`, `<style>${Mr(s, a)}</style>`, "<defs>", "<linearGradient id=\"pz-surface\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" class=\"pz-sf-top\"/><stop offset=\"1\" class=\"pz-sf-bot\"/></linearGradient>", "<linearGradient id=\"pz-light\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" class=\"pz-le\" stop-opacity=\"1\"/><stop offset=\"0.28\" class=\"pz-le\" stop-opacity=\"0\"/></linearGradient>", "<filter id=\"pz-shadow\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"160%\"><feDropShadow dx=\"0\" dy=\"1\" stdDeviation=\"0.6\" class=\"pz-sh\" flood-opacity=\"0.9\"/><feDropShadow dx=\"0\" dy=\"6\" stdDeviation=\"6\" class=\"pz-sh\" flood-opacity=\"0.8\"/></filter>", "<pattern id=\"pz-grid\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><circle cx=\"1\" cy=\"1\" r=\"1\" class=\"pz-grid\"/></pattern>", "</defs>", `<rect width="${c}" height="${l}" class="pz-stage"/>`, `<rect width="${c}" height="${l}" fill="url(#pz-grid)"/>`);
	for (let t of [...e.groups].sort((e, t) => e.depth - t.depth)) d.push(Sr(t, e, o));
	e.sequence && d.push(...Tr(e, o));
	for (let t of e.edges) t.edge.stroke !== "invisible" && d.push(Cr(t, o));
	for (let t of e.nodes) d.push(xr(t, o));
	d.push("</svg>");
	let p = d.join("");
	return u("info", "prism.render.svg", {
		trace_id: t.traceId ?? r(),
		theme: i,
		scheme: a,
		diagram_type: e.kind,
		node_count: e.nodes.length,
		bytes: p.length,
		duration_ms: typeof performance < "u" ? Math.round((performance.now() - n) * 100) / 100 : 0
	}), p;
}
function xr(e, t) {
	let n = e.node, { x: r, y: i, width: a, height: o } = Ir(e), s = Pr(n.tone), c = t.nodeText(n, a), l = [`<g class="pz-node ${s}" data-id="${Z(n.id)}">`], u = _n(n);
	if (n.shape === "circle") {
		let e = r + a / 2;
		l.push(`<circle cx="${Q(e)}" cy="${Q(i + 24)}" r="24" fill="url(#pz-surface)" filter="url(#pz-shadow)"/>`), l.push(`<circle cx="${Q(e)}" cy="${Q(i + 24)}" r="23.5" class="pz-tone-stroke" fill="none" stroke-opacity="0.35"/>`), l.push(kr(u ?? {
			kind: "letter",
			text: (c.title[0] ?? "•").slice(0, 1).toUpperCase()
		}, e, i + 24, 20));
		let t = i + 48 + 8;
		for (let n of c.title) l.push(`<text x="${Q(e)}" y="${Q(t + 12)}" text-anchor="middle" class="pz-title">${Z(n)}</text>`), t += W.circle.line;
		for (let n of c.meta) l.push(`<text x="${Q(e)}" y="${Q(t + 11)}" text-anchor="middle" class="pz-meta">${Z(n)}</text>`), t += W.node.metaLine;
		return l.push("</g>"), Ar(n.link?.href, l.join(""));
	}
	let d = n.shape === "stadium" ? o / 2 : n.shape === "round" ? 20 : n.shape === "diamond" ? 12 : 14, f = n.shape === "stadium" ? Fr(r, i, a, o) : Dt(r, i, a, o, d);
	l.push(`<path d="${f}" fill="url(#pz-surface)" filter="url(#pz-shadow)"/>`), l.push(`<path d="${f}" fill="url(#pz-light)" opacity="0.9"/>`), l.push(`<path d="${n.shape === "stadium" ? Fr(r + .5, i + .5, a - 1, o - 1) : Dt(r + .5, i + .5, a - 1, o - 1, d - .5)}" fill="none" class="pz-border"/>`);
	let p = r + W.node.padX, m = i + o / 2;
	if (n.shape === "diamond") {
		let e = W.diamond, t = r + e.padL + e.glyph / 2;
		l.push(`<rect x="${Q(t - 4.5)}" y="${Q(m - 4.5)}" width="9" height="9" rx="2" transform="rotate(45 ${Q(t)} ${Q(m)})" class="pz-accent-fill"/>`), p = r + e.padL + e.glyph + e.gap;
	} else if (u) {
		let e = W.node.icon, t = r + W.node.padX + e / 2;
		l.push(`<circle cx="${Q(t)}" cy="${Q(m)}" r="${e / 2}" class="pz-tone-fill" fill-opacity="${n.tone === "neutral" ? .07 : .13}"/>`), l.push(kr(u, t, m, 15)), p = r + W.node.padX + e + W.node.iconGap;
	}
	let h = i + (o - (c.title.length * W.node.titleLine + (c.meta.length ? W.node.metaGap + c.meta.length * W.node.metaLine : 0))) / 2;
	for (let e of c.title) l.push(`<text x="${Q(p)}" y="${Q(h + 13)}" class="pz-title">${Z(e)}</text>`), h += W.node.titleLine;
	c.meta.length && (h += W.node.metaGap);
	for (let e of c.meta) l.push(`<text x="${Q(p)}" y="${Q(h + 11)}" class="pz-meta">${Z(e)}</text>`), h += W.node.metaLine;
	if (n.tone !== "neutral" && n.shape !== "diamond") {
		let e = r + a - W.node.padX - 3;
		l.push(`<circle cx="${Q(e)}" cy="${Q(m)}" r="6" class="pz-tone-fill" fill-opacity="0.16"/><circle cx="${Q(e)}" cy="${Q(m)}" r="3" class="pz-tone-fill"/>`);
	}
	return l.push("</g>"), Ar(n.link?.href, l.join(""));
}
function Sr(e, t, n) {
	let { x: r, y: i, width: a, height: o } = Ir(e), s = W.group.radius, c = [
		`<g class="pz-group ${Pr(e.group.tone)}" data-id="${Z(e.group.id)}">`,
		`<path d="${Dt(r, i, a, o, s)}" class="pz-group-fill"/>`,
		`<path d="${Dt(r + .5, i + .5, a - 1, o - 1, s - .5)}" fill="none" class="pz-group-stroke"/>`
	], l = r + W.group.padX, u = i + W.group.header / 2;
	e.group.tone !== "neutral" && (c.push(`<circle cx="${Q(l + 3)}" cy="${Q(u)}" r="3" class="pz-tone-fill"/>`), l += 14);
	let d = a - (l - r) - W.group.padX - 28, f = n.wrap(e.group.label, "group", d)[0] ?? "";
	c.push(`<text x="${Q(l)}" y="${Q(u + 4)}" class="pz-group-title">${Z(f)}</text>`);
	let p = t.nodes.filter((t) => t.node.groupId === e.group.id).length;
	if (p) {
		let e = r + a - W.group.padX - 9;
		c.push(`<rect x="${Q(e - 9)}" y="${Q(u - 9)}" width="18" height="18" rx="9" class="pz-ink-fill" fill-opacity="0.12"/>`), c.push(`<text x="${Q(e)}" y="${Q(u + 3.5)}" text-anchor="middle" class="pz-count">${p}</text>`);
	}
	return c.push("</g>"), c.join("");
}
function Cr(e, t) {
	let n = Ht(e), r = e.edge.stroke === "dotted" ? "pz-edge pz-dotted" : e.edge.stroke === "thick" ? "pz-edge pz-thick" : "pz-edge", i = [
		`<g data-id="${Z(e.edge.id)}">`,
		`<path d="${n.d}" class="${r}"/>`,
		`<circle cx="${Q(n.start.x)}" cy="${Q(n.start.y)}" r="2" class="pz-edge-fill"/>`
	];
	for (let e of n.arrows) i.push(`<path d="${e}" class="pz-edge-fill"/>`);
	if (e.edge.label) {
		let n = Ut(e, t.text(e.edge.label, "edgeLabel"));
		n && i.push(wr(n, e.edge.label));
	}
	return i.push("</g>"), i.join("");
}
function wr(e, t) {
	let { x: n, y: r, width: i, height: a } = Ir(e);
	return `<rect x="${Q(n)}" y="${Q(r)}" width="${Q(i)}" height="${Q(a)}" rx="${Q(a / 2)}" class="pz-label"/><text x="${Q(n + i / 2)}" y="${Q(r + a / 2 + 3.8)}" text-anchor="middle" class="pz-label-text">${Z(t)}</text>`;
}
function Tr(e, t) {
	let n = e.sequence, r = [];
	for (let e of n.blocks) {
		let { x: n, y: i, width: a, height: o } = Ir(e);
		r.push(`<path d="${Dt(n, i, a, o, 16)}" class="pz-block"/>`), r.push(Or(n + 8, i + 7, e.block.kind, e.block.label, t));
		for (let i of e.dividers) r.push(`<line x1="${Q(n)}" x2="${Q(n + a)}" y1="${Q(i.y)}" y2="${Q(i.y)}" class="pz-divider"/>`), r.push(Or(n + 8, i.y + 6, e.block.kind === "par" ? "and" : "else", i.label, t));
	}
	for (let e of n.participants) r.push(`<line x1="${Q(e.lifelineX)}" x2="${Q(e.lifelineX)}" y1="${Q(n.lifelineTop)}" y2="${Q(n.lifelineBottom)}" class="pz-lifeline"/>`);
	for (let e of n.activations) {
		let { x: t, y: n, width: i, height: a } = Ir(e);
		r.push(`<rect x="${Q(t)}" y="${Q(n)}" width="${Q(i)}" height="${Q(a)}" rx="5" fill="url(#pz-surface)" class="pz-activation"/>`);
	}
	for (let e of n.messages) r.push(Er(e, n.activations));
	for (let e of n.notes) {
		let { x: n, y: i, width: a, height: o } = Ir(e);
		r.push(`<path d="${Dt(n, i, a, o, 12)}" class="pz-note" filter="url(#pz-shadow)"/>`);
		let s = t.wrap(e.note.text, "note", a - W.note.padX * 2), c = i + (o - s.length * W.note.line) / 2;
		for (let e of s) r.push(`<text x="${Q(n + a / 2)}" y="${Q(c + 12)}" text-anchor="middle" class="pz-note-text">${Z(e)}</text>`), c += W.note.line;
	}
	for (let e of n.participants) r.push(Dr(e));
	return r;
}
function Er(e, t) {
	let n = qt(e, t), r = e.message.kind === "reply", i = [`<g data-id="${Z(e.message.id)}">`, `<path d="${n.d}" class="pz-edge${r ? " pz-dashed" : ""}"/>`];
	for (let t of n.arrows) i.push(e.message.kind === "async" ? `<path d="${t}" class="pz-edge"/>` : `<path d="${t}" class="pz-edge-fill"/>`);
	return i.push(wr(e.label, e.message.label), "</g>"), i.join("");
}
function Dr(e) {
	let { x: t, y: n, width: r, height: i } = Ir(e), a = Dt(t, n, r, i, 12), o = [
		`<g class="pz-node pz-t-neutral" data-id="${Z(e.participant.id)}">`,
		`<path d="${a}" fill="url(#pz-surface)" filter="url(#pz-shadow)"/>`,
		`<path d="${a}" fill="url(#pz-light)" opacity="0.9"/>`,
		`<path d="${Dt(t + .5, n + .5, r - 1, i - 1, 11.5)}" fill="none" class="pz-border"/>`
	], s = t + r / 2;
	if (e.participant.role === "actor") {
		let e = gn("user");
		if (e) {
			let a = t + r / 2 - 30;
			o.push(`<circle cx="${Q(a)}" cy="${Q(n + i / 2)}" r="11" class="pz-ink-fill" fill-opacity="0.12"/>`), o.push(kr({
				kind: "glyph",
				paths: e
			}, a, n + i / 2, 13, "pz-icon-muted")), s += 12;
		}
	}
	return o.push(`<text x="${Q(s)}" y="${Q(n + i / 2 + 4.5)}" text-anchor="middle" class="pz-title">${Z(e.participant.label)}</text>`, "</g>"), o.join("");
}
function Or(e, t, n, r, i) {
	let a = n.toUpperCase(), o = a.length * 6.6 + 2, s = r ? i.width(r, "edgeLabel") : 0, c = 7 + o + (r ? 6 + s : 0) + 8;
	return `<rect x="${Q(e)}" y="${Q(t)}" width="${Q(c)}" height="20" rx="10" class="pz-label"/><text x="${Q(e + 7)}" y="${Q(t + 13.5)}" class="pz-chip-kind">${Z(a)}</text>` + (r ? `<text x="${Q(e + 7 + o + 6)}" y="${Q(t + 14)}" class="pz-chip-label">${Z(r)}</text>` : "");
}
function kr(e, t, n, r, i = "pz-icon") {
	if (!e) return "";
	if (e.kind === "letter") return `<text x="${Q(t)}" y="${Q(n + r * .24)}" text-anchor="middle" class="${i} pz-letter" font-size="${Q(r * .72)}">${Z(e.text)}</text>`;
	let a = r / 24, o = e.paths.map((e) => `<path d="${Z(e)}"/>`).join("");
	return `<g transform="translate(${Q(t - r / 2)} ${Q(n - r / 2)}) scale(${Q(a)})" class="${i}" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${o}</g>`;
}
function Ar(e, t) {
	let n = e ? Ot(e) : null;
	return n ? `<a href="${Z(n)}" target="_blank" rel="noopener noreferrer">${t}</a>` : t;
}
function jr(e) {
	return `--stage:${e.stage};--grid:${e.grid};--ink:${e.ink};--ink2:${e.ink2};--ink3:${e.ink3};--accent:${e.accent};--ok:${e.ok};--warn:${e.warn};--danger:${e.danger};--sft:${e.surfaceTop};--sfb:${e.surfaceBottom};--border:${e.border};--le:${e.lightEdge};--sh:${e.shadow};--group:${e.group};--gborder:${e.groupBorder};--edge:${e.edge};--label:${e.label};--note:${e.note};--block:${e.block}`;
}
function Mr(e, t) {
	return `svg{${jr(t === "dark" ? e.dark : e.light)}}` + (t === "auto" && e.dark !== e.light ? `@media (prefers-color-scheme: dark){svg{${jr(e.dark)}}}` : "") + ".pz-stage{fill:var(--stage)}.pz-grid{fill:var(--grid)}.pz-sf-top{stop-color:var(--sft)}.pz-sf-bot{stop-color:var(--sfb)}.pz-le{stop-color:var(--le)}.pz-sh{flood-color:var(--sh)}.pz-border{stroke:var(--border);stroke-width:1}.pz-t-neutral{--tone:var(--ink)}.pz-t-accent{--tone:var(--accent)}.pz-t-ok{--tone:var(--ok)}.pz-t-warn{--tone:var(--warn)}.pz-t-danger{--tone:var(--danger)}.pz-tone-fill{fill:var(--tone)}.pz-tone-stroke{stroke:var(--tone)}.pz-ink-fill{fill:var(--ink)}.pz-accent-fill{fill:var(--accent)}.pz-icon{stroke:var(--tone);fill:none}.pz-t-neutral .pz-icon,.pz-icon-muted{stroke:var(--ink2);fill:none}.pz-letter{fill:var(--tone);stroke:none;font-weight:650}.pz-title{fill:var(--ink);font-size:13px;font-weight:590;letter-spacing:-0.13px}.pz-meta{fill:var(--ink2);font-size:11px;font-weight:450;letter-spacing:0.11px}.pz-group-fill{fill:var(--group)}.pz-group-stroke{stroke:var(--gborder);stroke-width:1}.pz-group-title{fill:var(--ink);fill-opacity:0.78;font-size:12px;font-weight:600}.pz-count{fill:var(--ink2);font-size:10.5px;font-weight:600;font-variant-numeric:tabular-nums}.pz-edge{fill:none;stroke:var(--edge);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}.pz-dotted{stroke-dasharray:0.01 5;stroke-width:2}.pz-thick{stroke-width:2.5}.pz-dashed{stroke-dasharray:4 4;stroke-linecap:butt}.pz-edge-fill{fill:var(--edge)}.pz-label{fill:var(--label);stroke:var(--border);stroke-width:1}.pz-label-text{fill:var(--ink2);font-size:11px;font-weight:500;letter-spacing:0.11px}.pz-lifeline{stroke:var(--ink3);stroke-width:1;stroke-dasharray:2 5;stroke-linecap:round}.pz-activation{stroke:var(--accent);stroke-opacity:0.3;stroke-width:1}.pz-note{fill:var(--note);stroke:var(--border);stroke-width:1}.pz-note-text{fill:var(--ink);fill-opacity:0.74;font-size:12px}.pz-block{fill:var(--block);stroke:var(--gborder);stroke-width:1}.pz-divider{stroke:var(--gborder);stroke-dasharray:3 3}.pz-chip-kind{fill:var(--accent);font-size:9.5px;font-weight:700;letter-spacing:0.66px}.pz-chip-label{fill:var(--ink2);font-size:11px;font-weight:500}";
}
function Z(e) {
	return String(e ?? "").replace(/[&<>"']/g, (e) => Nr[e]);
}
var Nr = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
};
function Pr(e) {
	return [
		"neutral",
		"accent",
		"ok",
		"warn",
		"danger"
	].includes(e) ? `pz-t-${e}` : "pz-t-neutral";
}
function Fr(e, t, n, r) {
	let i = r / 2;
	return `M${Q(e + i)},${Q(t)} H${Q(e + n - i)} A${Q(i)},${Q(i)} 0 0 1 ${Q(e + n - i)},${Q(t + r)} H${Q(e + i)} A${Q(i)},${Q(i)} 0 0 1 ${Q(e + i)},${Q(t)} Z`;
}
function Ir(e) {
	return {
		x: Lr(e.x),
		y: Lr(e.y),
		width: Math.max(0, Lr(e.width)),
		height: Math.max(0, Lr(e.height))
	};
}
function Lr(e) {
	let t = Number(e);
	return Number.isFinite(t) ? t : 0;
}
function Q(e) {
	return (Math.round(Lr(e) * 100) / 100).toString();
}
//#endregion
//#region src/index.ts
var Rr = 1e4;
async function zr(e, t, n = {}) {
	let i = n.traceId ?? r(), a = Zr(), s = {
		...n,
		traceId: i
	};
	u("info", "prism.render.start", {
		trace_id: i,
		mode: s.mode ?? "2d",
		theme: s.theme ?? "graphite",
		code_length: t.length
	});
	let c, l;
	try {
		c = await qe(t, { traceId: i }), l = await Hr(e, c, s);
	} catch (n) {
		let r = n instanceof Ue ? "unsupported_diagram" : "parse_or_layout_failed";
		return u("warn", "prism.fallback", {
			trace_id: i,
			reason: r,
			diagram_type: n instanceof Ue ? n.diagramType : void 0,
			duration_ms: $(a),
			...o(n)
		}), s.signal?.aborted ? Yr() : qr(e, t, s, a);
	}
	if (s.signal?.aborted) return Yr();
	try {
		let t = await Vr(e, l, {
			...s,
			model: c
		});
		return u("info", "prism.render.ok", {
			trace_id: i,
			mode: t.mode,
			diagram_type: l.kind,
			node_count: l.nodes.length,
			duration_ms: $(a)
		}), t;
	} catch (n) {
		return u("error", "prism.render.error", {
			trace_id: i,
			stage: "mount",
			duration_ms: $(a),
			...o(n)
		}), s.signal?.aborted ? Yr() : (u("warn", "prism.fallback", {
			trace_id: i,
			reason: "render_failed",
			duration_ms: $(a)
		}), qr(e, t, s, a));
	}
}
async function Br(e, t, n = {}) {
	let i = n.traceId ?? r(), a = Zr(), s = {
		...n,
		traceId: i
	};
	u("info", "prism.render.start", {
		trace_id: i,
		mode: s.mode ?? "2d",
		source: "model",
		diagram_type: t.kind
	});
	try {
		let n = await Hr(e, t, s);
		if (s.signal?.aborted) return Yr();
		let r = await Vr(e, n, {
			...s,
			model: s.model ?? t
		});
		return u("info", "prism.render.ok", {
			trace_id: i,
			mode: r.mode,
			diagram_type: n.kind,
			node_count: n.nodes.length,
			duration_ms: $(a)
		}), r;
	} catch (e) {
		throw u("error", "prism.render.error", {
			trace_id: i,
			stage: "model",
			duration_ms: $(a),
			...o(e)
		}), e;
	}
}
async function Vr(e, t, n = {}) {
	let i = n.traceId ?? r();
	if (n.mode === "3d") {
		let r = Zr(), a = null, s = {};
		if (t.kind !== "flowchart") a = "kind_2d_only";
		else try {
			let r = await import("./chunks/render3d-1VkXl7UQ.js");
			if (!r.supportsWebGL()) a = "no_webgl";
			else return n.signal?.aborted ? Yr("3d") : await r.renderScene3d(e, t, {
				theme: n.theme,
				scheme: n.scheme,
				accent: n.accent,
				traceId: i,
				model: n.model,
				locale: n.locale ?? "en",
				playerBar: n.player !== !1 && void 0
			});
		} catch (e) {
			a = "render3d_failed", s = o(e);
		}
		u("warn", "prism.fallback", {
			trace_id: i,
			from: "3d",
			to: "2d",
			reason: a,
			duration_ms: $(r),
			...s
		});
	}
	return n.signal?.aborted ? Yr() : In(e, t, {
		...n,
		traceId: i
	});
}
async function Hr(e, t, n) {
	let r = document.createElement("div");
	r.className = "prism", r.dataset.theme = n.theme ?? "graphite", r.dataset.scheme = n.scheme ?? "auto", r.setAttribute("aria-hidden", "true"), r.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;width:0;height:0;overflow:hidden", e.append(r);
	try {
		return await gt(t, Lt(r), { traceId: n.traceId });
	} finally {
		r.remove();
	}
}
var Ur = 0, Wr = null;
function Gr() {
	return Wr || (Wr = import("./chunks/mermaid.core-TGRI-K3P.js").then(({ default: e }) => (e.initialize({
		startOnLoad: !1,
		securityLevel: "strict",
		theme: "neutral"
	}), e)), Wr.catch(() => {
		Wr = null;
	})), Wr;
}
function Kr(e, t) {
	let n = `%%{init: {"theme": "${t}"}}%%\n`, r = /^\s*---\r?\n[\s\S]*?\r?\n---[^\S\r\n]*(\r?\n|$)/.exec(e);
	return r ? e.slice(0, r[0].length) + n + e.slice(r[0].length) : n + e;
}
async function qr(e, t, n, r) {
	let i = document.createElement("div");
	i.className = "prism prism-fallback", i.dataset.theme = n.theme ?? "graphite", i.dataset.scheme = n.scheme ?? "auto", i.dataset.fallback = "mermaid", e.append(i);
	try {
		let e = await Gr(), a = n.scheme === "dark" || n.theme === "reqvar" || n.scheme !== "light" && Xr(), o = `prism-fb-${n.traceId}-${++Ur}`, { svg: s, bindFunctions: c } = await Jr(e.render(o, Kr(t, a ? "dark" : "neutral")), n.fallbackTimeoutMs ?? Rr);
		if (n.signal?.aborted) return i.remove(), Yr();
		let l = pr(s);
		if (!l) throw Error("mermaid output contained no <svg>");
		i.append(l.svg), c?.(i), u("info", "prism.render.ok", {
			trace_id: n.traceId,
			mode: "fallback",
			stripped_elements: l.report.removedElements,
			stripped_attributes: l.report.removedAttributes,
			duration_ms: $(r)
		});
	} catch (e) {
		if (u("error", "prism.fallback.failed", {
			trace_id: n.traceId,
			stage: "mermaid",
			code_length: t.length,
			duration_ms: $(r),
			...o(e)
		}), n.signal?.aborted) return i.remove(), Yr();
		i.dataset.fallback = "source", i.replaceChildren(mr(t));
	}
	let a = !1;
	return {
		mode: "2d",
		setTheme(e, t) {
			a || (i.dataset.theme = e, t && (i.dataset.scheme = t));
		},
		focusNode() {},
		destroy() {
			a || (a = !0, i.remove());
		}
	};
}
function Jr(e, t) {
	let n, r = new Promise((e, r) => {
		n = setTimeout(() => r(/* @__PURE__ */ Error(`mermaid render timed out after ${t}ms`)), t);
	});
	return Promise.race([e, r]).finally(() => clearTimeout(n));
}
function Yr(e = "2d") {
	return {
		mode: e,
		setTheme() {},
		focusNode() {},
		destroy() {}
	};
}
function Xr() {
	try {
		return typeof matchMedia == "function" && matchMedia("(prefers-color-scheme: dark)").matches;
	} catch {
		return !1;
	}
}
function Zr() {
	return typeof performance < "u" ? performance.now() : Date.now();
}
function $(e) {
	return Math.round((Zr() - e) * 100) / 100;
}
//#endregion
export { Ue as UnsupportedDiagramError, n as consoleSink, Lt as createMeasurer, Vr as mountScene, zr as render, Br as renderModel, In as renderScene, br as sceneToSvg, i as setLogSink, Kr as withMermaidTheme };
