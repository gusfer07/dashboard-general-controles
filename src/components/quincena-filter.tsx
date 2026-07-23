import { useState, useRef, useEffect } from "react";

const MONTH_NUM: Record<string, string> = {
  ENE: "01", FEB: "02", MAR: "03", ABR: "04", MAY: "05", JUN: "06",
  JUL: "07", AGO: "08", SEP: "09", OCT: "10", NOV: "11", DIC: "12",
};

export function getQuincenca(vencimiento: string): string | null {
  const parts = vencimiento.split("-");
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  if (isNaN(day)) return null;
  const quincena = day <= 15 ? "01" : "02";
  const monthNum = MONTH_NUM[parts[1]];
  if (!monthNum) return null;
  return `${quincena}-${monthNum}${parts[2]}`;
}

function quincenaLabel(code: string): string {
  const parts = code.split("-");
  if (parts.length !== 2) return code;
  return parts[0] === "01" ? "Primera" : "Segunda";
}

export function computeQuincenas(rows: { vencimiento: string }[]): string[] {
  const set = new Set<string>();
  rows.forEach((r) => {
    if (r.vencimiento !== "N/A") {
      const q = getQuincenca(r.vencimiento);
      if (q) set.add(q);
    }
  });
  return [...set].sort();
}

export function filterByQuincena(
  rows: { vencimiento: string; concepto: string }[],
  activeQuincena: string | null,
): { vencimiento: string; concepto: string }[] {
  if (!activeQuincena) return rows;
  return rows.filter((r) => {
    const q = getQuincenca(r.vencimiento);
    return q === activeQuincena;
  });
}

export function QuincenaFilter({
  activeQuincena,
  onChange,
  quincenas,
}: {
  activeQuincena: string | null;
  onChange: (q: string | null) => void;
  quincenas: string[];
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

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="px-2 lg:px-3 py-1.5 bg-surface border border-border rounded-md text-[10px] lg:text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-secondary transition-colors"
      >
        {activeQuincena ? quincenaLabel(activeQuincena) : "Quincena"}
        <svg className="size-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
          <button
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary transition-colors ${
              activeQuincena === null ? "bg-primary/10 font-bold" : ""
            }`}
          >
            Todas
          </button>
          {quincenas.map((q) => (
            <button
              key={q}
              onClick={() => {
                onChange(q);
                setOpen(false);
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
  );
}
