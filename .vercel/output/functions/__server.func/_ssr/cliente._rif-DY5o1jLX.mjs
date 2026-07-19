import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { c as useDashboardData } from "./use-dashboard-data-pGMcfYq6.mjs";
import { t as Route } from "./cliente._rif-Dy-fEEGZ.mjs";
import { n as DataTable, r as SectionCard, t as AppShell } from "./data-table-Dfh8gz8U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cliente._rif-DY5o1jLX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClientePageContent() {
	const { rif } = Route.useParams();
	const { allRows } = useDashboardData();
	const clientRows = allRows.filter((r) => r.cliente.rif === rif);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 lg:space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg lg:text-2xl font-bold break-words",
				children: clientRows.length > 0 ? clientRows[0].cliente.name : "Cliente no encontrado"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] lg:text-sm font-mono text-muted-foreground",
				children: rif
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
			title: "Alertas",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				rows: clientRows,
				hideClient: true
			})
		})]
	});
}
function ClientePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Detalle del Cliente",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Cargando..."
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientePageContent, {})
		})
	});
}
//#endregion
export { ClientePage as component };
