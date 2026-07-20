import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/data-table";
import { PeriodFilter } from "@/components/period-filter";
import {
  QuincenaFilter,
  computeQuincenas,
  filterByQuincena,
} from "@/components/quincena-filter";
import { CualidadFilter } from "@/components/cualidad-filter";
import {
  useDashboardData,
  computeClientStatuses,
  clientsQueryOptions,
  responsiblesQueryOptions,
  ivaSpeQueryOptions,
  ivaSpoQueryOptions,
  alcaldiaQueryOptions,
  dppQueryOptions,
  retislrQueryOptions,
  type Estado,
} from "@/hooks/use-dashboard-data";

export const Route = createFileRoute("/clientespendientes")({
  head: () => ({
    meta: [{ title: "Clientes pendientes" }],
  }),
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(clientsQueryOptions),
      queryClient.ensureQueryData(responsiblesQueryOptions),
      queryClient.ensureQueryData(ivaSpeQueryOptions),
      queryClient.ensureQueryData(ivaSpoQueryOptions),
      queryClient.ensureQueryData(alcaldiaQueryOptions),
      queryClient.ensureQueryData(dppQueryOptions),
      queryClient.ensureQueryData(retislrQueryOptions),
    ]);
  },
  component: ClientesPendientesPage,
});

const estadoStyles: Record<string, { dot: string; text: string }> = {
  "Al día": { dot: "bg-success", text: "text-success" },
  Pendiente: { dot: "bg-warning", text: "text-warning" },
  "En proceso": { dot: "bg-warning", text: "text-warning" },
  Vencido: { dot: "bg-danger", text: "text-danger" },
  "N/A": { dot: "bg-muted-foreground/40", text: "text-muted-foreground" },
};

const MONTHS_ES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

function currentPeriod(): string {
  const now = new Date();
  return `${MONTHS_ES[now.getMonth()]} ${now.getFullYear()}`;
}

function ClientesPendientesPage() {
  const { allRows } = useDashboardData();
  const [activePeriod, setActivePeriod] = useState<string>(currentPeriod);
  const [activeCualidad, setActiveCualidad] = useState<string>("TODOS");
  const [activeQuincena, setActiveQuincena] = useState<string | null>(null);
  const [expandedRif, setExpandedRif] = useState<string | null>(null);

  const periodFiltered = allRows.filter((r) => {
    if (r.vencimiento === "N/A") return false;
    const parts = r.vencimiento.split("-");
    if (parts.length === 3 && parts[0].length <= 2) {
      return `${parts[1]} ${parts[2]}` === activePeriod;
    }
    return false;
  });

  const cualidadFiltered =
    activeCualidad === "TODOS"
      ? periodFiltered
      : periodFiltered.filter((r) => r.cliente.cualidad === activeCualidad);

  const ivaSpeSubset = cualidadFiltered.filter((r) => r.concepto === "IVA SPE");
  const quincenas = computeQuincenas(ivaSpeSubset);

  const activeRows = filterByQuincena(cualidadFiltered, activeQuincena);

  const allStatuses = computeClientStatuses(activeRows);
  const clientes = allStatuses.filter((c) => c.estado === "Pendiente");

  return (
    <AppShell title="Clientes pendientes">
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Clientes pendientes</h1>
        <p className="text-sm text-muted-foreground">
          {clientes.length} clientes con declaraciones pendientes
        </p>
      </div>

      <SectionCard
        title="Clientes"
        actions={
          <div className="flex items-center gap-1.5 lg:gap-2">
            <CualidadFilter
              activeCualidad={activeCualidad}
              onChange={(c) => {
                setActiveCualidad(c);
                if (c !== "SPE") setActiveQuincena(null);
              }}
            />
            <PeriodFilter
              rows={allRows}
              activePeriod={activePeriod}
              hideAllOption
              onChange={(p) => {
                setActivePeriod(p!);
                setExpandedRif(null);
                setActiveQuincena(null);
              }}
            />
            {activeCualidad === "SPE" && (
              <QuincenaFilter
                activeQuincena={activeQuincena}
                onChange={setActiveQuincena}
                quincenas={quincenas}
              />
            )}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <th className="px-3 lg:px-6 py-3 font-semibold">Cliente</th>
                <th className="px-3 lg:px-6 py-3 font-semibold whitespace-nowrap">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clientes.map((c) => {
                const s = estadoStyles[c.estado];
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
                            {c.estado}
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
    </AppShell>
  );
}
