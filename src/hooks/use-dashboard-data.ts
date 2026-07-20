import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Estado = "Al día" | "Pendiente" | "En proceso" | "Vencido" | "N/A";

export type Responsable = { initials: string; name: string };
export type Cliente = { name: string; rif: string; cualidad?: string };

export type Row = {
  id?: string;
  cliente: Cliente;
  concepto: string;
  estado: Estado;
  vencimiento: string;
  monto: string;
  responsable: Responsable;
  checksPendientes?: string[];
};

const MONTHS_ES = [
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
  "DIC",
];

function formatDueDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length === 3 && parts[0].length === 4) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parts[2];
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${day}-${MONTHS_ES[monthIdx]}-${year}`;
      }
    }
  }
  return dateStr;
}

function getIvaStatus(
  ivaDeclarado: boolean | null | undefined,
  informeEnviado: boolean | null | undefined,
  fecha: string | null | undefined,
): Estado {
  const checks = [!!ivaDeclarado, !!informeEnviado];
  const allTrue = checks.every(Boolean);
  const anyTrue = checks.some(Boolean);

  if (allTrue) return "Al día";

  if (fecha) {
    const targetDate = new Date(fecha + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (targetDate < today) {
      return "Vencido";
    }
  }

  if (anyTrue) return "En proceso";
  return "Pendiente";
}

function getBooleanStatus(checks: boolean[], fecha: string | null | undefined): Estado {
  const allTrue = checks.length > 0 && checks.every(Boolean);
  const anyTrue = checks.some(Boolean);

  if (allTrue) return "Al día";

  if (fecha) {
    const targetDate = new Date(fecha + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (targetDate < today) {
      return "Vencido";
    }
  }

  if (anyTrue) return "En proceso";
  return "Pendiente";
}

function queryFnWithFallback<T>(tableName: string) {
  return async (): Promise<T[]> => {
    console.log(`[Supabase] Cargando '${tableName}'...`);
    try {
      const { data, error } = await supabase.from(tableName).select("*");
      if (error) {
        console.error(`[Supabase] Error (${tableName}):`, error);
        return [];
      }
      console.log(`[Supabase] ${data?.length || 0} registros de ${tableName} cargados.`);
      return (data as T[]) || [];
    } catch (err) {
      console.error(`[Supabase] Excepción al cargar '${tableName}':`, err);
      return [];
    }
  };
}

// 1. Export query options for loaders
export const clientsQueryOptions = queryOptions({
  queryKey: ["clients"],
  queryFn: queryFnWithFallback("clients"),
  retry: false,
});

export const responsiblesQueryOptions = queryOptions({
  queryKey: ["responsibles"],
  queryFn: queryFnWithFallback("responsibles"),
  retry: false,
});

export const ivaSpeQueryOptions = queryOptions({
  queryKey: ["iva_spe"],
  queryFn: queryFnWithFallback("iva_spe"),
  retry: false,
});

export const ivaSpoQueryOptions = queryOptions({
  queryKey: ["iva_spo"],
  queryFn: queryFnWithFallback("iva_spo"),
  retry: false,
});

export const alcaldiaQueryOptions = queryOptions({
  queryKey: ["alcaldia"],
  queryFn: queryFnWithFallback("alcaldia"),
  retry: false,
});

export const dppQueryOptions = queryOptions({
  queryKey: ["dpp"],
  queryFn: queryFnWithFallback("dpp"),
  retry: false,
});

export const retislrQueryOptions = queryOptions({
  queryKey: ["retislr"],
  queryFn: queryFnWithFallback("retislr"),
  retry: false,
});

function getDppOrRetislrStatus(
  declarado: boolean | null | undefined,
  pagado: boolean | null | undefined,
  fecha: string | null | undefined,
): Estado {
  const dec = declarado ?? false;
  const pag = pagado ?? false;

  if (dec && pag) return "Al día";

  if (fecha) {
    const targetDate = new Date(fecha + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (targetDate < today) {
      return "Vencido";
    }
  }

  if (dec || pag) return "En proceso";
  return "Pendiente";
}

export function computeClientStatuses(rows: Row[]): {
  name: string;
  rif: string;
  estado: Estado;
  rows: Row[];
}[] {
  const clientMap = new Map<string, Row[]>();
  rows.forEach((r) => {
    const key = r.cliente.rif;
    if (!clientMap.has(key)) clientMap.set(key, []);
    clientMap.get(key)!.push(r);
  });

  const result: {
    name: string;
    rif: string;
    estado: Estado;
    rows: Row[];
  }[] = [];
  for (const [, clientRows] of clientMap) {
    const allAlDia = clientRows.every((rr) => rr.estado === "Al día");
    const anyVencido = clientRows.some((rr) => rr.estado === "Vencido");
    const anyPendiente = clientRows.some(
      (rr) => rr.estado === "Pendiente" || rr.estado === "En proceso",
    );
    let estado: Estado;
    if (allAlDia) estado = "Al día";
    else if (anyVencido) estado = "Vencido";
    else if (anyPendiente) estado = "Pendiente";
    else estado = "N/A";

    result.push({
      name: clientRows[0].cliente.name,
      rif: clientRows[0].cliente.rif,
      estado,
      rows: clientRows,
    });
  }
  return result;
}

export function useDashboardData() {
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

  const defaultResp: Responsable = { initials: "N/A", name: "Sin Asignar" };

  // 1. Process Tributarias
  const tributariasRows: Row[] = [];

  function ivaPendingChecks(
    ivaDeclarado: boolean | null | undefined,
    informeEnviado: boolean | null | undefined,
  ): string[] | undefined {
    const pending: string[] = [];
    if (!ivaDeclarado) pending.push("Declaracion de IVA");
    if (!informeEnviado) pending.push("Informe");
    return pending.length > 0 ? pending : undefined;
  }

  function booleanPendingChecks(
    checks: (boolean | null | undefined)[],
    labels: string[],
  ): string[] | undefined {
    const pending: string[] = [];
    checks.forEach((c, i) => {
      if (!c) pending.push(labels[i]);
    });
    return pending.length > 0 ? pending : undefined;
  }

  ivaSpeList.forEach((item) => {
    if (item.iva_declarado == null && item.informe_enviado == null) return;
    const client = clientMap.get(item.client_id!);
    const resp = item.responsable_id ? respMap.get(item.responsable_id) : null;
    tributariasRows.push({
      id: `spe-${item.id}`,
      cliente: client
        ? { name: client.name, rif: client.rif, cualidad: client.cualidad }
        : { name: "Cliente Desconocido", rif: "" },
      concepto: "IVA SPE",
      estado: getIvaStatus(item.iva_declarado, item.informe_enviado, item.fecha),
      vencimiento: formatDueDate(item.fecha),
      monto: "—",
      responsable: resp ? { initials: resp.initials, name: resp.name } : defaultResp,
      checksPendientes: ivaPendingChecks(item.iva_declarado, item.informe_enviado),
    });
  });

  ivaSpoList.forEach((item) => {
    if (item.iva_declarado == null && item.informe_enviado == null) return;
    const client = clientMap.get(item.client_id!);
    const resp = item.responsable_id ? respMap.get(item.responsable_id) : null;
    tributariasRows.push({
      id: `spo-${item.id}`,
      cliente: client
        ? { name: client.name, rif: client.rif, cualidad: client.cualidad }
        : { name: "Cliente Desconocido", rif: "" },
      concepto: "IVA SPO",
      estado: getIvaStatus(item.iva_declarado, item.informe_enviado, item.fecha),
      vencimiento: formatDueDate(item.fecha),
      monto: "—",
      responsable: resp ? { initials: resp.initials, name: resp.name } : defaultResp,
      checksPendientes: ivaPendingChecks(item.iva_declarado, item.informe_enviado),
    });
  });

  // Add alcaldia
  alcaldiaList.forEach((item) => {
    if (
      item.declarado == null &&
      item.enviado == null &&
      item.pagado == null &&
      item.certificado == null
    )
      return;
    const client = clientMap.get(item.client_id!);
    const resp = item.responsable_id ? respMap.get(item.responsable_id) : null;
    tributariasRows.push({
      id: `alcaldia-${item.id}`,
      cliente: client
        ? { name: client.name, rif: client.rif, cualidad: client.cualidad }
        : { name: "Cliente Desconocido", rif: "" },
      concepto: "Alcaldía",
      estado: getBooleanStatus(
        [item.declarado, item.enviado, item.pagado, item.certificado],
        item.fecha,
      ),
      vencimiento: formatDueDate(item.fecha),
      monto: "—",
      responsable: resp ? { initials: resp.initials, name: resp.name } : defaultResp,
      checksPendientes: booleanPendingChecks(
        [item.declarado, item.enviado, item.pagado, item.certificado],
        ["Declarado", "Enviado", "Pagar", "Certificado"],
      ),
    });
  });

  // Add dpp
  dppList.forEach((item) => {
    if (item.declarado == null && item.pagado == null) return;
    const client = clientMap.get(item.client_id!);
    const resp = item.responsable_id ? respMap.get(item.responsable_id) : null;
    tributariasRows.push({
      id: `dpp-${item.id}`,
      cliente: client
        ? { name: client.name, rif: client.rif, cualidad: client.cualidad }
        : { name: "Cliente Desconocido", rif: "" },
      concepto: "DPP",
      estado: getDppOrRetislrStatus(item.declarado, item.pagado, item.fecha),
      vencimiento: formatDueDate(item.fecha),
      monto: "—",
      responsable: resp ? { initials: resp.initials, name: resp.name } : defaultResp,
      checksPendientes: booleanPendingChecks(
        [item.declarado, item.pagado],
        ["Declarado", "Pagar"],
      ),
    });
  });

  // Add retislr
  retislrList.forEach((item) => {
    if (item.declarado == null && item.pagado == null) return;
    const client = clientMap.get(item.client_id!);
    const resp = item.responsable_id ? respMap.get(item.responsable_id) : null;
    tributariasRows.push({
      id: `retislr-${item.id}`,
      cliente: client
        ? { name: client.name, rif: client.rif, cualidad: client.cualidad }
        : { name: "Cliente Desconocido", rif: "" },
      concepto: "RET ISLR",
      estado: getDppOrRetislrStatus(item.declarado, item.pagado, item.fecha),
      vencimiento: formatDueDate(item.fecha),
      monto: "—",
      responsable: resp ? { initials: resp.initials, name: resp.name } : defaultResp,
      checksPendientes: booleanPendingChecks(
        [item.declarado, item.pagado],
        ["Declarado", "Pagar"],
      ),
    });
  });

  // 2. Process Parafiscales (Empty as requested since they are not in DB)
  const parafiscalesRows: Row[] = [];

  // 3. Process Libros Legales (Empty as requested since they are not in DB)
  const librosRows: Row[] = [];

  // 4. Calculate KPIs
  const allRows = [...tributariasRows, ...parafiscalesRows, ...librosRows];
  const totalObligations = allRows.length;

  // Filter rows to current month/period for client-level KPI
  const now = new Date();
  const currentPeriod = `${MONTHS_ES[now.getMonth()]} ${now.getFullYear()}`;
  const periodRows = allRows.filter((r) => {
    if (r.vencimiento === "N/A") return false;
    const parts = r.vencimiento.split("-");
    return parts.length === 3 && parts[0].length <= 2 && `${parts[1]} ${parts[2]}` === currentPeriod;
  });

  const allClientStatuses = computeClientStatuses(periodRows);
  let clientesAlDiaCount = 0;
  let clientesPendientesCount = 0;
  let clientesVencidosCount = 0;
  for (const cs of allClientStatuses) {
    if (cs.estado === "Al día") clientesAlDiaCount++;
    else if (cs.estado === "Vencido") clientesVencidosCount++;
    else if (cs.estado === "Pendiente") clientesPendientesCount++;
  }

  const clientesAlDiaPct = clients.length > 0 ? Math.round((clientesAlDiaCount / clients.length) * 100) : 0;
  const clientesPendientesPct = clients.length > 0 ? Math.round((clientesPendientesCount / clients.length) * 100) : 0;
  const clientesVencidosPct = clients.length > 0 ? Math.round((clientesVencidosCount / clients.length) * 100) : 0;

  const kpis = [
    {
      label: "Clientes al día",
      value: String(clientesAlDiaCount).padStart(2, "0"),
      hint: `${clientesAlDiaPct}% de clientes`,
      hintTone: "success" as const,
      progress: { value: clientesAlDiaPct, tone: "success" as const },
    },
    {
      label: "Clientes pendientes",
      value: String(clientesPendientesCount).padStart(2, "0"),
      hint: `${clientesPendientesPct}% de clientes`,
      hintTone: "warning" as const,
      progress: { value: clientesPendientesPct, tone: "warning" as const },
    },
    {
      label: "Clientes vencidos",
      value: String(clientesVencidosCount).padStart(2, "0"),
      hint: `${clientesVencidosPct}% de clientes`,
      hintTone: "danger" as const,
      progress: { value: clientesVencidosPct, tone: "danger" as const },
    },
    {
      label: "Total Clientes",
      value: String(clients.length),
    },
  ];

  return {
    tributarias: tributariasRows,
    parafiscales: parafiscalesRows,
    libros: librosRows,
    kpis,
    allRows,
    clients,
    clientsCount: clients.length,
  };
}
