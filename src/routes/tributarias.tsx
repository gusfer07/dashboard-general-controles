import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { DataTable, SectionCard } from "@/components/data-table";
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
  const [showInformes, setShowInformes] = useState(false);
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

  const informesRows = tributarias.filter(
    (r) => (r.concepto === "IVA SPE" || r.concepto === "IVA SPO") && r.checksPendientes?.includes("Informe"),
  );

  const informesFiltered = showInformes && activePeriod
    ? informesRows.filter((r) => {
        if (r.vencimiento === "N/A") return false;
        const parts = r.vencimiento.split("-");
        if (parts.length === 3 && parts[0].length <= 2) {
          return `${parts[1]} ${parts[2]}` === activePeriod;
        }
        return false;
      })
    : informesRows;

  const displayRows = showInformes ? informesFiltered : filteredRows;

  function ConceptFilterDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      }
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, []);
    return (
      <div className="relative" ref={ref}>
        <button onClick={() => { if (!showInformes) setOpen(!open); }} className={`px-2 lg:px-3 py-1.5 bg-surface border border-border rounded-md text-[10px] lg:text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${showInformes ? "opacity-30 cursor-not-allowed" : "hover:bg-secondary"}`}>
          {activeFilter ?? "Concepto"}
          <svg className="size-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="absolute left-0 top-full mt-1 z-50 min-w-[160px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
            <button onClick={() => { setActiveFilter(null); setOpen(false); setActiveQuincena(null); }} className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary transition-colors ${activeFilter === null ? "bg-primary/10 font-bold" : ""}`}>
              Todos los conceptos
            </button>
            {[...conceptosPorTab.tributarias].map((c) => (
              <button key={c} onClick={() => { setActiveFilter(c); setOpen(false); if (c !== "IVA SPE") setActiveQuincena(null); }} className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary transition-colors ${activeFilter === c ? "bg-primary/10 font-bold" : ""}`}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <AppShell title="Obligaciones Tributarias">

      <SectionCard
        title="Detalle por cliente"
        actions={
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
        }
      >
        <div className={`bg-secondary/30 transition-all duration-300 ${showFilters ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className={`transition-all duration-300 flex flex-wrap gap-2 items-center justify-end pr-3 ${showFilters ? "max-h-[160px] py-2 lg:py-3" : "max-h-0 py-0"}`}>
            <ConceptFilterDropdown />
            <PeriodFilter
              rows={conceptFiltered}
              activePeriod={activePeriod}
              onChange={setActivePeriod}
            />
            <div className={`transition-all duration-300 ${activeFilter === "IVA SPE" ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 overflow-hidden"}`}>
              <QuincenaFilter
                activeQuincena={activeQuincena}
                onChange={setActiveQuincena}
                quincenas={quincenasDisponibles}
              />
            </div>
            <button
              onClick={() => setShowInformes(!showInformes)}
              className={`px-2 lg:px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${
                showInformes
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface border-border hover:bg-secondary"
              }`}
            >
              INFORMES
            </button>
          </div>
        </div>
        <div key={`${activeFilter ?? "all"}-${activePeriod ?? "all"}-${activeQuincena ?? "all"}-${showInformes}`} className="animate-fade-in">
          <DataTable rows={displayRows} totalClientes={showInformes ? informesFiltered.length : clientsCount} hideEstado={showInformes} hideVencimiento={showInformes} />
        </div>
      </SectionCard>
    </AppShell>
  );
}
