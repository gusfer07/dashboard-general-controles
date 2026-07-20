import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { KpiCards } from "@/components/kpi-cards";
import { DataTable, SectionCard, TableToolbar } from "@/components/data-table";
import { PeriodFilter } from "@/components/period-filter";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

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
  const { tributarias, parafiscales, libros, kpis, allRows, clients, clientsCount } = useDashboardData();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<string | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<number | null>(null);

  const baseAlertas = allRows.filter((r) => r.estado === "Vencido" || r.estado === "Pendiente");

  const conceptFiltered = activeFilter
    ? baseAlertas.filter((r) => r.concepto === activeFilter)
    : baseAlertas;

  const alertas = activePeriod
    ? conceptFiltered.filter((r) => {
        if (r.vencimiento === "N/A") return false;
        const parts = r.vencimiento.split("-");
        if (parts.length === 3 && parts[0].length <= 2) {
          return `${parts[1]} ${parts[2]}` === activePeriod;
        }
        return false;
      })
    : conceptFiltered;

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

  const alDiaRows = allRows.filter((r) => r.estado === "Al día");
  const pendienteRows = allRows.filter(
    (r) => r.estado === "Pendiente" || r.estado === "En proceso",
  );
  const vencidaRows = allRows.filter((r) => r.estado === "Vencido");

  function handleKpiClick(index: number) {
    setSelectedKpi(index);
  }

  return (
    <AppShell title="Dashboard General">
      <KpiCards kpis={kpis} onKpiClick={handleKpiClick} />

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
        title="Alertas"
        actions={
          <>
            <PeriodFilter
              rows={conceptFiltered}
              activePeriod={activePeriod}
              onChange={setActivePeriod}
            />
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
            onChipClick={setActiveFilter}
          />
        )}
        <DataTable rows={alertas} totalClientes={clientsCount} />
      </SectionCard>

      <Dialog open={selectedKpi !== null} onOpenChange={(open) => { if (!open) setSelectedKpi(null); }}>
        <DialogContent className="max-w-4xl max-h-[85dvh] overflow-y-auto w-[95vw] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base lg:text-lg">
              {selectedKpi === 0 && "Declaraciones al día"}
              {selectedKpi === 1 && "Declaraciones Pendientes"}
              {selectedKpi === 2 && "Declaraciones Vencidas"}
              {selectedKpi === 3 && "Todos los Clientes"}
            </DialogTitle>
            <DialogDescription>
              {selectedKpi === 0 && `${alDiaRows.length} declaraciones al día`}
              {selectedKpi === 1 && `${pendienteRows.length} declaraciones pendientes`}
              {selectedKpi === 2 && `${vencidaRows.length} declaraciones vencidas`}
              {selectedKpi === 3 && `${clients.length} clientes registrados`}
            </DialogDescription>
          </DialogHeader>

          {selectedKpi !== null && selectedKpi < 3 && (
            <div className="-mx-6">
              <DataTable
                rows={
                  selectedKpi === 0
                    ? alDiaRows
                    : selectedKpi === 1
                      ? pendienteRows
                      : vencidaRows
                }
                totalClientes={clientsCount}
              />
            </div>
          )}

          {selectedKpi === 3 && (
            <div className="overflow-x-auto -mx-6">
              <Table>
                <TableHeader>
                  <TableRow className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <TableHead className="px-6 py-3">Nombre</TableHead>
                    <TableHead className="px-6 py-3">RIF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                  {clients.map((client) => (
                    <TableRow
                      key={client.id}
                      className="hover:bg-secondary/50 transition-colors"
                    >
                      <TableCell className="px-6 py-3 font-medium text-xs lg:text-sm">
                        {client.name}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-[10px] lg:text-xs font-mono text-muted-foreground">
                        {client.rif}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}