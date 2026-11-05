import { n as e, r as t } from "./log-CNcbKWHK.js";
import { r as n } from "./timeline-Dg5AkARd.js";
//#region src/core/flow/player.ts
var r = [
	.5,
	1,
	2
], i = (e) => e < 0 ? 0 : e > 1 ? 1 : e;
function a(e, t, r = !1, a = 1) {
	let o = n(e, t), s = [];
	for (let n of e.waits) {
		if (n.end <= n.start || t < n.start || t >= n.end) continue;
		let e = n.spanEnd - n.spanStart;
		s.push({
			id: n.id,
			reason: n.reason,
			progress: e > 0 ? i((t - n.spanStart) / e) : 1,
			kind: n.kind,
			...n.ms === void 0 ? {} : { ms: n.ms },
			...n.pending ? { pending: [...n.pending] } : {}
		});
	}
	return {
		step: o,
		stepCount: e.steps.length,
		t,
		duration: e.duration,
		playing: r,
		speed: a,
		caption: o >= 0 ? e.steps[o].caption : "",
		waiting: s
	};
}
function o(i, o = {}) {
	let s = o.now ?? (() => performance.now()), c = o.raf ?? ((e) => requestAnimationFrame(e)), l = o.caf ?? ((e) => cancelAnimationFrame(e)), u = i.steps, d = /* @__PURE__ */ new Set(), f = u[0]?.arrive ?? 0, p = !1, m = 1, h = f, g = 0, _ = 0, v = !1, y = () => p ? Math.min(i.duration, h + (s() - g) * m) : f, b = () => a(i, y(), p, m), x = () => {
		let n = b();
		for (let r of [...d]) try {
			r(n);
		} catch (n) {
			t("warn", "prism.flow.listener_error", {
				trace_id: o.traceId,
				...e(n)
			});
		}
	}, S = () => {
		_ && l(_), _ = 0;
	}, C = () => {
		_ = 0, p && !v && (f = y(), f >= i.duration ? (f = i.duration, p = !1, t("debug", "prism.flow.ended", {
			trace_id: o.traceId,
			step_count: u.length
		}), x()) : (x(), _ = c(C)));
	}, w = () => {
		p && (f = y(), p = !1, S());
	}, T = (e) => {
		if (v || !u.length) return;
		w();
		let t = Math.max(0, Math.min(u.length - 1, Math.floor(Number.isFinite(e) ? e : 0)));
		f = u[t].arrive, x();
	}, E = () => n(i, y()), D = {
		timeline: i,
		play() {
			v || p || !u.length || (f >= i.duration && (f = 0), p = !0, h = f, g = s(), t("debug", "prism.flow.play", {
				trace_id: o.traceId,
				step: E(),
				speed: m
			}), x(), _ = c(C));
		},
		pause() {
			!v && p && (w(), t("debug", "prism.flow.pause", {
				trace_id: o.traceId,
				step: E()
			}), x());
		},
		toggle() {
			p ? D.pause() : D.play();
		},
		next() {
			T(E() + 1);
		},
		prev() {
			T(E() - 1);
		},
		seekStep: T,
		seek(e) {
			if (v || !u.length) return;
			let t = Math.max(0, Math.min(i.duration, Number.isFinite(e) ? e : 0));
			p && (h = t, g = s()), f = t, x();
		},
		setSpeed(e) {
			if (v || !Number.isFinite(e)) return;
			let n = r.reduce((t, n) => Math.abs(n - e) < Math.abs(t - e) ? n : t, r[1]);
			n !== m && (p && (h = y(), g = s()), m = n, t("debug", "prism.flow.speed", {
				trace_id: o.traceId,
				speed: m
			}), x());
		},
		reset() {
			T(0);
		},
		getState: b,
		subscribe(e) {
			return v ? () => {} : (d.add(e), () => {
				d.delete(e);
			});
		},
		destroy() {
			v || (v = !0, p = !1, S(), d.clear());
		}
	};
	return D;
}
//#endregion
export { o as t };
