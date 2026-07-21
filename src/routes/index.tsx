import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { KpiCards } from "@/components/kpi-cards";
import { CalendarView } from "@/components/calendar-view";
import { DataTable, SectionCard, TableToolbar } from "@/components/data-table";
import { PeriodFilter } from "@/components/period-filter";
import { QuincenaFilter, computeQuincenas, filterByQuincena } from "@/components/quincena-filter";
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

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  const { tributarias, parafiscales, libros, kpis, allRows, clientsCount } = useDashboardData();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<string | null>(null);
  const [activeQuincena, setActiveQuincena] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("calendar");

  const baseAlertas = allRows.filter((r) => r.estado === "Vencido" || r.estado === "Pendiente");

  const conceptFiltered = activeFilter
    ? baseAlertas.filter((r) => r.concepto === activeFilter)
    : baseAlertas;

  const periodFiltered = activePeriod
    ? conceptFiltered.filter((r) => {
        if (r.vencimiento === "N/A") return false;
        const parts = r.vencimiento.split("-");
        if (parts.length === 3 && parts[0].length <= 2) {
          return `${parts[1]} ${parts[2]}` === activePeriod;
        }
        return false;
      })
    : conceptFiltered;

  const ivaSpeRows = periodFiltered.filter((r) => r.concepto === "IVA SPE");
  const quincenasDisponibles = computeQuincenas(ivaSpeRows);
  const alertas = filterByQuincena(periodFiltered, activeQuincena);

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

  const kpiRoutes = ["/clientesaldia", "/clientespendientes", "/clientesvencidos", "/clientes"];

  return (
    <AppShell title="Dashboard General">
      <div className="flex flex-col min-h-0 gap-6 lg:gap-8">
      <KpiCards
        kpis={kpis}
        onKpiClick={(index) => navigate({ to: kpiRoutes[index] })}
      />

      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          {
            to: "/tributarias" as const,
            title: "Obligaciones Tributarias",
            desc: "IVA SPE, IVA SPO, DPP, RET ISLR, Alcaldía",
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
            disabled: false,
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
            disabled: true,
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
            disabled: true,
          },
        ].map((m) =>
          m.disabled ? (
            <div
              key={m.to}
              className="bg-surface border border-border rounded-sm p-5 opacity-40 cursor-not-allowed select-none"
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
              </div>
            </div>
          ) : (
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
          ),
        )}
      </div>

      <SectionCard
        className="flex-1 flex flex-col min-h-0"
        title={
          <button
            onClick={() => setViewMode((v) => (v === "table" ? "calendar" : "table"))}
            className={`px-2 lg:px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${
              viewMode === "calendar"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-foreground border-border hover:bg-secondary"
            }`}
          >
            {viewMode === "table" ? "Calendario" : "Tabla"}
          </button>
        }
        actions={
          <>
            {viewMode === "table" && (
              <>
                <PeriodFilter
                  rows={conceptFiltered}
                  activePeriod={activePeriod}
                  onChange={setActivePeriod}
                />
                {activeFilter === "IVA SPE" && (
                  <QuincenaFilter
                    activeQuincena={activeQuincena}
                    onChange={setActiveQuincena}
                    quincenas={quincenasDisponibles}
                  />
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-2 lg:px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${
                    showFilters
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface border-border hover:bg-secondary"
                  }`}
                >
                  Filtros
                </button>
              </>
            )}
          </>
        }
      >
        {viewMode === "table" && showFilters && (
          <TableToolbar
            chips={[...conceptosPorTab.tributarias]}
            activeChip={activeFilter}
            onChipClick={(chip) => {
              setActiveFilter(chip);
              if (chip !== "IVA SPE") setActiveQuincena(null);
            }}
          />
        )}
        {viewMode === "table" ? (
          <DataTable rows={alertas} totalClientes={clientsCount} />
        ) : (
          <CalendarView rows={baseAlertas} />
        )}
      </SectionCard>
    </div>
    </AppShell>
  );
}
