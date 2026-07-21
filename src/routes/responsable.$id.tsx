import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/data-table";
import { PeriodFilter } from "@/components/period-filter";
import {
  useDashboardData,
  responsiblesQueryOptions,
  clientsQueryOptions,
  ivaSpeQueryOptions,
  ivaSpoQueryOptions,
  alcaldiaQueryOptions,
  dppQueryOptions,
  retislrQueryOptions,
  type Row,
} from "@/hooks/use-dashboard-data";

export const Route = createFileRoute("/responsable/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Responsable ${params.id} — Dashboard General de Controles` }],
  }),
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(responsiblesQueryOptions),
      queryClient.ensureQueryData(clientsQueryOptions),
      queryClient.ensureQueryData(ivaSpeQueryOptions),
      queryClient.ensureQueryData(ivaSpoQueryOptions),
      queryClient.ensureQueryData(alcaldiaQueryOptions),
      queryClient.ensureQueryData(dppQueryOptions),
      queryClient.ensureQueryData(retislrQueryOptions),
    ]);
  },
  component: ResponsablePage,
});

const estadoStyles: Record<string, { dot: string; text: string }> = {
  "Al día": { dot: "bg-success", text: "text-success" },
  Pendiente: { dot: "bg-warning", text: "text-warning" },
  "En proceso": { dot: "bg-warning", text: "text-warning" },
  Vencido: { dot: "bg-danger", text: "text-danger" },
  "N/A": { dot: "bg-muted-foreground/40", text: "text-muted-foreground" },
};

const ESTADO_ORDER = ["Vencido", "Pendiente", "En proceso", "Al día", "N/A"] as const;
type EstadoKey = (typeof ESTADO_ORDER)[number];

const ESTADO_FILTERS: { label: string; value: EstadoKey | "TODOS" }[] = [
  { label: "Todos", value: "TODOS" },
  { label: "Vencido", value: "Vencido" },
  { label: "Pendiente", value: "Pendiente" },
  { label: "Al día", value: "Al día" },
];

function computeWorst(rows: Row[]): EstadoKey {
  return rows.reduce((w, r) => {
    return ESTADO_ORDER.indexOf(r.estado) < ESTADO_ORDER.indexOf(w) ? r.estado : w;
  }, "Al día" as EstadoKey);
}

const MONTHS_ES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

function currentPeriod(): string {
  const now = new Date();
  return `${MONTHS_ES[now.getMonth()]} ${now.getFullYear()}`;
}

