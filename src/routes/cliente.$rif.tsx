import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DataTable, SectionCard } from "@/components/data-table";
import { PeriodFilter } from "@/components/period-filter";
import { useClientBilling } from "@/hooks/use-client-billing";
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
  validateSearch: (search: Record<string, unknown>) => ({
    highlight: search.highlight as string | undefined,
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

function formatAcumulado(acumulado: string | null, moneda: string | null): string {
  if (!acumulado) return "—";
  const num = Number.parseFloat(acumulado);
  if (Number.isNaN(num)) return acumulado;
  const formatted = num.toFixed(2);
  switch (moneda?.toUpperCase()) {
    case "USD":
      return `${formatted}$`;
    case "EUR":
      return `${formatted}€`;
    default:
      return `${formatted} ${moneda ?? ""}`.trim();
  }
}

function ClientePageContent() {
  const { rif } = Route.useParams();
  const { highlight } = Route.useSearch();
  const { allRows, clients } = useDashboardData();
  const [activePeriod, setActivePeriod] = useState<string | null>(currentPeriod);
  const [activeQuincena, setActiveQuincena] = useState<string | null>(null);

  const client = clients.find((c) => c.rif === rif);
  const cualidad = client?.cualidad ?? null;
  const { data: clientFiles } = useClientFiles(client?.id);
  const { data: billing } = useClientBilling(client?.id);
  const [expandedBilling, setExpandedBilling] = useState(false);
  const [expandedArchivos, setExpandedArchivos] = useState(false);

  const hasBilling = !!billing;
  const hasFiles = !!clientFiles && clientFiles.length > 0;

  useEffect(() => {
    if (hasBilling) setExpandedBilling(true);
  }, [hasBilling]);

  useEffect(() => {
    if (hasFiles) setExpandedArchivos(true);
  }, [hasFiles]);

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
        <DataTable rows={filteredRows} hideClient highlightId={highlight} />
      </SectionCard>

      <SectionCard
        title={
          <button
            type="button"
            onClick={() => setExpandedBilling((v) => !v)}
            className={`flex items-center gap-2 cursor-pointer ${!hasBilling ? "text-muted-foreground/40" : ""}`}
          >
            Estado de Cuenta
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${expandedBilling ? "rotate-180" : ""} ${!hasBilling ? "text-muted-foreground/40" : ""}`}
            />
          </button>
        }
      >
        {!hasBilling ? (
          <p className="text-xs text-muted-foreground px-4 lg:px-6 py-3 lg:py-4">
            No hay estado de cuenta para este cliente
          </p>
        ) : (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedBilling ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 lg:px-6 py-3 lg:py-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <div
                  className="rounded-lg p-3 lg:p-4 space-y-1"
                  style={{
                    backgroundColor:
                      billing.mensualidad === "COBRAR" ? "#ffcfc9" :
                      billing.mensualidad === "COBRADO" ? "#bfe1f6" :
                      billing.mensualidad === "PAGADO" ? "#d4edbc" :
                      undefined,
                  }}
                >
                  <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wider">Mensualidad</p>
                  <div className="flex items-center">
                    <span className="text-sm lg:text-base font-semibold">{billing.monto_mensualidad ?? "—"}</span>
                    <span className="ml-auto text-lg lg:text-2xl font-bold text-muted-foreground">{billing.mensualidad ?? "—"}</span>
                  </div>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3 lg:p-4 space-y-1">
                  <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wider">Acumulado</p>
                  <p className="text-sm lg:text-base font-semibold">{formatAcumulado(billing.acumulado, billing.moneda)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title={
          <button
            type="button"
            onClick={() => setExpandedArchivos((v) => !v)}
            className={`flex items-center gap-2 cursor-pointer ${!hasFiles ? "text-muted-foreground/40" : ""}`}
          >
            Archivos
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${expandedArchivos ? "rotate-180" : ""} ${!hasFiles ? "text-muted-foreground/40" : ""}`}
            />
          </button>
        }
      >
        {!hasFiles ? (
          <p className="text-xs text-muted-foreground px-4 lg:px-6 py-3 lg:py-4">
            No hay archivos para este cliente
          </p>
        ) : (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedArchivos ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
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
