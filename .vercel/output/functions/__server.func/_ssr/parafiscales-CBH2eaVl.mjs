import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { c as useDashboardData } from "./use-dashboard-data-Cida7o6X.mjs";
import { a as conceptosPorTab, i as TableToolbar, n as DataTable, r as SectionCard, t as AppShell } from "./data-table-U2Uz3B-J.mjs";
import { n as PeriodFilter, t as KpiCards } from "./period-filter-C3_mLgju.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parafiscales-CBH2eaVl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ParafiscalesPage() {
	const { parafiscales, clientsCount } = useDashboardData();
	const [activePeriod, setActivePeriod] = (0, import_react.useState)(null);
	const filteredRows = activePeriod ? parafiscales.filter((r) => {
		if (r.vencimiento === "N/A") return false;
		const parts = r.vencimiento.split("-");
		if (parts.length === 3 && parts[0].length <= 2) return `${parts[1]} ${parts[2]}` === activePeriod;
		return false;
	}) : parafiscales;
	const total = parafiscales.length;
	const alDia = parafiscales.filter((r) => r.estado === "Al día").length;
	const enProceso = parafiscales.filter((r) => r.estado === "En proceso" || r.estado === "Pendiente").length;
	const vencidas = parafiscales.filter((r) => r.estado === "Vencido").length;
	const alDiaPct = total > 0 ? Math.round(alDia / total * 100) : 0;
	const enProcesoPct = total > 0 ? Math.round(enProceso / total * 100) : 0;
	const vencidasPct = total > 0 ? Math.round(vencidas / total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Parafiscales",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCards, { kpis: [
			{
				label: "Enteradas",
				value: String(alDia).padStart(2, "0"),
				hint: `${alDiaPct}%`,
				hintTone: "success",
				progress: {
					value: alDiaPct,
					tone: "success"
				}
			},
			{
				label: "Pendientes",
				value: String(enProceso).padStart(2, "0"),
				hint: `${enProcesoPct}%`,
				hintTone: "warning",
				progress: {
					value: enProcesoPct,
					tone: "warning"
				}
			},
			{
				label: "Vencidas",
				value: String(vencidas).padStart(2, "0"),
				hint: `${vencidasPct}%`,
				hintTone: "danger",
				progress: {
					value: vencidasPct,
					tone: "danger"
				}
			},
			{
				label: "Total",
				value: String(total).padStart(2, "0"),
				hint: "Aportes",
				hintTone: "muted"
			}
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
			title: "Detalle por cliente",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodFilter, {
				rows: parafiscales,
				activePeriod,
				onChange: setActivePeriod
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "px-3 py-1 bg-surface border border-border rounded text-[10px] font-bold uppercase tracking-wider",
				children: "Filtros"
			})] }),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableToolbar, { chips: [...conceptosPorTab.parafiscales] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				rows: filteredRows,
				totalClientes: clientsCount
			})]
		})]
	});
}
//#endregion
export { ParafiscalesPage as component };
