import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Row } from "@/hooks/use-dashboard-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const MONTHS_ES: Record<string, number> = {
  ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5,
  JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11,
};

const MONTH_NAMES = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
];

const DAY_HEADERS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

const ESTADO_DOT: Record<string, string> = {
  Vencido: "bg-danger",
  Pendiente: "bg-warning",
  "En proceso": "bg-warning",
  "Al día": "bg-success",
};

function parseVencimiento(v: string): Date | null {
  if (v === "N/A") return null;
  const p = v.split("-");
  if (p.length !== 3 || p[0].length > 2) return null;
  const d = parseInt(p[0], 10);
  const m = MONTHS_ES[p[1]];
  const y = parseInt(p[2], 10);
  if (isNaN(d) || m === undefined || isNaN(y)) return null;
  return new Date(y, m, d);
}

function buildGroups(rows: Row[], month: Date) {
  const map = new Map<number, Row[]>();
  const y = month.getFullYear();
  const m = month.getMonth();

  for (const r of rows) {
    const d = parseVencimiento(r.vencimiento);
    if (!d || d.getFullYear() !== y || d.getMonth() !== m) continue;
    const day = d.getDate();
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(r);
  }

  const groups: { day: number; rows: Row[]; estados: string[] }[] = [];
  for (const [day, dayRows] of map) {
    const estados: string[] = [];
    for (const e of ["Vencido", "Pendiente", "En proceso", "Al día"]) {
      if (dayRows.some((r) => r.estado === e)) {
        estados.push(e);
      }
    }
    groups.push({ day, rows: dayRows, estados });
  }
  return groups;
}

export function CalendarView({ rows }: { rows: Row[] }) {
  const firstRowDate = useMemo(() => {
    for (const r of rows) {
      const d = parseVencimiento(r.vencimiento);
      if (d) return d;
    }
    return new Date();
  }, [rows]);

  const [displayMonth, setDisplayMonth] = useState(() => {
    return new Date(firstRowDate.getFullYear(), firstRowDate.getMonth(), 1);
  });

  useEffect(() => {
    setDisplayMonth(new Date(firstRowDate.getFullYear(), firstRowDate.getMonth(), 1));
  }, [firstRowDate.getFullYear(), firstRowDate.getMonth()]);

  const groups = useMemo(() => buildGroups(rows, displayMonth), [rows, displayMonth]);

  const daysInMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0).getDate();
  const firstDow = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1).getDay();
  const startOffset = firstDow === 0 ? 6 : firstDow - 1;

  const groupMap = useMemo(() => {
    const m = new Map<number, (typeof groups)[number]>();
    for (const g of groups) m.set(g.day, g);
    return m;
  }, [groups]);

  const today = new Date();
  const isTodayMonth =
    today.getFullYear() === displayMonth.getFullYear() &&
    today.getMonth() === displayMonth.getMonth();

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm">
      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1))}
          className="size-7 flex items-center justify-center rounded hover:bg-secondary transition-colors text-muted-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-bold tracking-tight">
          {MONTH_NAMES[displayMonth.getMonth()]} {displayMonth.getFullYear()}
        </span>
        <button
          onClick={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1))}
          className="size-7 flex items-center justify-center rounded hover:bg-secondary transition-colors text-muted-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="px-1 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`e-${i}`} className="h-[42px]" />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const group = groupMap.get(day);
          const isToday = isTodayMonth && day === today.getDate();

          const cell = (
            <button
              className={`relative flex flex-col items-center justify-center w-full h-[42px] text-xs transition-colors
                ${group ? "cursor-pointer hover:bg-secondary/50" : "cursor-default"}
                ${isToday ? (group ? "ring-1 ring-primary/40" : "ring-1 ring-border") : ""}
                ${group ? "text-foreground" : "text-muted-foreground/40"}
              `}
            >
              <span className={`${isToday ? "font-bold" : "font-medium"} text-xs leading-none`}>{day}</span>
              <div className="flex items-center gap-[2px] mt-[2px] h-[4px]">
                {group?.estados?.slice(0, 3).map((e) => (
                  <span key={e} className={`size-1 rounded-full ${ESTADO_DOT[e] || "bg-muted-foreground/40"}`} />
                ))}
                {(!group || group.estados.length === 0) && (
                  <span className="size-1 rounded-full opacity-0" aria-hidden="true" />
                )}
              </div>
            </button>
          );

          if (!group) return <div key={day}>{cell}</div>;

          return (
            <Popover key={day}>
              <PopoverTrigger asChild>{cell}</PopoverTrigger>
              <PopoverContent align="start" side="bottom" className="w-80 p-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                  {day} de {MONTH_NAMES[displayMonth.getMonth()]} {displayMonth.getFullYear()}
                </p>
                <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                  {group.rows.map((r, idx) => {
                    const dc = ESTADO_DOT[r.estado] || "bg-muted-foreground/40";
                    return (
                      <div key={idx} className="flex items-start gap-2 p-1.5 rounded hover:bg-secondary/50 transition-colors">
                        <span className={`mt-0.5 size-1.5 rounded-full shrink-0 ${dc}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-medium px-1 py-0.5 bg-secondary rounded shrink-0">
                              {r.concepto}
                            </span>
                            <span className="text-xs font-bold truncate">{r.cliente.name}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{r.cliente.rif}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>

      {groups.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-6">
          {rows.length === 0
            ? "No hay alertas en el período seleccionado"
            : `No hay alertas para ${MONTH_NAMES[displayMonth.getMonth()].toLowerCase()} ${displayMonth.getFullYear()}`}
        </p>
      )}
    </div>
  );
}
