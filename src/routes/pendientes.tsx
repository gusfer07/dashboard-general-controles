import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
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

export const Route = createFileRoute("/pendientes")({
  head: () => ({
    meta: [{ title: "Declaraciones Pendientes" }],
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
  component: PendientesPage,
});

function PendientesPage() {
  const { allRows, clientsCount } = useDashboardData();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<string | null>(null);
  const [activeQuincena, setActiveQuincena] = useState<string | null>(null);

  const baseRows = allRows.filter(
    (r) => r.estado === "Pendiente" || r.estado === "En proceso",
  );

  const conceptFiltered = activeFilter
    ? baseRows.filter((r) => r.concepto === activeFilter)
    : baseRows;

  const ivaSpeRows = baseRows.filter((r) => r.concepto === "IVA SPE");
  const quincenasDisponibles = computeQuincenas(ivaSpeRows);
  const quincenaFiltered = filterByQuincena(conceptFiltered, activeQuincena);

  const rows = activePeriod
    ? quincenaFiltered.filter((r) => {
        if (r.vencimiento === "N/A") return false;
        const parts = r.vencimiento.split("-");
        if (parts.length === 3 && parts[0].length <= 2) {
          return `${parts[1]} ${parts[2]}` === activePeriod;
        }
        return false;
      })
    : quincenaFiltered;

  return (
    <AppShell title="Declaraciones Pendientes">
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Declaraciones Pendientes</h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} declaraciones pendientes o en proceso
        </p>
      </div>

      <SectionCard
        title="Detalle por cliente"
        actions={
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
        }
      >
        {showFilters && (
          <TableToolbar
            chips={[...conceptosPorTab.tributarias]}
            activeChip={activeFilter}
            onChipClick={(chip) => {
              setActiveFilter(chip);
              if (chip !== "IVA SPE") setActiveQuincena(null);
            }}
          />
        )}
          <DataTable rows={rows} totalClientes={clientsCount} />
      </SectionCard>
    </AppShell>
  );
}
