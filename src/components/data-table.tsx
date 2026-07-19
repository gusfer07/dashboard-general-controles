import { Fragment, useEffect, useMemo, useState } from "react";
import { responsables, type Row } from "@/lib/mock-data";

const MONTHS_ES: Record<string, number> = {
  ENE: 0,
  FEB: 1,
  MAR: 2,
  ABR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AGO: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DIC: 11,
};

const estadoStyles: Record<string, { dot: string; text: string }> = {
  "Al día": { dot: "bg-success", text: "text-success" },
  Pendiente: { dot: "bg-warning", text: "text-warning" },
  "En proceso": { dot: "bg-warning", text: "text-warning" },
  Vencido: { dot: "bg-danger", text: "text-danger" },
  "N/A": { dot: "bg-muted-foreground/40", text: "text-muted-foreground" },
};

const ESTADO_ORDER: Record<string, number> = {
  Vencido: 0,
  Pendiente: 1,
  "En proceso": 2,
  "Al día": 3,
  "N/A": 4,
};

function estadoSortKey(estado: string): number {
  return ESTADO_ORDER[estado] ?? 4;
}

function dateSortKey(vencimiento: string): number {
  if (vencimiento === "N/A") return Infinity;
  const parts = vencimiento.split("-");
  if (parts.length === 3 && parts[0].length <= 2) {
    const year = parseInt(parts[2], 10);
    const month = MONTHS_ES[parts[1]] ?? 0;
    const day = parseInt(parts[0], 10);
    if (!isNaN(year) && !isNaN(day)) {
      return year * 10000 + month * 100 + day;
    }
  }
  return Infinity;
}

function sortRows(rows: Row[]): Row[] {
  return [...rows].sort((a, b) => {
    const ea = estadoSortKey(a.estado);
    const eb = estadoSortKey(b.estado);
    if (ea !== eb) return ea - eb;
    return dateSortKey(a.vencimiento) - dateSortKey(b.vencimiento);
  });
}

const PAGE_SIZE = 10;

