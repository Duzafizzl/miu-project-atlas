import { d as e, l as t, n, t as r, u as i } from "./timeline-ys46lYsu.js";
import { t as a } from "./player-CQ6iMkSf.js";
//#region src/render3d/index.ts
var o = class extends Error {
	code;
	constructor(e, t) {
		super(t), this.code = e, this.name = "Prism3dError";
	}
}, s = null;
function c() {
	if (s !== null) return s;
	try {
		if (typeof document > "u") return s = !1;
		let e = globalThis;
		if (!e.WebGLRenderingContext && !e.WebGL2RenderingContext) return s = !1;
		let t = document.createElement("canvas"), n = t.getContext("webgl2") ?? t.getContext("webgl");
		return n ? (n.getExtension("WEBGL_lose_context")?.loseContext(), s = !0) : s = !1;
	} catch {
		return s = !1;
	}
}
function l(e, t, i, o) {
	let s = t?.kind === "flowchart" ? t : n(e), c = r(s, e, i, o === void 0 ? {} : { vocabulary: o });
	return c.steps.length >= 2 ? a(c, { traceId: i }) : null;
}
async function u(n, r, a = {}) {
	let s = a.traceId ?? e(), u = performance.now(), d = {
		trace_id: s,
		node_count: r.nodes.length,
		edge_count: r.edges.length,
		group_count: r.groups.length
	};
	i("info", "prism.render3d.start", d);
	let f = (e, n, r) => {
		throw i("error", "prism.render3d.error", {
			...d,
			error_code: e,
			duration_ms: Math.round(performance.now() - u),
			...r ? t(r) : { error_message: n }
		}), new o(e, n);
	};
	r.kind !== "flowchart" && f("UNSUPPORTED_KIND", `mermaid-prism 3D: "${r.kind}" diagrams render in 2D only`), c() || f("WEBGL_UNAVAILABLE", "mermaid-prism 3D: WebGL is not available in this browser");
	let p = null;
	try {
		p = l(r, a.model, s, a.vocabulary);
		let { createStage: e } = await import("./stage-DqGIyu7a.js"), t = e(n, r, a, s, p);
		return i("info", "prism.render3d.ok", {
			...d,
			duration_ms: Math.round(performance.now() - u),
			step_count: p?.getState().stepCount ?? 0
		}), t;
	} catch (e) {
		return p?.destroy(), f("STAGE_FAILED", e instanceof Error ? e.message : String(e), e);
	}
}
//#endregion
export { u as renderScene3d, c as supportsWebGL };
