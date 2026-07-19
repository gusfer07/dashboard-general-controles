import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/period-filter-C3_mLgju.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var toneText = {
	success: "text-success",
	warning: "text-warning",
	danger: "text-danger",
	muted: "text-muted-foreground"
};
var toneBar = {
	success: "bg-success",
	warning: "bg-warning",
	danger: "bg-danger"
};
function KpiCards({ kpis }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6",
		children: kpis.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-surface p-5 border border-border rounded-sm shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest",
					children: k.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-baseline gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-3xl font-bold tracking-tighter",
						children: k.value
					}), k.hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold " + toneText[k.hintTone ?? "muted"],
						children: k.hint
					})]
				}),
				k.progress ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 w-full h-1 bg-secondary rounded-full overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full " + toneBar[k.progress.tone],
						style: { width: `${k.progress.value}%` }
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-muted-foreground font-mono mt-4",
					children: "ACTIVOS EN SISTEMA"
				})
			]
		}, k.label))
	});
}
var MONTHS_ES = {
	ENE: 0,
	FEB: 1,
	MAR: 2,
	ABR: 3,
	MAY: 4,
	JUN: 5,
	JUL: 6,
	AGO: 7,
	SEP: 8,
	OCT: 9,
	NOV: 10,
	DIC: 11
};
function extractPeriod(vencimiento) {
	const parts = vencimiento.split("-");
	if (parts.length === 3 && parts[0].length <= 2) return `${parts[1]} ${parts[2]}`;
	return null;
}
function sortPeriods(periods) {
	return [...periods].sort((a, b) => {
		const [mA, yA] = a.split(" ");
		const [mB, yB] = b.split(" ");
		const nA = Number(yA) * 12 + (MONTHS_ES[mA] ?? 0);
		return Number(yB) * 12 + (MONTHS_ES[mB] ?? 0) - nA;
	});
}
function PeriodFilter({ rows, activePeriod, onChange }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function handleClick(e) {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);
	const periodSet = /* @__PURE__ */ new Set();
	rows.forEach((r) => {
		if (r.vencimiento !== "N/A") {
			const p = extractPeriod(r.vencimiento);
			if (p) periodSet.add(p);
		}
	});
	const availablePeriods = sortPeriods([...periodSet]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		ref,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen(!open),
			className: "px-2 lg:px-3 py-1.5 bg-surface border border-border rounded-md text-[10px] lg:text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:lg:gap-1.5 hover:bg-secondary transition-colors",
			children: [activePeriod ?? "Período", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "size-3 opacity-60",
				fill: "none",
				viewBox: "0 0 24 24",
				stroke: "currentColor",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					strokeLinecap: "round",
					strokeLinejoin: "round",
					strokeWidth: 2,
					d: "M19 9l-7 7-7-7"
				})
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 lg:left-0 top-full mt-1 z-50 min-w-[140px] lg:min-w-[160px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					onChange(null);
					setOpen(false);
				},
				className: `w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary transition-colors ${activePeriod === null ? "bg-primary/10 font-bold" : ""}`,
				children: "Todos los períodos"
			}), availablePeriods.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					onChange(p);
					setOpen(false);
				},
				className: `w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary transition-colors ${activePeriod === p ? "bg-primary/10 font-bold" : ""}`,
				children: p
			}, p))]
		})]
	});
}
//#endregion
export { PeriodFilter as n, KpiCards as t };
