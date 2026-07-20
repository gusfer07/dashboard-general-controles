import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { KpiCards } from "@/components/kpi-cards";
import { DataTable, SectionCard, TableToolbar } from "@/components/data-table";
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
} from "@/hooks/use-dashboard-data";
import { conceptosPorTab } from "@/lib/mock-data";

export const Route = createFileRoute("/tributarias")({
  head: () => ({
    meta: [
      { title: "Obligaciones Tributarias" },
      {
        name: "description",
        content: "Control de IVA SPE, IVA SPO, DPP, RET ISLR y Alcaldía por cliente.",
      },
    ],
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
  component: TributariasPage,
});

function TributariasPage() {
  const { tributarias, clientsCount } = useDashboardData();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<string | null>(null);
  const [activeQuincena, setActiveQuincena] = useState<string | null>(null);

  const conceptFiltered = activeFilter
    ? tributarias.filter((r) => r.concepto === activeFilter)
    : tributarias;

  const ivaSpeRows = tributarias.filter((r) => r.concepto === "IVA SPE");
  const quincenasDisponibles = computeQuincenas(ivaSpeRows);
  const quincenaFiltered = filterByQuincena(conceptFiltered, activeQuincena);

  const filteredRows = activePeriod
    ? quincenaFiltered.filter((r) => {
        if (r.vencimiento === "N/A") return false;
        const parts = r.vencimiento.split("-");
        if (parts.length === 3 && parts[0].length <= 2) {
          return `${parts[1]} ${parts[2]}` === activePeriod;
        }
        return false;
      })
    : quincenaFiltered;

  const total = tributarias.length;
  const alDia = tributarias.filter((r) => r.estado === "Al día").length;
  const enProceso = tributarias.filter(
    (r) => r.estado === "En proceso" || r.estado === "Pendiente",
  ).length;
  const vencidas = tributarias.filter((r) => r.estado === "Vencido").length;

  const alDiaPct = total > 0 ? Math.round((alDia / total) * 100) : 0;
  const enProcesoPct = total > 0 ? Math.round((enProceso / total) * 100) : 0;
  const vencidasPct = total > 0 ? Math.round((vencidas / total) * 100) : 0;

  const kpis = [
    {
      label: "Presentadas",
      value: String(alDia).padStart(2, "0"),
      hint: `${alDiaPct}%`,
      hintTone: "success" as const,
      progress: { value: alDiaPct, tone: "success" as const },
    },
    {
      label: "En proceso",
      value: String(enProceso).padStart(2, "0"),
      hint: `${enProcesoPct}%`,
      hintTone: "warning" as const,
      progress: { value: enProcesoPct, tone: "warning" as const },
    },
    {
      label: "Vencidas",
      value: String(vencidas).padStart(2, "0"),
      hint: `${vencidasPct}%`,
      hintTone: "danger" as const,
      progress: { value: vencidasPct, tone: "danger" as const },
    },
    {
      label: "Total",
      value: String(total).padStart(2, "0"),
      hint: "Declaraciones",
      hintTone: "muted" as const,
    },
  ];

  return (
    <AppShell title="Obligaciones Tributarias">
      <KpiCards kpis={kpis} />

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
        <DataTable rows={filteredRows} totalClientes={clientsCount} />
      </SectionCard>
    </AppShell>
  );
}
