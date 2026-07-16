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
  alcaldiaQueryOptions,
  dppQueryOptions,
  retislrQueryOptions,
} from "@/hooks/use-dashboard-data";
import { conceptosPorTab } from "@/lib/mock-data";

export const Route = createFileRoute("/tributarias")({
  head: () => ({
    meta: [
      { title: "Obligaciones Tributarias — Cortés & Asoc." },
      {
        name: "description",
        content:
          "Control de IVA SPE, IVA SPO, DPP, Retenciones ISLR y Alcaldía por cliente.",
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

  // Calculate dynamic KPIs
  const total = tributarias.length;
  const alDia = tributarias.filter((r) => r.estado === "Al día").length;
  const enProceso = tributarias.filter((r) => r.estado === "En proceso" || r.estado === "Pendiente").length;
  const vencidas = tributarias.filter((r) => r.estado === "Vencido").length;

  const alDiaPct = total > 0 ? Math.round((alDia / total) * 100) : 0;
  const enProcesoPct = total > 0 ? Math.round((enProceso / total) * 100) : 0;
  const vencidasPct = total > 0 ? Math.round((vencidas / total) * 100) : 0;

  const kpis = [
    { label: "Presentadas", value: String(alDia).padStart(2, "0"), hint: `${alDiaPct}%`, hintTone: "success" as const, progress: { value: alDiaPct, tone: "success" as const } },
    { label: "En proceso", value: String(enProceso).padStart(2, "0"), hint: `${enProcesoPct}%`, hintTone: "warning" as const, progress: { value: enProcesoPct, tone: "warning" as const } },
    { label: "Vencidas", value: String(vencidas).padStart(2, "0"), hint: `${vencidasPct}%`, hintTone: "danger" as const, progress: { value: vencidasPct, tone: "danger" as const } },
    { label: "Total", value: String(total).padStart(2, "0"), hint: "Declaraciones", hintTone: "muted" as const },
  ];

  return (
    <AppShell title="Obligaciones Tributarias">
      <KpiCards kpis={kpis} />

      <SectionCard
        title="Detalle por cliente"
        actions={
          <>
            <button className="px-3 py-1 bg-surface border border-border rounded text-[10px] font-bold uppercase tracking-wider">
              Filtros
            </button>
            <button className="px-3 py-1 bg-primary text-primary-foreground border border-primary rounded text-[10px] font-bold uppercase tracking-wider">
              Exportar
            </button>
          </>
        }
      >
        <TableToolbar chips={[...conceptosPorTab.tributarias]} />
        <DataTable rows={tributarias} totalClientes={clientsCount} />
      </SectionCard>
    </AppShell>
  );
}
