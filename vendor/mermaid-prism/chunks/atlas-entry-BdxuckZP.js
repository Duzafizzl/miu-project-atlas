import { i as e, n as t } from "./rolldown-runtime-5HNE8Q1r.js";
import { i as n, n as r, r as i } from "./log-CNcbKWHK.js";
import { t as a } from "./time-BWa0vVgI.js";
import { a as o, i as s, n as c, o as l, r as u, t as d } from "./effects-W-kAo5mP.js";
import { a as f, i as p, n as m, o as h, t as g } from "./timeline-Dg5AkARd.js";
import { t as _ } from "./player-BMx4cLWN.js";
//#region src/adapters/sanitize.ts
var v = {
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
}, y = /\ufb02\u00b0\u00b0(\d+)\u00b6\u00df/g, b = /\ufb02\u00b0([A-Za-z][A-Za-z0-9]*)\u00b6\u00df/g;
function x(e) {
	return e.replace(y, "&#$1;").replace(b, "&$1;");
}
function S(e) {
	return !Number.isFinite(e) || e <= 0 || e > 1114111 || e >= 55296 && e <= 57343 ? "�" : String.fromCodePoint(e);
}
function C(e) {
	return e.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (e, t) => {
		if (t[0] === "#") {
			let e = t[1] === "x" || t[1] === "X";
			return S(parseInt(t.slice(e ? 2 : 1), e ? 16 : 10));
		}
		return v[t.toLowerCase()] ?? e;
	});
}
var w = /<br\s*\/?\s*>/gi, T = /<!--[\s\S]*?-->/g, E = /<\/?[A-Za-z!][^<>]*>/g, D = /<\/?[A-Za-z][^<>]*$/, O = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
function k(e) {
	if (e == null) return "";
	let t = x(String(e));
	t = t.replace(/\r\n?/g, "\n"), t = t.replace(w, "\n"), t = t.replace(T, "");
	let n;
	do
		n = t, t = t.replace(E, "");
	while (t !== n);
	return t = t.replace(D, ""), t = C(t), t = t.replace(O, ""), t.split("\n").map((e) => e.replace(/[ \t]+/g, " ").trim()).join("\n").replace(/^\n+|\n+$/g, "");
}
function A(e) {
	let t = /^"?`([\s\S]*)`"?$/.exec(e);
	return t ? t[1] ?? "" : e;
}
function j(e) {
	return k(A(e == null ? "" : String(e)));
}
function M(e, t) {
	if (typeof e != "string") return;
	let n = C(x(e)).trim();
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
var N = [
	[/ok|success|done|pass|green/i, "ok"],
	[/warn|pending|amber|yellow/i, "warn"],
	[/danger|error|fail|critical|red/i, "danger"],
	[/accent|primary|active|blue/i, "accent"]
], P = {
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
function F(e) {
	for (let [t, n] of N) if (e.some((e) => t.test(e))) return n;
}
function I(e) {
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
	if (t.startsWith("#")) return I(t);
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
		].every((e) => Number.isFinite(e)) ? L(t, n, i) : void 0;
	}
	let i = P[t];
	return i ? I(i) : void 0;
}
function L(e, t, n) {
	let r = (t) => (t + e / 30) % 12, i = t * Math.min(n, 1 - n), a = (e) => n - i * Math.max(-1, Math.min(r(e) - 3, Math.min(9 - r(e), 1)));
	return {
		r: a(0) * 255,
		g: a(8) * 255,
		b: a(4) * 255
	};
}
function R({ r: e, g: t, b: n }) {
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
function z(e) {
	let t = te(e);
	if (!t) return;
	let { h: n, s: r, l: i } = R(t);
	if (!(r < .2 || i < .08 || i > .97)) {
		if (n < 15 || n >= 290) return "danger";
		if (n < 65) return "warn";
		if (n < 170) return "ok";
		if (n < 260) return "accent";
	}
}
function ne(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) for (let e of String(n).split(";")) {
		let n = e.indexOf(":");
		n <= 0 || t.set(e.slice(0, n).trim().toLowerCase(), e.slice(n + 1).trim());
	}
	return t;
}
function B(e) {
	let t = ne(e);
	for (let e of [
		"stroke",
		"fill",
		"background",
		"background-color",
		"color"
	]) {
		let n = t.get(e), r = n ? z(n) : void 0;
		if (r) return r;
	}
}
function V({ classes: e, inlineStyles: t, classStyles: n }) {
	return F(e) ?? B(t) ?? B(e.flatMap((e) => [...n(e)])) ?? "neutral";
}
//#endregion
//#region src/adapters/flowchart.ts
function H(e) {
	let t = e;
	return !!t && typeof t.getVertices == "function" && typeof t.getEdges == "function" && typeof t.getSubGraphs == "function" && typeof t.getDirection == "function" && typeof t.getClasses == "function";
}
function re(e) {
	return e instanceof Map ? [...e.values()] : Object.values(e);
}
function ie(e, t) {
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
	let n = e.getClasses(), r = (e) => ie(n, e)?.styles ?? [], a = e.getSubGraphs() ?? [], o = new Set(a.map((e) => e.id)), s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
	for (let e of a) for (let t of e.nodes ?? []) o.has(t) ? !c.has(t) && t !== e.id && c.set(t, e.id) : s.has(t) || s.set(t, e.id);
	let l = a.map((e) => {
		let t = de(e.classes), n = {
			id: String(e.id),
			label: j(e.title ?? e.id),
			tone: V({
				classes: t,
				inlineStyles: e.styles ?? [],
				classStyles: r
			})
		}, i = c.get(e.id);
		return i && (n.parentId = i), n;
	}), u = [];
	for (let n of re(e.getVertices())) {
		if (o.has(n.id)) continue;
		let e = de(n.classes), a = {
			id: String(n.id),
			...fe(j(n.text ?? n.id)),
			shape: oe(n.type),
			classes: e,
			tone: V({
				classes: e,
				inlineStyles: n.styles ?? [],
				classStyles: r
			})
		};
		n.icon && (a.icon = j(n.icon));
		let c = s.get(n.id);
		if (c && (a.groupId = c), n.link !== void 0) {
			let e = M(n.link, n.linkTarget);
			e ? a.link = e : i("warn", "prism.parse.link_dropped", {
				trace_id: t,
				node_id: n.id
			});
		}
		u.push(a);
	}
	let d = /* @__PURE__ */ new Set([...u.map((e) => e.id), ...l.map((e) => e.id)]), f = /* @__PURE__ */ new Set(), p = [];
	return (e.getEdges() ?? []).forEach((e, n) => {
		let r = String(e.start), a = String(e.end);
		if (!d.has(r) || !d.has(a)) {
			i("warn", "prism.parse.edge_dropped", {
				trace_id: t,
				from: r,
				to: a,
				reason: "unknown_endpoint"
			});
			return;
		}
		let o = e.id ? String(e.id) : `L_${r}_${a}_${n}`;
		for (let t = 1; f.has(o); t++) o = `${e.id ?? `L_${r}_${a}`}_${n}_${t}`;
		f.add(o);
		let s = j(e.text ?? ""), c = {
			id: o,
			from: r,
			to: a,
			stroke: ce(e.stroke),
			...le(e.type)
		};
		s && (c.label = s), p.push(c);
	}), {
		kind: "flowchart",
		direction: se(e.getDirection()),
		nodes: u,
		edges: p,
		groups: l
	};
}
var U = /^[A-Za-z0-9_\-.:]+$/, me = /^(\d+(?:\.\d+)?)(ms|s|m)$/, he = /^\s*%%\s*@prism\b(.*)$/, ge = 5e3, _e = /^[A-Za-z][A-Za-z0-9_]{0,31}$/, ve = /* @__PURE__ */ new Set([
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
function ye(e) {
	let t = me.exec(e);
	if (!t) return null;
	let n = Number(t[1]), r = t[2] === "ms" ? n : t[2] === "s" ? n * 1e3 : n * 6e4;
	return !Number.isFinite(r) || r <= 0 ? null : Math.min(a, Math.round(r));
}
function be(e) {
	return e.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
}
function xe(e, t) {
	let n = e.trim().split(/\s+/).filter(Boolean);
	return n.length < t ? "missing_args" : n.length > t ? "extra_args" : n;
}
function Se(e) {
	let t = xe(e, 3);
	if (typeof t == "string") return {
		ok: !1,
		reason: t
	};
	let [n = "", r = "", i = ""] = t;
	return !U.test(n) || !U.test(r) ? {
		ok: !1,
		reason: "bad_id"
	} : _e.test(i) ? {
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
function Ce(e) {
	let t = xe(e, 2);
	if (typeof t == "string") return {
		ok: !1,
		reason: t
	};
	let [n = "", r = ""] = t;
	return U.test(n) ? _e.test(r) ? {
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
function we(e) {
	if (/^\s*off\s*$/.test(e)) return {
		ok: !0,
		fxOff: !0
	};
	let t = xe(e, 2);
	if (typeof t == "string") return {
		ok: !1,
		reason: t
	};
	let [n = "", r = ""] = t;
	if (!ve.has(r)) return {
		ok: !1,
		reason: "bad_effect"
	};
	let i = n.indexOf("->");
	if (i >= 0) {
		let e = n.slice(0, i), t = n.slice(i + 2);
		return !U.test(e) || !U.test(t) ? {
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
	return U.test(n) ? {
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
function Te(e) {
	let t = e.trim(), n = /^(\S+)\s*(.*)$/.exec(t);
	if (!n) return {
		ok: !1,
		reason: "empty"
	};
	if (n[1] === "edge") return Se(n[2] ?? "");
	if (n[1] === "node") return Ce(n[2] ?? "");
	if (n[1] === "fx") return we(n[2] ?? "");
	if (n[1] === "diagram") {
		let e = xe(n[2] ?? "", 1);
		return typeof e == "string" ? {
			ok: !1,
			reason: e
		} : U.test(e[0]) ? {
			ok: !0,
			diagram: e[0]
		} : {
			ok: !1,
			reason: "bad_name"
		};
	}
	if (n[1] === "drill") {
		let e = xe(n[2] ?? "", 2);
		if (typeof e == "string") return {
			ok: !1,
			reason: e
		};
		let [t = "", r = ""] = e;
		return U.test(t) ? U.test(r) ? {
			ok: !0,
			drill: {
				nodeId: t,
				target: r
			}
		} : {
			ok: !1,
			reason: "bad_name"
		} : {
			ok: !1,
			reason: "bad_id"
		};
	}
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
	if (!U.test(i)) return {
		ok: !1,
		reason: "bad_id"
	};
	let s = ye(a);
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
	let u = be(l);
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
function Ee(e, t) {
	let n = {
		waits: [],
		edges: [],
		nodes: [],
		fx: [],
		fxOff: !1,
		drills: [],
		diagrams: []
	};
	if (typeof e != "string" || !e.includes("@prism")) return n;
	let r = e.split(/\r?\n/);
	for (let e = 0; e < Math.min(r.length, ge); e++) {
		let a = he.exec(r[e]);
		if (!a) continue;
		let o = Te(a[1] ?? "");
		o.ok ? "hint" in o ? n.waits.push(o.hint) : "edge" in o ? n.edges.push(o.edge) : "node" in o ? n.nodes.push(o.node) : "fx" in o ? n.fx.push(o.fx) : "drill" in o ? n.drills.push(o.drill) : "diagram" in o ? n.diagrams.push(o.diagram) : n.fxOff = !0 : i("warn", "prism.directive.invalid", {
			trace_id: t,
			line: e + 1,
			error_code: o.reason,
			line_length: r[e].length
		});
	}
	return n.waits.length + n.edges.length + n.nodes.length + n.fx.length + +!!n.fxOff + n.drills.length + n.diagrams.length && i("debug", "prism.directive.ok", {
		trace_id: t,
		wait_count: n.waits.length,
		edge_count: n.edges.length,
		node_count: n.nodes.length,
		fx_count: n.fx.length,
		fx_off: n.fxOff,
		drill_count: n.drills.length,
		diagram_count: n.diagrams.length
	}), n;
}
var De = /^\s*%%\s*@prism\s+diagram\b\s*(.*)$/;
function Oe(e, t) {
	if (typeof e != "string") return [];
	if (!e.includes("@prism") || !/@prism\s+diagram\b/.test(e)) return [{
		name: "",
		code: e,
		line: 1
	}];
	let n = e.split(/\r?\n/), r = [], a = /* @__PURE__ */ new Set(), o = {
		name: "",
		start: 0,
		buf: []
	}, s = () => {
		if (o.name === null) return;
		let e = o.buf.join("\n"), t = o.buf.some((e) => e.trim() && !/^\s*%%/.test(e));
		(o.name !== "" || t) && r.push({
			name: o.name,
			code: e,
			line: o.start + 1
		});
	};
	for (let e = 0; e < Math.min(n.length, ge); e++) {
		let r = De.exec(n[e]);
		if (!r) {
			o.buf.push(n[e]);
			continue;
		}
		s();
		let c = (r[1] ?? "").trim().split(/\s+/).filter(Boolean), l = c.length === 1 && U.test(c[0]) ? c[0] : null;
		l === null || a.has(l) ? (i("warn", "prism.directive.invalid", {
			trace_id: t,
			line: e + 1,
			error_code: l === null ? "bad_name" : "duplicate_diagram",
			line_length: n[e].length
		}), o = {
			name: null,
			start: e,
			buf: []
		}) : (a.add(l), o = {
			name: l,
			start: e,
			buf: []
		});
	}
	return s(), i("debug", "prism.directive.diagrams", {
		trace_id: t,
		section_count: r.length
	}), r;
}
function ke(e, t, n) {
	let r = e;
	if (e.kind === "flowchart" && (t.edges.length || t.nodes.length)) {
		let a = e.edges.map((e) => ({ ...e })), o = e.nodes.map((e) => ({ ...e }));
		for (let e of t.edges) {
			let t = a.filter((t) => t.from === e.from && t.to === e.to);
			if (!t.length) i("warn", "prism.directive.unmatched", {
				trace_id: n,
				verb: "edge",
				from_id: e.from,
				to_id: e.to,
				error_code: "UNKNOWN_EDGE"
			});
			else for (let n of t) n.kind = e.kind;
		}
		for (let e of t.nodes) {
			let t = o.find((t) => t.id === e.id);
			t ? t.kind = e.role : i("warn", "prism.directive.unmatched", {
				trace_id: n,
				verb: "node",
				node_id: e.id,
				error_code: "UNKNOWN_ID"
			});
		}
		r = {
			...e,
			edges: a,
			nodes: o
		};
	} else e.kind === "sequence" && (t.edges.length || t.nodes.length) && i("debug", "prism.directive.skipped", {
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
function Ae(e, t) {
	let n = new Map(e.map((e) => [e.name, e])), r = /* @__PURE__ */ new Map(), a = [], o = (e, n, r) => {
		a.push({
			diagram: e,
			nodeId: n.nodeId,
			target: n.target,
			reason: r
		}), i("warn", "prism.drill.dropped", {
			trace_id: t,
			diagram: e,
			node_id: n.nodeId,
			target: n.target,
			error_code: r
		});
	}, s = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = /* @__PURE__ */ new Set(), i = [];
		for (let r of t.drills) n.has(r.target) ? t.nodeIds.has(r.nodeId) ? e.has(r.nodeId) ? o(t.name, r, "duplicate") : (e.add(r.nodeId), i.push(r)) : o(t.name, r, "unknown_node") : o(t.name, r, "unknown_target");
		s.set(t.name, i), r.set(t.name, /* @__PURE__ */ new Map());
	}
	let c = /* @__PURE__ */ new Map(), l = (e, t) => {
		c.set(e, 1);
		for (let n of s.get(e) ?? []) {
			let i = c.get(n.target) ?? 0;
			i === 1 || t >= 32 ? o(e, n, "cycle") : (r.get(e).set(n.nodeId, n.target), i === 0 && l(n.target, t + 1));
		}
		c.set(e, 2);
	};
	for (let t of e) (c.get(t.name) ?? 0) === 0 && l(t.name, 0);
	let u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), p = (e) => {
		let t = u.get(e);
		if (t !== void 0) return t;
		u.set(e, 0);
		let i = n.get(e), a = /* @__PURE__ */ new Map();
		for (let [t, n] of r.get(e)) a.set(t, 1 + p(n));
		d.set(e, a);
		let o = /* @__PURE__ */ new Map(), s = i.groups ?? [], c = /* @__PURE__ */ new Map();
		for (let e of s) c.set(e.parentId, [...c.get(e.parentId) ?? [], e.id]);
		let l = /* @__PURE__ */ new Map();
		for (let [e, t] of i.nodeGroup ?? []) t && l.set(t, [...l.get(t) ?? [], e]);
		let m = (e, t) => {
			let n = o.get(e);
			if (n !== void 0) return n;
			if (t > 32) return 0;
			let r = 0;
			for (let n of c.get(e) ?? []) r = Math.max(r, m(n, t + 1));
			for (let t of l.get(e) ?? []) r = Math.max(r, a.get(t) ?? 0);
			let i = 1 + r;
			return o.set(e, i), i;
		};
		for (let e of s) m(e.id, 0);
		f.set(e, o);
		let h = 0;
		for (let e of a.values()) h = Math.max(h, e);
		for (let e of s) e.parentId || (h = Math.max(h, o.get(e.id) ?? 0));
		return u.set(e, h), h;
	};
	for (let t of e) p(t.name);
	for (let [e, t] of d) for (let [n, r] of t) r <= 0 && d.get(e).delete(n);
	return i("debug", "prism.drill.graph", {
		trace_id: t,
		diagram_count: e.length,
		link_count: [...r.values()].reduce((e, t) => e + t.size, 0),
		dropped_count: a.length
	}), {
		links: r,
		nodeLevels: d,
		groupLevels: f,
		depth: u,
		dropped: a
	};
}
//#endregion
//#region src/adapters/mermaid.ts
var je = null, Me = Promise.resolve();
function Ne() {
	return je || (je = import("./mermaid.core-tmowpuIY.js").then((e) => {
		let t = e.default;
		return t.initialize({
			startOnLoad: !1,
			securityLevel: "strict"
		}), t;
	}), je.catch(() => {
		je = null;
	})), je;
}
function Pe(e) {
	let t = Me.then(async () => {
		let t = await (await Ne()).mermaidAPI.getDiagramFromText(e);
		return {
			type: String(t.type),
			db: t.db
		};
	});
	return Me = t.catch(() => void 0), t;
}
//#endregion
//#region src/adapters/sequence.ts
function Fe(e) {
	let t = e;
	return !!t && typeof t.getActors == "function" && typeof t.getMessages == "function";
}
var Ie = {
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
}, Le = {
	LEFTOF: 0,
	RIGHTOF: 1,
	OVER: 2
}, Re = {
	LOOP_START: "loop",
	ALT_START: "alt",
	OPT_START: "opt",
	PAR_START: "par",
	PAR_OVER_START: "par",
	CRITICAL_START: "critical",
	BREAK_START: "break",
	RECT_START: "rect"
}, ze = /* @__PURE__ */ new Set([
	"ALT_ELSE",
	"PAR_AND",
	"CRITICAL_OPTION"
]), Be = /* @__PURE__ */ new Set([
	"LOOP_END",
	"ALT_END",
	"OPT_END",
	"PAR_END",
	"CRITICAL_END",
	"BREAK_END",
	"RECT_END"
]), Ve = /* @__PURE__ */ new Set(["AUTONUMBER"]);
function He(e) {
	if (typeof e == "string") return e;
	if (e && typeof e == "object" && typeof e.actor == "string") return e.actor;
}
function Ue(e) {
	return e === "SOLID_POINT" || e === "DOTTED_POINT" ? "async" : e.includes("DOTTED") ? "reply" : "sync";
}
function We(e, t) {
	let n = e.LINETYPE ?? Ie, r = e.PLACEMENT ?? Le, a = new Map(Object.entries(n).map(([e, t]) => [t, e])), o = e.getActors(), s = e.getActorKeys?.() ?? (o instanceof Map ? [...o.keys()] : Object.keys(o)), c = [];
	for (let e of s) {
		let t = o instanceof Map ? o.get(e) : o[e];
		t && c.push({
			id: String(t.name ?? e),
			label: j(t.description ?? t.name ?? e) || String(e),
			role: t.type === "actor" ? "actor" : "participant"
		});
	}
	let l = new Set(c.map((e) => e.id)), u = [], d = [], f = [], p = [], m = 0, h = 0, g = (e, n) => {
		for (let t = u.length - 1; t >= 0; t--) {
			let r = u[t];
			if (n === "activate" ? r.to === e : r.from === e) {
				r[n] = !0;
				return;
			}
		}
		i("warn", "prism.parse.activation_unmapped", {
			trace_id: t,
			participant: e,
			kind: n
		});
	}, _ = (e) => {
		e.block.endIndex = m - 1, e.block.endIndex < e.block.startIndex && (f.splice(f.indexOf(e.block), 1), i("debug", "prism.parse.block_empty", {
			trace_id: t,
			block_kind: e.block.kind
		}));
	};
	for (let n of e.getMessages() ?? []) {
		let e = a.get(Number(n.type)) ?? "", o = He(n.from), s = He(n.to), c = j(n.message ?? "");
		if (Ve.has(e)) continue;
		if (e === "NOTE") {
			if (!o) continue;
			let e = n.placement === r.LEFTOF ? "left" : n.placement === r.RIGHTOF ? "right" : "over", t = s && s !== o && e === "over" ? [o, s] : [o];
			d.push({
				id: `note_${n.id ?? m}`,
				index: m++,
				over: t,
				placement: e,
				text: c
			});
			continue;
		}
		let v = Re[e];
		if (v) {
			let e = {
				id: `block_${h++}`,
				kind: v,
				label: v === "rect" ? "" : c,
				startIndex: m,
				endIndex: m,
				sections: []
			};
			(v === "alt" || v === "par" || v === "critical") && e.sections.push({
				label: c,
				startIndex: m
			}), f.push(e), p.push({ block: e });
			continue;
		}
		if (ze.has(e)) {
			let e = p[p.length - 1];
			e && e.block.sections.push({
				label: c,
				startIndex: m
			});
			continue;
		}
		if (Be.has(e)) {
			let e = p.pop();
			e && _(e);
			continue;
		}
		if (e === "ACTIVE_START") {
			let e = u[u.length - 1];
			if (e?.activate && e.to === o) continue;
			g(o, "activate");
			continue;
		}
		if (e === "ACTIVE_END") {
			g(o, "deactivate");
			continue;
		}
		if (!o || !s) {
			i("debug", "prism.parse.signal_skipped", {
				trace_id: t,
				line_type: e || n.type
			});
			continue;
		}
		if (!l.has(o) || !l.has(s)) {
			i("warn", "prism.parse.message_dropped", {
				trace_id: t,
				from: o,
				to: s,
				reason: "unknown_participant"
			});
			continue;
		}
		let y = {
			id: `msg_${n.id ?? m}`,
			index: m++,
			from: o,
			to: s,
			label: c,
			kind: Ue(e)
		};
		n.activate && (y.activate = !0), u.push(y);
	}
	for (; p.length;) _(p.pop());
	return {
		kind: "sequence",
		participants: c,
		messages: u,
		notes: d,
		blocks: f
	};
}
//#endregion
//#region src/adapters/index.ts
var Ge = /* @__PURE__ */ t({
	UnsupportedDiagramError: () => Ke,
	parseMermaid: () => Xe
}), Ke = class extends Error {
	diagramType;
	constructor(e) {
		super(`mermaid-prism: diagram type "${e}" is not supported yet`), this.diagramType = e, this.name = "UnsupportedDiagramError";
	}
}, qe = /* @__PURE__ */ new Set([
	"flowchart",
	"flowchart-v2",
	"flowchart-elk",
	"graph"
]), Je = /* @__PURE__ */ new Set(["sequence", "sequenceDiagram"]);
function Ye(e) {
	return e.kind === "flowchart" ? {
		node_count: e.nodes.length,
		edge_count: e.edges.length
	} : {
		node_count: e.participants.length,
		edge_count: e.messages.length
	};
}
async function Xe(e, t = {}) {
	let a = t.traceId ?? n(), o = typeof e == "string" ? Oe(e, a) : [];
	if (o.length <= 1) {
		let t = await Ze(o[0]?.code ?? e, a);
		if (t.kind !== "flowchart" || !t.groups.length) return t;
		let n = Ae([{
			name: "",
			drills: [],
			groups: t.groups,
			nodeIds: new Set(t.nodes.map((e) => e.id)),
			nodeGroup: new Map(t.nodes.map((e) => [e.id, e.groupId]))
		}], a).groupLevels.get("");
		return {
			...t,
			groups: t.groups.map((e) => n.has(e.id) ? {
				...e,
				levels: n.get(e.id)
			} : e)
		};
	}
	let s = performance.now(), c = [];
	for (let [e, t] of o.entries()) try {
		let e = await Ze(t.code, a);
		c.push({
			name: t.name,
			model: e,
			drills: Ee(t.code, a).drills
		});
	} catch (n) {
		if (e === 0) throw n;
		i("warn", "prism.parse.section_failed", {
			trace_id: a,
			diagram: t.name,
			line: t.line,
			...r(n)
		});
	}
	let l = Ae(c.map(({ name: e, model: t, drills: n }) => t.kind === "flowchart" ? {
		name: e,
		drills: n,
		groups: t.groups,
		nodeIds: new Set(t.nodes.map((e) => e.id)),
		nodeGroup: new Map(t.nodes.map((e) => [e.id, e.groupId]))
	} : {
		name: e,
		drills: n,
		nodeIds: new Set(t.participants.map((e) => e.id))
	}), a), u = c.map(({ name: e, model: t }) => {
		if (t.kind !== "flowchart") return {
			...t,
			name: e
		};
		let n = l.links.get(e), r = l.nodeLevels.get(e), i = l.groupLevels.get(e);
		return {
			...t,
			name: e,
			nodes: t.nodes.map((e) => {
				let t = n.get(e.id);
				return t ? {
					...e,
					drill: !0,
					drillTo: t,
					levels: r.get(e.id) ?? 1
				} : e;
			}),
			groups: t.groups.map((e) => i.has(e.id) ? {
				...e,
				levels: i.get(e.id)
			} : e)
		};
	}), [d, ...f] = u, p = {};
	for (let e of f) e.name && (p[e.name] = e);
	return i("info", "prism.parse.document", {
		trace_id: a,
		diagram_count: u.length,
		drill_dropped: l.dropped.length,
		depth: l.depth.get(d.name ?? "") ?? 0,
		duration_ms: Math.round(performance.now() - s)
	}), {
		...d,
		diagrams: p
	};
}
async function Ze(e, t) {
	let n = performance.now(), a = "unknown";
	i("debug", "prism.parse.start", {
		trace_id: t,
		code_length: typeof e == "string" ? e.length : 0
	});
	try {
		if (typeof e != "string") throw TypeError("mermaid-prism: diagram code must be a string");
		let { type: r, db: o } = await Pe(e);
		a = r;
		let s;
		if (qe.has(r)) {
			if (!H(o)) throw Error(`mermaid-prism: flowchart DB shape changed (type "${r}")`);
			s = pe(o, t);
		} else if (Je.has(r)) {
			if (!Fe(o)) throw Error(`mermaid-prism: sequence DB shape changed (type "${r}")`);
			s = We(o, t);
		} else throw new Ke(r);
		return s = ke(s, Ee(e, t), t), i("info", "prism.parse.ok", {
			trace_id: t,
			diagram_type: s.kind,
			mermaid_type: r,
			...Ye(s),
			duration_ms: Math.round(performance.now() - n)
		}), s;
	} catch (e) {
		let o = e instanceof Ke;
		throw i(o ? "warn" : "error", "prism.parse.error", {
			trace_id: t,
			error_code: o ? "UNSUPPORTED_DIAGRAM" : "PARSE_FAILED",
			diagram_type: a,
			duration_ms: Math.round(performance.now() - n),
			...r(e)
		}), e;
	}
}
//#endregion
//#region src/layout/elk.ts
var Qe = async () => {
	let t = (await import("./elk.bundled-Cfj6BPFW.js").then((t) => /* @__PURE__ */ e(t.default, 1))).default;
	return new t();
}, $e = Qe, et = null;
function tt(e) {
	let t = et;
	et = null, $e = e ?? Qe, t?.then((e) => e.terminateWorker?.()).catch(() => void 0);
}
function nt(t) {
	return async () => {
		let n = (await import("./elk-api-zvjUVmQU.js").then((t) => /* @__PURE__ */ e(t.default, 1))).default;
		return new n({ workerFactory: () => new Worker(t) });
	};
}
function rt() {
	return et || (et = Promise.resolve().then(() => $e()), et.catch(() => {
		et = null;
	})), et;
}
//#endregion
//#region src/layout/bounds.ts
function it() {
	return {
		minX: Infinity,
		minY: Infinity,
		maxX: -Infinity,
		maxY: -Infinity
	};
}
function at(e, t) {
	ot(e, {
		x: t.x,
		y: t.y
	}), ot(e, {
		x: t.x + t.width,
		y: t.y + t.height
	});
}
function ot(e, t) {
	Number.isFinite(t.x) && Number.isFinite(t.y) && (e.minX = Math.min(e.minX, t.x), e.minY = Math.min(e.minY, t.y), e.maxX = Math.max(e.maxX, t.x), e.maxY = Math.max(e.maxY, t.y));
}
function st(e) {
	let t = it();
	e.nodes.forEach((e) => at(t, e)), e.groups.forEach((e) => at(t, e));
	for (let n of e.edges) n.points.forEach((e) => ot(t, e)), n.label && at(t, n.label);
	let n = e.sequence;
	return n && (n.participants.forEach((e) => at(t, e)), n.messages.forEach((e) => at(t, e.label)), n.messages.forEach((e) => {
		ot(t, {
			x: e.fromX,
			y: e.y
		}), ot(t, {
			x: e.toX,
			y: e.y
		});
	}), n.activations.forEach((e) => at(t, e)), n.notes.forEach((e) => at(t, e)), n.blocks.forEach((e) => at(t, e)), n.participants.length && ot(t, {
		x: n.participants[0].lifelineX,
		y: n.lifelineBottom
	})), t;
}
function ct(e, t, n) {
	return {
		...e,
		x: e.x + t,
		y: e.y + n
	};
}
function lt(e) {
	let t = st(e);
	if (!Number.isFinite(t.minX)) return {
		...e,
		width: 0,
		height: 0
	};
	let n = -t.minX, r = -t.minY, i = {
		...e,
		width: t.maxX - t.minX,
		height: t.maxY - t.minY,
		nodes: e.nodes.map((e) => ct(e, n, r)),
		groups: e.groups.map((e) => ct(e, n, r)),
		edges: e.edges.map((e) => {
			let t = {
				...e,
				points: e.points.map((e) => ({
					x: e.x + n,
					y: e.y + r
				}))
			};
			return e.label && (t.label = ct(e.label, n, r)), t;
		})
	}, a = e.sequence;
	return a && (i.sequence = {
		participants: a.participants.map((e) => ({
			...ct(e, n, r),
			lifelineX: e.lifelineX + n
		})),
		messages: a.messages.map((e) => ({
			...e,
			y: e.y + r,
			fromX: e.fromX + n,
			toX: e.toX + n,
			label: ct(e.label, n, r)
		})),
		activations: a.activations.map((e) => ct(e, n, r)),
		notes: a.notes.map((e) => ct(e, n, r)),
		blocks: a.blocks.map((e) => ({
			...ct(e, n, r),
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
var W = {
	nodeNode: 40,
	betweenLayers: 64,
	groupHeaderGap: 16,
	groupSide: 20,
	groupBottom: 20,
	edgeNode: 24,
	edgeEdge: 16
}, ut = {
	TB: "DOWN",
	BT: "UP",
	LR: "RIGHT",
	RL: "LEFT"
};
function dt(e) {
	return {
		"elk.algorithm": "layered",
		"elk.direction": ut[e],
		"elk.edgeRouting": "ORTHOGONAL",
		"elk.hierarchyHandling": "INCLUDE_CHILDREN",
		"elk.spacing.nodeNode": String(W.nodeNode),
		"elk.layered.spacing.nodeNodeBetweenLayers": String(W.betweenLayers),
		"elk.spacing.edgeNode": String(W.edgeNode),
		"elk.layered.spacing.edgeNodeBetweenLayers": String(W.edgeNode),
		"elk.spacing.edgeEdge": String(W.edgeEdge),
		"elk.layered.spacing.edgeEdgeBetweenLayers": String(W.edgeEdge),
		"elk.edgeLabels.placement": "CENTER",
		"elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
		"elk.padding": "[top=0,left=0,bottom=0,right=0]",
		"org.eclipse.elk.json.shapeCoords": "ROOT",
		"org.eclipse.elk.json.edgeCoords": "ROOT"
	};
}
function ft(e) {
	let t = new Map(e.map((e) => [e.id, e])), n = /* @__PURE__ */ new Map(), r = (e, i) => {
		let a = n.get(e.id);
		if (a !== void 0) return a;
		let o = e.parentId ? t.get(e.parentId) : void 0, s = o && !i.has(o.id) ? r(o, i.add(e.id)) + 1 : 0;
		return n.set(e.id, s), s;
	};
	for (let t of e) r(t, /* @__PURE__ */ new Set());
	return n;
}
function pt(e, t) {
	let n = new Set(e.groups.map((e) => e.id)), r = /* @__PURE__ */ new Map(), i = {
		id: "__prism_root__",
		layoutOptions: dt(e.direction),
		children: [],
		edges: []
	};
	for (let n of e.groups) {
		let e = t.groupHeader(n), i = Math.ceil(e.height + W.groupHeaderGap), a = Math.ceil(e.width + W.groupSide * 2), o = Math.ceil(i + W.groupBottom);
		r.set(n.id, {
			id: n.id,
			children: [],
			layoutOptions: {
				"elk.padding": `[top=${i},left=${W.groupSide},bottom=${W.groupBottom},right=${W.groupSide}]`,
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
function mt(e, t) {
	for (let n of e.children ?? []) t.set(n.id, n), mt(n, t);
}
function ht(e, t) {
	for (let n of e.edges ?? []) t.set(n.id, n);
	for (let n of e.children ?? []) ht(n, t);
}
function gt(e) {
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
function _t(e) {
	return {
		x: e.x ?? 0,
		y: e.y ?? 0,
		width: e.width ?? 0,
		height: e.height ?? 0
	};
}
async function vt(e, t, n) {
	if (e.nodes.length === 0 && e.groups.length === 0) return {
		kind: "flowchart",
		width: 0,
		height: 0,
		nodes: [],
		groups: [],
		edges: []
	};
	let { graph: r, edgeLabelSizes: a } = pt(e, t), o = await (await rt()).layout(r), s = /* @__PURE__ */ new Map();
	mt(o, s);
	let c = /* @__PURE__ */ new Map();
	ht(o, c);
	let l = e.nodes.map((e) => ({
		node: e,
		..._t(s.get(e.id) ?? { id: e.id })
	})), u = ft(e.groups), d = e.groups.map((e) => ({
		group: e,
		depth: u.get(e.id) ?? 0,
		..._t(s.get(e.id) ?? { id: e.id })
	})), f = [];
	for (let t of e.edges) {
		let e = c.get(t.id), r = e ? gt(e) : [];
		r.length < 2 && i("warn", "prism.layout.edge_unrouted", {
			trace_id: n,
			edge_id: t.id
		});
		let o = {
			edge: t,
			points: r
		}, s = e?.labels?.[0], l = a.get(t.id);
		s && l && (o.label = {
			x: s.x ?? 0,
			y: s.y ?? 0,
			width: s.width ?? l.width,
			height: s.height ?? l.height
		}), f.push(o);
	}
	return lt({
		kind: "flowchart",
		width: 0,
		height: 0,
		nodes: l,
		groups: d,
		edges: f
	});
}
//#endregion
//#region src/layout/sequence.ts
var G = {
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
}, yt = {
	width: 32,
	height: 32
}, bt = {
	width: 0,
	height: 0
};
function xt(e, t, n) {
	return t ? e.text(t, n) : bt;
}
function St(e) {
	return e.map((t, n) => e.reduce((e, r, i) => {
		if (i === n) return e;
		let a = r.startIndex <= t.startIndex && t.endIndex <= r.endIndex, o = r.startIndex === t.startIndex && r.endIndex === t.endIndex;
		return a && (!o || i < n) ? e + 1 : e;
	}, 0));
}
function Ct(e, t) {
	let n = e.participants, r = new Map(n.map((e, t) => [e.id, t])), i = n.map((e) => t.text(e.label, "participant")), a = Math.max(0, ...i.map((e) => e.height)), o = [...e.messages.filter((e) => r.has(e.from) && r.has(e.to)).map((e) => ({
		kind: "message",
		m: e
	})), ...e.notes.filter((e) => e.over.length && e.over.every((e) => r.has(e))).map((e) => ({
		kind: "note",
		n: e
	}))].sort((e, t) => (e.kind === "message" ? e.m.index : e.n.index) - (t.kind === "message" ? t.m.index : t.n.index)), s = (e) => e.kind === "message" ? e.m.index : e.n.index, c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
	for (let e of o) e.kind === "message" ? c.set(e.m.id, xt(t, e.m.label, "edgeLabel")) : l.set(e.n.id, xt(t, e.n.text, "note"));
	let u = n.slice(1).map((e, t) => Math.max(G.minColumn, (i[t].width + i[t + 1].width) / 2 + G.headGap)), d = (e, t, n) => {
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
				yt.width + 8 + i + G.labelPad / 2
			]] : [[
				Math.min(t, n),
				Math.max(t, n),
				i + G.labelPad
			]];
		}
		let t = e.n, n = l.get(t.id).width, i = t.over.map((e) => r.get(e));
		return t.placement === "right" ? [[
			i[0],
			i[0] + 1,
			G.noteGap + n + G.noteGap
		]] : t.placement === "left" ? [[
			i[0] - 1,
			i[0],
			G.noteGap + n + G.noteGap
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
	})).filter((e) => e.first >= 0 && e.last >= e.first), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), S = [], C = [], w = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), E = a + G.firstRowGap;
	o.forEach((e, t) => {
		v.forEach((e, n) => {
			if (e.first === t) y.set(n, E), E += G.blockHeader + G.blockPad;
			else if (e.first < t && t <= e.last) {
				for (let r of e.block.sections.slice(1)) if (g(r.startIndex) === t) {
					let e = x.get(n) ?? [];
					e.push({
						y: E,
						label: r.label
					}), x.set(n, e), E += G.blockHeader;
				}
			}
		});
		let n = E;
		if (e.kind === "message") {
			let r = e.m, i = c.get(r.id), a = m(r.from), o = m(r.to), s = r.from === r.to, l, u;
			s ? (u = n + G.labelArrowGap, l = {
				x: a + yt.width + 8,
				y: u + yt.height / 2 - i.height / 2,
				...i
			}, E += G.row * 2 + i.height, w.set(t, {
				minX: a,
				maxX: Math.max(l.x + i.width, a + yt.width)
			})) : (u = n + i.height + G.labelArrowGap, l = {
				x: (a + o) / 2 - i.width / 2,
				y: n,
				...i
			}, E += G.row + i.height, w.set(t, {
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
			if (r.placement === "right") o = a[0] + G.noteGap;
			else if (r.placement === "left") o = a[0] - G.noteGap - i.width;
			else {
				let e = Math.min(...a), t = Math.max(...a);
				s = Math.max(i.width, a.length > 1 ? t - e + G.noteOverPad * 2 : i.width), o = (e + t) / 2 - s / 2;
			}
			C.push({
				note: r,
				x: o,
				y: n,
				width: s,
				height: i.height
			}), E += Math.max(G.row, i.height + G.noteRowGap), w.set(t, {
				minX: o,
				maxX: o + s
			});
		}
		for (let e = v.length - 1; e >= 0; e--) v[e].last === t && (E += G.blockPad, b.set(e, E));
	});
	let D = E, O = [], k = /* @__PURE__ */ new Map(), A = (e, t, n, r) => {
		O.push({
			participantId: e,
			x: m(e) - G.activationWidth / 2 + r * G.activationOffset,
			y: t,
			width: G.activationWidth,
			height: Math.max(G.activationMin, n - t)
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
	let j = St(v.map((e) => e.block)), M = v.map((e, t) => t).sort((e, t) => j[t] - j[e]), N = /* @__PURE__ */ new Map();
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
		r -= G.blockPad, i += G.blockPad;
		let a = xt(t, n.block.label, "label").width + G.blockMinChip + G.blockPad * 2;
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
	return lt({
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
			lifelineBottom: D + G.lifelineTail
		}
	});
}
//#endregion
//#region src/layout/index.ts
var wt = /* @__PURE__ */ t({
	elkWorkerFactory: () => nt,
	layoutModel: () => Et,
	setElkFactory: () => tt
});
function Tt(e) {
	return e.kind === "flowchart" ? {
		node_count: e.nodes.length,
		edge_count: e.edges.length
	} : {
		node_count: e.participants.length,
		edge_count: e.messages.length
	};
}
async function Et(e, t, a = {}) {
	let o = a.traceId ?? n(), s = performance.now(), c = {
		trace_id: o,
		diagram_type: e?.kind,
		...e ? Tt(e) : {}
	};
	i("debug", "prism.layout.start", c);
	try {
		let n;
		if (e.kind === "flowchart") n = await vt(e, t, o);
		else if (e.kind === "sequence") n = Ct(e, t);
		else throw Error(`mermaid-prism: cannot lay out diagram kind "${e.kind}"`);
		return i("info", "prism.layout.ok", {
			...c,
			width: Math.round(n.width),
			height: Math.round(n.height),
			duration_ms: Math.round(performance.now() - s)
		}), n;
	} catch (e) {
		throw i("error", "prism.layout.error", {
			...c,
			duration_ms: Math.round(performance.now() - s),
			...r(e)
		}), e;
	}
}
//#endregion
//#region src/render/geometry.ts
var K = {
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
}, Dt = /* @__PURE__ */ new Set([
	"cylinder",
	"hexagon",
	"subroutine",
	"parallelogram"
]);
function Ot(e) {
	let t = String(e.label ?? "").split("\n").map((e) => e.trim()).filter((e) => e.length > 0);
	return e.meta && e.meta.trim() ? {
		title: t.join(" "),
		meta: e.meta.trim()
	} : {
		title: t[0] ?? "",
		meta: t.slice(1).join(" · ")
	};
}
function kt(e) {
	return !!e.icon || Dt.has(e.shape);
}
function At(e, t, n) {
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
function jt(e, t = K.edge.radius) {
	if (e.length === 0) return "";
	let n = e[0];
	if (e.length === 1) return `M${q(n.x)},${q(n.y)}`;
	let r = `M${q(n.x)},${q(n.y)}`;
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
		r += ` L${q(f.x)},${q(f.y)} C${q(h.x)},${q(h.y)} ${q(g.x)},${q(g.y)} ${q(p.x)},${q(p.y)}`;
	}
	let i = e[e.length - 1];
	return r += ` L${q(i.x)},${q(i.y)}`, r;
}
function Mt(e, t) {
	if (e.length < 2 || t <= 0) return e.slice();
	let n = e.slice(), r = n[n.length - 1], i = n[n.length - 2], a = Math.hypot(r.x - i.x, r.y - i.y);
	return a <= t || (n[n.length - 1] = {
		x: r.x - (r.x - i.x) / a * t,
		y: r.y - (r.y - i.y) / a * t
	}), n;
}
function Nt(e, t) {
	return Mt(e.slice().reverse(), t).reverse();
}
function Pt(e, t, n = K.edge.arrow) {
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
	return `M${q(t.x)},${q(t.y)} L${q(u.x)},${q(u.y)} Q${q(f.x)},${q(f.y)} ${q(d.x)},${q(d.y)} Z`;
}
function Ft(e) {
	if (e.length === 0) return {
		x: 0,
		y: 0
	};
	let t = 0;
	for (let n = 1; n < e.length; n++) t += zt(e[n - 1], e[n]);
	let n = t / 2;
	for (let t = 1; t < e.length; t++) {
		let r = e[t - 1], i = e[t], a = zt(r, i);
		if (n <= a && a > 0) return {
			x: r.x + (i.x - r.x) * n / a,
			y: r.y + (i.y - r.y) * n / a
		};
		n -= a;
	}
	return e[e.length - 1];
}
function It(e, t, n) {
	if (e.length < 2) return Ft(e);
	let r = e.length - 1, i = null, a = -Infinity;
	for (let o = 1; o <= r; o++) {
		let s = e[o - 1], c = e[o], l = zt(s, c);
		if (l <= 0) continue;
		let u = Math.abs(c.x - s.x) >= Math.abs(c.y - s.y) ? t : n, d = o === 1 ? 4 : K.edge.radius, f = o === r ? K.edge.arrow + 6 : K.edge.radius, p = l - u - d - f;
		if (p > a) {
			a = p;
			let e = (d + (l - d - f) / 2) / l;
			i = {
				x: s.x + (c.x - s.x) * e,
				y: s.y + (c.y - s.y) * e
			};
		}
	}
	return a >= 0 && i ? i : Ft(e);
}
function Lt(e, t, n, r, i) {
	let a = Math.min(i * 1.25, n / 2, r / 2), o = .29, s = e + n, c = t + r;
	return [
		`M${q(e + a)},${q(t)}`,
		`L${q(s - a)},${q(t)}`,
		`C${q(s - a * o)},${q(t)} ${q(s)},${q(t + a * o)} ${q(s)},${q(t + a)}`,
		`L${q(s)},${q(c - a)}`,
		`C${q(s)},${q(c - a * o)} ${q(s - a * o)},${q(c)} ${q(s - a)},${q(c)}`,
		`L${q(e + a)},${q(c)}`,
		`C${q(e + a * o)},${q(c)} ${q(e)},${q(c - a * o)} ${q(e)},${q(c - a)}`,
		`L${q(e)},${q(t + a)}`,
		`C${q(e)},${q(t + a * o)} ${q(e + a * o)},${q(t)} ${q(e + a)},${q(t)}`,
		"Z"
	].join(" ");
}
function Rt(e) {
	if (typeof e != "string") return null;
	try {
		let t = new URL(e.trim());
		return t.protocol === "http:" || t.protocol === "https:" ? t.href : null;
	} catch {
		return null;
	}
}
function zt(e, t) {
	return Math.hypot(t.x - e.x, t.y - e.y);
}
function q(e) {
	return (Math.round(e * 100) / 100).toString();
}
//#endregion
//#region src/render/measure.ts
var Bt = /* @__PURE__ */ t({ createMeasurer: () => Jt }), Vt = 2, Ht = "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", system-ui, \"Helvetica Neue\", \"Segoe UI\", Roboto, sans-serif", Ut = {
	label: {
		family: Ht,
		size: 13,
		weight: 590,
		tracking: -.01,
		uppercase: !1
	},
	meta: {
		family: Ht,
		size: 11,
		weight: 450,
		tracking: .01,
		uppercase: !1
	},
	edgeLabel: {
		family: Ht,
		size: 11,
		weight: 500,
		tracking: .01,
		uppercase: !1
	},
	participant: {
		family: Ht,
		size: 13,
		weight: 590,
		tracking: -.01,
		uppercase: !1
	},
	note: {
		family: Ht,
		size: 12,
		weight: 450,
		tracking: 0,
		uppercase: !1
	},
	group: {
		family: Ht,
		size: 12,
		weight: 600,
		tracking: 0,
		uppercase: !1
	}
}, Wt = {
	label: "label",
	meta: "meta",
	edgeLabel: "edge-label",
	participant: "participant",
	note: "note",
	group: "group-label"
};
function Gt(e) {
	let t = { ...Ut };
	if (!e || typeof getComputedStyle != "function") return t;
	let n;
	try {
		n = getComputedStyle(e);
	} catch {
		return t;
	}
	let r = (e) => n.getPropertyValue(e).trim(), i = r("--prism-font") || Ht;
	for (let e of Object.keys(Ut)) {
		let n = Wt[e], a = Ut[e];
		t[e] = {
			family: r(`--prism-${n}-font`) || i,
			size: Kt(r(`--prism-${n}-size`), a.size),
			weight: Kt(r(`--prism-${n}-weight`), a.weight),
			tracking: Kt(r(`--prism-${n}-tracking`), a.tracking),
			uppercase: r(`--prism-${n}-transform`) === "uppercase"
		};
	}
	return t;
}
function Kt(e, t) {
	let n = parseFloat(e);
	return Number.isFinite(n) ? n : t;
}
function qt() {
	try {
		if (typeof document > "u") return null;
		let e = document.createElement("canvas");
		return typeof Object.getPrototypeOf(e).getContext != "function" || typeof navigator < "u" && /jsdom/i.test(navigator.userAgent) ? null : e.getContext("2d");
	} catch {
		return null;
	}
}
function Jt(e) {
	let t = typeof performance < "u" ? performance.now() : 0, n = Gt(e), r = qt(), a = /* @__PURE__ */ new Map();
	function o(e, t) {
		let i = n[t], o = i.uppercase ? e.toUpperCase() : e, s = `${t}\u0000${o}`, c = a.get(s);
		if (c !== void 0) return c;
		let l;
		return r ? (r.font = `${i.weight} ${i.size}px ${i.family}`, l = r.measureText(o).width) : l = o.length * i.size * (i.family.includes("Mono") || i.family.includes("mono") ? .6 : .56), l += i.tracking * i.size * Math.max(0, o.length - 1), l = Math.ceil(l * 100) / 100, a.set(s, l), l;
	}
	function s(e, t, n) {
		return At(e, Math.max(8, n), (e) => o(e, t));
	}
	function c(e) {
		let t = K.node, n = t.padX * 2;
		return kt(e) && (n += t.icon + t.iconGap), e.tone !== "neutral" && (n += t.dotSlot), e.link && (n += t.dotSlot + 4), n;
	}
	function l(e, t) {
		let n = Ot(e), r = n.title || String(e.id ?? ""), i = n.meta;
		if (e.shape === "circle") {
			let e = K.circle, n = t ?? Math.min(e.maxW, Math.max(e.minW, o(r, "label")));
			return {
				title: s(r, "label", n),
				meta: i ? s(i, "meta", n) : [],
				textWidth: n
			};
		}
		if (e.shape === "diamond") {
			let e = K.diamond, n = e.padL + e.glyph + e.gap + e.padR, a = (t ?? K.node.maxW) - n;
			return {
				title: s(i ? `${r} · ${i}` : r, "label", a),
				meta: [],
				textWidth: a
			};
		}
		let a = K.node, l = c(e), u = Math.max(o(r, "label"), i ? o(i, "meta") : 0), d = (t ?? Yt(Math.ceil(u + l) + Vt, a.minW, a.maxW)) - l;
		return {
			title: s(r, "label", d),
			meta: i ? s(i, "meta", d) : [],
			textWidth: d
		};
	}
	function u(e, t) {
		return e.reduce((e, n) => Math.max(e, o(n, t)), 0);
	}
	let d = {
		font: (e) => n[e],
		width: o,
		wrap: s,
		nodeText: l,
		node(e) {
			if (e.shape === "circle") {
				let t = K.circle, n = l(e), r = Math.max(t.size, Math.ceil(Math.max(u(n.title, "label"), u(n.meta, "meta")))), i = t.size + t.gap + n.title.length * t.line + n.meta.length * K.node.metaLine;
				return {
					width: Math.max(t.minW, r),
					height: i
				};
			}
			if (e.shape === "diamond") {
				let t = K.diamond, n = l(e), r = t.padL + t.glyph + t.gap + Math.ceil(u(n.title, "label")) + t.padR, i = Math.max(t.height, n.title.length * K.node.titleLine + 18);
				return {
					width: Math.max(96, r),
					height: i
				};
			}
			let t = K.node, n = l(e), r = Math.max(u(n.title, "label"), u(n.meta, "meta")), i = Yt(Math.ceil(r + c(e)) + Vt, t.minW, t.maxW), a = n.title.length * t.titleLine + (n.meta.length ? t.metaGap + n.meta.length * t.metaLine : 0), o = kt(e) ? t.minHIcon : t.minH;
			return {
				width: i,
				height: Math.max(o, Math.ceil(a + t.padY * 2))
			};
		},
		groupHeader(e) {
			let t = K.group;
			return {
				width: Math.ceil(o(e.label, "group") + t.padX * 2),
				height: t.header
			};
		},
		text(e, t) {
			if (t === "edgeLabel") {
				let t = K.edge;
				return {
					width: Math.ceil(o(e, "edgeLabel") + t.labelPadX * 2) + Vt,
					height: t.labelLine + t.labelPadY * 2
				};
			}
			if (t === "participant") {
				let t = K.participant;
				return {
					width: Math.max(t.minW, Math.ceil(o(e, "participant") + t.padX * 2)),
					height: t.line + t.padY * 2
				};
			}
			if (t === "note") {
				let t = K.note, n = s(e, "note", t.maxW - t.padX * 2);
				return {
					width: Math.ceil(u(n, "note") + t.padX * 2),
					height: n.length * t.line + t.padY * 2
				};
			}
			let n = e.split("\n"), r = t === "meta" ? K.node.metaLine : K.node.titleLine;
			return {
				width: Math.ceil(u(n, t)),
				height: n.length * r
			};
		}
	};
	return i("debug", "prism.measure.ready", {
		canvas: !!r,
		font_label: `${n.label.weight} ${n.label.size}px`,
		duration_ms: typeof performance < "u" ? Math.round((performance.now() - t) * 100) / 100 : 0
	}), d;
}
function Yt(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
//#endregion
//#region src/render/paths.ts
var Xt = K.edge.arrow, Zt = Xt * .7;
function Qt(e, t, n, r = K.edge.radius) {
	let i = e;
	n && (i = Mt(i, Zt)), t && (i = Nt(i, Zt));
	let a = [], o = e.length;
	return o >= 2 && (n && a.push(Pt(e[o - 2], e[o - 1], Xt)), t && a.push(Pt(e[1], e[0], Xt))), {
		d: jt(i, r),
		arrows: a,
		start: e[0] ?? {
			x: 0,
			y: 0
		},
		end: e[o - 1] ?? {
			x: 0,
			y: 0
		},
		mid: Ft(e)
	};
}
function $t(e) {
	return Qt(e.points, e.edge.arrowStart, e.edge.arrowEnd);
}
function en(e, t) {
	if (!e.edge.label) return null;
	if (e.label) return e.label;
	let n = t?.width ?? 60, r = t?.height ?? 21, i = It(e.points, n, r);
	return {
		x: i.x - n / 2,
		y: i.y - r / 2,
		width: n,
		height: r
	};
}
var tn = 36, nn = 20;
function rn(e, t) {
	let n = (e, n) => t.find((t) => t.participantId === e && n >= t.y && n <= t.y + t.height), r = n(e.message.from, e.y);
	if (e.self) {
		let t = r ? r.x + r.width : e.fromX, i = e.y + nn, a = n(e.message.to, i), o = a ? a.x + a.width : e.fromX;
		return [
			{
				x: t,
				y: e.y
			},
			{
				x: e.fromX + tn,
				y: e.y
			},
			{
				x: e.fromX + tn,
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
function an(e, t) {
	return Qt(rn(e, t), !1, !0, 8);
}
//#endregion
//#region src/render/flow.ts
var on = "http://www.w3.org/2000/svg", sn = 5, cn = 10, ln = 17, un = 4, dn = 14, fn = (e) => e.returns ?? [], pn = (e) => new Set(e.skipped ?? []), mn = (e) => e.timeout === !0;
function hn(e, t) {
	if (t && t.kind === e.kind) return t;
	let n = e.sequence;
	return e.kind === "sequence" && n ? {
		kind: "sequence",
		participants: n.participants.map((e) => e.participant),
		messages: n.messages.map((e) => e.message),
		notes: n.notes.map((e) => e.note),
		blocks: n.blocks.map((e) => e.block)
	} : m(e, t?.waits);
}
function gn(e, t, n, r) {
	return h(hn(e, t), n, r);
}
function _n(e, t, n, r) {
	let i = g(hn(e, t), e, n, r ? { effects: r } : {});
	return i.steps.length >= 2 ? _(i, { traceId: n }) : null;
}
var vn = (e, t) => e.l < t.r && t.l < e.r && e.t < t.b && t.t < e.b;
function yn(e) {
	let { root: t, stage: n, scene: r, player: a, nodeEls: s, edgeEls: c, edgeLabelEls: u, activationEls: d } = e, m = a.timeline, h = o(e.locale), g = r.sequence, _ = m.kind === "sequence", v = document.createElementNS(on, "svg");
	v.setAttribute("class", "prism-layer prism-layer-flow"), v.setAttribute("width", String(r.width)), v.setAttribute("height", String(r.height)), v.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`), v.setAttribute("overflow", "visible"), v.setAttribute("aria-hidden", "true");
	let y = document.createElement("div");
	y.className = "prism-layer prism-layer-flow-pills", n.append(v, y);
	let b = new Map(r.nodes.map((e) => [e.node.id, e])), x = new Map(r.edges.map((e) => [e.edge.id, e])), S = new Map((g?.messages ?? []).map((e) => [e.message.id, e])), C = new Map((g?.participants ?? []).map((e) => [e.participant.id, e.lifelineX])), w = /* @__PURE__ */ new Map(), T = (e) => {
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
			let t = x.get(e), n = S.get(e), i = t?.points ?? (n && g ? rn(n, g.activations) : null);
			i && i.length >= 2 && (r = Cn(i));
		}
		return r && w.set(e, r), r;
	}, E = pn(m), D = (e, t) => {
		let n = x.get(e)?.edge;
		return !!(n && n.arrowStart && !n.arrowEnd) !== t;
	}, O = [], k = (e) => {
		for (; O.length <= e;) {
			let e = document.createElementNS(on, "circle");
			e.setAttribute("class", "prism-pulse prism-flow-token"), e.setAttribute("r", "4"), v.append(e), O.push(e);
		}
		return O[e];
	}, A = (e) => {
		for (let t = e; t < O.length; t++) O[t].style.display = "none";
	}, j = /* @__PURE__ */ new Map(), M = !1, N = (e) => {
		let t = j.get(e);
		t && (t.ring?.remove(), t.track?.remove(), t.pill.remove(), j.delete(e), M = !0);
	}, P = (e) => {
		if (!_) {
			let t = b.get(e.id);
			if (!t) return null;
			if (t.node.shape === "circle") {
				let e = K.circle.size / 2 + sn, n = t.x + t.width / 2, r = t.y + K.circle.size / 2;
				return {
					d: Tn(n, r, e),
					pill: {
						x: n,
						y: r + e + ln
					},
					side: "below"
				};
			}
			let n = t.x - sn, r = t.y - sn, i = t.width + 10, a = t.height + 10;
			return {
				d: wn(n, r, i, a, t.node.shape === "stadium" ? a / 2 : Math.min(a / 2, xn(t) + sn)),
				pill: {
					x: n + i / 2,
					y: r + a + ln
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
			d: Tn(r, n.y, 9),
			pill: {
				x: r + 9 + cn,
				y: n.y
			},
			side: "right"
		};
	}, F = () => {
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
				for (let t = 0; t < 8 && e.some((e) => vn(e, o())); t++) i += r + un;
				e.push(o());
			}
			n.pill.style.top = `${i}px`;
		}
	}, I = (e) => {
		let t = `${e.kind}:${e.start}`, n = j.get(e.id);
		if (n && n.key === t) return n;
		N(e.id);
		let r = P(e);
		if (!r) return null;
		let i = null, a = null;
		r.d && (a = document.createElementNS(on, "path"), a.setAttribute("class", "prism-flow-ring-track"), a.setAttribute("d", r.d), i = document.createElementNS(on, "path"), i.setAttribute("class", "prism-flow-ring"), i.setAttribute("d", r.d), i.setAttribute("pathLength", "100"), i.dataset.id = e.id, i.dataset.kind = e.kind, mn(e) && (i.dataset.timeout = ""), v.append(a, i));
		let o = document.createElement("div");
		o.className = "prism-flow-pill", o.dataset.id = e.id, o.dataset.kind = e.kind, o.dataset.side = r.side, mn(e) && (o.dataset.timeout = ""), o.style.left = `${r.pill.x}px`, o.style.top = `${r.pill.y}px`;
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
	}, ee = m.steps[0]?.arrive ?? 0, te = !1, L = "", R = (e, t, n) => e?.classList.toggle(t, n), z = () => {
		for (let e of [...c.values(), ...u.values()]) e.classList.remove("is-flow-trail", "is-flow-live", "is-flow-upcoming", "is-flow-skipped");
		for (let e of s.values()) e.classList.remove("is-flow-active", "is-flow-done", "is-flow-upcoming", "is-flow-waiting");
		for (let { el: e } of d) e.classList.remove("is-flow-waiting");
		A(0);
		for (let e of [...j.keys()]) N(e);
		L = "";
	}, ne = (e, t, n) => {
		let r = m.steps[e], i = p(m, e, t), a = new Set(n ? r.edges : []);
		for (let [e, t] of c) {
			let n = a.has(e), r = !n && i.has(e);
			for (let i of [t, u.get(e)]) R(i, "is-flow-live", n), R(i, "is-flow-trail", r), R(i, "is-flow-upcoming", !n && !r), R(i, "is-flow-skipped", !n && !r && E.has(e));
		}
		let o = f(m, e, t), l = new Set(t ? r.nodes : r.from);
		for (let [e, t] of s) {
			let n = l.has(e);
			R(t, "is-flow-active", n), R(t, "is-flow-done", !n && o.has(e)), R(t, "is-flow-upcoming", !_ && !n && !o.has(e));
		}
	}, B = (n) => {
		if (!te) {
			if (n.t === ee && !n.playing) {
				t.dataset.flow = "idle";
				return;
			}
			te = !0, i("debug", "prism.flow2d.engaged", {
				trace_id: e.traceId,
				step: n.step
			});
		}
		t.dataset.flow = "on";
		let r = n.step, a = m.steps[r];
		if (!a) {
			z();
			return;
		}
		let o = n.t, c = a.travel > 0 && o < a.arrive, u = !c, f = e.reduced(), p = `${r}|${+!!u}`;
		p !== L && (ne(r, u, c), L = p);
		let g = 0;
		if (c) {
			let e = f ? 0 : bn((o - a.start) / a.travel), t = new Set(fn(a));
			for (let n of a.edges) {
				let r = T(n);
				if (!r) continue;
				let i = (D(n, t.has(n)) ? 1 - e : e) * r.len, a = r.at(Math.max(0, Math.min(r.len, i))), o = k(g++);
				o.style.display = "";
				let s = m.effects?.edgeEffects[n]?.kind ? m.effects.edgeEffects[n].color : void 0;
				o.style.fill = s ?? "", o.setAttribute("cx", a.x.toFixed(2)), o.setAttribute("cy", a.y.toFixed(2));
				let c = f ? 1 : Math.min(1, e * r.len / dn, (1 - e) * r.len / dn);
				o.style.opacity = Math.max(0, c).toFixed(3);
			}
		}
		A(g);
		let _ = /* @__PURE__ */ new Map();
		for (let e of m.waits) e.end <= e.start || o < e.start || o >= e.end || (!_.has(e.id) || e.kind === "directive" && _.get(e.id).kind !== "directive") && _.set(e.id, e);
		for (let e of [...j.keys()]) _.has(e) || N(e);
		let v = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set();
		for (let t of _.values()) {
			let n = I(t);
			if (!n) continue;
			let r = t.spanEnd - t.spanStart, i = r > 0 ? bn((o - t.spanStart) / r) : 1;
			if (n.ring) {
				let e = Math.max(.001, i * 100);
				n.ring.style.strokeDasharray = `${e.toFixed(2)} 100`, n.ring.style.opacity = i > .004 ? "" : "0", n.ring.dataset.timeout !== void 0 && n.ring.classList.toggle("is-flow-expired", i >= .999);
			}
			let a = l(t, h, e.locale), s = f ? `${a} · ${Math.round(i * 100)} %` : a;
			if (n.text.textContent !== s && (n.text.textContent = s), n.pill.style.setProperty("--prism-flow-progress", i.toFixed(3)), n.pill.dataset.timeout !== void 0 && n.pill.classList.toggle("is-flow-expired", i >= .999), v.add(t.id), t.kind === "reply") {
				let e = S.get(m.steps[t.step]?.edges[0] ?? "")?.y;
				for (let { a: n, el: r } of d) n.participantId === t.id && (e === void 0 || n.y <= e + 2 && n.y + n.height >= e - 2) && y.add(r);
			}
		}
		M && (M = !1, F());
		for (let [e, t] of s) R(t, "is-flow-waiting", v.has(e));
		for (let { el: e } of d) R(e, "is-flow-waiting", y.has(e));
	}, V = a.subscribe(B);
	B(a.getState()), i("debug", "prism.flow2d.mount", {
		trace_id: e.traceId,
		step_count: m.steps.length,
		wait_count: m.waits.length,
		diagram_type: m.kind
	});
	let H = !1;
	return {
		paint: B,
		destroy() {
			H || (H = !0, V(), z(), v.remove(), y.remove(), delete t.dataset.flow);
		}
	};
}
function bn(e) {
	return e < 0 ? 0 : e > 1 ? 1 : e;
}
function xn(e) {
	return Sn(e.node.shape);
}
function Sn(e) {
	return e === "round" ? 20 : e === "diamond" ? 12 : 14;
}
function Cn(e) {
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
function wn(e, t, n, r, i) {
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
function Tn(e, t, n) {
	let r = (e) => (Math.round(e * 100) / 100).toString();
	return `M${r(e)},${r(t - n)} A${r(n)},${r(n)} 0 1 1 ${r(e)},${r(t + n)} A${r(n)},${r(n)} 0 1 1 ${r(e)},${r(t - n)} Z`;
}
//#endregion
//#region src/render/effects.ts
var En = "http://www.w3.org/2000/svg", Dn = 20, On = 22, kn = 5, An = {
	no: 420,
	yes: 560,
	error: 480,
	decision: 520,
	done: 700,
	"loop-closed": 700,
	settle: 700,
	kick: 560,
	"gauge-return": 700
}, jn = (e) => An[e] ?? 600, Mn = {
	yes: "M6 10.4 8.7 13.1 14 7.3",
	done: "M6 10.4 8.7 13.1 14 7.3",
	no: "M7 7 13 13M13 7 7 13",
	error: "M10 5.6 15 14.4H5ZM10 8.9v2.6M10 13.1v.01",
	timeout: "M10 4.8a5.2 5.2 0 1 1 0 10.4 5.2 5.2 0 0 1 0-10.4ZM10 7.3V10l2 1.3",
	retry: "M14.6 10a4.6 4.6 0 1 1-1.35-3.25M13.7 4.4v2.8h-2.8",
	lock: "M6.6 9.4h6.8a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H6.6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1ZM7.9 9.4V7.7a2.1 2.1 0 0 1 4.2 0v1.7",
	gate: "M6 14.5V8.2a4 4 0 0 1 8 0v6.3"
}, Nn = {
	spark: "✦",
	park: "❚❚",
	radio: "◠",
	catch: "⌒",
	lane: "✉",
	blackbox: "?",
	kick: "≋",
	regulate: "◎",
	"gauge-return": "◎",
	scan: "⌖",
	eye: "◉",
	settle: "◡",
	filter: "▿",
	fan: "⋔",
	wait: "◷"
}, Pn = /* @__PURE__ */ new Set([
	"kick",
	"gauge-return",
	"decision",
	"loop-closed"
]), Fn = (e) => e < 0 ? 0 : e > 1 ? 1 : e, In = (e) => 1 - (1 - e) ** 3;
function Ln(e, t) {
	let n = [], r = [];
	for (let [n, i] of Object.entries(t.edgeEffects)) if (i.kind) for (let t of [e.edgeEls.get(n), e.edgeLabelEls.get(n)]) {
		if (!t) continue;
		t.dataset.kind = i.kind, t.dataset.flowKind = i.flow;
		let e = [];
		i.color && (t.style.setProperty("--prism-kind", i.color), e.push("--prism-kind")), r.push({
			el: t,
			attrs: ["data-kind", "data-flow-kind"],
			props: e
		});
	}
	for (let i of Object.values(t.nodeRoles)) {
		let t = e.nodeEls.get(i.nodeId);
		if (!t) continue;
		t.dataset.role = i.role, t.dataset.decoration = i.decoration, r.push({
			el: t,
			attrs: ["data-role", "data-decoration"],
			props: []
		});
		let a = document.createElement("span");
		if (a.className = "prism-role-glyph", a.setAttribute("aria-hidden", "true"), a.textContent = i.glyph, t.append(a), n.push(a), i.decoration === "gauge") {
			let e = document.createElement("span");
			e.className = "prism-gauge", e.setAttribute("aria-hidden", "true"), e.style.setProperty("--prism-gauge", "0.5");
			let r = document.createElement("span");
			r.className = "prism-gauge-band";
			let i = document.createElement("span");
			i.className = "prism-gauge-needle", e.append(r, i), t.append(e), n.push(e);
		}
		if (i.decoration === "blackbox") {
			let e = document.createElement("span");
			e.className = "prism-node-veil", e.setAttribute("aria-hidden", "true"), t.append(e), n.push(e);
		}
	}
	return i("debug", "prism.fx2d.decorate", {
		trace_id: e.traceId,
		pack: t.packId,
		fx_off: t.fxOff,
		kinded_edges: Object.values(t.edgeEffects).filter((e) => e.kind).length,
		roles: Object.keys(t.nodeRoles).length,
		loops: t.loops.length
	}), () => {
		for (let e of n) e.remove();
		for (let { el: e, attrs: t, props: n } of r) {
			for (let n of t) e.removeAttribute(n);
			for (let t of n) e.style.removeProperty(t);
		}
	};
}
function Rn(e, t) {
	let { stage: n, scene: r, nodeEls: a, edgeEls: o } = e, s = t.timeline, l = s.effects, f = r.sequence, p = document.createElementNS(En, "svg");
	p.setAttribute("class", "prism-layer prism-layer-fx-rings"), p.setAttribute("width", String(r.width)), p.setAttribute("height", String(r.height)), p.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`), p.setAttribute("overflow", "visible"), p.setAttribute("aria-hidden", "true");
	let m = document.createElement("div");
	m.className = "prism-layer prism-layer-fx", m.setAttribute("aria-hidden", "true"), n.append(p, m);
	let h = new Map(r.nodes.map((e) => [e.node.id, e])), g = /* @__PURE__ */ new Map();
	for (let e of r.nodes) {
		let t = e.node.shape === "circle" ? K.circle.size : e.height;
		g.set(e.node.id, {
			x: e.x,
			y: e.y,
			width: e.width,
			height: t,
			shape: e.node.shape
		});
	}
	for (let e of f?.participants ?? []) g.set(e.participant.id, {
		x: e.x,
		y: e.y,
		width: e.width,
		height: e.height,
		shape: "rect"
	});
	let _ = (e) => {
		let t = r.edges.find((t) => t.edge.id === e);
		return t?.edge.label ? t.edge.label : (t ? h.get(t.edge.to)?.node.label : void 0) ?? "";
	}, v = (l?.loops ?? []).filter((e) => e.kind === "closed"), y = (e) => v.find((t) => t.regulator === e.targetId && (!e.members || e.members.every((e) => t.members.includes(e)))), b = /* @__PURE__ */ new Map(), x = (e) => {
		let t = document.createElement("div");
		t.className = "prism-fx-badge", t.dataset.effect = e.effect, t.dataset.id = e.targetId, e.closed && (t.dataset.closed = "");
		let n = null, r = Mn[e.effect];
		if (r) {
			let e = document.createElementNS(En, "svg");
			e.setAttribute("viewBox", "0 0 20 20"), e.setAttribute("width", String(Dn)), e.setAttribute("height", String(Dn)), n = document.createElementNS(En, "path"), n.setAttribute("d", r), n.setAttribute("pathLength", "1"), e.append(n), t.append(e);
		} else {
			let n = document.createElement("span");
			n.className = "prism-fx-glyph", n.textContent = e.edgeId && l?.edgeEffects[e.edgeId]?.glyph || Nn[e.effect] || "•", t.append(n);
		}
		return m.append(t), {
			el: t,
			path: n,
			effect: e.effect
		};
	}, S = (e) => {
		b.get(e)?.el.remove(), b.delete(e);
	}, C = /* @__PURE__ */ new Map(), w = (e) => {
		C.get(e)?.remove(), C.delete(e);
	}, T = /* @__PURE__ */ new Map(), E = (e, t) => {
		let n = T.get(e);
		return n || (n = document.createElementNS(En, "path"), n.setAttribute("class", `prism-fx-ring ${t}`), n.setAttribute("pathLength", "100"), p.append(n), T.set(e, n)), n;
	}, D = (e, t) => {
		let n = g.get(e);
		if (n.shape === "circle") {
			let e = n.height / 2 + t, r = n.x + n.width / 2, i = n.y + n.height / 2;
			return `M${r},${i - e} A${e},${e} 0 1 1 ${r},${i + e} A${e},${e} 0 1 1 ${r},${i - e} Z`;
		}
		let r = n.width + t * 2, i = n.height + t * 2, a = n.shape === "stadium" ? i / 2 : Math.min(i / 2, Sn(n.shape) + t);
		return wn(n.x - t, n.y - t, r, i, a);
	}, O = (e, t) => {
		let n = g.get(e);
		return n ? n.shape === "diamond" || n.shape === "circle" ? {
			x: n.x + n.width * .78 - t * On,
			y: n.y + n.height * .18
		} : {
			x: n.x + n.width - 6 - t * On,
			y: n.y + 2
		} : null;
	}, k = /* @__PURE__ */ new Set(), A = [
		"is-fx-flicker",
		"is-fx-blocked",
		"is-fx-chosen",
		"is-fx-loop",
		"is-fx-loop-lit"
	], j = [
		"is-fx-flash",
		"is-fx-verdict-yes",
		"is-fx-verdict-no",
		"is-fx-verdict-error",
		"is-fx-locked",
		"is-fx-gone",
		"is-fx-done"
	], M = /* @__PURE__ */ new Set(), N = -2, P = (t) => {
		let n = t.t, r = e.reduced(), p = (e) => {
			if (r) return 1;
			let t = (s.steps[e.step + 1]?.start ?? s.duration) - e.firedAt, n = Math.min(jn(e.effect), Math.max(250, t));
			return Fn(e.elapsed / n);
		}, h = c(s, n), v = u(s, n);
		t.step !== N && (M.clear(), N = t.step);
		for (let t of h) {
			let n = `${t.step}|${t.targetId}|${t.effect}`;
			M.has(n) || (M.add(n), i("debug", "prism.fx2d.fire", {
				trace_id: e.traceId,
				step: t.step,
				effect: t.effect,
				target: t.targetId,
				kind: t.kind
			}));
		}
		let P = /* @__PURE__ */ new Map();
		for (let e of v) P.set(`${e.targetId}|${d(e.effect)}`, e);
		for (let e of h) P.set(`${e.targetId}|${d(e.effect)}`, e);
		let F = (e) => h.includes(e), I = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Set();
		for (let [e, t] of [...P.entries()].sort(([e], [t]) => e.localeCompare(t))) {
			if (Pn.has(t.effect) || !g.has(t.targetId)) continue;
			let n = I.get(t.targetId) ?? 0;
			I.set(t.targetId, n + 1);
			let i = O(t.targetId, n), a = b.get(e);
			a && (a.effect !== t.effect || a.el.hasAttribute("data-closed") !== !!t.closed) && (S(e), a = void 0), a || (a = x(t), b.set(e, a)), ee.add(e);
			let o = p(t);
			a.el.style.left = `${i.x}px`, a.el.style.top = `${i.y}px`, a.el.style.setProperty("--p", o.toFixed(3)), a.el.classList.toggle("is-running", F(t) && o < 1), a.el.classList.toggle("is-latched", !F(t)), a.path && (a.path.style.strokeDashoffset = (1 - (t.effect === "retry" ? 1 : In(o))).toFixed(3)), t.effect === "retry" && a.el.style.setProperty("--spin", `${(r ? 0 : In(o) * 360).toFixed(1)}deg`);
		}
		for (let e of [...b.keys()]) ee.has(e) || S(e);
		let te = h.filter((e) => e.effect === "decision" && e.branch), L = /* @__PURE__ */ new Set();
		for (let e of te) {
			let t = g.get(e.targetId);
			if (!t) continue;
			L.add(e.targetId);
			let n = C.get(e.targetId);
			if (!n) {
				n = document.createElement("div"), n.className = "prism-fx-chip", n.dataset.id = e.targetId;
				let t = l?.edgeEffects[e.branch]?.effect;
				t && (n.dataset.effect = t), n.textContent = _(e.branch) || "→", m.append(n), C.set(e.targetId, n);
			}
			n.style.left = `${t.x + t.width / 2}px`, n.style.top = `${t.y + t.height + 14}px`, n.style.setProperty("--p", p(e).toFixed(3));
		}
		for (let e of [...C.keys()]) L.has(e) || w(e);
		let R = /* @__PURE__ */ new Set();
		for (let e of P.values()) {
			if (!g.has(e.targetId) || f) continue;
			let t = p(e);
			if (e.effect === "yes" && F(e) && !r && t < 1) {
				let n = `yes|${e.targetId}`, r = E(n, "is-yes");
				r.setAttribute("d", D(e.targetId, kn + 12 * In(t))), r.style.opacity = ((1 - t) * .9).toFixed(3), R.add(n);
			}
			if (e.effect === "done") {
				let n = `done|${e.targetId}`, r = E(n, "is-done");
				r.setAttribute("d", D(e.targetId, kn)), r.style.strokeDasharray = `${(In(t) * 100).toFixed(2)} 100`, r.classList.toggle("is-closed", t >= 1), R.add(n);
			}
		}
		for (let [e, t] of [...T]) R.has(e) || (t.remove(), T.delete(e));
		let z = /* @__PURE__ */ new Map(), ne = (e, t) => {
			let n = a.get(e);
			if (!n) return;
			let r = z.get(n) ?? /* @__PURE__ */ new Set();
			r.add(t), z.set(n, r);
		}, B = /* @__PURE__ */ new Map(), V = (e, t) => {
			let n = e ? o.get(e) : void 0;
			if (!n) return;
			let r = B.get(n) ?? /* @__PURE__ */ new Set();
			r.add(t), B.set(n, r);
		}, H = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map();
		for (let e of P.values()) {
			let t = p(e), n = F(e) && !r && t < 1, i = a.get(e.targetId);
			switch (e.effect) {
				case "yes":
				case "no":
				case "error":
					ne(e.targetId, `is-fx-verdict-${e.effect}`), e.effect === "no" && n && i && H.set(i, { translate: `${(5 * Math.sin(t * 6 * Math.PI) * (1 - t)).toFixed(2)}px 0` }), e.effect === "error" && F(e) && t < 1 && (ne(e.targetId, "is-fx-flash"), !r && t < .4 && V(e.edgeId, "is-fx-flicker"));
					break;
				case "lock":
					ne(e.targetId, "is-fx-locked"), V(e.edgeId, "is-fx-blocked");
					break;
				case "blackbox":
					ne(e.targetId, "is-fx-gone");
					break;
				case "done":
					ne(e.targetId, "is-fx-done");
					break;
				case "settle":
					n && i && H.set(i, { translate: `0 ${(3 * Math.sin(t * 5 * Math.PI) * (1 - t) ** 1.5).toFixed(2)}px` });
					break;
				case "catch":
					n && i && H.set(i, { scale: (1 + .04 * Math.sin(t * Math.PI)).toFixed(4) });
					break;
				case "decision":
					V(e.branch, "is-fx-chosen"), n && i && H.set(i, { scale: `${Math.max(.12, Math.abs(Math.cos(In(t) * Math.PI * 2))).toFixed(3)} 1` });
					break;
				case "loop-closed": {
					let r = y(e);
					if (!r) break;
					let i = r.edges.length;
					r.edges.forEach((e, r) => {
						n ? t * i >= r && t * i < r + 1.6 && V(e, "is-fx-loop-lit") : V(e, "is-fx-loop");
					});
					break;
				}
				case "kick":
				case "gauge-return": {
					let r = e.effect === "kick" ? .86 : .5, i = u(s, e.firedAt - .001).find((t) => t.targetId === e.targetId && d(t.effect) === "gauge")?.effect === "kick" ? .86 : .5, a = In(t), o = i + (r - i) * a;
					n && e.effect === "kick" && (o += .035 * Math.sin(t * 7 * Math.PI) * (1 - t)), n && e.effect === "gauge-return" && (o = r + (i - r) * (1 - t) ** 2 * Math.cos(t * Math.PI * 2.5)), re.set(e.targetId, o);
					break;
				}
			}
		}
		for (let e of a.values()) {
			let t = z.get(e);
			for (let n of j) e.classList.toggle(n, !!t?.has(n));
			if (e.classList.contains("is-fx-flash")) {
				let t = h.find((t) => t.effect === "error" && a.get(t.targetId) === e);
				e.style.setProperty("--fx-p", t ? p(t).toFixed(3) : "1");
			}
		}
		for (let e of o.values()) {
			let t = B.get(e);
			for (let n of A) e.classList.toggle(n, !!t?.has(n));
		}
		for (let e of k) H.has(e) || (e.style.removeProperty("translate"), e.style.removeProperty("scale"), k.delete(e));
		for (let [e, t] of H) t.translate ? e.style.setProperty("translate", t.translate) : e.style.removeProperty("translate"), t.scale ? e.style.setProperty("scale", t.scale) : e.style.removeProperty("scale"), k.add(e);
		for (let [e, t] of a) {
			let n = t.querySelector(":scope > .prism-gauge");
			if (!n) continue;
			let r = re.get(e) ?? .5;
			n.style.setProperty("--prism-gauge", r.toFixed(3)), n.classList.toggle("is-out", r < .33 || r > .67);
		}
	}, F = t.subscribe(P);
	P(t.getState()), i("debug", "prism.fx2d.mount", {
		trace_id: e.traceId,
		pack: l?.packId ?? null,
		fx_off: l?.fxOff ?? !1,
		effect_count: s.steps.reduce((e, t) => e + t.effects.length, 0),
		loops: v.length
	});
	let I = !1;
	return {
		paint: P,
		destroy() {
			if (!I) {
				I = !0, F();
				for (let e of a.values()) e.classList.remove(...j), e.style.removeProperty("translate"), e.style.removeProperty("scale"), e.style.removeProperty("--fx-p");
				for (let e of o.values()) e.classList.remove(...A);
				for (let e of a.values()) e.querySelector(":scope > .prism-gauge")?.style.setProperty("--prism-gauge", "0.5");
				p.remove(), m.remove(), b.clear(), C.clear(), T.clear();
			}
		}
	};
}
//#endregion
//#region src/render/icons.ts
var zn = {
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
}, Bn = {
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
}, Vn = {
	cylinder: "database",
	hexagon: "hexagon",
	subroutine: "subroutine",
	parallelogram: "parallelogram"
};
function Hn(e) {
	return zn[e] ?? null;
}
function Un(e) {
	if (e.icon) {
		let t = String(e.icon).toLowerCase(), n = t.replace(/^[a-z0-9-]+:/, "").replace(/^fa-/, "").trim();
		if (t.startsWith("letter:")) return {
			kind: "letter",
			text: Wn(String(e.icon).slice(7))
		};
		let r = zn[n] ? n : Bn[n];
		return r && zn[r] ? {
			kind: "glyph",
			paths: zn[r]
		} : {
			kind: "letter",
			text: Wn(e.label)
		};
	}
	let t = Vn[e.shape];
	return t ? {
		kind: "glyph",
		paths: zn[t]
	} : null;
}
function Wn(e) {
	return ([...String(e ?? "").trim()][0] ?? "•").toUpperCase();
}
//#endregion
//#region src/render/spring.ts
var Gn = {
	response: .35,
	damping: 1
}, Kn = {
	response: .5,
	damping: .86
}, J = {
	response: .42,
	damping: 1
}, qn = class {
	value;
	velocity = 0;
	target;
	config;
	constructor(e, t = Gn) {
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
function Jn(e, t = .998) {
	return e / 1e3 * t / (1 - t);
}
function Yn(e, t, n = .55) {
	return t <= 0 ? 0 : e * t * n / (t + n * Math.abs(e));
}
var Xn = class {
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
}, Zn = 4, Qn = class {
	el;
	stage;
	content;
	ticker;
	opts;
	x = new qn(0, J);
	y = new qn(0, J);
	s = new qn(1, J);
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
		e && !this.opts.reducedMotion() ? (this.x.to(r, J), this.y.to(i, J), this.s.to(n, J), this.run()) : (this.x.set(r), this.y.set(i), this.s.set(n), this.apply());
	}
	get scale() {
		return this.s.value;
	}
	ensureVisible(e) {
		let t = this.s.value, n = this.el.clientWidth, r = this.el.clientHeight;
		if (!n || !r) return;
		let i = e.x * t + this.x.value, a = e.y * t + this.y.value, o = this.x.value, s = this.y.value;
		i < 24 ? o += 24 - i : i + e.width * t > n - 24 && (o -= i + e.width * t - (n - 24)), a < 24 ? s += 24 - a : a + e.height * t > r - 24 && (s -= a + e.height * t - (r - 24)), (o !== this.x.value || s !== this.y.value) && (this.opts.reducedMotion() ? (this.x.set(o), this.y.set(s), this.apply()) : (this.x.to(o, J), this.y.to(s, J), this.run()));
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
		this.stage.style.transform = `translate3d(${tr(this.x.value)}px, ${tr(this.y.value)}px, 0) scale(${nr(this.s.value)})`;
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
			if (Math.hypot(n, r) < Zn) return;
			t.active = !0, t.startX = e.clientX, t.startY = e.clientY, this.capture(e.pointerId), this.el.dataset.panning = "true", this.markInteracted();
			return;
		}
		let i = this.bounds(this.s.value), a = this.el.clientWidth || 1, o = this.el.clientHeight || 1;
		this.x.set($n(t.tx + n, i.minX, i.maxX, a)), this.y.set($n(t.ty + r, i.minY, i.maxY, o));
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
		let n = t.history, r = 0, a = 0;
		if (n.length >= 2) {
			let e = n[0], t = n[n.length - 1], i = (t.t - e.t) / 1e3;
			i > 0 && performance.now() - t.t < 80 && (r = (t.x - e.x) / i, a = (t.y - e.y) / i);
		}
		this.settleIntoBounds(r, a), i("debug", "prism.viewport.pan", {
			trace_id: this.opts.traceId,
			vx: Math.round(r),
			vy: Math.round(a),
			scale: nr(this.s.value)
		});
	};
	settleIntoBounds(e, t) {
		let n = this.clampScale(this.s.value), r = this.bounds(n), i = this.opts.reducedMotion(), a = (e, t, n, r) => {
			let a = e.value + (i ? 0 : Jn(t)), o = er(a, n, r), s = o !== a && Math.abs(t) > 300;
			e.to(o, s ? Kn : J, i ? 0 : t);
		};
		a(this.x, e, r.minX, r.maxX), a(this.y, t, r.minY, r.maxY), this.s.to(n, J), i ? (this.x.set(this.x.target), this.y.set(this.y.target), this.s.set(n), this.apply()) : this.run();
	}
	onWheel = (e) => {
		let t = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? this.el.clientHeight : 1, n = this.local(e.clientX, e.clientY);
		if (e.ctrlKey || e.metaKey) {
			e.preventDefault(), this.halt(), this.zoomAbout(n.x, n.y, this.s.value * Math.exp(-e.deltaY * t * .01)), this.markInteracted(), this.scheduleSettle();
			return;
		}
		let r = this.bounds(this.s.value), i = er(this.x.value - e.deltaX * t, r.minX, r.maxX), a = er(this.y.value - e.deltaY * t, r.minY, r.maxY);
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
		return er(e, Math.min(this.opts.minScale, this.fitScale), this.opts.maxScale);
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
function $n(e, t, n, r) {
	return e < t ? t - Yn(t - e, r) : e > n ? n + Yn(e - n, r) : e;
}
function er(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
function tr(e) {
	return Math.round(e * 100) / 100;
}
function nr(e) {
	return Math.round(e * 1e4) / 1e4;
}
//#endregion
//#region src/render/dom.ts
var rr = "http://www.w3.org/2000/svg", ir = 32, ar = .4, or = .65, sr = 240;
function cr(e, t, a = {}) {
	let o = Pr(), c = a.traceId ?? n(), l = [], u = (e, t, n, r) => {
		e.addEventListener(t, n, r), l.push(() => e.removeEventListener(t, n, r));
	}, d = () => jr("(prefers-reduced-motion: reduce)"), f = X("div", "prism");
	f.dataset.theme = a.theme ?? "graphite", f.dataset.scheme = a.scheme ?? "auto", f.dataset.kind = t.kind, f.dataset.height = a.height ?? "auto", f.setAttribute("role", "figure"), f.setAttribute("aria-roledescription", "diagram"), f.setAttribute("aria-label", a.label ?? Er(t)), Tr(f, a.accent);
	let p = X("div", "prism-viewport"), m = X("div", "prism-stage");
	m.style.width = `${t.width}px`, m.style.height = `${t.height}px`;
	let h = X("div", "prism-layer prism-layer-groups"), g = Z("svg", "prism-layer prism-layer-under"), _ = X("div", "prism-layer prism-layer-bars"), v = Z("svg", "prism-layer prism-layer-edges"), y = X("div", "prism-layer prism-layer-labels"), b = X("div", "prism-layer prism-layer-nodes");
	for (let e of [g, v]) e.setAttribute("width", String(t.width)), e.setAttribute("height", String(t.height)), e.setAttribute("viewBox", `0 0 ${t.width} ${t.height}`), e.setAttribute("aria-hidden", "true"), e.setAttribute("overflow", "visible");
	m.append(h, g, _, v, y, b), p.append(m), f.append(p), e.append(f);
	let x = Jt(f), S = new Xn(), C = [], w = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), O = [], k = (e, t, n) => w.set(e, {
		spring: new qn(0, Gn),
		ids: t,
		kind: n
	});
	for (let e of Dr(t.groups)) {
		let n = dr(e, t);
		h.append(n), k(n, [e.group.id], "group");
	}
	for (let e of t.edges) {
		if (e.edge.stroke === "invisible") continue;
		let { group: t, label: n } = fr(e, x);
		v.append(t), T.set(e.edge.id, t), k(t, [e.edge.id], "edge"), n && (y.append(n), E.set(e.edge.id, n), k(n, [e.edge.id], "edge"));
	}
	for (let e of t.nodes) {
		let t = lr(e, x);
		b.append(t), D.set(e.node.id, t), C.push({
			id: e.node.id,
			el: t,
			rect: e
		}), k(t, [e.node.id], "node");
	}
	let A = t.sequence;
	if (A) {
		for (let e of A.blocks) {
			let t = hr(e);
			h.append(t), k(t, [], "group");
		}
		for (let e of A.participants) {
			let t = Z("line", "prism-lifeline");
			Sr(t, {
				x1: e.lifelineX,
				x2: e.lifelineX,
				y1: A.lifelineTop,
				y2: A.lifelineBottom
			}), t.dataset.participant = e.participant.id, g.append(t), k(t, [e.participant.id], "node");
		}
		for (let e of A.activations) {
			let t = X("div", "prism-activation");
			Cr(t, e), _.append(t), O.push({
				a: e,
				el: t
			}), k(t, [e.participantId], "node");
		}
		for (let e of A.messages) {
			let { group: t, label: n } = pr(e, A.activations);
			v.append(t), T.set(e.message.id, t), k(t, [e.message.id], "edge"), y.append(n), E.set(e.message.id, n), k(n, [e.message.id], "edge");
		}
		for (let e of A.notes) {
			let t = X("div", "prism-note");
			Cr(t, e), t.dataset.over = e.note.over.join(",");
			for (let n of x.wrap(e.note.text, "note", e.width - K.note.padX * 2)) t.append(Y(n, "prism-note-line"));
			b.append(t), k(t, e.note.over, "node");
		}
		for (let e of A.participants) {
			let t = mr(e);
			b.append(t), D.set(e.participant.id, t), C.push({
				id: e.participant.id,
				el: t,
				rect: e
			}), k(t, [e.participant.id], "node");
		}
	}
	C.sort((e, t) => e.rect.y - t.rect.y || e.rect.x - t.rect.x), C[0]?.el.setAttribute("tabindex", "0");
	let j = (e) => {
		let n = e > 0 ? (e - 64) / Math.max(1, t.width) : 1, r = f.dataset.height === "fill" ? (p.clientHeight - 64) / Math.max(1, t.height) : 696 / Math.max(1, t.height);
		return Math.max(ar, Math.min(1, n, r > 0 ? r : 1));
	}, M = () => {
		if (f.dataset.height === "fill") return;
		let n = j(e.clientWidth);
		f.style.setProperty("--prism-height", `${Math.round(t.height * n + 64)}px`);
	};
	M();
	let N = new Qn(p, m, t, S, {
		padding: ir,
		minScale: .25,
		maxScale: 3,
		traceId: c,
		reducedMotion: d,
		fitScale: j
	});
	N.fit(!1);
	let P = null;
	typeof ResizeObserver == "function" && (P = new ResizeObserver(() => M()), P.observe(e));
	let F = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
	for (let e of t.edges) e.edge.stroke !== "invisible" && (kr(F, e.edge.from, e), kr(I, e.edge.to, e));
	function ee(e) {
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
		return i(e, F, (e) => e.edge.to, !0), i(e, I, (e) => e.edge.from, r.length === 0), {
			nodes: t,
			edges: n,
			route: r
		};
	}
	let te = null, L = null, R = null;
	function z(e) {
		if (e !== null && !D.has(e) && (e = null), e === te) return;
		te = e;
		let n = e ? ee(e) : null;
		f.dataset.focus = e ? "true" : "false";
		for (let [t, r] of D) r.classList.toggle("is-selected", t === e), r.classList.toggle("is-path", !!(n && n.nodes.has(t) && t !== e)), r.setAttribute("aria-pressed", t === e ? "true" : "false");
		for (let [e, t] of T) t.classList.toggle("is-active", !!n?.edges.has(e));
		for (let [e, t] of E) t.classList.toggle("is-active", !!n?.edges.has(e));
		let r = /* @__PURE__ */ new Set();
		if (n) {
			for (let e of t.nodes) if (n.nodes.has(e.node.id) && e.node.groupId) for (let n of Or(t.groups, e.node.groupId)) r.add(n);
		}
		for (let [e, t] of w) {
			let i = 0;
			n && (i = t.kind === "edge" ? +!t.ids.some((e) => n.edges.has(e)) : t.kind === "node" ? +!t.ids.some((e) => n.nodes.has(e)) : t.ids.length === 0 ? .5 : t.ids.some((e) => r.has(e)) ? 0 : .6), t.spring.to(i), d() && (t.spring.set(i), wr(e, t.spring.value));
		}
		!d() && !R && (R = S.add((e) => {
			let t = !1;
			for (let [n, r] of w) r.spring.settled || (r.spring.step(e), wr(n, r.spring.value), t ||= !r.spring.settled);
			return t || (R = null), t;
		})), L?.(), L = null, n && n.route.length && !d() && (L = ne(n.route)), i("info", "prism.focus", {
			trace_id: c,
			node_id: e,
			path_nodes: n?.nodes.size ?? 0,
			path_edges: n?.edges.size ?? 0
		});
	}
	function ne(e) {
		let t = e.map((e) => T.get(e)?.querySelector(".prism-edge-line")).filter((e) => !!(e && typeof e.getTotalLength == "function"));
		if (!t.length) return () => {};
		let n = Z("circle", "prism-pulse");
		n.setAttribute("r", "3"), v.append(n);
		let r = t.map((e) => Ar(e)), i = 0, a = 0, o = 0, s = S.add((e) => {
			if (o > 0) return o -= e, n.style.opacity = "0", !0;
			let s = t[i], c = r[i];
			if (a += sr * e, a >= c) return a = 0, i = (i + 1) % t.length, i === 0 && (o = .6), !0;
			let l = s.getPointAtLength(a);
			n.setAttribute("cx", l.x.toFixed(2)), n.setAttribute("cy", l.y.toFixed(2));
			let u = Math.min(1, a / 18, (c - a) / 18);
			return n.style.opacity = u.toFixed(3), !0;
		});
		return () => {
			s(), n.remove();
		};
	}
	let B = (e) => e instanceof Element ? e.closest("[data-prism-focusable]") : null;
	u(b, "click", ((e) => {
		if (e.target?.closest?.("a")) return;
		let t = B(e.target);
		if (!t) return;
		let n = t.dataset.id ?? null;
		z(n === te ? null : n);
	})), u(p, "click", ((e) => {
		!B(e.target) && !e.target?.closest?.("a") && z(null);
	})), u(b, "pointerover", (e) => {
		let t = B(e.target);
		if (t?.dataset.id) {
			for (let e of [...F.get(t.dataset.id) ?? [], ...I.get(t.dataset.id) ?? []]) T.get(e.edge.id)?.classList.add("is-hover");
			if (A) for (let e of A.messages) (e.message.from === t.dataset.id || e.message.to === t.dataset.id) && T.get(e.message.id)?.classList.add("is-hover");
		}
	}), u(b, "pointerout", () => {
		for (let e of T.values()) e.classList.remove("is-hover");
	}), u(f, "focusin", ((e) => {
		let t = B(e.target);
		if (!t) return;
		for (let e of C) e.el.setAttribute("tabindex", e.el === t ? "0" : "-1");
		let n = C.find((e) => e.el === t);
		n && N.ensureVisible(n.rect);
	})), u(f, "keydown", ((e) => {
		if (e.key === "Escape") {
			te && (z(null), e.preventDefault());
			return;
		}
		let t = B(e.target);
		if (!t) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			let n = t.dataset.id ?? null;
			z(n === te ? null : n);
			return;
		}
		let n = _r[e.key];
		if (!n) return;
		let r = C.find((e) => e.el === t);
		r && (e.preventDefault(), vr(r, C, n)?.el.focus({ preventScroll: !0 }));
	}));
	let V = null, H = null, re = null, ie = null, ae = null, oe, se = {
		root: f,
		stage: m,
		scene: t,
		nodeEls: D,
		edgeEls: T,
		edgeLabelEls: E,
		reduced: d,
		traceId: c
	};
	try {
		oe = gn(t, a.model, a.vocabulary, c), ae = Ln(se, oe);
	} catch (e) {
		i("error", "prism.fx2d.failed", {
			trace_id: c,
			phase: "decorate",
			...r(e)
		}), ae?.(), ae = null, oe = void 0;
	}
	let ce = () => {
		let e = f.dataset.scheme;
		return e === "light" || e === "dark" ? e : f.dataset.theme === "reqvar" || jr("(prefers-color-scheme: dark)") ? "dark" : "light";
	};
	if (a.player !== !1) try {
		if (V = _n(t, a.model, c, oe), V) {
			let e = a.locale ?? "en";
			f.dataset.player = "", p.tabIndex = 0, p.setAttribute("aria-label", e === "de" ? "Diagramm · Leertaste spielt den Ablauf ab" : "Diagram · Space plays the flow"), re = yn({
				root: f,
				stage: m,
				scene: t,
				player: V,
				nodeEls: D,
				edgeEls: T,
				edgeLabelEls: E,
				activationEls: O,
				reduced: d,
				locale: e,
				traceId: c
			}), ie = Rn(se, V), H = s(f, V, {
				locale: e,
				scheme: ce(),
				keyTarget: f,
				traceId: c
			});
		}
	} catch (e) {
		i("error", "prism.flow2d.failed", {
			trace_id: c,
			...r(e)
		}), ie?.destroy(), re?.destroy(), H?.destroy(), V?.destroy(), ie = null, re = null, H = null, V = null, delete f.dataset.player;
	}
	a.animate !== !1 && gr(f, D, h, T, E, d()), i("info", "prism.render.scene", {
		trace_id: c,
		renderer: "dom",
		diagram_type: t.kind,
		node_count: t.nodes.length + (A?.participants.length ?? 0),
		edge_count: t.edges.length + (A?.messages.length ?? 0),
		duration_ms: Fr(Pr() - o)
	});
	let le = !1;
	return {
		mode: "2d",
		setTheme(e, t) {
			le || (f.dataset.theme = e, t && (f.dataset.scheme = t), H?.setScheme(ce()), i("info", "prism.theme", {
				trace_id: c,
				theme: e,
				scheme: f.dataset.scheme
			}));
		},
		get player() {
			return le ? void 0 : V ?? void 0;
		},
		focusNode(e) {
			le || z(e);
		},
		destroy() {
			if (!le) {
				le = !0;
				try {
					ie?.destroy(), ae?.(), re?.destroy(), H?.destroy(), V?.destroy(), L?.(), S.destroy(), N.destroy(), P?.disconnect();
					for (let e of l) e();
					for (let e of typeof f.getAnimations == "function" ? f.getAnimations({ subtree: !0 }) : []) e.cancel();
				} catch (e) {
					i("warn", "prism.destroy.partial", {
						trace_id: c,
						...r(e)
					});
				}
				f.remove(), i("debug", "prism.destroy", { trace_id: c });
			}
		}
	};
}
function lr(e, t) {
	let n = e.node, r = X("div", "prism-node");
	r.dataset.id = n.id, r.dataset.shape = n.shape, r.dataset.tone = n.tone, r.dataset.prismFocusable = "", r.setAttribute("role", "button"), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-pressed", "false"), Cr(r, e);
	let i = t.nodeText(n, e.width);
	r.setAttribute("aria-label", [
		i.title.join(" "),
		i.meta.join(" "),
		n.tone === "neutral" ? "" : `status ${n.tone}`
	].filter(Boolean).join(", "));
	let a = Un(n);
	if (n.shape === "circle") {
		let e = X("span", "prism-node-orb");
		e.append(br(a ?? {
			kind: "letter",
			text: Mr(i.title[0] ?? n.label)
		})), r.append(e);
	} else if (n.shape === "diamond") r.append(X("span", "prism-node-diamond"));
	else if (a) {
		let e = X("span", "prism-node-icon");
		e.append(br(a)), r.append(e);
	}
	let o = X("span", "prism-node-text");
	for (let e of i.title) o.append(Y(e, "prism-node-title"));
	for (let e of i.meta) o.append(Y(e, "prism-node-meta"));
	if (r.append(o), n.shape !== "circle" && n.shape !== "diamond") {
		if (n.tone !== "neutral") {
			let e = X("span", "prism-node-status");
			e.setAttribute("aria-hidden", "true"), r.append(e);
		}
		let e = n.link ? Rt(n.link.href) : null;
		e && r.append(ur(e, n));
	} else if (n.link) {
		let e = Rt(n.link.href);
		e && r.append(ur(e, n));
	}
	return r;
}
function ur(e, t) {
	let n = document.createElement("a");
	n.className = "prism-node-link", n.href = e, n.rel = "noopener noreferrer", t.link?.target === "_blank" && (n.target = "_blank"), n.setAttribute("aria-label", "Open link"), n.tabIndex = -1;
	let r = Hn("external");
	return r && n.append(xr(r)), n;
}
function dr(e, t) {
	let n = X("div", "prism-group");
	n.dataset.id = e.group.id, n.dataset.tone = e.group.tone, n.dataset.depth = String(Math.min(e.depth, 3)), n.setAttribute("role", "group"), n.setAttribute("aria-label", e.group.label), Cr(n, e);
	let r = X("div", "prism-group-header");
	e.group.tone !== "neutral" && r.append(X("span", "prism-group-dot")), r.append(Y(e.group.label, "prism-group-title"));
	let i = t.nodes.filter((t) => t.node.groupId === e.group.id).length;
	return i && r.append(Y(String(i), "prism-group-count")), n.append(r), n;
}
function fr(e, t) {
	let n = $t(e), r = Z("g", "prism-edge");
	r.dataset.id = e.edge.id, r.dataset.from = e.edge.from, r.dataset.to = e.edge.to, r.dataset.stroke = e.edge.stroke;
	let i = Z("path", "prism-edge-halo");
	i.setAttribute("d", n.d);
	let a = Z("path", "prism-edge-line");
	a.setAttribute("d", n.d);
	let o = Z("circle", "prism-edge-port");
	Sr(o, {
		cx: n.start.x,
		cy: n.start.y,
		r: 2
	}), r.append(i, a, o);
	for (let e of n.arrows) {
		let t = Z("path", "prism-edge-arrow");
		t.setAttribute("d", e), r.append(t);
	}
	let s = null;
	if (e.edge.label) {
		let n = en(e, t.text(e.edge.label, "edgeLabel"));
		n && (s = X("div", "prism-edge-label"), s.dataset.edge = e.edge.id, Cr(s, n), s.append(Y(e.edge.label, "prism-edge-label-text")));
	}
	return {
		group: r,
		label: s
	};
}
function pr(e, t) {
	let n = an(e, t), r = Z("g", "prism-edge prism-message");
	r.dataset.id = e.message.id, r.dataset.from = e.message.from, r.dataset.to = e.message.to, r.dataset.kind = e.message.kind, r.dataset.stroke = e.message.kind === "reply" ? "dashed" : "solid";
	let i = Z("path", "prism-edge-halo");
	i.setAttribute("d", n.d);
	let a = Z("path", "prism-edge-line");
	a.setAttribute("d", n.d), r.append(i, a);
	for (let t of n.arrows) {
		let n = Z("path", e.message.kind === "async" ? "prism-edge-arrow is-open" : "prism-edge-arrow");
		n.setAttribute("d", t), r.append(n);
	}
	let o = X("div", "prism-edge-label prism-message-label");
	return o.dataset.edge = e.message.id, Cr(o, e.label), o.append(Y(e.message.label, "prism-edge-label-text")), {
		group: r,
		label: o
	};
}
function mr(e) {
	let t = X("div", "prism-node prism-participant");
	if (t.dataset.id = e.participant.id, t.dataset.shape = "participant", t.dataset.role = e.participant.role, t.dataset.tone = "neutral", t.dataset.prismFocusable = "", t.setAttribute("role", "button"), t.setAttribute("tabindex", "-1"), t.setAttribute("aria-pressed", "false"), t.setAttribute("aria-label", `${e.participant.role === "actor" ? "Actor" : "Participant"} ${e.participant.label}`), Cr(t, e), e.participant.role === "actor") {
		let e = X("span", "prism-node-icon"), n = Hn("user");
		n && e.append(xr(n)), t.append(e);
	}
	let n = X("span", "prism-node-text");
	return n.append(Y(e.participant.label, "prism-node-title")), t.append(n), t;
}
function hr(e) {
	let t = X("div", "prism-block");
	t.dataset.kind = e.block.kind, Cr(t, e);
	let n = X("div", "prism-block-chip");
	n.append(Y(e.block.kind, "prism-block-kind")), e.block.label && n.append(Y(e.block.label, "prism-block-label")), t.append(n);
	for (let n of e.dividers) {
		let r = X("div", "prism-block-divider");
		r.style.top = `${n.y - e.y}px`;
		let i = X("div", "prism-block-chip is-section");
		i.append(Y(e.block.kind === "par" ? "and" : "else", "prism-block-kind")), n.label && i.append(Y(n.label, "prism-block-label")), r.append(i), t.append(r);
	}
	return t;
}
function gr(e, t, n, r, i, a) {
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
		let l = [...t.values()].sort((e, t) => Nr(e.style.top) - Nr(t.style.top) || Nr(e.style.left) - Nr(t.style.left)), u = l.length > 1 ? Math.min(36, 480 / l.length) : 0;
		l.forEach((e, t) => e.animate(s, {
			duration: 460,
			delay: 60 + t * u,
			easing: o,
			fill: "backwards"
		}));
		let d = 60 + l.length * u + 160;
		for (let [e, t] of r) {
			let n = t.querySelector(".prism-edge-line"), r = t.dataset.stroke === "dotted" || t.dataset.stroke === "dashed", a = n ? Ar(n) : 0;
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
var _r = {
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
function vr(e, t, n) {
	let r = yr(e.rect), i = null, a = Infinity;
	for (let o of t) {
		if (o === e) continue;
		let t = yr(o.rect), s = t.x - r.x, c = t.y - r.y, l = s * n.x + c * n.y;
		if (l <= 1) continue;
		let u = l + Math.abs(s * n.y - c * n.x) * 2;
		u < a && (a = u, i = o);
	}
	return i;
}
function yr(e) {
	return {
		x: e.x + e.width / 2,
		y: e.y + e.height / 2
	};
}
function br(e) {
	if (e.kind === "glyph") return xr(e.paths);
	let t = X("span", "prism-icon-letter");
	return t.textContent = e.text, t.setAttribute("aria-hidden", "true"), t;
}
function xr(e) {
	let t = Z("svg", "prism-glyph");
	Sr(t, {
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		focusable: "false"
	});
	for (let n of e) {
		let e = Z("path", "");
		e.setAttribute("d", n), t.append(e);
	}
	return t;
}
function Y(e, t) {
	let n = X("span", t);
	return n.textContent = e, n;
}
function X(e, t) {
	let n = document.createElement(e);
	return t && (n.className = t), n;
}
function Z(e, t) {
	let n = document.createElementNS(rr, e);
	return t && n.setAttribute("class", t), n;
}
function Sr(e, t) {
	for (let [n, r] of Object.entries(t)) e.setAttribute(n, String(r));
}
function Cr(e, t) {
	e.style.left = `${t.x}px`, e.style.top = `${t.y}px`, e.style.width = `${t.width}px`, e.style.height = `${t.height}px`;
}
function wr(e, t) {
	let n = 1 - or * t;
	e.style.opacity = n > .999 ? "" : n.toFixed(3);
}
function Tr(e, t) {
	t && ((typeof CSS < "u" && typeof CSS.supports == "function" ? CSS.supports("color", t) : /^#[0-9a-f]{3,8}$/i.test(t)) ? e.style.setProperty("--prism-accent", t) : i("warn", "prism.accent.invalid", { accent_length: t.length }));
}
function Er(e) {
	if (e.kind === "sequence") {
		let t = e.sequence;
		return `Sequence diagram with ${t?.participants.length ?? 0} participants and ${t?.messages.length ?? 0} messages`;
	}
	return `Flowchart with ${e.nodes.length} nodes and ${e.edges.length} connections`;
}
function Dr(e) {
	return [...e].sort((e, t) => e.depth - t.depth);
}
function Or(e, t) {
	let n = [], r = t, i = /* @__PURE__ */ new Set();
	for (; r && !i.has(r);) i.add(r), n.push(r), r = e.find((e) => e.group.id === r)?.group.parentId;
	return n;
}
function kr(e, t, n) {
	let r = e.get(t);
	r ? r.push(n) : e.set(t, [n]);
}
function Ar(e) {
	try {
		return typeof e.getTotalLength == "function" ? e.getTotalLength() : 0;
	} catch {
		return 0;
	}
}
function jr(e) {
	try {
		return typeof matchMedia == "function" && matchMedia(e).matches;
	} catch {
		return !1;
	}
}
function Mr(e) {
	return ([...String(e).trim()][0] ?? "•").toUpperCase();
}
function Nr(e) {
	return parseFloat(e) || 0;
}
function Pr() {
	return typeof performance < "u" ? performance.now() : Date.now();
}
function Fr(e) {
	return Math.round(e * 100) / 100;
}
//#endregion
//#region src/render/fallback.ts
var Ir = /* @__PURE__ */ new Set([
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
]), Lr = /* @__PURE__ */ new Set([
	"href",
	"xlink:href",
	"src",
	"action",
	"formaction",
	"poster",
	"background",
	"srcset"
]);
function Rr(e) {
	let t = e.replace(/[\u0000-\u0020\u007f-\u009f]+/g, "").toLowerCase();
	return t === "" || t.startsWith("#") || t.startsWith("http://") || t.startsWith("https://") ? !0 : /^data:image\/(png|gif|jpe?g|webp);/.test(t);
}
function zr(e) {
	let t = {
		removedElements: 0,
		removedAttributes: 0
	}, n = [e, ...Array.from(e.querySelectorAll("*"))];
	for (let r of n) if (r !== e && Ir.has(r.localName.toLowerCase())) r.remove(), t.removedElements++;
	else for (let e of Array.from(r.attributes)) {
		let n = e.name.toLowerCase();
		(n.startsWith("on") || Lr.has(n) && !Rr(e.value) || n === "style" && /expression\s*\(|javascript:|url\s*\(\s*['"]?\s*(?!#)[a-z]+:/i.test(e.value)) && (r.removeAttributeNode(e), t.removedAttributes++);
	}
	return t;
}
function Br(e, t = document) {
	let n = new DOMParser().parseFromString(`<!doctype html><body>${e}`, "text/html").body.querySelector("svg");
	if (!n || n.namespaceURI !== "http://www.w3.org/2000/svg") return null;
	let r = zr(n);
	return {
		svg: t.importNode(n, !0),
		report: r
	};
}
function Vr(e, t = document) {
	let n = t.createElement("div");
	n.className = "prism-fallback-source", n.setAttribute("role", "group"), n.setAttribute("aria-label", "Diagram source");
	let r = t.createElement("p");
	r.className = "prism-fallback-error", r.textContent = "Diagram could not be rendered";
	let i = t.createElement("pre");
	return i.className = "prism-fallback-code", i.textContent = e, n.append(r, i), n;
}
//#endregion
//#region src/render/palette.ts
var Hr = {
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
}, Ur = {
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
}, Wr = {
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
function Gr(e) {
	return e === "reqvar" ? {
		light: Wr,
		dark: Wr
	} : {
		light: Hr,
		dark: Ur
	};
}
//#endregion
//#region src/render/svg.ts
var Kr = "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", system-ui, \"Helvetica Neue\", \"Segoe UI\", Roboto, sans-serif";
function qr(e, t = {}) {
	let r = typeof performance < "u" ? performance.now() : 0, a = String(t.theme ?? "graphite"), o = t.scheme ?? "auto", s = t.measurer ?? Jt(null), c = Gr(a), l = ui(e.width), u = ui(e.height), d = [], f = t.title ?? (e.kind === "sequence" ? "Sequence diagram" : "Flowchart");
	d.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${u}" viewBox="0 0 ${l} ${u}" role="img" aria-label="${Q(f)}" font-family="${Q(Kr)}">`, `<title>${Q(f)}</title>`, `<style>${ai(c, o)}</style>`, "<defs>", "<linearGradient id=\"pz-surface\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" class=\"pz-sf-top\"/><stop offset=\"1\" class=\"pz-sf-bot\"/></linearGradient>", "<linearGradient id=\"pz-light\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" class=\"pz-le\" stop-opacity=\"1\"/><stop offset=\"0.28\" class=\"pz-le\" stop-opacity=\"0\"/></linearGradient>", "<filter id=\"pz-shadow\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"160%\"><feDropShadow dx=\"0\" dy=\"1\" stdDeviation=\"0.6\" class=\"pz-sh\" flood-opacity=\"0.9\"/><feDropShadow dx=\"0\" dy=\"6\" stdDeviation=\"6\" class=\"pz-sh\" flood-opacity=\"0.8\"/></filter>", "<pattern id=\"pz-grid\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><circle cx=\"1\" cy=\"1\" r=\"1\" class=\"pz-grid\"/></pattern>", "</defs>", `<rect width="${l}" height="${u}" class="pz-stage"/>`, `<rect width="${l}" height="${u}" fill="url(#pz-grid)"/>`);
	for (let t of [...e.groups].sort((e, t) => e.depth - t.depth)) d.push(Yr(t, e, s));
	e.sequence && d.push(...Qr(e, s));
	for (let t of e.edges) t.edge.stroke !== "invisible" && d.push(Xr(t, s));
	for (let t of e.nodes) d.push(Jr(t, s));
	d.push("</svg>");
	let p = d.join("");
	return i("info", "prism.render.svg", {
		trace_id: t.traceId ?? n(),
		theme: a,
		scheme: o,
		diagram_type: e.kind,
		node_count: e.nodes.length,
		bytes: p.length,
		duration_ms: typeof performance < "u" ? Math.round((performance.now() - r) * 100) / 100 : 0
	}), p;
}
function Jr(e, t) {
	let n = e.node, { x: r, y: i, width: a, height: o } = li(e), s = si(n.tone), c = t.nodeText(n, a), l = [`<g class="pz-node ${s}" data-id="${Q(n.id)}">`], u = Un(n);
	if (n.shape === "circle") {
		let e = r + a / 2;
		l.push(`<circle cx="${$(e)}" cy="${$(i + 24)}" r="24" fill="url(#pz-surface)" filter="url(#pz-shadow)"/>`), l.push(`<circle cx="${$(e)}" cy="${$(i + 24)}" r="23.5" class="pz-tone-stroke" fill="none" stroke-opacity="0.35"/>`), l.push(ni(u ?? {
			kind: "letter",
			text: (c.title[0] ?? "•").slice(0, 1).toUpperCase()
		}, e, i + 24, 20));
		let t = i + 48 + 8;
		for (let n of c.title) l.push(`<text x="${$(e)}" y="${$(t + 12)}" text-anchor="middle" class="pz-title">${Q(n)}</text>`), t += K.circle.line;
		for (let n of c.meta) l.push(`<text x="${$(e)}" y="${$(t + 11)}" text-anchor="middle" class="pz-meta">${Q(n)}</text>`), t += K.node.metaLine;
		return l.push("</g>"), ri(n.link?.href, l.join(""));
	}
	let d = n.shape === "stadium" ? o / 2 : n.shape === "round" ? 20 : n.shape === "diamond" ? 12 : 14, f = n.shape === "stadium" ? ci(r, i, a, o) : Lt(r, i, a, o, d);
	l.push(`<path d="${f}" fill="url(#pz-surface)" filter="url(#pz-shadow)"/>`), l.push(`<path d="${f}" fill="url(#pz-light)" opacity="0.9"/>`), l.push(`<path d="${n.shape === "stadium" ? ci(r + .5, i + .5, a - 1, o - 1) : Lt(r + .5, i + .5, a - 1, o - 1, d - .5)}" fill="none" class="pz-border"/>`);
	let p = r + K.node.padX, m = i + o / 2;
	if (n.shape === "diamond") {
		let e = K.diamond, t = r + e.padL + e.glyph / 2;
		l.push(`<rect x="${$(t - 4.5)}" y="${$(m - 4.5)}" width="9" height="9" rx="2" transform="rotate(45 ${$(t)} ${$(m)})" class="pz-accent-fill"/>`), p = r + e.padL + e.glyph + e.gap;
	} else if (u) {
		let e = K.node.icon, t = r + K.node.padX + e / 2;
		l.push(`<circle cx="${$(t)}" cy="${$(m)}" r="${e / 2}" class="pz-tone-fill" fill-opacity="${n.tone === "neutral" ? .07 : .13}"/>`), l.push(ni(u, t, m, 15)), p = r + K.node.padX + e + K.node.iconGap;
	}
	let h = i + (o - (c.title.length * K.node.titleLine + (c.meta.length ? K.node.metaGap + c.meta.length * K.node.metaLine : 0))) / 2;
	for (let e of c.title) l.push(`<text x="${$(p)}" y="${$(h + 13)}" class="pz-title">${Q(e)}</text>`), h += K.node.titleLine;
	c.meta.length && (h += K.node.metaGap);
	for (let e of c.meta) l.push(`<text x="${$(p)}" y="${$(h + 11)}" class="pz-meta">${Q(e)}</text>`), h += K.node.metaLine;
	if (n.tone !== "neutral" && n.shape !== "diamond") {
		let e = r + a - K.node.padX - 3;
		l.push(`<circle cx="${$(e)}" cy="${$(m)}" r="6" class="pz-tone-fill" fill-opacity="0.16"/><circle cx="${$(e)}" cy="${$(m)}" r="3" class="pz-tone-fill"/>`);
	}
	return l.push("</g>"), ri(n.link?.href, l.join(""));
}
function Yr(e, t, n) {
	let { x: r, y: i, width: a, height: o } = li(e), s = K.group.radius, c = [
		`<g class="pz-group ${si(e.group.tone)}" data-id="${Q(e.group.id)}">`,
		`<path d="${Lt(r, i, a, o, s)}" class="pz-group-fill"/>`,
		`<path d="${Lt(r + .5, i + .5, a - 1, o - 1, s - .5)}" fill="none" class="pz-group-stroke"/>`
	], l = r + K.group.padX, u = i + K.group.header / 2;
	e.group.tone !== "neutral" && (c.push(`<circle cx="${$(l + 3)}" cy="${$(u)}" r="3" class="pz-tone-fill"/>`), l += 14);
	let d = a - (l - r) - K.group.padX - 28, f = n.wrap(e.group.label, "group", d)[0] ?? "";
	c.push(`<text x="${$(l)}" y="${$(u + 4)}" class="pz-group-title">${Q(f)}</text>`);
	let p = t.nodes.filter((t) => t.node.groupId === e.group.id).length;
	if (p) {
		let e = r + a - K.group.padX - 9;
		c.push(`<rect x="${$(e - 9)}" y="${$(u - 9)}" width="18" height="18" rx="9" class="pz-ink-fill" fill-opacity="0.12"/>`), c.push(`<text x="${$(e)}" y="${$(u + 3.5)}" text-anchor="middle" class="pz-count">${p}</text>`);
	}
	return c.push("</g>"), c.join("");
}
function Xr(e, t) {
	let n = $t(e), r = e.edge.stroke === "dotted" ? "pz-edge pz-dotted" : e.edge.stroke === "thick" ? "pz-edge pz-thick" : "pz-edge", i = [
		`<g data-id="${Q(e.edge.id)}">`,
		`<path d="${n.d}" class="${r}"/>`,
		`<circle cx="${$(n.start.x)}" cy="${$(n.start.y)}" r="2" class="pz-edge-fill"/>`
	];
	for (let e of n.arrows) i.push(`<path d="${e}" class="pz-edge-fill"/>`);
	if (e.edge.label) {
		let n = en(e, t.text(e.edge.label, "edgeLabel"));
		n && i.push(Zr(n, e.edge.label));
	}
	return i.push("</g>"), i.join("");
}
function Zr(e, t) {
	let { x: n, y: r, width: i, height: a } = li(e);
	return `<rect x="${$(n)}" y="${$(r)}" width="${$(i)}" height="${$(a)}" rx="${$(a / 2)}" class="pz-label"/><text x="${$(n + i / 2)}" y="${$(r + a / 2 + 3.8)}" text-anchor="middle" class="pz-label-text">${Q(t)}</text>`;
}
function Qr(e, t) {
	let n = e.sequence, r = [];
	for (let e of n.blocks) {
		let { x: n, y: i, width: a, height: o } = li(e);
		r.push(`<path d="${Lt(n, i, a, o, 16)}" class="pz-block"/>`), r.push(ti(n + 8, i + 7, e.block.kind, e.block.label, t));
		for (let i of e.dividers) r.push(`<line x1="${$(n)}" x2="${$(n + a)}" y1="${$(i.y)}" y2="${$(i.y)}" class="pz-divider"/>`), r.push(ti(n + 8, i.y + 6, e.block.kind === "par" ? "and" : "else", i.label, t));
	}
	for (let e of n.participants) r.push(`<line x1="${$(e.lifelineX)}" x2="${$(e.lifelineX)}" y1="${$(n.lifelineTop)}" y2="${$(n.lifelineBottom)}" class="pz-lifeline"/>`);
	for (let e of n.activations) {
		let { x: t, y: n, width: i, height: a } = li(e);
		r.push(`<rect x="${$(t)}" y="${$(n)}" width="${$(i)}" height="${$(a)}" rx="5" fill="url(#pz-surface)" class="pz-activation"/>`);
	}
	for (let e of n.messages) r.push($r(e, n.activations));
	for (let e of n.notes) {
		let { x: n, y: i, width: a, height: o } = li(e);
		r.push(`<path d="${Lt(n, i, a, o, 12)}" class="pz-note" filter="url(#pz-shadow)"/>`);
		let s = t.wrap(e.note.text, "note", a - K.note.padX * 2), c = i + (o - s.length * K.note.line) / 2;
		for (let e of s) r.push(`<text x="${$(n + a / 2)}" y="${$(c + 12)}" text-anchor="middle" class="pz-note-text">${Q(e)}</text>`), c += K.note.line;
	}
	for (let e of n.participants) r.push(ei(e));
	return r;
}
function $r(e, t) {
	let n = an(e, t), r = e.message.kind === "reply", i = [`<g data-id="${Q(e.message.id)}">`, `<path d="${n.d}" class="pz-edge${r ? " pz-dashed" : ""}"/>`];
	for (let t of n.arrows) i.push(e.message.kind === "async" ? `<path d="${t}" class="pz-edge"/>` : `<path d="${t}" class="pz-edge-fill"/>`);
	return i.push(Zr(e.label, e.message.label), "</g>"), i.join("");
}
function ei(e) {
	let { x: t, y: n, width: r, height: i } = li(e), a = Lt(t, n, r, i, 12), o = [
		`<g class="pz-node pz-t-neutral" data-id="${Q(e.participant.id)}">`,
		`<path d="${a}" fill="url(#pz-surface)" filter="url(#pz-shadow)"/>`,
		`<path d="${a}" fill="url(#pz-light)" opacity="0.9"/>`,
		`<path d="${Lt(t + .5, n + .5, r - 1, i - 1, 11.5)}" fill="none" class="pz-border"/>`
	], s = t + r / 2;
	if (e.participant.role === "actor") {
		let e = Hn("user");
		if (e) {
			let a = t + r / 2 - 30;
			o.push(`<circle cx="${$(a)}" cy="${$(n + i / 2)}" r="11" class="pz-ink-fill" fill-opacity="0.12"/>`), o.push(ni({
				kind: "glyph",
				paths: e
			}, a, n + i / 2, 13, "pz-icon-muted")), s += 12;
		}
	}
	return o.push(`<text x="${$(s)}" y="${$(n + i / 2 + 4.5)}" text-anchor="middle" class="pz-title">${Q(e.participant.label)}</text>`, "</g>"), o.join("");
}
function ti(e, t, n, r, i) {
	let a = n.toUpperCase(), o = a.length * 6.6 + 2, s = r ? i.width(r, "edgeLabel") : 0, c = 7 + o + (r ? 6 + s : 0) + 8;
	return `<rect x="${$(e)}" y="${$(t)}" width="${$(c)}" height="20" rx="10" class="pz-label"/><text x="${$(e + 7)}" y="${$(t + 13.5)}" class="pz-chip-kind">${Q(a)}</text>` + (r ? `<text x="${$(e + 7 + o + 6)}" y="${$(t + 14)}" class="pz-chip-label">${Q(r)}</text>` : "");
}
function ni(e, t, n, r, i = "pz-icon") {
	if (!e) return "";
	if (e.kind === "letter") return `<text x="${$(t)}" y="${$(n + r * .24)}" text-anchor="middle" class="${i} pz-letter" font-size="${$(r * .72)}">${Q(e.text)}</text>`;
	let a = r / 24, o = e.paths.map((e) => `<path d="${Q(e)}"/>`).join("");
	return `<g transform="translate(${$(t - r / 2)} ${$(n - r / 2)}) scale(${$(a)})" class="${i}" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${o}</g>`;
}
function ri(e, t) {
	let n = e ? Rt(e) : null;
	return n ? `<a href="${Q(n)}" target="_blank" rel="noopener noreferrer">${t}</a>` : t;
}
function ii(e) {
	return `--stage:${e.stage};--grid:${e.grid};--ink:${e.ink};--ink2:${e.ink2};--ink3:${e.ink3};--accent:${e.accent};--ok:${e.ok};--warn:${e.warn};--danger:${e.danger};--sft:${e.surfaceTop};--sfb:${e.surfaceBottom};--border:${e.border};--le:${e.lightEdge};--sh:${e.shadow};--group:${e.group};--gborder:${e.groupBorder};--edge:${e.edge};--label:${e.label};--note:${e.note};--block:${e.block}`;
}
function ai(e, t) {
	return `svg{${ii(t === "dark" ? e.dark : e.light)}}` + (t === "auto" && e.dark !== e.light ? `@media (prefers-color-scheme: dark){svg{${ii(e.dark)}}}` : "") + ".pz-stage{fill:var(--stage)}.pz-grid{fill:var(--grid)}.pz-sf-top{stop-color:var(--sft)}.pz-sf-bot{stop-color:var(--sfb)}.pz-le{stop-color:var(--le)}.pz-sh{flood-color:var(--sh)}.pz-border{stroke:var(--border);stroke-width:1}.pz-t-neutral{--tone:var(--ink)}.pz-t-accent{--tone:var(--accent)}.pz-t-ok{--tone:var(--ok)}.pz-t-warn{--tone:var(--warn)}.pz-t-danger{--tone:var(--danger)}.pz-tone-fill{fill:var(--tone)}.pz-tone-stroke{stroke:var(--tone)}.pz-ink-fill{fill:var(--ink)}.pz-accent-fill{fill:var(--accent)}.pz-icon{stroke:var(--tone);fill:none}.pz-t-neutral .pz-icon,.pz-icon-muted{stroke:var(--ink2);fill:none}.pz-letter{fill:var(--tone);stroke:none;font-weight:650}.pz-title{fill:var(--ink);font-size:13px;font-weight:590;letter-spacing:-0.13px}.pz-meta{fill:var(--ink2);font-size:11px;font-weight:450;letter-spacing:0.11px}.pz-group-fill{fill:var(--group)}.pz-group-stroke{stroke:var(--gborder);stroke-width:1}.pz-group-title{fill:var(--ink);fill-opacity:0.78;font-size:12px;font-weight:600}.pz-count{fill:var(--ink2);font-size:10.5px;font-weight:600;font-variant-numeric:tabular-nums}.pz-edge{fill:none;stroke:var(--edge);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}.pz-dotted{stroke-dasharray:0.01 5;stroke-width:2}.pz-thick{stroke-width:2.5}.pz-dashed{stroke-dasharray:4 4;stroke-linecap:butt}.pz-edge-fill{fill:var(--edge)}.pz-label{fill:var(--label);stroke:var(--border);stroke-width:1}.pz-label-text{fill:var(--ink2);font-size:11px;font-weight:500;letter-spacing:0.11px}.pz-lifeline{stroke:var(--ink3);stroke-width:1;stroke-dasharray:2 5;stroke-linecap:round}.pz-activation{stroke:var(--accent);stroke-opacity:0.3;stroke-width:1}.pz-note{fill:var(--note);stroke:var(--border);stroke-width:1}.pz-note-text{fill:var(--ink);fill-opacity:0.74;font-size:12px}.pz-block{fill:var(--block);stroke:var(--gborder);stroke-width:1}.pz-divider{stroke:var(--gborder);stroke-dasharray:3 3}.pz-chip-kind{fill:var(--accent);font-size:9.5px;font-weight:700;letter-spacing:0.66px}.pz-chip-label{fill:var(--ink2);font-size:11px;font-weight:500}";
}
function Q(e) {
	return String(e ?? "").replace(/[&<>"']/g, (e) => oi[e]);
}
var oi = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
};
function si(e) {
	return [
		"neutral",
		"accent",
		"ok",
		"warn",
		"danger"
	].includes(e) ? `pz-t-${e}` : "pz-t-neutral";
}
function ci(e, t, n, r) {
	let i = r / 2;
	return `M${$(e + i)},${$(t)} H${$(e + n - i)} A${$(i)},${$(i)} 0 0 1 ${$(e + n - i)},${$(t + r)} H${$(e + i)} A${$(i)},${$(i)} 0 0 1 ${$(e + i)},${$(t)} Z`;
}
function li(e) {
	return {
		x: ui(e.x),
		y: ui(e.y),
		width: Math.max(0, ui(e.width)),
		height: Math.max(0, ui(e.height))
	};
}
function ui(e) {
	let t = Number(e);
	return Number.isFinite(t) ? t : 0;
}
function $(e) {
	return (Math.round(ui(e) * 100) / 100).toString();
}
//#endregion
//#region src/index.ts
var di = 1e4;
async function fi(e, t, a = {}) {
	let o = a.traceId ?? n(), s = wi(), c = {
		...a,
		traceId: o
	};
	i("info", "prism.render.start", {
		trace_id: o,
		mode: c.mode ?? "2d",
		theme: c.theme ?? "graphite",
		code_length: t.length
	});
	let l, u;
	try {
		l = await Xe(t, { traceId: o }), u = await hi(e, l, c);
	} catch (n) {
		let a = n instanceof Ke ? "unsupported_diagram" : "parse_or_layout_failed";
		return i("warn", "prism.fallback", {
			trace_id: o,
			reason: a,
			diagram_type: n instanceof Ke ? n.diagramType : void 0,
			duration_ms: Ti(s),
			...r(n)
		}), c.signal?.aborted ? Si() : bi(e, t, c, s);
	}
	if (c.signal?.aborted) return Si();
	try {
		let t = await mi(e, u, {
			...c,
			model: l
		});
		return i("info", "prism.render.ok", {
			trace_id: o,
			mode: t.mode,
			diagram_type: u.kind,
			node_count: u.nodes.length,
			duration_ms: Ti(s)
		}), t;
	} catch (n) {
		return i("error", "prism.render.error", {
			trace_id: o,
			stage: "mount",
			duration_ms: Ti(s),
			...r(n)
		}), c.signal?.aborted ? Si() : (i("warn", "prism.fallback", {
			trace_id: o,
			reason: "render_failed",
			duration_ms: Ti(s)
		}), bi(e, t, c, s));
	}
}
async function pi(e, t, a = {}) {
	let o = a.traceId ?? n(), s = wi(), c = {
		...a,
		traceId: o
	};
	i("info", "prism.render.start", {
		trace_id: o,
		mode: c.mode ?? "2d",
		source: "model",
		diagram_type: t.kind
	});
	try {
		let n = await hi(e, t, c);
		if (c.signal?.aborted) return Si();
		let r = await mi(e, n, {
			...c,
			model: c.model ?? t
		});
		return i("info", "prism.render.ok", {
			trace_id: o,
			mode: r.mode,
			diagram_type: n.kind,
			node_count: n.nodes.length,
			duration_ms: Ti(s)
		}), r;
	} catch (e) {
		throw i("error", "prism.render.error", {
			trace_id: o,
			stage: "model",
			duration_ms: Ti(s),
			...r(e)
		}), e;
	}
}
async function mi(e, t, a = {}) {
	let o = a.traceId ?? n();
	if (a.mode === "3d") {
		let n = wi(), s = null, c = {};
		if (t.kind !== "flowchart") s = "kind_2d_only";
		else try {
			let n = await import("./render3d-7kp9sGEU.js");
			if (!n.supportsWebGL()) s = "no_webgl";
			else return a.signal?.aborted ? Si("3d") : await n.renderScene3d(e, t, {
				theme: a.theme,
				scheme: a.scheme,
				accent: a.accent,
				traceId: o,
				model: a.model,
				locale: a.locale ?? "en",
				playerBar: a.player !== !1 && void 0,
				...a.vocabulary === void 0 ? {} : { vocabulary: a.vocabulary }
			});
		} catch (e) {
			s = "render3d_failed", c = r(e);
		}
		i("warn", "prism.fallback", {
			trace_id: o,
			from: "3d",
			to: "2d",
			reason: s,
			duration_ms: Ti(n),
			...c
		});
	}
	return a.signal?.aborted ? Si() : cr(e, t, {
		...a,
		traceId: o
	});
}
async function hi(e, t, n) {
	let r = document.createElement("div");
	r.className = "prism", r.dataset.theme = n.theme ?? "graphite", r.dataset.scheme = n.scheme ?? "auto", r.setAttribute("aria-hidden", "true"), r.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;width:0;height:0;overflow:hidden", e.append(r);
	try {
		return await Et(t, Jt(r), { traceId: n.traceId });
	} finally {
		r.remove();
	}
}
var gi = 0, _i = null;
function vi() {
	return _i || (_i = import("./mermaid.core-tmowpuIY.js").then(({ default: e }) => (e.initialize({
		startOnLoad: !1,
		securityLevel: "strict",
		theme: "neutral"
	}), e)), _i.catch(() => {
		_i = null;
	})), _i;
}
function yi(e, t) {
	let n = `%%{init: {"theme": "${t}"}}%%\n`, r = /^\s*---\r?\n[\s\S]*?\r?\n---[^\S\r\n]*(\r?\n|$)/.exec(e);
	return r ? e.slice(0, r[0].length) + n + e.slice(r[0].length) : n + e;
}
async function bi(e, t, n, a) {
	let o = document.createElement("div");
	o.className = "prism prism-fallback", o.dataset.theme = n.theme ?? "graphite", o.dataset.scheme = n.scheme ?? "auto", o.dataset.fallback = "mermaid", e.append(o);
	try {
		let e = await vi(), r = n.scheme === "dark" || n.theme === "reqvar" || n.scheme !== "light" && Ci(), s = `prism-fb-${n.traceId}-${++gi}`, { svg: c, bindFunctions: l } = await xi(e.render(s, yi(t, r ? "dark" : "neutral")), n.fallbackTimeoutMs ?? di);
		if (n.signal?.aborted) return o.remove(), Si();
		let u = Br(c);
		if (!u) throw Error("mermaid output contained no <svg>");
		o.append(u.svg), l?.(o), i("info", "prism.render.ok", {
			trace_id: n.traceId,
			mode: "fallback",
			stripped_elements: u.report.removedElements,
			stripped_attributes: u.report.removedAttributes,
			duration_ms: Ti(a)
		});
	} catch (e) {
		if (i("error", "prism.fallback.failed", {
			trace_id: n.traceId,
			stage: "mermaid",
			code_length: t.length,
			duration_ms: Ti(a),
			...r(e)
		}), n.signal?.aborted) return o.remove(), Si();
		o.dataset.fallback = "source", o.replaceChildren(Vr(t));
	}
	let s = !1;
	return {
		mode: "2d",
		setTheme(e, t) {
			s || (o.dataset.theme = e, t && (o.dataset.scheme = t));
		},
		focusNode() {},
		destroy() {
			s || (s = !0, o.remove());
		}
	};
}
function xi(e, t) {
	let n, r = new Promise((e, r) => {
		n = setTimeout(() => r(/* @__PURE__ */ Error(`mermaid render timed out after ${t}ms`)), t);
	});
	return Promise.race([e, r]).finally(() => clearTimeout(n));
}
function Si(e = "2d") {
	return {
		mode: e,
		setTheme() {},
		focusNode() {},
		destroy() {}
	};
}
function Ci() {
	try {
		return typeof matchMedia == "function" && matchMedia("(prefers-color-scheme: dark)").matches;
	} catch {
		return !1;
	}
}
function wi() {
	return typeof performance < "u" ? performance.now() : Date.now();
}
function Ti(e) {
	return Math.round((wi() - e) * 100) / 100;
}
//#endregion
//#region atlas-entry.ts
async function Ei(...e) {
	return (await import("./render3d-7kp9sGEU.js")).renderDrill3d(...e);
}
async function Di() {
	return (await import("./render3d-7kp9sGEU.js")).supportsWebGL();
}
//#endregion
export { pi as a, cr as c, wt as d, Ke as f, fi as i, Jt as l, Xe as m, Di as n, yi as o, Ge as p, mi as r, qr as s, Ei as t, Bt as u };
