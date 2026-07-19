import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { DataTable, SectionCard } from "@/components/data-table";
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

export const Route = createFileRoute("/cliente/$rif")({
  head: ({ params }) => ({
    meta: [{ title: `Cliente ${params.rif} — Dashboard General de Controles` }],
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
  component: ClientePage,
});

function ClientePageContent() {
  const { rif } = Route.useParams();
  const { allRows } = useDashboardData();

  const clientRows = allRows.filter((r) => r.cliente.rif === rif);
  const clientName = clientRows.length > 0
    ? clientRows[0].cliente.name
    : "Cliente no encontrado";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{clientName}</h2>
        <p className="text-sm font-mono text-muted-foreground">{rif}</p>
      </div>

      <SectionCard title="Alertas">
        <DataTable rows={clientRows} />
      </SectionCard>
    </div>
  );
}

function ClientePage() {
  return (
    <AppShell title="Detalle del Cliente">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando...</p>}>
        <ClientePageContent />
      </Suspense>
    </AppShell>
  );
}
