import { useState, useRef, useEffect } from "react";
import type { Row } from "@/hooks/use-dashboard-data";

const MONTHS_ES: Record<string, number> = {
  ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5,
  JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11,
};

function extractPeriod(vencimiento: string): string | null {
  const parts = vencimiento.split("-");
  if (parts.length === 3 && parts[0].length <= 2) {
    return `${parts[1]} ${parts[2]}`;
  }
  return null;
}

function sortPeriods(periods: string[]): string[] {
  return [...periods].sort((a, b) => {
    const [mA, yA] = a.split(" ");
    const [mB, yB] = b.split(" ");
    const nA = Number(yA) * 12 + (MONTHS_ES[mA] ?? 0);
    const nB = Number(yB) * 12 + (MONTHS_ES[mB] ?? 0);
    return nB - nA;
  });
}

export function PeriodFilter({
  rows,
  activePeriod,
  onChange,
}: {
  rows: Row[];
  activePeriod: string | null;
  onChange: (period: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const periodSet = new Set<string>();
  rows.forEach((r) => {
    if (r.vencimiento !== "N/A") {
      const p = extractPeriod(r.vencimiento);
      if (p) periodSet.add(p);
    }
  });
  const availablePeriods = sortPeriods([...periodSet]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 bg-surface border border-border rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-secondary transition-colors"
      >
        {activePeriod ?? "Todos los períodos"}
        <svg className="size-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[160px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
          <button
            onClick={() => { onChange(null); setOpen(false); }}
            className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary transition-colors ${
              activePeriod === null ? "bg-primary/10 font-bold" : ""
            }`}
          >
            Todos los períodos
          </button>
          {availablePeriods.map((p) => (
            <button
              key={p}
              onClick={() => { onChange(p); setOpen(false); }}
              className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary transition-colors ${
                activePeriod === p ? "bg-primary/10 font-bold" : ""
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
