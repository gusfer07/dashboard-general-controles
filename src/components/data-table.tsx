import { responsables, type Row } from "@/lib/mock-data";

const estadoStyles: Record<string, { dot: string; text: string }> = {
  "Al día": { dot: "bg-success", text: "text-success" },
  Pendiente: { dot: "bg-warning", text: "text-warning" },
  "En proceso": { dot: "bg-warning", text: "text-warning" },
  Vencido: { dot: "bg-danger", text: "text-danger" },
  "N/A": { dot: "bg-muted-foreground/40", text: "text-muted-foreground" },
};

export function DataTable({
  rows,
  totalClientes = 103,
}: {
  rows: Row[];
  totalClientes?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <th className="px-6 py-3 font-semibold">Cliente / Empresa</th>
            <th className="px-6 py-3 font-semibold">Concepto</th>
            <th className="px-6 py-3 font-semibold">Estado</th>
            <th className="px-6 py-3 font-semibold">Vencimiento</th>
            <th className="px-6 py-3 font-semibold">Responsable</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r, i) => {
            const s = estadoStyles[r.estado] || { dot: "bg-muted-foreground/40", text: "text-muted-foreground" };
            const resp = typeof r.responsable === 'object' && r.responsable !== null
              ? r.responsable
              : (responsables[r.responsable as string] || { initials: String(r.responsable || ''), name: String(r.responsable || '') });
            const vencidoText = r.estado === "Vencido";
            return (
              <tr key={i} className="group hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-sm">{r.cliente.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">RIF: {r.cliente.rif}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2 py-0.5 bg-secondary rounded">
                    {r.concepto}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={"size-1.5 rounded-full " + s.dot} />
                    <span className={"text-xs font-bold uppercase tracking-wider " + s.text}>
                      {r.estado}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p
                     className={
                      "text-xs font-mono " + (vencidoText ? "text-danger font-bold" : "")
                    }
                  >
                    {r.vencimiento}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded bg-secondary flex items-center justify-center text-[10px] font-bold">
                      {resp.initials}
                    </div>
                    <span className="text-xs">{resp.name}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="px-6 py-4 border-t border-border bg-secondary/40 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Mostrando {rows.length} de {totalClientes} registros
        </p>
        <div className="flex gap-1">
          <button
            className="size-8 border border-border rounded flex items-center justify-center text-xs bg-surface hover:bg-secondary disabled:opacity-30"
            disabled
          >
            ←
          </button>
          <button className="size-8 border border-primary bg-primary text-primary-foreground rounded flex items-center justify-center text-xs">
            1
          </button>
          <button className="size-8 border border-border rounded flex items-center justify-center text-xs bg-surface hover:bg-secondary">
            2
          </button>
          <button className="size-8 border border-border rounded flex items-center justify-center text-xs bg-surface hover:bg-secondary">
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
    <section className="bg-surface border border-border rounded-sm overflow-hidden">
      <div className="border-b border-border bg-secondary/40 px-6 py-4 flex items-center justify-between">
        <h2 className="text-sm font-bold">{title}</h2>
        <div className="flex gap-2">{actions}</div>
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
    <div className="border-b border-border bg-surface px-6 py-3 flex items-center justify-between flex-wrap gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChipClick(null)}
          className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded border transition-all ${
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
            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded border transition-all ${
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
