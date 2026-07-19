import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Receipt, Landmark, BookOpen, Search } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { to: "/", label: "Dashboard General", icon: LayoutDashboard, group: null, disabled: false },
  { to: "/tributarias", label: "Obligaciones Tributarias", icon: Receipt, group: "Operaciones", disabled: false },
  { to: "/parafiscales", label: "Parafiscales", icon: Landmark, group: "Operaciones", disabled: true },
  { to: "/libros", label: "Libros Legales", icon: BookOpen, group: "Operaciones", disabled: true },
] as const;

export function AppShell({
  title,
  period = "Marzo 2024",
  children,
}: {
  title: string;
  period?: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background font-display text-foreground">
      <aside className="w-auto min-w-[16rem] shrink-0 border-r border-border bg-surface flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 min-w-[2rem] min-h-[2rem] bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">
              C
            </div>
            <span className="font-extrabold tracking-tighter text-xl whitespace-nowrap">
              Carrasco & Asociados
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono mt-1 tracking-widest">
            GESTIÓN DE CONTROLES v1.0
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item, i) => {
            const active = pathname === item.to;
            const prevGroup = i > 0 ? navItems[i - 1].group : null;
            const showGroup = item.group && item.group !== prevGroup;
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <div key={item.to} className="opacity-40 cursor-not-allowed select-none">
                  {showGroup && (
                    <div className="pt-4 pb-2 px-3">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {item.group}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm text-muted-foreground">
                    <Icon className="size-4 opacity-70" />
                    <span>{item.label}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.to}>
                {showGroup && (
                  <div className="pt-4 pb-2 px-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {item.group}
                    </span>
                  </div>
                )}
                <Link
                  to={item.to}
                  className={
                    "flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-colors " +
                    (active
                      ? "bg-primary/5 text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")
                  }
                >
                  {active ? (
                    <span className="size-2 bg-primary rounded-full" />
                  ) : (
                    <Icon className="size-4 opacity-70" />
                  )}
                  {item.label}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <ThemeToggle />
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-8 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">{title}</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                className="bg-surface border border-border rounded-md pl-8 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="px-3 py-1.5 bg-surface border border-border rounded-md text-xs font-bold uppercase tracking-wider">
              {period}
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