export function DataTable({
  rows,
  totalClientes = 103,
  hideClient,
}: { rows: Row[]; totalClientes?: number; hideClient?: boolean }) {
  const sorted = useMemo(() => sortRows(rows), [rows]);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = sorted.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [sorted.length]);

  function goTo(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)));
  }

  const windowStart = Math.max(1, Math.min(safePage, totalPages - 1));
  const windowPages: number[] = [];
  for (let i = windowStart; i <= Math.min(windowStart + 1, totalPages); i++) {
    windowPages.push(i);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <th className={`px-3 lg:px-6 py-3 font-semibold ${hideClient ? "hidden" : ""}`}>Cliente / Empresa</th>
            <th className="px-3 lg:px-6 py-3 font-semibold">Concepto</th>
            <th className="px-3 lg:px-6 py-3 font-semibold">Estado</th>
            <th className="px-3 lg:px-6 py-3 font-semibold">Vencimiento</th>
            <th className="px-3 lg:px-6 py-3 font-semibold">Responsable</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {visible.map((r, i) => {
            const s = estadoStyles[r.estado] || {
              dot: "bg-muted-foreground/40",
              text: "text-muted-foreground",
            };
            const resp =
              typeof r.responsable === "object" && r.responsable !== null
                ? r.responsable
                : responsables[r.responsable as string] || {
                    initials: String(r.responsable || ""),
                    name: String(r.responsable || ""),
                  };
            const vencidoText = r.estado === "Vencido";
            const isExpanded = r.id && expandedId === r.id;
            return (
              <Fragment key={i}>
                <tr
                  onClick={() => setExpandedId(isExpanded ? null : (r.id ?? null))}
                  className="group hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <td className={`px-3 lg:px-6 py-3 lg:py-4 ${hideClient ? "hidden" : ""}`}>
                    <p className="font-bold text-xs lg:text-sm">{r.cliente.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      RIF: {r.cliente.rif}
                    </p>
                  </td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4">
                    <span className="text-[10px] lg:text-xs font-medium px-1.5 lg:px-2 py-0.5 bg-secondary rounded">
                      {r.concepto}
                    </span>
                  </td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4">
                    <div className="flex items-center gap-1.5 lg:gap-2">
                      <span className={"size-1.5 rounded-full " + s.dot} />
                      <span
                        className={
                          "text-[10px] lg:text-xs font-bold uppercase tracking-wider " + s.text
                        }
                      >
                        {r.estado}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4">
                    <p
                      className={
                        "text-[10px] lg:text-xs font-mono " +
                        (vencidoText ? "text-danger font-bold" : "")
                      }
                    >
                      {r.vencimiento}
                    </p>
                  </td>
                  <td className="px-3 lg:px-6 py-3 lg:py-4">
                    <div className="flex items-center gap-1.5 lg:gap-2">
                      <div className="size-5 lg:size-6 rounded bg-secondary flex items-center justify-center text-[9px] lg:text-[10px] font-bold">
                        {resp.initials}
                      </div>
                      <span className="text-[10px] lg:text-xs">{resp.name}</span>
                    </div>
                  </td>
                </tr>
                <tr
                  className={`bg-secondary/30 transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                >
                  <td colSpan={5} className="px-3 lg:px-6 py-0 overflow-hidden">
                    <div
                      className={`transition-all duration-300 ${isExpanded ? "max-h-[100px] py-2 lg:py-3" : "max-h-0 py-0"}`}
                    >
                      {r.checksPendientes && r.checksPendientes.length > 0 ? (
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Pendiente por realizar:
                          </span>
                          {r.checksPendientes.map((check) => (
                            <span
                              key={check}
                              className="inline-flex items-center gap-1 text-xs text-danger"
                            >
                              <span className="size-1 rounded-full bg-danger" />
                              {check}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-success">
                          Todo completado
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>

      <div className="px-3 lg:px-6 py-3 lg:py-4 border-t border-border bg-secondary/40 flex items-center justify-between gap-2">
        <p className="text-[10px] lg:text-xs text-muted-foreground shrink-0">
          Página {safePage} de {totalPages} — {visible.length} de {sorted.length} registros
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => goTo(safePage - 1)}
            disabled={safePage <= 1}
            className="size-8 border border-border rounded flex items-center justify-center text-xs bg-surface hover:bg-secondary disabled:opacity-30"
          >
            ←
          </button>
          {windowPages.map((p) => (
            <button
              key={p}
              onClick={() => goTo(p)}
              className={
                "size-8 border rounded flex items-center justify-center text-xs " +
                (p === safePage
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface hover:bg-secondary")
              }
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => goTo(safePage + 1)}
            disabled={safePage >= totalPages}
            className="size-8 border border-border rounded flex items-center justify-center text-xs bg-surface hover:bg-secondary disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-surface border border-border rounded-sm overflow-x-auto">
      <div className="border-b border-border bg-secondary/40 px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between gap-2">
        <h2 className="text-xs lg:text-sm font-bold shrink-0">{title}</h2>
        <div className="flex gap-1.5 lg:gap-2 shrink-0">{actions}</div>
      </div>
      {children}
    </section>
  );
}

export function TableToolbar({
  chips,
  activeChip,
  onChipClick,
}: {
  chips: string[];
  activeChip: string | null;
  onChipClick: (chip: string | null) => void;
}) {
  return (
    <div className="border-b border-border bg-surface px-4 lg:px-6 py-2 lg:py-3 flex items-center justify-between flex-wrap gap-2">
      <div className="flex flex-wrap gap-1.5 lg:gap-2">
        <button
          onClick={() => onChipClick(null)}
          className={`text-[10px] font-bold uppercase tracking-wider px-2 lg:px-3 py-1 rounded border transition-all ${
            activeChip === null
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-surface text-muted-foreground hover:text-foreground"
          }`}
        >
          Todos
        </button>
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => onChipClick(c)}
            className={`text-[10px] font-bold uppercase tracking-wider px-2 lg:px-3 py-1 rounded border transition-all ${
              activeChip === c
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
