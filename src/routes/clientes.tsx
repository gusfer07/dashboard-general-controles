import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
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

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [{ title: "Todos los Clientes" }],
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
  component: ClientesPage,
});

function ClientesPage() {
  const { clients } = useDashboardData();
  const navigate = useNavigate();

  const sorted = [...clients].sort((a, b) => {
    const cualA = a.cualidad ?? "";
    const cualB = b.cualidad ?? "";
    if (cualA !== cualB) {
      if (cualA === "SPE") return -1;
      if (cualB === "SPE") return 1;
      return cualA.localeCompare(cualB);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <AppShell title="Todos los Clientes">
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Todos los Clientes</h1>
        <p className="text-sm text-muted-foreground">
          {clients.length} clientes registrados en el sistema
        </p>
      </div>

      <div className="bg-surface border border-border rounded-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <TableHead className="px-6 py-3">Nombre</TableHead>
              <TableHead className="px-6 py-3">RIF</TableHead>
              <TableHead className="px-6 py-3">Cualidad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {sorted.map((client) => (
              <TableRow
                key={client.id}
                onClick={() => navigate({ to: "/cliente/$rif", params: { rif: client.rif } })}
                className="hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <TableCell className="px-6 py-3 font-bold text-xs lg:text-sm">
                  {client.name}
                </TableCell>
                <TableCell className="px-6 py-3 text-[10px] lg:text-xs font-mono text-muted-foreground whitespace-nowrap">
                  {client.rif}
                </TableCell>
                <TableCell className="px-6 py-3 text-[10px] lg:text-xs font-mono text-muted-foreground whitespace-nowrap">
                  {client.cualidad ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppShell>
  );
}
