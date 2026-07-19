import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { KpiCards } from "@/components/kpi-cards";
import { DataTable, SectionCard, TableToolbar } from "@/components/data-table";
import { conceptosPorTab } from "@/lib/mock-data";
import {
  useDashboardData,
  clientsQueryOptions,
  responsiblesQueryOptions,
  ivaSpeQueryOptions,
  ivaSpoQueryOptions,
  alcaldiaQueryOptions,
  dppQueryOptions,
  retislrQueryOptions,
} from "@/hooks/use-dashboard-data";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient } }) => {
    // Pre-fill query cache on server & client without obligations table
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
  component: Index,
});

function Index() {
  const { tributarias, parafiscales, libros, kpis, allRows, clientsCount } = useDashboardData();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Get active alerts (Vencido or Pendiente), sorted or filtered
  const baseAlertas = allRows
    .filter((r) => r.estado === "Vencido" || r.estado === "Pendiente");

  const filteredAlertas = activeFilter
    ? baseAlertas.filter((r) => r.concepto === activeFilter)
    : baseAlertas;

  const alertas = filteredAlertas.slice(0, 10); // Show up to 10 alerts

  // Calculate dynamic stats for each card
  const tribPendientes = tributarias.filter(
    (r) => r.estado === "Vencido" || r.estado === "Pendiente" || r.estado === "En proceso",
  ).length;
  const paraPendientes = parafiscales.filter(
    (r) => r.estado === "Vencido" || r.estado === "Pendiente" || r.estado === "En proceso",
  ).length;
  const libroPendientes = libros.filter(
    (r) => r.estado === "Vencido" || r.estado === "Pendiente" || r.estado === "En proceso",
  ).length;

  const tribVencidas = tributarias.filter((r) => r.estado === "Vencido").length;
  const paraVencidas = parafiscales.filter((r) => r.estado === "Vencido").length;
  const libroVencidas = libros.filter((r) => r.estado === "Vencido").length;

  return (
    <AppShell title="Dashboard General">
      <KpiCards kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          {
            to: "/tributarias" as const,
            title: "Obligaciones Tributarias",
            desc: "IVA SPE, IVA SPO, DPP, Retenciones ISLR, Alcaldía",
            stat: String(tributarias.length),
            pill:
              tribVencidas > 0
                ? `${tribVencidas} vencidas`
                : tribPendientes > 0
                  ? `${tribPendientes} pendientes`
                  : "Al día",
            tone:
              tribVencidas > 0
                ? "text-danger"
                : tribPendientes > 0
                  ? "text-warning"
                  : "text-success",
          },
          {
            to: "/parafiscales" as const,
            title: "Parafiscales",
            desc: "FAOV, IVSS, INCES, FONACIT SPE, FONACIT SPO, RUPDAE",
            stat: String(parafiscales.length),
            pill:
              paraVencidas > 0
                ? `${paraVencidas} vencidas`
                : paraPendientes > 0
                  ? `${paraPendientes} pendientes`
                  : "Al día",
            tone:
              paraVencidas > 0
                ? "text-danger"
                : paraPendientes > 0
                  ? "text-warning"
                  : "text-success",
          },
          {
            to: "/libros" as const,
            title: "Libros Legales",
            desc: "Actas, Accionistas, Inventario, Mayor, Diario",
            stat: String(libros.length),
            pill:
              libroVencidas > 0
                ? `${libroVencidas} vencidas`
                : libroPendientes > 0
                  ? `${libroPendientes} pendientes`
                  : "Al día",
            tone:
              libroVencidas > 0
                ? "text-danger"
                : libroPendientes > 0
                  ? "text-warning"
                  : "text-success",
          },
        ].map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className="bg-surface border border-border rounded-sm p-5 hover:border-primary/40 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest h-[14px]"></p>
                <h3 className="mt-1 text-base font-bold tracking-tight">{m.title}</h3>
              </div>
              <span className="text-3xl font-bold tracking-tighter">{m.stat}</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className={"text-[10px] font-bold uppercase tracking-wider " + m.tone}>
                {m.pill}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary transition-colors">
                ABRIR →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <SectionCard title="Alertas" actions={
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${
            showFilters
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-surface border-border hover:bg-secondary"
          }`}
        >
          Filtros
        </button>
      }>
        {showFilters && (
          <TableToolbar
            chips={[...conceptosPorTab.tributarias]}
            activeChip={activeFilter}
            onChipClick={setActiveFilter}
          />
        )}
        <DataTable rows={alertas} totalClientes={clientsCount} />
      </SectionCard>
    </AppShell>
  );
}
