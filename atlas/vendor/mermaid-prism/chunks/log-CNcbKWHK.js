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
//#endregion
export { t as a, i, a as n, r, n as t };
