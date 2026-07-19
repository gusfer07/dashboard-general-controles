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

// 1. Export query options for loaders
export const clientsQueryOptions = queryOptions({
  queryKey: ["clients"],
  queryFn: async () => {
    console.log("Supabase: Cargando 'clients'...");
    const { data, error } = await supabase.from("clients").select("*");
    if (error) {
      console.error("Supabase Error (clients):", error);
      throw error;
    }
    console.log(`Supabase: ${data?.length || 0} clientes cargados.`);
    return data || [];
  },
  retry: false,
});

export const responsiblesQueryOptions = queryOptions({
  queryKey: ["responsibles"],
  queryFn: async () => {
    console.log("Supabase: Cargando 'responsibles'...");
    const { data, error } = await supabase.from("responsibles").select("*");
    if (error) {
      console.error("Supabase Error (responsibles):", error);
      throw error;
    }
    console.log(`Supabase: ${data?.length || 0} responsables cargados.`);
    return data || [];
  },
  retry: false,
});

export const ivaSpeQueryOptions = queryOptions({
  queryKey: ["iva_spe"],
  queryFn: async () => {
    console.log("Supabase: Cargando 'iva_spe'...");
    const { data, error } = await supabase.from("iva_spe").select("*");
    if (error) {
      console.error("Supabase Error (iva_spe):", error);
      throw error;
    }
    console.log(`Supabase: ${data?.length || 0} registros de IVA SPE cargados.`);
    return data || [];
  },
  retry: false,
});

export const ivaSpoQueryOptions = queryOptions({
  queryKey: ["iva_spo"],
  queryFn: async () => {
    console.log("Supabase: Cargando 'iva_spo'...");
    const { data, error } = await supabase.from("iva_spo").select("*");
    if (error) {
      console.error("Supabase Error (iva_spo):", error);
      throw error;
    }
    console.log(`Supabase: ${data?.length || 0} registros de IVA SPO cargados.`);
    return data || [];
  },
  retry: false,
});

export const alcaldiaQueryOptions = queryOptions({
  queryKey: ["alcaldia"],
  queryFn: async () => {
    console.log("Supabase: Cargando 'alcaldia'...");
    const { data, error } = await supabase.from("alcaldia").select("*");
    if (error) {
      console.error("Supabase Error (alcaldia):", error);
      throw error;
    }
    console.log(`Supabase: ${data?.length || 0} registros de alcaldia cargados.`);
    return data || [];
  },
  retry: false,
});

export const dppQueryOptions = queryOptions({
  queryKey: ["dpp"],
  queryFn: async () => {
    console.log("Supabase: Cargando 'dpp'...");
    const { data, error } = await supabase.from("dpp").select("*");
    if (error) {
      console.error("Supabase Error (dpp):", error);
      throw error;
    }
    console.log(`Supabase: ${data?.length || 0} registros de dpp cargados.`);
    return data || [];
  },
  retry: false,
});

export const retislrQueryOptions = queryOptions({
  queryKey: ["retislr"],
  queryFn: async () => {
    console.log("Supabase: Cargando 'retislr'...");
    const { data, error } = await supabase.from("retislr").select("*");
    if (error) {
      console.error("Supabase Error (retislr):", error);
      throw error;
    }
    console.log(`Supabase: ${data?.length || 0} registros de retislr cargados.`);
    return data || [];
  },
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
    if (!ivaDeclarado) pending.push("IVA declarado");
    if (!informeEnviado) pending.push("Informe enviado");
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
        ["Declarado", "Enviado", "Pagado", "Certificado"],
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
        ["Declarado", "Pagado"],
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
        ["Declarado", "Pagado"],
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

  const alDiaCount = allRows.filter((r) => r.estado === "Al día").length;
  const pendienteCount = allRows.filter(
    (r) => r.estado === "Pendiente" || r.estado === "En proceso",
  ).length;
  const vencidaCount = allRows.filter((r) => r.estado === "Vencido").length;

  const alDiaPct = totalObligations > 0 ? Math.round((alDiaCount / totalObligations) * 100) : 0;
  const pendientePct =
    totalObligations > 0 ? Math.round((pendienteCount / totalObligations) * 100) : 0;
  const vencidaPct = totalObligations > 0 ? Math.round((vencidaCount / totalObligations) * 100) : 0;

  const kpis = [
    {
      label: "Declaraciones al día",
      value: String(alDiaCount).padStart(2, "0"),
      hint: `${alDiaPct}% del total`,
      hintTone: "success" as const,
      progress: { value: alDiaPct, tone: "success" as const },
    },
    {
      label: "Pendientes",
      value: String(pendienteCount).padStart(2, "0"),
      hint: `${pendientePct}% del total`,
      hintTone: "warning" as const,
      progress: { value: pendientePct, tone: "warning" as const },
    },
    {
      label: "Vencidas",
      value: String(vencidaCount).padStart(2, "0"),
      hint: `${vencidaPct}% del total`,
      hintTone: "danger" as const,
      progress: { value: vencidaPct, tone: "danger" as const },
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
    clientsCount: clients.length,
  };
}
