import { r as e } from "./log-CNcbKWHK.js";
import { i as t, n } from "./time-BWa0vVgI.js";
//#region src/core/vocab/loops.ts
var r = /* @__PURE__ */ new Set(["SENSES", "OBSERVES"]), i = /* @__PURE__ */ new Set(["PART_OF"]);
function a(e) {
	let t = e.filter((e) => !i.has(e.kind ?? "")), n = /* @__PURE__ */ new Map();
	for (let e of t) n.set(e.from, [...n.get(e.from) ?? [], e]);
	let r = [], a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
	for (let e of t.filter((e) => e.kind === "REGULATES")) {
		let t = o(n, e.to, e.from);
		if (t) {
			let n = [e.id, ...t.map((e) => e.id)], i = [...n].sort().join("|");
			if (a.has(i)) continue;
			a.add(i);
			let o = [e.from];
			for (let n of [e, ...t]) o.includes(n.to) || o.push(n.to);
			r.push({
				kind: "closed",
				regulator: e.from,
				members: o,
				edges: n
			});
		} else {
			let t = s.get(e.from) ?? {
				members: [e.from],
				edges: []
			};
			t.members.includes(e.to) || t.members.push(e.to), t.edges.push(e.id), s.set(e.from, t);
		}
	}
	let c = [...s].map(([e, t]) => ({
		kind: "open",
		regulator: e,
		members: t.members,
		edges: t.edges
	}));
	return [...r, ...c];
}
function o(e, t, n) {
	let i = (e) => `${e.node}|${+!!e.fb}`, a = /* @__PURE__ */ new Map(), o = {
		node: t,
		fb: !1
	};
	a.set(i(o), null);
	let s = [o];
	for (; s.length;) {
		let t = s.shift();
		for (let o of e.get(t.node) ?? []) {
			let e = {
				node: o.to,
				fb: t.fb || r.has(o.kind ?? "")
			}, c = i(e);
			if (!a.has(c)) {
				if (a.set(c, {
					from: i(t),
					edge: o
				}), e.node === n && e.fb) {
					let e = [], t = c;
					for (; t;) {
						let n = a.get(t);
						if (!n) break;
						e.unshift(n.edge), t = n.from;
					}
					return e;
				}
				e.node !== n && s.push(e);
			}
		}
	}
	return null;
}
//#endregion
//#region src/core/vocab/classify.ts
var s = {
	yes: [
		"yes",
		"ja",
		"true",
		"ok",
		"success",
		"pass",
		"approved",
		"valid",
		"✓",
		"✔"
	],
	no: [
		"no",
		"nein",
		"false",
		"reject",
		"rejected",
		"denied",
		"invalid",
		"✗",
		"✘"
	],
	error: [
		"error",
		"fail",
		"failed",
		"fehler",
		"exception"
	],
	timeout: [
		"timeout",
		"expired",
		"abgelaufen"
	],
	retry: [
		"retry",
		"again",
		"erneut",
		"wiederholen"
	],
	wait: [
		"wait",
		"warten",
		"delay",
		"sleep",
		"pause"
	]
}, c = /* @__PURE__ */ new Map();
for (let [e, t] of Object.entries(s)) for (let n of t) c.set(n, e);
var l = 400;
function u(e) {
	return typeof e != "string" || !e ? [] : e.slice(0, l).toLowerCase().match(/[\p{L}\p{N}]+|[✓✔✗✘]/gu) ?? [];
}
function d(e) {
	for (let t of u(e)) {
		let e = c.get(t);
		if (e) return e;
	}
	return null;
}
function f(e) {
	return (typeof e == "string" ? e : "").trim().slice(0, 64).replace(/[\s-]+/g, "_").toUpperCase();
}
//#endregion
//#region src/core/vocab/packs.ts
var p = {
	yes: {
		tone: "ok",
		effect: "yes",
		glyph: "✓",
		flow: "travel",
		color: "#34c759",
		label: {
			de: "ja",
			en: "yes"
		}
	},
	no: {
		tone: "danger",
		effect: "no",
		glyph: "✕",
		flow: "travel",
		color: "#ff453a",
		label: {
			de: "nein",
			en: "no"
		}
	},
	error: {
		tone: "danger",
		effect: "error",
		glyph: "⚠",
		flow: "travel",
		color: "#ff453a",
		label: {
			de: "Fehler",
			en: "error"
		}
	},
	timeout: {
		tone: "warn",
		effect: "timeout",
		glyph: "⏱",
		flow: "travel",
		color: "#ff9f0a",
		label: {
			de: "Zeitüberschreitung",
			en: "timeout"
		}
	},
	retry: {
		tone: "warn",
		effect: "retry",
		glyph: "↻",
		flow: "travel",
		label: {
			de: "erneut",
			en: "retry"
		}
	},
	wait: {
		tone: "neutral",
		effect: "wait",
		glyph: "🕑",
		flow: "travel",
		label: {
			de: "warten",
			en: "wait"
		}
	}
}, m = {
	yes: {
		glyph: "✓",
		decoration: "check",
		effect: "yes"
	},
	no: {
		glyph: "✕",
		decoration: "cross",
		effect: "no"
	},
	error: {
		glyph: "⚠",
		decoration: "warn",
		effect: "error"
	},
	wait: {
		glyph: "🕑",
		decoration: "clock",
		effect: "wait"
	},
	retry: {
		glyph: "↻",
		decoration: "retry",
		effect: "retry"
	},
	done: {
		glyph: "●",
		decoration: "done",
		effect: "done"
	}
};
function h(e, t) {
	return d(t);
}
var g = {
	id: "default",
	edgeKinds: p,
	nodeRoles: m,
	classify: h
}, _ = {
	NEXT: {
		color: "#ef597a",
		tone: "accent",
		flow: "travel",
		label: {
			de: "dann",
			en: "next"
		}
	},
	CAUSES: {
		color: "#41dce1",
		tone: "accent",
		effect: "spark",
		flow: "travel",
		label: {
			de: "löst aus",
			en: "causes"
		}
	},
	ENABLES: {
		color: "#7dffa8",
		tone: "ok",
		effect: "gate",
		glyph: "⊓",
		flow: "gate",
		label: {
			de: "nur wenn",
			en: "enables"
		}
	},
	BLOCKS: {
		color: "#ef597a",
		tone: "danger",
		effect: "lock",
		glyph: "🔒",
		flow: "bounce",
		label: {
			de: "stoppt",
			en: "blocks"
		}
	},
	HOLDS: {
		color: "#ffbd3c",
		tone: "warn",
		effect: "park",
		glyph: "❚❚",
		flow: "park",
		label: {
			de: "pausiert",
			en: "holds"
		}
	},
	EMITS: {
		color: "#c084fc",
		tone: "accent",
		effect: "radio",
		glyph: "◠",
		flow: "travel",
		label: {
			de: "wirft Signal",
			en: "emits"
		}
	},
	CALLS: {
		color: "#94a3b8",
		tone: "neutral",
		flow: "roundtrip",
		glyph: "⇄",
		label: {
			de: "ruft auf",
			en: "calls"
		}
	},
	HANDLES: {
		color: "#64748b",
		tone: "neutral",
		effect: "catch",
		flow: "travel",
		label: {
			de: "fängt",
			en: "handles"
		}
	},
	PART_OF: {
		color: "#e8eef4",
		tone: "neutral",
		flow: "none",
		label: {
			de: "enthält",
			en: "part of"
		}
	},
	CROSS_LANE: {
		color: "#41dce1",
		tone: "accent",
		effect: "lane",
		glyph: "✉",
		flow: "travel",
		label: {
			de: "über Bahnen",
			en: "cross lane"
		}
	},
	EXTERNAL: {
		color: "#fb7185",
		tone: "danger",
		effect: "blackbox",
		glyph: "?",
		flow: "vanish",
		label: {
			de: "verlässt die Karte",
			en: "external"
		}
	},
	REGULATES: {
		color: "#34d399",
		tone: "ok",
		effect: "regulate",
		flow: "travel",
		label: {
			de: "reguliert",
			en: "regulates"
		}
	},
	DISTURBS: {
		color: "#f97316",
		tone: "warn",
		effect: "kick",
		flow: "travel",
		label: {
			de: "stört",
			en: "disturbs"
		}
	},
	SENSES: {
		color: "#38bdf8",
		tone: "accent",
		effect: "scan",
		flow: "travel",
		label: {
			de: "misst",
			en: "senses"
		}
	},
	OBSERVES: {
		color: "#38bdf8",
		tone: "accent",
		effect: "eye",
		glyph: "◉",
		flow: "travel",
		label: {
			de: "beobachtet",
			en: "observes"
		}
	},
	SETTLES: {
		color: "#a3e635",
		tone: "ok",
		effect: "settle",
		flow: "travel",
		label: {
			de: "erholt sich",
			en: "settles"
		}
	},
	ATTENUATES: {
		color: "#94a3b8",
		tone: "neutral",
		effect: "filter",
		flow: "merge",
		label: {
			de: "dämpft Varietät",
			en: "attenuates"
		}
	},
	AMPLIFIES: {
		color: "#c084fc",
		tone: "accent",
		effect: "fan",
		flow: "split",
		label: {
			de: "erhöht Varietät",
			en: "amplifies"
		}
	}
}, v = {
	...m,
	essential: {
		glyph: "◔",
		decoration: "gauge",
		label: {
			de: "Vitalwert",
			en: "essential"
		}
	},
	regulator: {
		glyph: "◎",
		decoration: "knob",
		label: {
			de: "Regler",
			en: "regulator"
		}
	},
	disturbance: {
		glyph: "≋",
		decoration: "weather",
		label: {
			de: "Störung",
			en: "disturbance"
		}
	},
	external: {
		glyph: "?",
		decoration: "blackbox",
		label: {
			de: "Blackbox",
			en: "external"
		}
	},
	regime: {
		glyph: "▤",
		decoration: "regime",
		label: {
			de: "Regime",
			en: "regime"
		}
	},
	event: {
		glyph: "○",
		decoration: "event",
		label: {
			de: "Ereignis",
			en: "event"
		}
	}
}, y = {
	REGULIERT: "REGULATES",
	STÖRT: "DISTURBS",
	MISST: "SENSES",
	BEOBACHTET: "OBSERVES",
	BLOCKIERT: "BLOCKS",
	STOPPT: "BLOCKS",
	PAUSIERT: "HOLDS",
	RUFT_AUF: "CALLS",
	ENTHÄLT: "PART_OF",
	DÄMPFT: "ATTENUATES",
	VERSTÄRKT: "AMPLIFIES"
};
function b(e, t) {
	let n = f(t);
	return n && _[n] ? n : n && y[n] ? y[n] : h(e, t);
}
var x = {
	id: "reqvar",
	edgeKinds: {
		...p,
		..._
	},
	nodeRoles: v,
	classify: b,
	loops: !0
};
function S(e) {
	return e && typeof e == "object" && typeof e.classify == "function" && e.edgeKinds && e.nodeRoles ? e : e === "reqvar" ? x : g;
}
function C(e, t) {
	if (!t) return null;
	if (e.edgeKinds[t]) return t;
	let n = f(t);
	if (e.edgeKinds[n]) return n;
	let r = t.toLowerCase();
	return e.edgeKinds[r] ? r : null;
}
function w(e, t) {
	if (!t) return null;
	if (e.nodeRoles[t]) return t;
	let n = t.toLowerCase();
	return e.nodeRoles[n] ? n : null;
}
//#endregion
//#region src/core/vocab/resolve.ts
var T = (e, t) => `${e}\u0000${t}`;
function E(e) {
	return e.kind === "flowchart" ? {
		nodes: e.nodes,
		edges: e.edges
	} : {
		nodes: e.participants.map((e) => ({
			id: e.id,
			label: e.label,
			shape: "rect",
			classes: [],
			tone: "neutral"
		})),
		edges: e.messages.map((e) => ({
			id: e.id,
			from: e.from,
			to: e.to,
			label: e.label,
			stroke: "solid",
			arrowStart: !1,
			arrowEnd: !0
		}))
	};
}
function D(t, n, r) {
	let i = S(n), o = t.fxOff === !0, { nodes: s, edges: c } = E(t), l = new Map(s.map((e) => [e.id, e])), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map();
	for (let n of t.fx ?? []) if ("node" in n.target) {
		if (!l.has(n.target.node)) {
			e("warn", "prism.vocab.fx_dropped", {
				trace_id: r,
				error_code: "UNKNOWN_ID",
				target_id: n.target.node
			});
			continue;
		}
		u.has(n.target.node) || u.set(n.target.node, n.effect);
	} else {
		let { from: t, to: i } = n.target, a = T(t, i);
		if (!c.some((e) => e.from === t && e.to === i)) {
			e("warn", "prism.vocab.fx_dropped", {
				trace_id: r,
				error_code: "UNKNOWN_EDGE",
				from_id: t,
				to_id: i
			});
			continue;
		}
		d.has(a) || d.set(a, n.effect);
	}
	let f = {}, p = {};
	for (let t of s) {
		let n = null, a = "directive";
		if (t.kind && (n = w(i, t.kind), n || e("warn", "prism.vocab.unknown_role", {
			trace_id: r,
			pack_id: i.id,
			node_id: t.id,
			error_code: "UNKNOWN_ROLE"
		})), !n) {
			a = "class";
			for (let e of t.classes) if (n = w(i, e), n) break;
		}
		if (n) {
			let e = i.nodeRoles[n];
			f[t.id] = {
				nodeId: t.id,
				role: n,
				glyph: e.glyph,
				decoration: e.decoration,
				source: a
			};
		}
		if (o) continue;
		let s = u.get(t.id);
		s ? p[t.id] = s : n && i.nodeRoles[n].effect && (p[t.id] = i.nodeRoles[n].effect);
	}
	let m = {};
	for (let t of c) {
		let n = null;
		t.kind && (n = C(i, t.kind), n || e("warn", "prism.vocab.unknown_kind", {
			trace_id: r,
			pack_id: i.id,
			edge_id: t.id,
			error_code: "UNKNOWN_KIND"
		}));
		let a = n ? null : C(i, i.classify(t, t.label ?? "")), s = n ?? a, c = s ? i.edgeKinds[s] : void 0, p = l.get(t.to)?.shape === "diamond", h = null, g = "none", _ = d.get(T(t.from, t.to)), v = p ? void 0 : u.get(t.to), y = f[t.to]?.source === "class" ? f[t.to].role : null, b = y ? i.nodeRoles[y]?.effect : void 0;
		_ ? [h, g] = [_, "fx"] : v ? [h, g] = [v, "fx"] : n && c?.effect ? [h, g] = [c.effect, "directive"] : b && !p ? [h, g] = [b, "class"] : a && c?.effect && ([h, g] = [c.effect, "label"]), o && ([h, g] = [null, "none"]), m[t.id] = {
			edgeId: t.id,
			kind: s,
			effect: h,
			flow: c?.flow ?? "travel",
			tone: c?.tone ?? "neutral",
			source: g,
			...c?.color ? { color: c.color } : {},
			...c?.glyph ? { glyph: c.glyph } : {}
		};
	}
	let h = i.loops && t.kind === "flowchart" ? a(c.map((e) => ({
		id: e.id,
		from: e.from,
		to: e.to,
		kind: m[e.id].kind
	}))) : [];
	return e("debug", "prism.vocab.resolved", {
		trace_id: r,
		pack_id: i.id,
		fx_off: o,
		edge_count: c.length,
		kinded_edges: Object.values(m).filter((e) => e.kind).length,
		role_count: Object.keys(f).length,
		closed_loops: h.filter((e) => e.kind === "closed").length,
		open_loops: h.filter((e) => e.kind === "open").length
	}), {
		packId: i.id,
		fxOff: o,
		edgeEffects: m,
		nodeRoles: f,
		nodeEffects: p,
		loops: h
	};
}
//#endregion
//#region src/core/flow/timeline.ts
var O = (e) => e.replace(/\s+/g, " ").trim();
function ee(e) {
	let t = 0;
	for (let n = 1; n < e.length; n++) t += Math.hypot(e[n].x - e[n - 1].x, e[n].y - e[n - 1].y);
	return t;
}
function k(e, t) {
	let n = {
		kind: "flowchart",
		direction: "LR",
		nodes: e.nodes.map((e) => e.node),
		edges: e.edges.map((e) => e.edge),
		groups: e.groups.map((e) => e.group)
	};
	return t?.length ? {
		...n,
		waits: t
	} : n;
}
function A(t, n, r) {
	let i = /* @__PURE__ */ new Map(), a = [];
	for (let o of t ?? []) n.has(o.targetId) ? i.has(o.targetId) || i.set(o.targetId, o) : (a.push(o.targetId), e("warn", "prism.flow.wait_dropped", {
		trace_id: r,
		target_id: o.targetId,
		error_code: "UNKNOWN_ID"
	}));
	return {
		map: i,
		dropped: a
	};
}
function j(e, t, r, i) {
	if (!e) return null;
	let a = n(e.ms);
	return {
		id: t,
		kind: "directive",
		reason: e.reason ?? "",
		ms: e.ms,
		start: r,
		end: r + a,
		spanStart: r,
		spanEnd: r + a,
		step: i
	};
}
function te(e, t) {
	if (e.length === 1) {
		let n = e[0];
		return `${t(n.from)} → ${t(n.to)}${n.label ? ` (${O(n.label)})` : ""}${n.back ? " ↺" : ""}${n.ret ? " ↩" : ""}`;
	}
	let n = [];
	for (let r of e) {
		let e = t(r.to) + (r.back ? " ↺" : "") + (r.ret ? " ↩" : ""), i = n.find((e) => e.from === r.from);
		i ? i.tos.push(e) : n.push({
			from: r.from,
			tos: [e]
		});
	}
	let r = n.slice(0, 3).map((e) => `${t(e.from)} → ${e.tos.join(", ")}`);
	return n.length > 3 && r.push(`+${n.length - 3}`), r.join(" · ");
}
var ne = 1e-6;
function M(n, r, i, a) {
	let o = n.nodes, s = new Set(o.map((e) => e.id)), { map: c, dropped: l } = A(n.waits, s, a);
	if (!o.length) return {
		kind: "flowchart",
		steps: [],
		waits: [],
		duration: 0,
		dropped: l,
		skipped: [],
		effects: i
	};
	let u = new Map(o.map((e) => [e.id, O(e.label) || e.id])), d = (e) => u.get(e) ?? e, f = new Map(o.map((e, t) => [e.id, t]));
	new Map(o.map((e) => [e.id, e.shape]));
	let p = /* @__PURE__ */ new Map();
	for (let e of r?.edges ?? []) p.set(e.edge.id, ee(e.points));
	let m = !i.fxOff, h = n.edges.filter((e) => e.stroke !== "invisible" && s.has(e.from) && s.has(e.to)).map((e) => {
		let t = i.edgeEffects[e.id], n = {
			label: e.label,
			flow: t?.flow ?? "travel",
			effect: t?.effect ?? null,
			kind: t?.kind ?? null
		};
		return e.arrowStart && !e.arrowEnd ? {
			id: e.id,
			from: e.to,
			to: e.from,
			...n
		} : {
			id: e.id,
			from: e.from,
			to: e.to,
			...n
		};
	}).filter((e) => e.flow !== "none"), g = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map();
	for (let e of h) g.set(e.from, [...g.get(e.from) ?? [], e]), _.set(e.to, (_.get(e.to) ?? 0) + 1);
	let v = o.filter((e) => !_.get(e.id)).map((e) => e.id);
	v.length || (v = [o[0].id]);
	let y = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Map();
	for (let e of [...v, ...o.map((e) => e.id)]) {
		if (b.has(e)) continue;
		let t = [[e, 0]];
		for (b.set(e, 1); t.length;) {
			let e = t[t.length - 1], n = g.get(e[0]) ?? [];
			if (e[1] >= n.length) {
				b.set(e[0], 2), t.pop();
				continue;
			}
			let r = n[e[1]++], i = b.get(r.to);
			i === 1 ? y.add(r.id) : i || (b.set(r.to, 1), t.push([r.to, 0]));
		}
	}
	let x = /* @__PURE__ */ new Set(), S = /* @__PURE__ */ new Map();
	for (let e of o) {
		let t = g.get(e.id) ?? [];
		if (e.shape !== "diamond" || t.length < 2) continue;
		let n = i.nodeEffects[e.id], r = n && t.find((e) => e.effect === n) || t[0];
		S.set(e.id, r);
		for (let e of t) e !== r && x.add(e.id);
	}
	let C = (e) => e.flow === "bounce" || e.flow === "park", w = (e) => e.flow === "gate" && e.effect === "no", T = (e) => !x.has(e.id) && !C(e) && !w(e), E = (e) => {
		let t = new Set(v), n = [...v];
		for (; n.length;) for (let r of g.get(n.shift()) ?? []) e(r) && !t.has(r.to) && (t.add(r.to), n.push(r.to));
		return t;
	}, D = E(() => !0), k = E(T), M = new Set([...D].filter((e) => !k.has(e))), N = (e) => (g.get(e) ?? []).filter((e) => !x.has(e.id)), P = /* @__PURE__ */ new Map();
	for (let e of h) !y.has(e.id) && T(e) && !M.has(e.from) && P.set(e.to, (P.get(e.to) ?? /* @__PURE__ */ new Set()).add(e.from));
	let F = (e, t) => f.get(e) - f.get(t), I = (e) => i.nodeRoles[e]?.role === "essential", L = i.loops.filter((e) => e.kind === "closed"), R = [], z = [], B = /* @__PURE__ */ new Set(), V = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Set(), Y = /* @__PURE__ */ new Set(), X = !1, Z = 0, Q = (e, t, n, r) => {
		B.add(e);
		let i = j(c.get(e), e, t, n);
		i && (N(e).some((e) => e.effect === "timeout") && (i.timeout = !0), r.push(i));
		let a = i ? i.end : t;
		W.set(`n:${e}`, {
			readyAt: a,
			node: e,
			mode: "node"
		});
		for (let t of K.get(e) ?? []) W.set(`r:${t.id}`, {
			readyAt: a,
			node: e,
			mode: "return",
			edge: t
		});
		K.delete(e);
	}, $ = (e, t) => {
		let n = U.get(e);
		n && (n.end = t), U.delete(e);
		for (let n of H.get(e) ?? []) n.spanEnd = t;
	}, re = (e) => {
		let t = R.length, n = [];
		for (let r of e) Q(r, Z, t, n);
		R.push({
			index: t,
			start: Z,
			travel: 0,
			arrive: Z,
			end: Z + 600,
			caption: e.map(d).join(", "),
			edges: [],
			back: [],
			from: [],
			nodes: [...e],
			waits: n,
			effects: [],
			returns: []
		}), z.push(...n), Z += 600;
	};
	re(v);
	for (let n = 0; n < (o.length + h.length) * 4 + 16; n++) {
		let n = [...W.entries()].filter(([, e]) => e.readyAt <= Z + ne).sort(([e, t], [n, r]) => F(t.node, r.node) || e.localeCompare(n));
		if (!n.length) {
			if (W.size) {
				let e = Math.min(...[...W.values()].map((e) => e.readyAt));
				R[R.length - 1].end = e, Z = e;
				continue;
			}
			let t = o.map((e) => e.id).filter((e) => !B.has(e) && !M.has(e) && (V.get(e)?.size ?? 0) > 0);
			if (t.length) {
				e("debug", "prism.flow.join_released", {
					trace_id: a,
					node_ids: t
				});
				let n = [];
				for (let e of t) $(e, Z), Q(e, Z, R.length - 1, n);
				z.push(...n);
				continue;
			}
			let n = o.find((e) => !B.has(e.id) && !M.has(e.id));
			if (!n) break;
			re([n.id]);
			continue;
		}
		let r = [], i = [], s = [];
		for (let [e, t] of n) {
			W.delete(e);
			let n = [];
			if (t.mode === "return") r.push({
				e: t.edge,
				ret: !0
			}), i.includes(t.node) || i.push(t.node);
			else {
				if (t.mode === "resume") n = G.get(t.node) ?? [];
				else {
					let e = N(t.node), r = e.filter((e) => e.flow === "roundtrip" && !y.has(e.id));
					r.length && r.length < e.length ? (n = r, G.set(t.node, e.filter((e) => !r.includes(e)))) : n = e;
					let i = S.get(t.node);
					i && m && s.push({
						targetId: t.node,
						effect: "decision",
						at: "travel",
						edgeId: i.id,
						branch: i.id
					});
				}
				t.mode === "resume" && G.delete(t.node);
				for (let e of n) r.push({
					e,
					ret: !1
				});
				n.length && !i.includes(t.node) && i.push(t.node);
			}
		}
		if (!r.length) continue;
		let c = R.length, l = Z, u = Math.max(...r.map((e) => t(p.get(e.e.id)))), f = l + u, h = [], g = [], _ = [], v = [], b = [], x = (e) => {
			m && !s.some((t) => t.targetId === e.targetId && t.effect === e.effect) && s.push(e);
		};
		for (let { e, ret: t } of r) {
			if (J.add(e.id), t) {
				_.push(e.id);
				let t = q.get(e.id);
				t && (t.end = t.spanEnd = f), q.delete(e.id), G.has(e.from) && W.set(`c:${e.from}`, {
					readyAt: f,
					node: e.from,
					mode: "resume"
				});
				continue;
			}
			let n = e.effect;
			m && I(e.to) && n !== "kick" && X && (n = "gauge-return"), e.kind === "REGULATES" && (X = !0);
			let r = {
				targetId: e.to,
				at: "arrive",
				edgeId: e.id,
				...e.kind ? { kind: e.kind } : {}
			};
			if (y.has(e.id) || B.has(e.to)) g.push(e.id), n && x({
				...r,
				effect: n
			});
			else if (C(e)) n && x({
				...r,
				effect: n
			});
			else {
				if (e.flow === "gate") {
					if (x({
						...r,
						effect: "gate",
						closed: w(e)
					}), w(e)) continue;
				} else n && x({
					...r,
					effect: n
				});
				if (e.flow === "roundtrip") {
					let t = d(e.to), n = {
						id: e.from,
						kind: "reply",
						reason: `waiting for reply from ${t}`,
						pending: [t],
						start: f,
						end: Infinity,
						spanStart: f,
						spanEnd: Infinity,
						step: c
					};
					q.set(e.id, n), v.push(n), K.set(e.to, [...K.get(e.to) ?? [], e]);
				}
				V.set(e.to, (V.get(e.to) ?? /* @__PURE__ */ new Set()).add(e.from)), h.includes(e.to) || h.push(e.to);
			}
		}
		for (let e of h) {
			let t = P.get(e) ?? /* @__PURE__ */ new Set(), n = V.get(e), r = [...t].filter((e) => !n.has(e)).sort(F);
			if (t.size >= 2) {
				let t = U.get(e);
				if (t && (t.end = f), r.length) {
					let t = H.get(e) ?? [], n = r.map(d), i = {
						id: e,
						kind: "join",
						reason: `waiting for ${n.join(", ")}`,
						pending: n,
						start: f,
						end: Infinity,
						spanStart: t[0]?.spanStart ?? f,
						spanEnd: Infinity,
						step: c
					};
					H.set(e, [...t, i]), U.set(e, i), v.push(i);
				} else $(e, f);
			}
			(!r.length || t.size < 2) && b.push(e);
		}
		for (let e of b) Q(e, f, c, v), !N(e).length && !s.some((t) => t.targetId === e) && x({
			targetId: e,
			effect: "done",
			at: "arrive"
		});
		L.forEach((e, t) => {
			!Y.has(t) && e.edges.every((e) => J.has(e)) && (Y.add(t), x({
				targetId: e.regulator,
				effect: "loop-closed",
				at: "arrive",
				members: [...e.members]
			}));
		});
		let T = r.map(({ e, ret: t }) => t ? {
			from: e.to,
			to: e.from,
			label: void 0,
			back: !1,
			ret: !0
		} : {
			from: e.from,
			to: e.to,
			label: e.label,
			back: g.includes(e.id),
			ret: !1
		});
		R.push({
			index: c,
			start: l,
			travel: u,
			arrive: f,
			end: f + 300,
			caption: te(T, d),
			edges: r.map((e) => e.e.id),
			back: g,
			from: i,
			nodes: h,
			waits: v,
			effects: s,
			returns: _
		}), z.push(...v), Z = f + 300;
	}
	for (let e of z) Number.isFinite(e.end) || (e.end = Z), Number.isFinite(e.spanEnd) || (e.spanEnd = Z);
	let ie = h.filter((e) => !J.has(e.id)).map((e) => e.id);
	return {
		kind: "flowchart",
		steps: R,
		waits: z,
		duration: Z,
		dropped: l,
		skipped: ie,
		effects: i
	};
}
function N(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.blocks) {
		if (n.kind !== "alt" || n.sections.length < 2) continue;
		let e = [...n.sections].sort((e, t) => e.startIndex - t.startIndex);
		for (let r = e[1].startIndex; r <= n.endIndex; r++) t.add(r);
	}
	return t;
}
function P(e) {
	let t = /(?:^|\D)(\d+)\s*[x×]|[x×]\s*(\d+)/i.exec(e), n = t?.[1] ?? t?.[2];
	if (n) return `×${n}`;
	let r = O(e);
	return r ? `loop: ${r}` : "loop";
}
function F(e, n, r, i) {
	let a = /* @__PURE__ */ new Set([...e.participants.map((e) => e.id), ...e.messages.map((e) => e.id)]), { map: o, dropped: s } = A(e.waits, a, i), c = new Map(e.participants.map((e) => [e.id, O(e.label) || e.id])), l = (e) => c.get(e) ?? e, u = N(e), d = [...e.messages].sort((e, t) => e.index - t.index).filter((e) => !u.has(e.index)), f = /* @__PURE__ */ new Map();
	for (let e of n?.sequence?.messages ?? []) f.set(e.message.id, Math.abs(e.toX - e.fromX));
	let p = e.blocks.filter((e) => e.kind === "loop"), m = [], h = [], g = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Set(), v = 0;
	d.forEach((e, n) => {
		let i = v, a = e.from === e.to ? 350 : t(f.get(e.id)), s = i + a, c = [];
		if (e.kind === "reply") {
			let t = `${e.to}<-${e.from}`, n = g.get(t);
			n && (n.end = n.spanEnd = s, g.delete(t));
		}
		if (e.kind === "sync" && e.from !== e.to) {
			let t = d.slice(n + 1).find((t) => t.kind === "reply" && t.from === e.to && t.to === e.from && !_.has(t.id)), r = `${e.from}<-${e.to}`;
			if (t && !g.has(r)) {
				_.add(t.id);
				let i = l(e.to), a = {
					id: e.from,
					kind: "reply",
					reason: `waiting for reply from ${i}`,
					pending: [i],
					start: s,
					end: Infinity,
					spanStart: s,
					spanEnd: Infinity,
					step: n
				};
				g.set(r, a), c.push(a);
			}
		}
		let u = j(o.get(e.id) ?? o.get(e.to), e.to, s, n);
		u && c.push(u);
		let y = Math.max(300, u ? u.end - u.start : 0), b = p.find((t) => e.index >= t.startIndex && e.index <= t.endIndex), x = r.fxOff ? null : r.edgeEffects[e.id]?.effect ?? null, S = x ? [{
			targetId: e.to,
			effect: x,
			at: "arrive",
			edgeId: e.id
		}] : [], C = `${l(e.from)} → ${l(e.to)}${O(e.label) ? ` · ${O(e.label)}` : ""}`;
		m.push({
			index: n,
			start: i,
			travel: a,
			arrive: s,
			end: s + y,
			caption: b ? `${C} · ${P(b.label)}` : C,
			edges: [e.id],
			back: [],
			from: [e.from],
			nodes: [e.to],
			waits: c,
			effects: S,
			returns: []
		}), h.push(...c), v = s + y;
	});
	for (let e of h) Number.isFinite(e.end) || (e.end = v), Number.isFinite(e.spanEnd) || (e.spanEnd = v);
	return {
		kind: "sequence",
		steps: m,
		waits: h,
		duration: v,
		dropped: s,
		skipped: [],
		effects: r
	};
}
function I(t, n, r, i = {}) {
	let a = Date.now(), o = i.effects ?? D(t, i.vocabulary, r), s = t.kind === "flowchart" ? M(t, n, o, r) : F(t, n, o, r);
	return e("debug", "prism.flow.timeline", {
		trace_id: r,
		diagram_type: t.kind,
		step_count: s.steps.length,
		wait_count: s.waits.length,
		effect_count: s.steps.reduce((e, t) => e + t.effects.length, 0),
		skipped_count: s.skipped.length,
		duration_ms: Math.round(s.duration),
		dropped_count: s.dropped.length,
		build_ms: Date.now() - a
	}), s;
}
function L(e, t) {
	let n = e.steps;
	if (!n.length) return -1;
	let r = 0, i = n.length - 1;
	for (; r < i;) {
		let e = r + i + 1 >> 1;
		n[e].start <= t ? r = e : i = e - 1;
	}
	return r;
}
function R(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = 0; i < e.steps.length && i <= t && (i !== t || n); i++) for (let t of e.steps[i].edges) r.add(t);
	return r;
}
function z(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = 0; i < e.steps.length && i <= t; i++) {
		if (i === t && !n) {
			for (let t of e.steps[i].from) r.add(t);
			break;
		}
		for (let t of e.steps[i].nodes) r.add(t);
	}
	return r;
}
//#endregion
export { z as a, R as i, k as n, D as o, L as r, I as t };
