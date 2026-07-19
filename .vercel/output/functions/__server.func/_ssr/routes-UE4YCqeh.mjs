import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { c as useDashboardData } from "./use-dashboard-data-Cida7o6X.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as conceptosPorTab, i as TableToolbar, n as DataTable, r as SectionCard, t as AppShell } from "./data-table-U2Uz3B-J.mjs";
import { n as PeriodFilter, t as KpiCards } from "./period-filter-C3_mLgju.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-UE4YCqeh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Index() {
	const { tributarias, parafiscales, libros, kpis, allRows, clientsCount } = useDashboardData();
	const [showFilters, setShowFilters] = (0, import_react.useState)(false);
	const [activeFilter, setActiveFilter] = (0, import_react.useState)(null);
	const [activePeriod, setActivePeriod] = (0, import_react.useState)(null);
	const baseAlertas = allRows.filter((r) => r.estado === "Vencido" || r.estado === "Pendiente");
	const conceptFiltered = activeFilter ? baseAlertas.filter((r) => r.concepto === activeFilter) : baseAlertas;
	const alertas = activePeriod ? conceptFiltered.filter((r) => {
		if (r.vencimiento === "N/A") return false;
		const parts = r.vencimiento.split("-");
		if (parts.length === 3 && parts[0].length <= 2) return `${parts[1]} ${parts[2]}` === activePeriod;
		return false;
	}) : conceptFiltered;
	const tribPendientes = tributarias.filter((r) => r.estado === "Vencido" || r.estado === "Pendiente" || r.estado === "En proceso").length;
	const paraPendientes = parafiscales.filter((r) => r.estado === "Vencido" || r.estado === "Pendiente" || r.estado === "En proceso").length;
	const libroPendientes = libros.filter((r) => r.estado === "Vencido" || r.estado === "Pendiente" || r.estado === "En proceso").length;
	const tribVencidas = tributarias.filter((r) => r.estado === "Vencido").length;
	const paraVencidas = parafiscales.filter((r) => r.estado === "Vencido").length;
	const libroVencidas = libros.filter((r) => r.estado === "Vencido").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Dashboard General",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCards, { kpis }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [
					{
						to: "/tributarias",
						title: "Obligaciones Tributarias",
						desc: "IVA SPE, IVA SPO, DPP, RET ISLR, Alcaldía",
						stat: String(tributarias.length),
						pill: tribVencidas > 0 ? `${tribVencidas} vencidas` : tribPendientes > 0 ? `${tribPendientes} pendientes` : "Al día",
						tone: tribVencidas > 0 ? "text-danger" : tribPendientes > 0 ? "text-warning" : "text-success",
						disabled: false
					},
					{
						to: "/parafiscales",
						title: "Parafiscales",
						desc: "FAOV, IVSS, INCES, FONACIT SPE, FONACIT SPO, RUPDAE",
						stat: String(parafiscales.length),
						pill: paraVencidas > 0 ? `${paraVencidas} vencidas` : paraPendientes > 0 ? `${paraPendientes} pendientes` : "Al día",
						tone: paraVencidas > 0 ? "text-danger" : paraPendientes > 0 ? "text-warning" : "text-success",
						disabled: true
					},
					{
						to: "/libros",
						title: "Libros Legales",
						desc: "Actas, Accionistas, Inventario, Mayor, Diario",
						stat: String(libros.length),
						pill: libroVencidas > 0 ? `${libroVencidas} vencidas` : libroPendientes > 0 ? `${libroPendientes} pendientes` : "Al día",
						tone: libroVencidas > 0 ? "text-danger" : libroPendientes > 0 ? "text-warning" : "text-success",
						disabled: true
					}
				].map((m) => m.disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface border border-border rounded-sm p-5 opacity-40 cursor-not-allowed select-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest h-[14px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-1 text-base font-bold tracking-tight",
								children: m.title
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-3xl font-bold tracking-tighter",
								children: m.stat
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground leading-relaxed",
							children: m.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex items-center justify-between border-t border-border pt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider " + m.tone,
								children: m.pill
							})
						})
					]
				}, m.to) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: m.to,
					className: "bg-surface border border-border rounded-sm p-5 hover:border-primary/40 hover:shadow-sm transition-all group",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest h-[14px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-1 text-base font-bold tracking-tight",
								children: m.title
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-3xl font-bold tracking-tighter",
								children: m.stat
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground leading-relaxed",
							children: m.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center justify-between border-t border-border pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider " + m.tone,
								children: m.pill
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-muted-foreground group-hover:text-primary transition-colors",
								children: "ABRIR →"
							})]
						})
					]
				}, m.to))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
				title: "Alertas",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodFilter, {
					rows: conceptFiltered,
					activePeriod,
					onChange: setActivePeriod
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowFilters(!showFilters),
					className: `px-2 lg:px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-surface border-border hover:bg-secondary"}`,
					children: "Filtros"
				})] }),
				children: [showFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableToolbar, {
					chips: [...conceptosPorTab.tributarias],
					activeChip: activeFilter,
					onChipClick: setActiveFilter
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					rows: alertas,
					totalClientes: clientsCount
				})]
			})
		]
	});
}
//#endregion
export { Index as component };
