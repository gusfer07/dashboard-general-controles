import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DataTable, SectionCard } from "@/components/data-table";
import { PeriodFilter } from "@/components/period-filter";
import { useClientFiles, getFileDownloadUrl } from "@/hooks/use-client-files";
import {
  QuincenaFilter,
  computeQuincenas,
  filterByQuincena,
} from "@/components/quincena-filter";
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

const MONTHS_ES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

function currentPeriod(): string {
  const now = new Date();
  return `${MONTHS_ES[now.getMonth()]} ${now.getFullYear()}`;
}

function ClientePageContent() {
  const { rif } = Route.useParams();
  const { allRows, clients } = useDashboardData();
  const [activePeriod, setActivePeriod] = useState<string | null>(currentPeriod);
  const [activeQuincena, setActiveQuincena] = useState<string | null>(null);

  const client = clients.find((c) => c.rif === rif);
  const cualidad = client?.cualidad ?? null;
  const { data: clientFiles } = useClientFiles(client?.id);

  const clientRows = allRows.filter((r) => r.cliente.rif === rif);
  const clientName = clientRows.length > 0 ? clientRows[0].cliente.name : "Cliente no encontrado";

  const periodFiltered = activePeriod
    ? clientRows.filter((r) => {
        if (r.vencimiento === "N/A") return false;
        const parts = r.vencimiento.split("-");
        if (parts.length === 3 && parts[0].length <= 2) {
          return `${parts[1]} ${parts[2]}` === activePeriod;
        }
        return false;
      })
    : clientRows;

  const quincenas = computeQuincenas(periodFiltered);

  const filteredRows =
    cualidad === "SPE" ? filterByQuincena(periodFiltered, activeQuincena) : periodFiltered;

  const periodResponsable = (() => {
    const conceptKey = cualidad === "SPE" ? "IVA SPE" : cualidad === "SPO" ? "IVA SPO" : null;
    if (!conceptKey) return null;
    const match = filteredRows.find((r) => r.concepto === conceptKey);
    return match?.responsable ?? null;
  })();

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg lg:text-2xl font-bold break-words">{clientName}</h2>
        <p className="text-[10px] lg:text-sm font-mono text-muted-foreground">{rif}</p>
        {periodResponsable && (
          <p className="text-[10px] lg:text-xs text-muted-foreground">
            Responsable del período:{" "}
            <span className="font-semibold text-foreground">{periodResponsable.name}</span>
          </p>
        )}
      </div>

      <SectionCard
        title="Alertas"
        actions={
          <div className="flex items-center gap-1.5 lg:gap-2">
            <PeriodFilter
              rows={clientRows}
              activePeriod={activePeriod}
              onChange={(p) => {
                setActivePeriod(p);
                setActiveQuincena(null);
              }}
            />
            {cualidad === "SPE" && (
              <QuincenaFilter
                activeQuincena={activeQuincena}
                onChange={setActiveQuincena}
                quincenas={quincenas}
              />
            )}
          </div>
        }
      >
        <DataTable rows={filteredRows} hideClient />
      </SectionCard>

      <SectionCard title="Archivos">
        {!clientFiles || clientFiles.length === 0 ? (
          <p className="text-xs text-muted-foreground px-4 lg:px-6 py-3 lg:py-4">
            No hay archivos para este cliente
          </p>
        ) : (
          <div className="divide-y divide-border">
            {clientFiles.map((f) => (
              <a
                key={f.id}
                href={getFileDownloadUrl(f.storage_path)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 hover:bg-secondary/50 transition-colors"
              >
                <span className="text-xs font-medium">{f.filename}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary shrink-0">
                  Descargar
                </span>
              </a>
            ))}
          </div>
        )}
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
