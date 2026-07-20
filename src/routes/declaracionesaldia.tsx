import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DataTable } from "@/components/data-table";
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

export const Route = createFileRoute("/declaracionesaldia")({
  head: () => ({
    meta: [{ title: "Declaraciones al día" }],
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
  component: DeclaracionesAlDiaPage,
});

function DeclaracionesAlDiaPage() {
  const { allRows, clientsCount } = useDashboardData();
  const rows = allRows.filter((r) => r.estado === "Al día");

  return (
    <AppShell title="Declaraciones al día">
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Declaraciones al día</h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} declaraciones con estado al día
        </p>
      </div>

      <div className="bg-surface border border-border rounded-sm overflow-x-auto">
        <DataTable rows={rows} totalClientes={clientsCount} />
      </div>
    </AppShell>
  );
}
