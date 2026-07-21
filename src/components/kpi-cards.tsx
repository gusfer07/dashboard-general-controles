export type Kpi = {
  label: string;
  value: string;
  hint?: string;
  hintTone?: "success" | "warning" | "danger" | "muted";
  progress?: { value: number; tone: "success" | "warning" | "danger" };
};

const toneText: Record<string, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  muted: "text-muted-foreground",
};

const toneBar: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function KpiCards({ kpis, onKpiClick }: { kpis: Kpi[]; onKpiClick?: (index: number) => void }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {kpis.map((k, i) => (
        <div
          key={k.label}
          onClick={() => onKpiClick?.(i)}
          className="bg-surface p-5 border border-border rounded-sm shadow-sm cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all active:scale-[0.98]"
        >
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {k.label}
          </p>
          <div className="mt-2">
            <span className="text-3xl font-bold tracking-tighter text-primary-dark">{k.value}</span>
            {k.hint && (
              <p className={"text-[11px] font-bold mt-0.5 " + toneText[k.hintTone ?? "muted"]}>
                {k.hint}
              </p>
            )}
          </div>
          {k.progress ? (
            <div className="mt-4 w-full h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className={"h-full " + toneBar[k.progress.tone]}
                style={{ width: `${k.progress.value}%` }}
              />
            </div>
          ) : (
            <p className="text-[10px] text-muted-foreground font-mono mt-4">ACTIVOS EN SISTEMA</p>
          )}
        </div>
      ))}
    </div>
  );
}
