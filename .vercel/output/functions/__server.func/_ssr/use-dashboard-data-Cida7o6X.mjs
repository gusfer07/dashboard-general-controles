import { t as supabase } from "./client-Bk9sLGIo.mjs";
import { n as useSuspenseQuery, t as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-dashboard-data-Cida7o6X.js
var MONTHS_ES = [
	"ENE",
	"FEB",
	"MAR",
	"ABR",
	"MAY",
	"JUN",
	"JUL",
	"AGO",
	"SEP",
	"OCT",
	"NOV",
	"DIC"
];
function formatDueDate(dateStr) {
	if (!dateStr) return "N/A";
	if (dateStr.includes("-")) {
		const parts = dateStr.split("-");
		if (parts.length === 3 && parts[0].length === 4) {
			const year = parts[0];
			const monthIdx = parseInt(parts[1], 10) - 1;
			const day = parts[2];
			if (monthIdx >= 0 && monthIdx < 12) return `${day}-${MONTHS_ES[monthIdx]}-${year}`;
		}
	}
	return dateStr;
}
function getIvaStatus(ivaDeclarado, informeEnviado, fecha) {
	const checks = [!!ivaDeclarado, !!informeEnviado];
	const allTrue = checks.every(Boolean);
	const anyTrue = checks.some(Boolean);
	if (allTrue) return "Al día";
	if (fecha) {
		const targetDate = /* @__PURE__ */ new Date(fecha + "T00:00:00");
		const today = /* @__PURE__ */ new Date();
		today.setHours(0, 0, 0, 0);
		if (targetDate < today) return "Vencido";
	}
	if (anyTrue) return "En proceso";
	return "Pendiente";
}
function getBooleanStatus(checks, fecha) {
	const allTrue = checks.length > 0 && checks.every(Boolean);
	const anyTrue = checks.some(Boolean);
	if (allTrue) return "Al día";
	if (fecha) {
		const targetDate = /* @__PURE__ */ new Date(fecha + "T00:00:00");
		const today = /* @__PURE__ */ new Date();
		today.setHours(0, 0, 0, 0);
		if (targetDate < today) return "Vencido";
	}
	if (anyTrue) return "En proceso";
	return "Pendiente";
}
function queryFnWithFallback(tableName) {
	return async () => {
		console.log(`[Supabase] Cargando '${tableName}'...`);
		try {
			const { data, error } = await supabase.from(tableName).select("*");
			if (error) {
				console.error(`[Supabase] Error (${tableName}):`, error);
				return [];
			}
			console.log(`[Supabase] ${data?.length || 0} registros de ${tableName} cargados.`);
			return data || [];
		} catch (err) {
			console.error(`[Supabase] Excepción al cargar '${tableName}':`, err);
			return [];
		}
	};
}
var clientsQueryOptions = queryOptions({
	queryKey: ["clients"],
	queryFn: queryFnWithFallback("clients"),
	retry: false
});
var responsiblesQueryOptions = queryOptions({
	queryKey: ["responsibles"],
	queryFn: queryFnWithFallback("responsibles"),
	retry: false
});
var ivaSpeQueryOptions = queryOptions({
	queryKey: ["iva_spe"],
	queryFn: queryFnWithFallback("iva_spe"),
	retry: false
});
var ivaSpoQueryOptions = queryOptions({
	queryKey: ["iva_spo"],
	queryFn: queryFnWithFallback("iva_spo"),
	retry: false
});
var alcaldiaQueryOptions = queryOptions({
	queryKey: ["alcaldia"],
	queryFn: queryFnWithFallback("alcaldia"),
	retry: false
});
var dppQueryOptions = queryOptions({
	queryKey: ["dpp"],
	queryFn: queryFnWithFallback("dpp"),
	retry: false
});
var retislrQueryOptions = queryOptions({
	queryKey: ["retislr"],
	queryFn: queryFnWithFallback("retislr"),
	retry: false
});
function getDppOrRetislrStatus(declarado, pagado, fecha) {
	const dec = declarado ?? false;
	const pag = pagado ?? false;
	if (dec && pag) return "Al día";
	if (fecha) {
		const targetDate = /* @__PURE__ */ new Date(fecha + "T00:00:00");
		const today = /* @__PURE__ */ new Date();
		today.setHours(0, 0, 0, 0);
		if (targetDate < today) return "Vencido";
	}
	if (dec || pag) return "En proceso";
	return "Pendiente";
}
function useDashboardData() {
	const clientsQuery = useSuspenseQuery(clientsQueryOptions);
	const responsiblesQuery = useSuspenseQuery(responsiblesQueryOptions);
	const ivaSpeQuery = useSuspenseQuery(ivaSpeQueryOptions);
	const ivaSpoQuery = useSuspenseQuery(ivaSpoQueryOptions);
	const alcaldiaQuery = useSuspenseQuery(alcaldiaQueryOptions);
	const dppQuery = useSuspenseQuery(dppQueryOptions);
	const retislrQuery = useSuspenseQuery(retislrQueryOptions);
	const clients = clientsQuery.data;
	const responsibles = responsiblesQuery.data;
	const ivaSpeList = ivaSpeQuery.data;
	const ivaSpoList = ivaSpoQuery.data;
	const alcaldiaList = alcaldiaQuery.data;
	const dppList = dppQuery.data;
	const retislrList = retislrQuery.data;
	const clientMap = new Map(clients.map((c) => [c.id, c]));
	const respMap = new Map(responsibles.map((r) => [r.id, r]));
	const defaultResp = {
		initials: "N/A",
		name: "Sin Asignar"
	};
	const tributariasRows = [];
	function ivaPendingChecks(ivaDeclarado, informeEnviado) {
		const pending = [];
		if (!ivaDeclarado) pending.push("IVA declarado");
		if (!informeEnviado) pending.push("Informe enviado");
		return pending.length > 0 ? pending : void 0;
	}
	function booleanPendingChecks(checks, labels) {
		const pending = [];
		checks.forEach((c, i) => {
			if (!c) pending.push(labels[i]);
		});
		return pending.length > 0 ? pending : void 0;
	}
	ivaSpeList.forEach((item) => {
		if (item.iva_declarado == null && item.informe_enviado == null) return;
		const client = clientMap.get(item.client_id);
		const resp = item.responsable_id ? respMap.get(item.responsable_id) : null;
		tributariasRows.push({
			id: `spe-${item.id}`,
			cliente: client ? {
				name: client.name,
				rif: client.rif,
				cualidad: client.cualidad
			} : {
				name: "Cliente Desconocido",
				rif: ""
			},
			concepto: "IVA SPE",
			estado: getIvaStatus(item.iva_declarado, item.informe_enviado, item.fecha),
			vencimiento: formatDueDate(item.fecha),
			monto: "—",
			responsable: resp ? {
				initials: resp.initials,
				name: resp.name
			} : defaultResp,
			checksPendientes: ivaPendingChecks(item.iva_declarado, item.informe_enviado)
		});
	});
	ivaSpoList.forEach((item) => {
		if (item.iva_declarado == null && item.informe_enviado == null) return;
		const client = clientMap.get(item.client_id);
		const resp = item.responsable_id ? respMap.get(item.responsable_id) : null;
		tributariasRows.push({
			id: `spo-${item.id}`,
			cliente: client ? {
				name: client.name,
				rif: client.rif,
				cualidad: client.cualidad
			} : {
				name: "Cliente Desconocido",
				rif: ""
			},
			concepto: "IVA SPO",
			estado: getIvaStatus(item.iva_declarado, item.informe_enviado, item.fecha),
			vencimiento: formatDueDate(item.fecha),
			monto: "—",
			responsable: resp ? {
				initials: resp.initials,
				name: resp.name
			} : defaultResp,
			checksPendientes: ivaPendingChecks(item.iva_declarado, item.informe_enviado)
		});
	});
	alcaldiaList.forEach((item) => {
		if (item.declarado == null && item.enviado == null && item.pagado == null && item.certificado == null) return;
		const client = clientMap.get(item.client_id);
		const resp = item.responsable_id ? respMap.get(item.responsable_id) : null;
		tributariasRows.push({
			id: `alcaldia-${item.id}`,
			cliente: client ? {
				name: client.name,
				rif: client.rif,
				cualidad: client.cualidad
			} : {
				name: "Cliente Desconocido",
				rif: ""
			},
			concepto: "Alcaldía",
			estado: getBooleanStatus([
				item.declarado,
				item.enviado,
				item.pagado,
				item.certificado
			], item.fecha),
			vencimiento: formatDueDate(item.fecha),
			monto: "—",
			responsable: resp ? {
				initials: resp.initials,
				name: resp.name
			} : defaultResp,
			checksPendientes: booleanPendingChecks([
				item.declarado,
				item.enviado,
				item.pagado,
				item.certificado
			], [
				"Declarado",
				"Enviado",
				"Pagado",
				"Certificado"
			])
		});
	});
	dppList.forEach((item) => {
		if (item.declarado == null && item.pagado == null) return;
		const client = clientMap.get(item.client_id);
		const resp = item.responsable_id ? respMap.get(item.responsable_id) : null;
		tributariasRows.push({
			id: `dpp-${item.id}`,
			cliente: client ? {
				name: client.name,
				rif: client.rif,
				cualidad: client.cualidad
			} : {
				name: "Cliente Desconocido",
				rif: ""
			},
			concepto: "DPP",
			estado: getDppOrRetislrStatus(item.declarado, item.pagado, item.fecha),
			vencimiento: formatDueDate(item.fecha),
			monto: "—",
			responsable: resp ? {
				initials: resp.initials,
				name: resp.name
			} : defaultResp,
			checksPendientes: booleanPendingChecks([item.declarado, item.pagado], ["Declarado", "Pagado"])
		});
	});
	retislrList.forEach((item) => {
		if (item.declarado == null && item.pagado == null) return;
		const client = clientMap.get(item.client_id);
		const resp = item.responsable_id ? respMap.get(item.responsable_id) : null;
		tributariasRows.push({
			id: `retislr-${item.id}`,
			cliente: client ? {
				name: client.name,
				rif: client.rif,
				cualidad: client.cualidad
			} : {
				name: "Cliente Desconocido",
				rif: ""
			},
			concepto: "RET ISLR",
			estado: getDppOrRetislrStatus(item.declarado, item.pagado, item.fecha),
			vencimiento: formatDueDate(item.fecha),
			monto: "—",
			responsable: resp ? {
				initials: resp.initials,
				name: resp.name
			} : defaultResp,
			checksPendientes: booleanPendingChecks([item.declarado, item.pagado], ["Declarado", "Pagado"])
		});
	});
	const parafiscalesRows = [];
	const librosRows = [];
	const allRows = [
		...tributariasRows,
		...parafiscalesRows,
		...librosRows
	];
	const totalObligations = allRows.length;
	const alDiaCount = allRows.filter((r) => r.estado === "Al día").length;
	const pendienteCount = allRows.filter((r) => r.estado === "Pendiente" || r.estado === "En proceso").length;
	const vencidaCount = allRows.filter((r) => r.estado === "Vencido").length;
	const alDiaPct = totalObligations > 0 ? Math.round(alDiaCount / totalObligations * 100) : 0;
	const pendientePct = totalObligations > 0 ? Math.round(pendienteCount / totalObligations * 100) : 0;
	const vencidaPct = totalObligations > 0 ? Math.round(vencidaCount / totalObligations * 100) : 0;
	return {
		tributarias: tributariasRows,
		parafiscales: parafiscalesRows,
		libros: librosRows,
		kpis: [
			{
				label: "Declaraciones al día",
				value: String(alDiaCount).padStart(2, "0"),
				hint: `${alDiaPct}% del total`,
				hintTone: "success",
				progress: {
					value: alDiaPct,
					tone: "success"
				}
			},
			{
				label: "Pendientes",
				value: String(pendienteCount).padStart(2, "0"),
				hint: `${pendientePct}% del total`,
				hintTone: "warning",
				progress: {
					value: pendientePct,
					tone: "warning"
				}
			},
			{
				label: "Vencidas",
				value: String(vencidaCount).padStart(2, "0"),
				hint: `${vencidaPct}% del total`,
				hintTone: "danger",
				progress: {
					value: vencidaPct,
					tone: "danger"
				}
			},
			{
				label: "Total Clientes",
				value: String(clients.length)
			}
		],
		allRows,
		clientsCount: clients.length
	};
}
//#endregion
export { ivaSpoQueryOptions as a, useDashboardData as c, ivaSpeQueryOptions as i, clientsQueryOptions as n, responsiblesQueryOptions as o, dppQueryOptions as r, retislrQueryOptions as s, alcaldiaQueryOptions as t };
