import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/data-table";
import { PeriodFilter } from "@/components/period-filter";
import { QuincenaFilter, computeQuincenas, filterByQuincena } from "@/components/quincena-filter";
import {
  useDashboardData,
  clientsQueryOptions,
  responsiblesQueryOptions,
  ivaSpeQueryOptions,
  ivaSpoQueryOptions,
  alcaldiaQueryOptions,
  dppQueryOptions,
  retislrQueryOptions,
  type Row,
  type Estado,
} from "@/hooks/use-dashboard-data";

export const Route = createFileRoute("/clientesaldia")({
  head: () => ({
    meta: [{ title: "Clientes al día" }],
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
  component: ClientesAlDiaPage,
});

type ClientStatus = {
  name: string;
  rif: string;
  estado: Estado;
  rows: Row[];
};

function computeClientStatuses(rows: Row[]): ClientStatus[] {
  const clientMap = new Map<string, Row[]>();
  rows.forEach((r) => {
    const key = r.cliente.rif;
    if (!clientMap.has(key)) clientMap.set(key, []);
    clientMap.get(key)!.push(r);
  });

  const result: ClientStatus[] = [];
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
      rif: key,
      estado,
      rows: clientRows,
    });
  }
  return result;
}

const estadoStyles: Record<string, { dot: string; text: string }> = {
  "Al día": { dot: "bg-success", text: "text-success" },
  Pendiente: { dot: "bg-warning", text: "text-warning" },
  "En proceso": { dot: "bg-warning", text: "text-warning" },
  Vencido: { dot: "bg-danger", text: "text-danger" },
  "N/A": { dot: "bg-muted-foreground/40", text: "text-muted-foreground" },
};

function ClientesAlDiaPage() {
  const { allRows } = useDashboardData();
  const [activePeriod, setActivePeriod] = useState<string | null>(null);
  const [activeQuincena, setActiveQuincena] = useState<string | null>(null);
  const [expandedRif, setExpandedRif] = useState<string | null>(null);

  const periodFiltered = activePeriod
    ? allRows.filter((r) => {
        if (r.vencimiento === "N/A") return false;
        const parts = r.vencimiento.split("-");
        if (parts.length === 3 && parts[0].length <= 2) {
          return `${parts[1]} ${parts[2]}` === activePeriod;
        }
        return false;
      })
    : allRows;

  const quincenaFiltered = filterByQuincena(periodFiltered, activeQuincena);

  const allStatuses = computeClientStatuses(quincenaFiltered);
  const clientes = allStatuses.filter((c) => c.estado === "Al día");

  const ivaSpeRows = quincenaFiltered.filter((r) => r.concepto === "IVA SPE");
  const quincenasDisponibles = computeQuincenas(ivaSpeRows);

  return (
    <AppShell title="Clientes al día">
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Clientes al día</h1>
        <p className="text-sm text-muted-foreground">
          {clientes.length} clientes con todas sus declaraciones al día
        </p>
      </div>

      <SectionCard
        title="Clientes"
        actions={
          <PeriodFilter
            rows={allRows}
            activePeriod={activePeriod}
            onChange={(p) => {
              setActivePeriod(p);
              setExpandedRif(null);
            }}
          />
        }
      >
        <QuincenaFilter
          visible={true}
          activeQuincena={activeQuincena}
          onChange={(q) => {
            setActiveQuincena(q);
            setExpandedRif(null);
          }}
          quincenas={quincenasDisponibles}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <th className="px-3 lg:px-6 py-3 font-semibold">Cliente</th>
                <th className="px-3 lg:px-6 py-3 font-semibold">Estado</th>
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
                          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-wider text-success">
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
                          className={`transition-all duration-300 ${isExpanded ? "max-h-[100px] py-2 lg:py-3" : "max-h-0 py-0"}`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-success">
                            Todo completado
                          </span>
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
