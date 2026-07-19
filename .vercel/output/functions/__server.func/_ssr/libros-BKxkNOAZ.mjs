import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { c as useDashboardData } from "./use-dashboard-data-Cida7o6X.mjs";
import { a as conceptosPorTab, i as TableToolbar, n as DataTable, r as SectionCard, t as AppShell } from "./data-table-U2Uz3B-J.mjs";
import { n as PeriodFilter, t as KpiCards } from "./period-filter-C3_mLgju.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/libros-BKxkNOAZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LibrosPage() {
	const { libros, clientsCount } = useDashboardData();
	const [activePeriod, setActivePeriod] = (0, import_react.useState)(null);
	const filteredRows = activePeriod ? libros.filter((r) => {
		if (r.vencimiento === "N/A") return false;
		const parts = r.vencimiento.split("-");
		if (parts.length === 3 && parts[0].length <= 2) return `${parts[1]} ${parts[2]}` === activePeriod;
		return false;
	}) : libros;
	const total = libros.length;
	const alDia = libros.filter((r) => r.estado === "Al día").length;
	const enActualizacion = libros.filter((r) => r.estado === "En proceso" || r.estado === "Pendiente").length;
	const conRetraso = libros.filter((r) => r.estado === "Vencido").length;
	const alDiaPct = total > 0 ? Math.round(alDia / total * 100) : 0;
	const enActualizacionPct = total > 0 ? Math.round(enActualizacion / total * 100) : 0;
	const conRetrasoPct = total > 0 ? Math.round(conRetraso / total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Libros Legales",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCards, { kpis: [
			{
				label: "Al día",
				value: String(alDia).padStart(2, "0"),
				hint: `${alDiaPct}%`,
				hintTone: "success",
				progress: {
					value: alDiaPct,
					tone: "success"
				}
			},
			{
				label: "En actualización",
				value: String(enActualizacion).padStart(2, "0"),
				hint: `${enActualizacionPct}%`,
				hintTone: "warning",
				progress: {
					value: enActualizacionPct,
					tone: "warning"
				}
			},
			{
				label: "Con retraso",
				value: String(conRetraso).padStart(2, "0"),
				hint: `${conRetrasoPct}%`,
				hintTone: "danger",
				progress: {
					value: conRetrasoPct,
					tone: "danger"
				}
			},
			{
				label: "Total",
				value: String(total).padStart(2, "0"),
				hint: "Libros",
				hintTone: "muted"
			}
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
			title: "Detalle por cliente",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodFilter, {
				rows: libros,
				activePeriod,
				onChange: setActivePeriod
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "px-3 py-1 bg-surface border border-border rounded text-[10px] font-bold uppercase tracking-wider",
				children: "Filtros"
			})] }),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableToolbar, { chips: [...conceptosPorTab.libros] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				rows: filteredRows,
				totalClientes: clientsCount
			})]
		})]
	});
}
//#endregion
export { LibrosPage as component };
