var e = 6e5, t = (e, t, n) => Math.min(n, Math.max(t, e));
function n(e) {
	return e === void 0 || !Number.isFinite(e) ? 600 : Math.round(t(600 * e / 220, 350, 900));
}
function r(e) {
	return e > 0 ? Math.round(Math.min(2500, 400 + 600 * Math.log10(1 + e / 250))) : 0;
}
function i(e, t = "de") {
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
export { n as i, r as n, i as r, e as t };
