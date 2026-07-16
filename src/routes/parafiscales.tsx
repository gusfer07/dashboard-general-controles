import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { KpiCards } from "@/components/kpi-cards";
import { DataTable, SectionCard, TableToolbar } from "@/components/data-table";
import {
  useDashboardData,
  clientsQueryOptions,
  responsiblesQueryOptions,
  ivaSpeQueryOptions,
  ivaSpoQueryOptions,
} from "@/hooks/use-dashboard-data";
import { conceptosPorTab } from "@/lib/mock-data";

export const Route = createFileRoute("/parafiscales")({
  head: () => ({
    meta: [
      { title: "Parafiscales — Cortés & Asoc." },
      {
        name: "description",
        content:
          "Seguimiento de FAOV, IVSS, INCES, FONACIT SPE, FONACIT SPO y RUPDAE por cliente.",
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
  component: ParafiscalesPage,
});

function ParafiscalesPage() {
  const { parafiscales, clientsCount } = useDashboardData();

  // Calculate dynamic KPIs
  const total = parafiscales.length;
  const alDia = parafiscales.filter((r) => r.estado === "Al día").length;
  const enProceso = parafiscales.filter((r) => r.estado === "En proceso" || r.estado === "Pendiente").length;
  const vencidas = parafiscales.filter((r) => r.estado === "Vencido").length;

  const alDiaPct = total > 0 ? Math.round((alDia / total) * 100) : 0;
  const enProcesoPct = total > 0 ? Math.round((enProceso / total) * 100) : 0;
  const vencidasPct = total > 0 ? Math.round((vencidas / total) * 100) : 0;

  const kpis = [
    { label: "Enteradas", value: String(alDia).padStart(2, "0"), hint: `${alDiaPct}%`, hintTone: "success" as const, progress: { value: alDiaPct, tone: "success" as const } },
    { label: "Pendientes", value: String(enProceso).padStart(2, "0"), hint: `${enProcesoPct}%`, hintTone: "warning" as const, progress: { value: enProcesoPct, tone: "warning" as const } },
    { label: "Vencidas", value: String(vencidas).padStart(2, "0"), hint: `${vencidasPct}%`, hintTone: "danger" as const, progress: { value: vencidasPct, tone: "danger" as const } },
    { label: "Total", value: String(total).padStart(2, "0"), hint: "Aportes", hintTone: "muted" as const },
  ];

  return (
    <AppShell title="Parafiscales">
      <KpiCards kpis={kpis} />

      <SectionCard
        title="Detalle por cliente"
        actions={
          <button className="px-3 py-1 bg-surface border border-border rounded text-[10px] font-bold uppercase tracking-wider">
            Filtros
          </button>
        }
      >
        <TableToolbar chips={[...conceptosPorTab.parafiscales]} />
        <DataTable rows={parafiscales} totalClientes={clientsCount} />
      </SectionCard>
    </AppShell>
  );
}
