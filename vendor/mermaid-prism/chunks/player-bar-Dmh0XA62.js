import { s as e, u as t } from "./timeline-ys46lYsu.js";
//#region src/ui/player-bar.ts
var n = {
	de: {
		step: "Schritt {i} / {n}",
		play: "Abspielen",
		pause: "Pausieren",
		next: "Nächster Schritt",
		prev: "Vorheriger Schritt",
		reset: "Zum Anfang",
		speed: "Tempo",
		timeline: "Zeitleiste",
		group: "Ablauf abspielen",
		waiting: "wartet",
		waitingFor: "wartet auf",
		replyFrom: "wartet auf Antwort von"
	},
	en: {
		step: "Step {i} / {n}",
		play: "Play",
		pause: "Pause",
		next: "Next step",
		prev: "Previous step",
		reset: "Back to start",
		speed: "Speed",
		timeline: "Timeline",
		group: "Flow playback",
		waiting: "waiting",
		waitingFor: "waiting for",
		replyFrom: "waiting for reply from"
	}
};
function r(e = "en", t) {
	return {
		...n[e] ?? n.en,
		...t
	};
}
function i(e, t, n) {
	return e.step.replace("{i}", String(Math.max(0, t) + 1)).replace("{n}", String(n));
}
function a(t, n, r = "en") {
	if (t.kind === "join") return `${n.waitingFor} ${(t.pending ?? []).join(", ")}`;
	if (t.kind === "reply") return `${n.replyFrom} ${(t.pending ?? []).join(", ")}`;
	let i = [n.waiting];
	return t.ms && i.push(e(t.ms, r)), t.reason && i.push(t.reason), i.join(" · ");
}
var o = "http://www.w3.org/2000/svg", s = {
	reset: [[
		"rect",
		2.5,
		3,
		2,
		10
	], ["path", "M13.5 3.6v8.8a.6.6 0 0 1-.92.5L6.3 8.5a.6.6 0 0 1 0-1l6.28-4.4a.6.6 0 0 1 .92.5z"]],
	prev: [["path", "M11.5 3.6v8.8a.6.6 0 0 1-.92.5L4.3 8.5a.6.6 0 0 1 0-1l6.28-4.4a.6.6 0 0 1 .92.5z"]],
	play: [["path", "M4.5 2.9v10.2a.7.7 0 0 0 1.06.6l8.3-5.1a.7.7 0 0 0 0-1.2l-8.3-5.1a.7.7 0 0 0-1.06.6z"]],
	pause: [[
		"rect",
		3.5,
		2.5,
		3.2,
		11
	], [
		"rect",
		9.3,
		2.5,
		3.2,
		11
	]],
	next: [["path", "M2.5 3.6v8.8a.6.6 0 0 0 .92.5L9.7 8.5a.6.6 0 0 0 0-1L3.42 3.1a.6.6 0 0 0-.92.5z"], [
		"rect",
		11.5,
		3,
		2,
		10
	]]
};
function c(e) {
	let t = document.createElementNS(o, "svg");
	t.setAttribute("viewBox", "0 0 16 16"), t.setAttribute("aria-hidden", "true"), t.setAttribute("focusable", "false");
	for (let n of s[e]) {
		let e = document.createElementNS(o, n[0]);
		n[0] === "path" ? e.setAttribute("d", n[1]) : (e.setAttribute("x", String(n[1])), e.setAttribute("y", String(n[2])), e.setAttribute("width", String(n[3])), e.setAttribute("height", String(n[4])), e.setAttribute("rx", "1")), t.appendChild(e);
	}
	return t;
}
function l(e) {
	let t = e.waits.filter((e) => e.end > e.start).map((e) => [e.start, e.end]).sort((e, t) => e[0] - t[0]), n = [];
	for (let [e, r] of t) {
		let t = n[n.length - 1];
		t && e <= t[1] ? t[1] = Math.max(t[1], r) : n.push([e, r]);
	}
	return n;
}
var u = {
	1: .5,
	2: 1,
	3: 2
};
function d(e, n, a = {}) {
	let o = a.locale ?? "en", s = r(o, a.strings), d = a.timeline ?? n.timeline, f = a.keyTarget ?? e, p = document.createElement("div");
	p.className = "prism-player", p.setAttribute("role", "group"), p.setAttribute("aria-label", s.group), p.dataset.scheme = a.scheme ?? "dark", a.accent && p.style.setProperty("--pp-accent", a.accent);
	let m = document.createElement("div");
	m.className = "prism-player-row";
	let h = (e, t, n, r) => {
		let i = document.createElement("button");
		return i.type = "button", i.className = "prism-player-btn", i.dataset.role = e, i.setAttribute("aria-label", t), i.title = t, i.appendChild(c(n)), i.addEventListener("click", r), i;
	}, g = h("reset", s.reset, "reset", () => n.reset()), _ = h("prev", s.prev, "prev", () => n.prev()), v = h("toggle", s.play, "play", () => n.toggle()), y = h("next", s.next, "next", () => n.next()), b = document.createElement("div");
	b.className = "prism-player-caption", b.setAttribute("aria-live", "polite"), b.setAttribute("aria-atomic", "true");
	let x = document.createElement("span");
	x.className = "prism-player-count";
	let S = document.createElement("span");
	b.append(x, S);
	let C = document.createElement("div");
	C.className = "prism-player-speed", C.setAttribute("role", "group"), C.setAttribute("aria-label", s.speed);
	let w = [
		.5,
		1,
		2
	].map((e) => {
		let t = document.createElement("button");
		return t.type = "button", t.dataset.speed = String(e), t.textContent = `${o === "de" ? String(e).replace(".", ",") : String(e)}×`, t.setAttribute("aria-label", `${s.speed} ${t.textContent}`), t.addEventListener("click", () => n.setSpeed(e)), C.appendChild(t), t;
	});
	m.append(g, _, v, y, b, C);
	let T = document.createElement("div");
	T.className = "prism-player-track", T.tabIndex = 0, T.setAttribute("role", "slider"), T.setAttribute("aria-label", s.timeline), T.setAttribute("aria-valuemin", "1");
	let E = document.createElement("div");
	E.className = "prism-player-rail", T.appendChild(E);
	let D = Math.max(1, d?.duration ?? n.getState().duration);
	if (d) {
		for (let [e, t] of l(d)) {
			let n = document.createElement("div");
			n.className = "prism-player-wait", n.style.left = `${e / D * 100}%`, n.style.width = `${Math.max(.4, (t - e) / D * 100)}%`, T.appendChild(n);
		}
		let e = d.steps, t = Math.max(1, Math.ceil(e.length / 60));
		for (let n = 1; n < e.length; n += t) {
			let t = document.createElement("div");
			t.className = "prism-player-tick", t.style.left = `${e[n].start / D * 100}%`, T.appendChild(t);
		}
	}
	let O = document.createElement("div");
	O.className = "prism-player-fill";
	let k = document.createElement("div");
	k.className = "prism-player-thumb", T.append(O, k), p.append(m, T), e.appendChild(p);
	let A = -2, j = "", M = null, N = (e) => {
		(e.step !== A || e.caption !== j) && (x.textContent = i(s, e.step, e.stepCount), S.textContent = e.caption ? ` · ${e.caption}` : "", T.setAttribute("aria-valuemax", String(Math.max(1, e.stepCount))), T.setAttribute("aria-valuenow", String(Math.max(1, e.step + 1))), T.setAttribute("aria-valuetext", `${x.textContent}${S.textContent}`), A = e.step, j = e.caption), e.playing !== M && (v.replaceChildren(c(e.playing ? "pause" : "play")), v.setAttribute("aria-label", e.playing ? s.pause : s.play), v.title = e.playing ? s.pause : s.play, M = e.playing), _.disabled = e.step <= 0, y.disabled = e.step >= e.stepCount - 1;
		for (let t of w) t.setAttribute("aria-pressed", String(Number(t.dataset.speed) === e.speed));
		let t = Math.min(100, Math.max(0, e.t / D * 100));
		O.style.width = `${t}%`, k.style.left = `${t}%`;
	}, P = n.subscribe(N);
	N(n.getState());
	let F = null, I = (e) => {
		let t = T.getBoundingClientRect();
		t.width && n.seek(Math.min(1, Math.max(0, (e - t.left) / t.width)) * D);
	}, L = (e) => {
		e.button === 0 && (F = {
			wasPlaying: n.getState().playing,
			id: e.pointerId
		}, n.pause(), T.setPointerCapture?.(e.pointerId), T.dataset.dragging = "", I(e.clientX), e.preventDefault());
	}, R = (e) => {
		F && e.pointerId === F.id && I(e.clientX);
	}, z = (e) => {
		if (!F || e.pointerId !== F.id) return;
		let t = F.wasPlaying;
		F = null, delete T.dataset.dragging, T.releasePointerCapture?.(e.pointerId), t && n.play();
	}, B = (e) => {
		let t = e.key;
		if (t === "ArrowRight" || t === "ArrowUp") n.next();
		else if (t === "ArrowLeft" || t === "ArrowDown") n.prev();
		else if (t === "Home") n.reset();
		else if (t === "End") n.seekStep(n.getState().stepCount - 1);
		else return;
		e.preventDefault();
	};
	T.addEventListener("pointerdown", L), T.addEventListener("pointermove", R), T.addEventListener("pointerup", z), T.addEventListener("pointercancel", z), T.addEventListener("keydown", B);
	let V = (e) => {
		if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return;
		let t = e.target instanceof Element ? e.target : null;
		if (t?.closest("input, textarea, select, [contenteditable=\"\"], [contenteditable=\"true\"]")) return;
		let r = e.key;
		if (r === " " || r === "Spacebar") {
			if (t?.closest("button")) return;
			n.toggle();
		} else if (r === "ArrowRight") n.next();
		else if (r === "ArrowLeft") n.prev();
		else if (r === "Home") n.reset();
		else if (r in u) n.setSpeed(u[r]);
		else return;
		e.preventDefault();
	};
	f.addEventListener("keydown", V), t("debug", "prism.player_bar.mount", {
		trace_id: a.traceId,
		step_count: n.getState().stepCount,
		locale: o
	});
	let H = !1;
	return {
		el: p,
		setScheme(e) {
			p.dataset.scheme = e;
		},
		setAccent(e) {
			p.style.setProperty("--pp-accent", e);
		},
		destroy() {
			H || (H = !0, P(), f.removeEventListener("keydown", V), T.removeEventListener("pointerdown", L), T.removeEventListener("pointermove", R), T.removeEventListener("pointerup", z), T.removeEventListener("pointercancel", z), T.removeEventListener("keydown", B), p.remove());
		}
	};
}
//#endregion
export { r as n, a as r, d as t };
