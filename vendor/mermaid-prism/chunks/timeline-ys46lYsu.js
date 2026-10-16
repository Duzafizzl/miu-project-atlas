//#region src/core/log.ts
var e = null;
function t(t) {
	e = t;
}
function n(e = "info") {
	let t = [
		"debug",
		"info",
		"warn",
		"error"
	];
	return (n) => {
		t.indexOf(n.level) < t.indexOf(e) || (n.level === "error" ? console.error : n.level === "warn" ? console.warn : console.log)(JSON.stringify(n));
	};
}
function r(t, n, r = {}) {
	if (e) try {
		e({
			ts: (/* @__PURE__ */ new Date()).toISOString(),
			level: t,
			event: n,
			...r
		});
	} catch {}
}
function i() {
	return Math.random().toString(36).slice(2, 10);
}
function a(e) {
	return e instanceof Error ? {
		error_message: e.message,
		stack_trace: e.stack
	} : { error_message: String(e) };
}
var o = 6e5, s = (e, t, n) => Math.min(n, Math.max(t, e));
function c(e) {
	return e === void 0 || !Number.isFinite(e) ? 600 : Math.round(s(600 * e / 220, 350, 900));
}
function l(e) {
	return e > 0 ? Math.round(Math.min(2500, 400 + 600 * Math.log10(1 + e / 250))) : 0;
}
function u(e, t = "de") {
	if (!(e > 0)) return "0 s";
	if (e < 1e3) return `${Math.round(e)} ms`;
	let n = (e) => {
		let n = (Math.round(e * 10) / 10).toString();
		return t === "de" ? n.replace(".", ",") : n;
	};
	if (e < 6e4) return `${n(e / 1e3)} s`;
	let r = Math.floor(e / 6e4), i = Math.round((e - r * 6e4) / 1e3);
	return i ? `${r} min ${i} s` : `${r} min`;
}
//#endregion
//#region src/core/vocab/loops.ts
var d = /* @__PURE__ */ new Set(["SENSES", "OBSERVES"]), f = /* @__PURE__ */ new Set(["PART_OF"]);
function p(e) {
	let t = e.filter((e) => !f.has(e.kind ?? "")), n = /* @__PURE__ */ new Map();
	for (let e of t) n.set(e.from, [...n.get(e.from) ?? [], e]);
	let r = [], i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
	for (let e of t.filter((e) => e.kind === "REGULATES")) {
		let t = m(n, e.to, e.from);
		if (t) {
			let n = [e.id, ...t.map((e) => e.id)], a = [...n].sort().join("|");
			if (i.has(a)) continue;
			i.add(a);
			let o = [e.from];
			for (let n of [e, ...t]) o.includes(n.to) || o.push(n.to);
			r.push({
				kind: "closed",
				regulator: e.from,
				members: o,
				edges: n
			});
		} else {
			let t = a.get(e.from) ?? {
				members: [e.from],
				edges: []
			};
			t.members.includes(e.to) || t.members.push(e.to), t.edges.push(e.id), a.set(e.from, t);
		}
	}
	let o = [...a].map(([e, t]) => ({
		kind: "open",
		regulator: e,
		members: t.members,
		edges: t.edges
	}));
	return [...r, ...o];
}
function m(e, t, n) {
	let r = (e) => `${e.node}|${+!!e.fb}`, i = /* @__PURE__ */ new Map(), a = {
		node: t,
		fb: !1
	};
	i.set(r(a), null);
	let o = [a];
	for (; o.length;) {
		let t = o.shift();
		for (let a of e.get(t.node) ?? []) {
			let e = {
				node: a.to,
				fb: t.fb || d.has(a.kind ?? "")
			}, s = r(e);
			if (!i.has(s)) {
				if (i.set(s, {
					from: r(t),
					edge: a
				}), e.node === n && e.fb) {
					let e = [], t = s;
					for (; t;) {
						let n = i.get(t);
						if (!n) break;
						e.unshift(n.edge), t = n.from;
					}
					return e;
				}
				e.node !== n && o.push(e);
			}
		}
	}
	return null;
}
//#endregion
//#region src/core/vocab/classify.ts
var h = {
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
}, g = /* @__PURE__ */ new Map();
for (let [e, t] of Object.entries(h)) for (let n of t) g.set(n, e);
var _ = 400;
function v(e) {
	return typeof e != "string" || !e ? [] : e.slice(0, _).toLowerCase().match(/[\p{L}\p{N}]+|[✓✔✗✘]/gu) ?? [];
}
function y(e) {
	for (let t of v(e)) {
		let e = g.get(t);
		if (e) return e;
	}
	return null;
}
function b(e) {
	return (typeof e == "string" ? e : "").trim().slice(0, 64).replace(/[\s-]+/g, "_").toUpperCase();
}
//#endregion
//#region src/core/vocab/packs.ts
var x = {
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
}, S = {
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
function C(e, t) {
	return y(t);
}
var w = {
	id: "default",
	edgeKinds: x,
	nodeRoles: S,
	classify: C
}, T = {
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
}, E = {
	...S,
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
}, D = {
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
function O(e, t) {
	let n = b(t);
	return n && T[n] ? n : n && D[n] ? D[n] : C(e, t);
}
var k = {
	id: "reqvar",
	edgeKinds: {
		...x,
		...T
	},
	nodeRoles: E,
	classify: O,
	loops: !0
};
function A(e) {
	return e && typeof e == "object" && typeof e.classify == "function" && e.edgeKinds && e.nodeRoles ? e : e === "reqvar" ? k : w;
}
function j(e, t) {
	if (!t) return null;
	if (e.edgeKinds[t]) return t;
	let n = b(t);
	if (e.edgeKinds[n]) return n;
	let r = t.toLowerCase();
	return e.edgeKinds[r] ? r : null;
}
function M(e, t) {
	if (!t) return null;
	if (e.nodeRoles[t]) return t;
	let n = t.toLowerCase();
	return e.nodeRoles[n] ? n : null;
}
//#endregion
//#region src/core/vocab/resolve.ts
var N = (e, t) => `${e}\u0000${t}`;
function P(e) {
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
function F(e, t, n) {
	let i = A(t), a = e.fxOff === !0, { nodes: o, edges: s } = P(e), c = new Map(o.map((e) => [e.id, e])), l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
	for (let t of e.fx ?? []) if ("node" in t.target) {
		if (!c.has(t.target.node)) {
			r("warn", "prism.vocab.fx_dropped", {
				trace_id: n,
				error_code: "UNKNOWN_ID",
				target_id: t.target.node
			});
			continue;
		}
		l.has(t.target.node) || l.set(t.target.node, t.effect);
	} else {
		let { from: e, to: i } = t.target, a = N(e, i);
		if (!s.some((t) => t.from === e && t.to === i)) {
			r("warn", "prism.vocab.fx_dropped", {
				trace_id: n,
				error_code: "UNKNOWN_EDGE",
				from_id: e,
				to_id: i
			});
			continue;
		}
		u.has(a) || u.set(a, t.effect);
	}
	let d = {}, f = {};
	for (let e of o) {
		let t = null, o = "directive";
		if (e.kind && (t = M(i, e.kind), t || r("warn", "prism.vocab.unknown_role", {
			trace_id: n,
			pack_id: i.id,
			node_id: e.id,
			error_code: "UNKNOWN_ROLE"
		})), !t) {
			o = "class";
			for (let n of e.classes) if (t = M(i, n), t) break;
		}
		if (t) {
			let n = i.nodeRoles[t];
			d[e.id] = {
				nodeId: e.id,
				role: t,
				glyph: n.glyph,
				decoration: n.decoration,
				source: o
			};
		}
		if (a) continue;
		let s = l.get(e.id);
		s ? f[e.id] = s : t && i.nodeRoles[t].effect && (f[e.id] = i.nodeRoles[t].effect);
	}
	let m = {};
	for (let e of s) {
		let t = null;
		e.kind && (t = j(i, e.kind), t || r("warn", "prism.vocab.unknown_kind", {
			trace_id: n,
			pack_id: i.id,
			edge_id: e.id,
			error_code: "UNKNOWN_KIND"
		}));
		let o = t ? null : j(i, i.classify(e, e.label ?? "")), s = t ?? o, f = s ? i.edgeKinds[s] : void 0, p = c.get(e.to)?.shape === "diamond", h = null, g = "none", _ = u.get(N(e.from, e.to)), v = p ? void 0 : l.get(e.to), y = d[e.to]?.source === "class" ? d[e.to].role : null, b = y ? i.nodeRoles[y]?.effect : void 0;
		_ ? [h, g] = [_, "fx"] : v ? [h, g] = [v, "fx"] : t && f?.effect ? [h, g] = [f.effect, "directive"] : b && !p ? [h, g] = [b, "class"] : o && f?.effect && ([h, g] = [f.effect, "label"]), a && ([h, g] = [null, "none"]), m[e.id] = {
			edgeId: e.id,
			kind: s,
			effect: h,
			flow: f?.flow ?? "travel",
			tone: f?.tone ?? "neutral",
			source: g,
			...f?.color ? { color: f.color } : {},
			...f?.glyph ? { glyph: f.glyph } : {}
		};
	}
	let h = i.loops && e.kind === "flowchart" ? p(s.map((e) => ({
		id: e.id,
		from: e.from,
		to: e.to,
		kind: m[e.id].kind
	}))) : [];
	return r("debug", "prism.vocab.resolved", {
		trace_id: n,
		pack_id: i.id,
		fx_off: a,
		edge_count: s.length,
		kinded_edges: Object.values(m).filter((e) => e.kind).length,
		role_count: Object.keys(d).length,
		closed_loops: h.filter((e) => e.kind === "closed").length,
		open_loops: h.filter((e) => e.kind === "open").length
	}), {
		packId: i.id,
		fxOff: a,
		edgeEffects: m,
		nodeRoles: d,
		nodeEffects: f,
		loops: h
	};
}
//#endregion
//#region src/core/flow/timeline.ts
var I = (e) => e.replace(/\s+/g, " ").trim();
function ee(e) {
	let t = 0;
	for (let n = 1; n < e.length; n++) t += Math.hypot(e[n].x - e[n - 1].x, e[n].y - e[n - 1].y);
	return t;
}
function L(e, t) {
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
function R(e, t, n) {
	let i = /* @__PURE__ */ new Map(), a = [];
	for (let o of e ?? []) t.has(o.targetId) ? i.has(o.targetId) || i.set(o.targetId, o) : (a.push(o.targetId), r("warn", "prism.flow.wait_dropped", {
		trace_id: n,
		target_id: o.targetId,
		error_code: "UNKNOWN_ID"
	}));
	return {
		map: i,
		dropped: a
	};
}
function z(e, t, n, r) {
	if (!e) return null;
	let i = l(e.ms);
	return {
		id: t,
		kind: "directive",
		reason: e.reason ?? "",
		ms: e.ms,
		start: n,
		end: n + i,
		spanStart: n,
		spanEnd: n + i,
		step: r
	};
}
function te(e, t) {
	if (e.length === 1) {
		let n = e[0];
		return `${t(n.from)} → ${t(n.to)}${n.label ? ` (${I(n.label)})` : ""}${n.back ? " ↺" : ""}${n.ret ? " ↩" : ""}`;
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
function B(e, t, n, i) {
	let a = e.nodes, o = new Set(a.map((e) => e.id)), { map: s, dropped: l } = R(e.waits, o, i);
	if (!a.length) return {
		kind: "flowchart",
		steps: [],
		waits: [],
		duration: 0,
		dropped: l,
		skipped: [],
		effects: n
	};
	let u = new Map(a.map((e) => [e.id, I(e.label) || e.id])), d = (e) => u.get(e) ?? e, f = new Map(a.map((e, t) => [e.id, t]));
	new Map(a.map((e) => [e.id, e.shape]));
	let p = /* @__PURE__ */ new Map();
	for (let e of t?.edges ?? []) p.set(e.edge.id, ee(e.points));
	let m = !n.fxOff, h = e.edges.filter((e) => e.stroke !== "invisible" && o.has(e.from) && o.has(e.to)).map((e) => {
		let t = n.edgeEffects[e.id], r = {
			label: e.label,
			flow: t?.flow ?? "travel",
			effect: t?.effect ?? null,
			kind: t?.kind ?? null
		};
		return e.arrowStart && !e.arrowEnd ? {
			id: e.id,
			from: e.to,
			to: e.from,
			...r
		} : {
			id: e.id,
			from: e.from,
			to: e.to,
			...r
		};
	}).filter((e) => e.flow !== "none"), g = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map();
	for (let e of h) g.set(e.from, [...g.get(e.from) ?? [], e]), _.set(e.to, (_.get(e.to) ?? 0) + 1);
	let v = a.filter((e) => !_.get(e.id)).map((e) => e.id);
	v.length || (v = [a[0].id]);
	let y = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Map();
	for (let e of [...v, ...a.map((e) => e.id)]) {
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
	for (let e of a) {
		let t = g.get(e.id) ?? [];
		if (e.shape !== "diamond" || t.length < 2) continue;
		let r = n.nodeEffects[e.id], i = r && t.find((e) => e.effect === r) || t[0];
		S.set(e.id, i);
		for (let e of t) e !== i && x.add(e.id);
	}
	let C = (e) => e.flow === "bounce" || e.flow === "park", w = (e) => e.flow === "gate" && e.effect === "no", T = (e) => !x.has(e.id) && !C(e) && !w(e), E = (e) => {
		let t = new Set(v), n = [...v];
		for (; n.length;) for (let r of g.get(n.shift()) ?? []) e(r) && !t.has(r.to) && (t.add(r.to), n.push(r.to));
		return t;
	}, D = E(() => !0), O = E(T), k = new Set([...D].filter((e) => !O.has(e))), A = (e) => (g.get(e) ?? []).filter((e) => !x.has(e.id)), j = /* @__PURE__ */ new Map();
	for (let e of h) !y.has(e.id) && T(e) && !k.has(e.from) && j.set(e.to, (j.get(e.to) ?? /* @__PURE__ */ new Set()).add(e.from));
	let M = (e, t) => f.get(e) - f.get(t), N = (e) => n.nodeRoles[e]?.role === "essential", P = n.loops.filter((e) => e.kind === "closed"), F = [], L = [], B = /* @__PURE__ */ new Set(), V = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Set(), Y = /* @__PURE__ */ new Set(), X = !1, Z = 0, Q = (e, t, n, r) => {
		B.add(e);
		let i = z(s.get(e), e, t, n);
		i && (A(e).some((e) => e.effect === "timeout") && (i.timeout = !0), r.push(i));
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
		let t = F.length, n = [];
		for (let r of e) Q(r, Z, t, n);
		F.push({
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
		}), L.push(...n), Z += 600;
	};
	re(v);
	for (let e = 0; e < (a.length + h.length) * 4 + 16; e++) {
		let e = [...W.entries()].filter(([, e]) => e.readyAt <= Z + ne).sort(([e, t], [n, r]) => M(t.node, r.node) || e.localeCompare(n));
		if (!e.length) {
			if (W.size) {
				let e = Math.min(...[...W.values()].map((e) => e.readyAt));
				F[F.length - 1].end = e, Z = e;
				continue;
			}
			let e = a.map((e) => e.id).filter((e) => !B.has(e) && !k.has(e) && (V.get(e)?.size ?? 0) > 0);
			if (e.length) {
				r("debug", "prism.flow.join_released", {
					trace_id: i,
					node_ids: e
				});
				let t = [];
				for (let n of e) $(n, Z), Q(n, Z, F.length - 1, t);
				L.push(...t);
				continue;
			}
			let t = a.find((e) => !B.has(e.id) && !k.has(e.id));
			if (!t) break;
			re([t.id]);
			continue;
		}
		let t = [], n = [], o = [];
		for (let [r, i] of e) {
			W.delete(r);
			let e = [];
			if (i.mode === "return") t.push({
				e: i.edge,
				ret: !0
			}), n.includes(i.node) || n.push(i.node);
			else {
				if (i.mode === "resume") e = G.get(i.node) ?? [];
				else {
					let t = A(i.node), n = t.filter((e) => e.flow === "roundtrip" && !y.has(e.id));
					n.length && n.length < t.length ? (e = n, G.set(i.node, t.filter((e) => !n.includes(e)))) : e = t;
					let r = S.get(i.node);
					r && m && o.push({
						targetId: i.node,
						effect: "decision",
						at: "travel",
						edgeId: r.id,
						branch: r.id
					});
				}
				i.mode === "resume" && G.delete(i.node);
				for (let n of e) t.push({
					e: n,
					ret: !1
				});
				e.length && !n.includes(i.node) && n.push(i.node);
			}
		}
		if (!t.length) continue;
		let s = F.length, l = Z, u = Math.max(...t.map((e) => c(p.get(e.e.id)))), f = l + u, h = [], g = [], _ = [], v = [], b = [], x = (e) => {
			m && !o.some((t) => t.targetId === e.targetId && t.effect === e.effect) && o.push(e);
		};
		for (let { e, ret: n } of t) {
			if (J.add(e.id), n) {
				_.push(e.id);
				let t = q.get(e.id);
				t && (t.end = t.spanEnd = f), q.delete(e.id), G.has(e.from) && W.set(`c:${e.from}`, {
					readyAt: f,
					node: e.from,
					mode: "resume"
				});
				continue;
			}
			let t = e.effect;
			m && N(e.to) && t !== "kick" && X && (t = "gauge-return"), e.kind === "REGULATES" && (X = !0);
			let r = {
				targetId: e.to,
				at: "arrive",
				edgeId: e.id,
				...e.kind ? { kind: e.kind } : {}
			};
			if (y.has(e.id) || B.has(e.to)) g.push(e.id), t && x({
				...r,
				effect: t
			});
			else if (C(e)) t && x({
				...r,
				effect: t
			});
			else {
				if (e.flow === "gate") {
					if (x({
						...r,
						effect: "gate",
						closed: w(e)
					}), w(e)) continue;
				} else t && x({
					...r,
					effect: t
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
						step: s
					};
					q.set(e.id, n), v.push(n), K.set(e.to, [...K.get(e.to) ?? [], e]);
				}
				V.set(e.to, (V.get(e.to) ?? /* @__PURE__ */ new Set()).add(e.from)), h.includes(e.to) || h.push(e.to);
			}
		}
		for (let e of h) {
			let t = j.get(e) ?? /* @__PURE__ */ new Set(), n = V.get(e), r = [...t].filter((e) => !n.has(e)).sort(M);
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
						step: s
					};
					H.set(e, [...t, i]), U.set(e, i), v.push(i);
				} else $(e, f);
			}
			(!r.length || t.size < 2) && b.push(e);
		}
		for (let e of b) Q(e, f, s, v), !A(e).length && !o.some((t) => t.targetId === e) && x({
			targetId: e,
			effect: "done",
			at: "arrive"
		});
		P.forEach((e, t) => {
			!Y.has(t) && e.edges.every((e) => J.has(e)) && (Y.add(t), x({
				targetId: e.regulator,
				effect: "loop-closed",
				at: "arrive",
				members: [...e.members]
			}));
		});
		let T = t.map(({ e, ret: t }) => t ? {
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
		F.push({
			index: s,
			start: l,
			travel: u,
			arrive: f,
			end: f + 300,
			caption: te(T, d),
			edges: t.map((e) => e.e.id),
			back: g,
			from: n,
			nodes: h,
			waits: v,
			effects: o,
			returns: _
		}), L.push(...v), Z = f + 300;
	}
	for (let e of L) Number.isFinite(e.end) || (e.end = Z), Number.isFinite(e.spanEnd) || (e.spanEnd = Z);
	let ie = h.filter((e) => !J.has(e.id)).map((e) => e.id);
	return {
		kind: "flowchart",
		steps: F,
		waits: L,
		duration: Z,
		dropped: l,
		skipped: ie,
		effects: n
	};
}
function V(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.blocks) {
		if (n.kind !== "alt" || n.sections.length < 2) continue;
		let e = [...n.sections].sort((e, t) => e.startIndex - t.startIndex);
		for (let r = e[1].startIndex; r <= n.endIndex; r++) t.add(r);
	}
	return t;
}
function H(e) {
	let t = /(?:^|\D)(\d+)\s*[x×]|[x×]\s*(\d+)/i.exec(e), n = t?.[1] ?? t?.[2];
	if (n) return `×${n}`;
	let r = I(e);
	return r ? `loop: ${r}` : "loop";
}
function U(e, t, n, r) {
	let i = /* @__PURE__ */ new Set([...e.participants.map((e) => e.id), ...e.messages.map((e) => e.id)]), { map: a, dropped: o } = R(e.waits, i, r), s = new Map(e.participants.map((e) => [e.id, I(e.label) || e.id])), l = (e) => s.get(e) ?? e, u = V(e), d = [...e.messages].sort((e, t) => e.index - t.index).filter((e) => !u.has(e.index)), f = /* @__PURE__ */ new Map();
	for (let e of t?.sequence?.messages ?? []) f.set(e.message.id, Math.abs(e.toX - e.fromX));
	let p = e.blocks.filter((e) => e.kind === "loop"), m = [], h = [], g = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Set(), v = 0;
	d.forEach((e, t) => {
		let r = v, i = e.from === e.to ? 350 : c(f.get(e.id)), o = r + i, s = [];
		if (e.kind === "reply") {
			let t = `${e.to}<-${e.from}`, n = g.get(t);
			n && (n.end = n.spanEnd = o, g.delete(t));
		}
		if (e.kind === "sync" && e.from !== e.to) {
			let n = d.slice(t + 1).find((t) => t.kind === "reply" && t.from === e.to && t.to === e.from && !_.has(t.id)), r = `${e.from}<-${e.to}`;
			if (n && !g.has(r)) {
				_.add(n.id);
				let i = l(e.to), a = {
					id: e.from,
					kind: "reply",
					reason: `waiting for reply from ${i}`,
					pending: [i],
					start: o,
					end: Infinity,
					spanStart: o,
					spanEnd: Infinity,
					step: t
				};
				g.set(r, a), s.push(a);
			}
		}
		let u = z(a.get(e.id) ?? a.get(e.to), e.to, o, t);
		u && s.push(u);
		let y = Math.max(300, u ? u.end - u.start : 0), b = p.find((t) => e.index >= t.startIndex && e.index <= t.endIndex), x = n.fxOff ? null : n.edgeEffects[e.id]?.effect ?? null, S = x ? [{
			targetId: e.to,
			effect: x,
			at: "arrive",
			edgeId: e.id
		}] : [], C = `${l(e.from)} → ${l(e.to)}${I(e.label) ? ` · ${I(e.label)}` : ""}`;
		m.push({
			index: t,
			start: r,
			travel: i,
			arrive: o,
			end: o + y,
			caption: b ? `${C} · ${H(b.label)}` : C,
			edges: [e.id],
			back: [],
			from: [e.from],
			nodes: [e.to],
			waits: s,
			effects: S,
			returns: []
		}), h.push(...s), v = o + y;
	});
	for (let e of h) Number.isFinite(e.end) || (e.end = v), Number.isFinite(e.spanEnd) || (e.spanEnd = v);
	return {
		kind: "sequence",
		steps: m,
		waits: h,
		duration: v,
		dropped: o,
		skipped: [],
		effects: n
	};
}
function W(e, t, n, i = {}) {
	let a = Date.now(), o = i.effects ?? F(e, i.vocabulary, n), s = e.kind === "flowchart" ? B(e, t, o, n) : U(e, t, o, n);
	return r("debug", "prism.flow.timeline", {
		trace_id: n,
		diagram_type: e.kind,
		step_count: s.steps.length,
		wait_count: s.waits.length,
		effect_count: s.steps.reduce((e, t) => e + t.effects.length, 0),
		skipped_count: s.skipped.length,
		duration_ms: Math.round(s.duration),
		dropped_count: s.dropped.length,
		build_ms: Date.now() - a
	}), s;
}
function G(e, t) {
	let n = e.steps;
	if (!n.length) return -1;
	let r = 0, i = n.length - 1;
	for (; r < i;) {
		let e = r + i + 1 >> 1;
		n[e].start <= t ? r = e : i = e - 1;
	}
	return r;
}
function K(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = 0; i < e.steps.length && i <= t && (i !== t || n); i++) for (let t of e.steps[i].edges) r.add(t);
	return r;
}
function q(e, t, n) {
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
export { q as a, n as c, i as d, t as f, K as i, a as l, L as n, o, G as r, u as s, W as t, r as u };