function ResponsablePage() {
  const { id } = Route.useParams();
  const { data: responsibles } = useSuspenseQuery(responsiblesQueryOptions);
  const { allRows } = useDashboardData();
  const [expandedRif, setExpandedRif] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<string | null>(currentPeriod);
  const [estadoFilter, setEstadoFilter] = useState<EstadoKey | "TODOS">("TODOS");
  const [estadoOpen, setEstadoOpen] = useState(false);

  const responsable = responsibles.find((r) => r.id === id);

  const respRows = responsable
    ? allRows.filter(
        (r) =>
          r.responsable.name === responsable.name &&
          (r.concepto === "IVA SPE" || r.concepto === "IVA SPO"),
      )
    : [];

  const periodFiltered = activePeriod
    ? respRows.filter((r) => {
        if (r.vencimiento === "N/A") return false;
        const parts = r.vencimiento.split("-");
        if (parts.length === 3 && parts[0].length <= 2) {
          return `${parts[1]} ${parts[2]}` === activePeriod;
        }
        return false;
      })
    : respRows;

  const clientMap = new Map<string, Row[]>();
  periodFiltered.forEach((r) => {
    const key = r.cliente.rif;
    if (!clientMap.has(key)) clientMap.set(key, []);
    clientMap.get(key)!.push(r);
  });

  let clients = Array.from(clientMap.entries())
    .map(([rif, rows]) => ({
      rif,
      name: rows[0].cliente.name,
      rows,
      worst: computeWorst(rows),
    }));

  if (estadoFilter !== "TODOS") {
    clients = clients.filter((c) => c.worst === estadoFilter);
  }

  clients.sort((a, b) => {
    const oa = ESTADO_ORDER.indexOf(a.worst);
    const ob = ESTADO_ORDER.indexOf(b.worst);
    if (oa !== ob) return oa - ob;
    return a.name.localeCompare(b.name);
  });

  const countVencidos = clients.filter((c) => c.worst === "Vencido").length;
  const countPendientes = clients.filter((c) => c.worst === "Pendiente" || c.worst === "En proceso").length;
  const countAlDia = clients.filter((c) => c.worst === "Al día").length;

  return (
    <AppShell title="Detalle del Responsable">
      <div className="space-y-4 lg:space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg lg:text-2xl font-bold break-words">
            {responsable?.name ?? "Responsable no encontrado"}
          </h2>
          <p className="text-[10px] lg:text-sm font-mono text-muted-foreground">
            {responsable ? `${responsable.initials} — ${clients.length} clientes` : id}
          </p>
        </div>

        <SectionCard
          title={`Clientes (${clients.length})`}
          actions={
            <div className="flex items-center gap-1.5 lg:gap-2">
              <div className="relative">
                <button
                  onClick={() => setEstadoOpen(!estadoOpen)}
                  className="px-2 lg:px-3 py-1.5 bg-surface border border-border rounded-md text-[10px] lg:text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-secondary transition-colors"
                >
                  {ESTADO_FILTERS.find((f) => f.value === estadoFilter)?.label ?? "Estado"}
                  <svg className="size-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {estadoOpen && (
                  <div className="absolute right-0 top-full mt-1 z-50 min-w-[140px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
                    {ESTADO_FILTERS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => {
                          setEstadoFilter(f.value);
                          setEstadoOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary transition-colors ${
                          estadoFilter === f.value ? "bg-primary/10 font-bold" : ""
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <PeriodFilter
                rows={respRows}
                activePeriod={activePeriod}
                onChange={setActivePeriod}
              />
            </div>
          }
        >
          <div className="flex items-center gap-4 px-3 lg:px-6 py-2 text-[10px] lg:text-xs text-muted-foreground border-b border-border">
            <span>
              Vencidos: <span className="font-bold text-danger">{countVencidos}</span>
            </span>
            <span>
              Pendientes: <span className="font-bold text-warning">{countPendientes}</span>
            </span>
            <span>
              Al día: <span className="font-bold text-success">{countAlDia}</span>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <th className="px-3 lg:px-6 py-3 font-semibold">Cliente</th>
                  <th className="px-3 lg:px-6 py-3 font-semibold whitespace-nowrap">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clients.map((c) => {
                  const s = estadoStyles[c.worst] ?? estadoStyles["N/A"];
                  const isExpanded = expandedRif === c.rif;
                  return (
                    <Fragment key={c.rif}>
                      <tr
                        onClick={() => setExpandedRif(isExpanded ? null : c.rif)}
                        className="group hover:bg-secondary/50 transition-colors cursor-pointer"
                      >
                        <td className="px-3 lg:px-6 py-3 lg:py-4">
                          <p className="font-bold text-xs lg:text-sm">{c.name}</p>
                          <p className="text-[10px] font-mono text-muted-foreground">
                            RIF: {c.rif}
                          </p>
                        </td>
                        <td className="px-3 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-1.5 lg:gap-2">
                            <span className={"size-1.5 rounded-full " + s.dot} />
                            <span className={"text-[10px] lg:text-xs font-bold uppercase tracking-wider whitespace-nowrap " + s.text}>
                              {c.worst}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr
                        className={`bg-secondary/30 transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                      >
                        <td colSpan={2} className="px-3 lg:px-6 py-0 overflow-hidden">
                          <div
                            className={`transition-all duration-300 ${isExpanded ? "max-h-[500px] py-2 lg:py-3" : "max-h-0 py-0"}`}
                          >
                            <table className="w-full text-left">
                              <thead>
                                <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/50">
                                  <th className="pr-2 py-1">Concepto</th>
                                  <th className="pr-2 py-1 whitespace-nowrap">Estado</th>
                                  <th className="pr-2 py-1">Vencimiento</th>
                                  <th className="py-1">Por realizar</th>
                                </tr>
                              </thead>
                              <tbody>
                                {c.rows.map((row, i) => {
                                  const rs = estadoStyles[row.estado];
                                  return (
                                    <tr key={i} className="text-[11px] border-b border-border/30">
                                      <td className="pr-2 py-1.5 font-semibold">{row.concepto}</td>
                                      <td className="pr-2 py-1.5">
                                        <div className="flex items-center gap-1">
                                          <span className={"size-1 rounded-full " + rs.dot} />
                                          <span className={rs.text}>{row.estado}</span>
                                        </div>
                                      </td>
                                      <td className="pr-2 py-1.5 font-mono text-muted-foreground">{row.vencimiento}</td>
                                      <td className="py-1.5">
                                        {row.checksPendientes && row.checksPendientes.length > 0 ? (
                                          <span className={rs.text}>{row.checksPendientes.join(", ")}</span>
                                        ) : null}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
