import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { KpiCards } from "@/components/kpi-cards";
import { DataTable, SectionCard, TableToolbar } from "@/components/data-table";
import { PeriodFilter } from "@/components/period-filter";
import {
  useDashboardData,
  clientsQueryOptions,
  responsiblesQueryOptions,
  ivaSpeQueryOptions,
  ivaSpoQueryOptions,
} from "@/hooks/use-dashboard-data";
import { conceptosPorTab } from "@/lib/mock-data";

export const Route = createFileRoute("/libros")({
  head: () => ({
    meta: [
      { title: "Libros" },
      {
        name: "description",
        content:
          "Estado de los libros de Actas, Accionistas, Inventario, Mayor y Diario por cliente.",
      },
    ],
  }),
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(clientsQueryOptions),
      queryClient.ensureQueryData(responsiblesQueryOptions),
      queryClient.ensureQueryData(ivaSpeQueryOptions),
      queryClient.ensureQueryData(ivaSpoQueryOptions),
    ]);
  },
  component: LibrosPage,
});

function LibrosPage() {
  const { libros, clientsCount } = useDashboardData();
  const [activePeriod, setActivePeriod] = useState<string | null>(null);

  const filteredRows = activePeriod
    ? libros.filter((r) => {
        if (r.vencimiento === "N/A") return false;
        const parts = r.vencimiento.split("-");
        if (parts.length === 3 && parts[0].length <= 2) {
          return `${parts[1]} ${parts[2]}` === activePeriod;
        }
        return false;
      })
    : libros;

  // Calculate dynamic KPIs
  const total = libros.length;
  const alDia = libros.filter((r) => r.estado === "Al día").length;
  const enActualizacion = libros.filter(
    (r) => r.estado === "En proceso" || r.estado === "Pendiente",
  ).length;
  const conRetraso = libros.filter((r) => r.estado === "Vencido").length;

  const alDiaPct = total > 0 ? Math.round((alDia / total) * 100) : 0;
  const enActualizacionPct = total > 0 ? Math.round((enActualizacion / total) * 100) : 0;
  const conRetrasoPct = total > 0 ? Math.round((conRetraso / total) * 100) : 0;

  const kpis = [
    {
      label: "Al día",
      value: String(alDia).padStart(2, "0"),
      hint: `${alDiaPct}%`,
      hintTone: "success" as const,
      progress: { value: alDiaPct, tone: "success" as const },
    },
    {
      label: "En actualización",
      value: String(enActualizacion).padStart(2, "0"),
      hint: `${enActualizacionPct}%`,
      hintTone: "warning" as const,
      progress: { value: enActualizacionPct, tone: "warning" as const },
    },
    {
      label: "Con retraso",
      value: String(conRetraso).padStart(2, "0"),
      hint: `${conRetrasoPct}%`,
      hintTone: "danger" as const,
      progress: { value: conRetrasoPct, tone: "danger" as const },
    },
    {
      label: "Total",
      value: String(total).padStart(2, "0"),
      hint: "Libros",
      hintTone: "muted" as const,
    },
  ];

  return (
    <AppShell title="Libros Legales">
      <KpiCards kpis={kpis} />

      <SectionCard
        title="Detalle por cliente"
        actions={
          <>
            <PeriodFilter
              rows={libros}
              activePeriod={activePeriod}
              onChange={setActivePeriod}
            />
            <button className="px-3 py-1 bg-surface border border-border rounded text-[10px] font-bold uppercase tracking-wider">
              Filtros
            </button>
          </>
        }
      >
        <TableToolbar chips={[...conceptosPorTab.libros]} />
        <DataTable rows={filteredRows} totalClientes={clientsCount} />
      </SectionCard>
    </AppShell>
  );
}
