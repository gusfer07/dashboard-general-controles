import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
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

const MONTH_NUM: Record<string, string> = {
  ENE: "01", FEB: "02", MAR: "03", ABR: "04", MAY: "05", JUN: "06",
  JUL: "07", AGO: "08", SEP: "09", OCT: "10", NOV: "11", DIC: "12",
};

const MONTH_NAMES = ["", "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

function getQuincenca(vencimiento: string): string | null {
  const parts = vencimiento.split("-");
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  if (isNaN(day)) return null;
  const quincena = day <= 15 ? "01" : "02";
  const monthNum = MONTH_NUM[parts[1]];
  if (!monthNum) return null;
  return `${quincena}-${monthNum}${parts[2]}`;
}

function parseQuincenaMonthYear(code: string): { quincena: string; month: number; year: number } | null {
  const parts = code.split("-");
  if (parts.length !== 2) return null;
  const monthYear = parts[1];
  const month = parseInt(monthYear.substring(0, 2), 10);
  const year = parseInt(monthYear.substring(2), 10);
  if (isNaN(month) || isNaN(year)) return null;
  return { quincena: parts[0], month, year };
}

function quincenaLabel(code: string): string {
  const p = parseQuincenaMonthYear(code);
  if (!p) return code;
  const label = p.quincena === "01" ? "Primera quincena" : "Segunda quincena";
  return `${label} de ${MONTH_NAMES[p.month]} ${p.year}`;
}

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
  const { tributarias, parafiscales, libros, kpis, allRows, clientsCount } = useDashboardData();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<string | null>(null);
  const [activeQuincena, setActiveQuincena] = useState<string | null>(null);
  const [quincenaOpen, setQuincenaOpen] = useState(false);
  const quincenaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (quincenaRef.current && !quincenaRef.current.contains(e.target as Node)) {
        setQuincenaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const baseAlertas = allRows.filter((r) => r.estado === "Vencido" || r.estado === "Pendiente");

  const conceptFiltered = activeFilter
    ? baseAlertas.filter((r) => r.concepto === activeFilter)
    : baseAlertas;

  const ivaSpeRows = baseAlertas.filter((r) => r.concepto === "IVA SPE");

  const quincenaSet = new Set<string>();
  ivaSpeRows.forEach((r) => {
    if (r.vencimiento !== "N/A") {
      const q = getQuincenca(r.vencimiento);
      if (q) quincenaSet.add(q);
    }
  });
  const quincenasDisponibles = [...quincenaSet].sort();

  const quincenaFiltered = activeQuincena && activeFilter === "IVA SPE"
    ? conceptFiltered.filter((r) => {
        if (r.concepto !== "IVA SPE") return true;
        const q = getQuincenca(r.vencimiento);
        return q === activeQuincena;
      })
    : conceptFiltered;

  const alertas = activePeriod
    ? quincenaFiltered.filter((r) => {
        if (r.vencimiento === "N/A") return false;
        const parts = r.vencimiento.split("-");
        if (parts.length === 3 && parts[0].length <= 2) {
          return `${parts[1]} ${parts[2]}` === activePeriod;
        }
        return false;
      })
    : quincenaFiltered;

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

  const kpiRoutes = ["/declaracionesaldia", "/pendientes", "/vencidas", "/clientes"];

  return (
    <AppShell title="Dashboard General">
      <KpiCards
        kpis={kpis}
        onKpiClick={(index) => navigate({ to: kpiRoutes[index] })}
      />

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
            onChipClick={(chip) => {
              setActiveFilter(chip);
              if (chip !== "IVA SPE") setActiveQuincena(null);
            }}
          />
        )}
        {activeFilter === "IVA SPE" && (
          <div className="relative border-b border-border bg-surface px-4 lg:px-6 py-2 lg:py-3 flex items-center gap-2 flex-wrap" ref={quincenaRef}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
              QUINCENA
            </span>
            <button
              onClick={() => setQuincenaOpen(!quincenaOpen)}
              className="px-2 lg:px-3 py-1.5 bg-surface border border-border rounded-md text-[10px] lg:text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-secondary transition-colors"
            >
              {activeQuincena ? quincenaLabel(activeQuincena) : "Seleccionar"}
              <svg className="size-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {quincenaOpen && (
              <div className="absolute left-4 lg:left-6 top-full mt-1 z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
                <button
                  onClick={() => {
                    setActiveQuincena(null);
                    setQuincenaOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary transition-colors ${
                    activeQuincena === null ? "bg-primary/10 font-bold" : ""
                  }`}
                >
                  Todas
                </button>
                {quincenasDisponibles.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setActiveQuincena(q);
                      setQuincenaOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary transition-colors ${
                      activeQuincena === q ? "bg-primary/10 font-bold" : ""
                    }`}
                  >
                    {quincenaLabel(q)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <DataTable rows={alertas} totalClientes={clientsCount} />
      </SectionCard>
    </AppShell>
  );
}
