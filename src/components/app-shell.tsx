import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Receipt, Landmark, BookOpen, Menu, X, SearchIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ThemeToggle } from "./theme-toggle";
import { ClientSearch } from "./client-search";

const navItems = [
  { to: "/", label: "Dashboard General", icon: LayoutDashboard, group: null, disabled: false },
  {
    to: "/tributarias",
    label: "Obligaciones Tributarias",
    icon: Receipt,
    group: "Operaciones",
    disabled: false,
  },
  {
    to: "/parafiscales",
    label: "Parafiscales",
    icon: Landmark,
    group: "Operaciones",
    disabled: true,
  },
  { to: "/libros", label: "Libros Legales", icon: BookOpen, group: "Operaciones", disabled: true },
] as const;

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background font-display text-foreground">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-border bg-surface flex flex-col
          transition-transform duration-300 lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex lg:hidden items-center justify-end px-4 pt-3">
          <button
            onClick={() => setSidebarOpen(false)}
            className="size-7 flex items-center justify-center rounded hover:bg-secondary"
          >
            <X className="size-3.5" />
          </button>
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
                      <span className="text-[10px] font-bold text-primary-dark uppercase tracking-widest">
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
                    <span className="text-[10px] font-bold text-primary-dark uppercase tracking-widest">
                      {item.group}
                    </span>
                  </div>
                )}
                <Link
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={
                    "flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-colors " +
                    (active
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground")
                  }
                >
                  {active ? (
                    <span className="size-2 bg-sidebar-primary rounded-full" />
                  ) : (
                    <Icon className="size-4 opacity-70" />
                  )}
                  {item.label}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-border">
          <p className="text-[8px] lg:text-[9px] text-muted-foreground font-mono tracking-wider px-4 pt-3 pb-2 pl-7">
            Dashboard General de Controles v0.1
          </p>
          <div className="border-t border-border" />
          <div className="p-4">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden size-8 flex items-center justify-center rounded hover:bg-secondary"
            >
              <Menu className="size-4" />
            </button>
            <h1 className="text-base lg:text-lg font-bold tracking-tight truncate text-primary-dark">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <ClientSearch />
            </div>
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden size-8 flex items-center justify-center rounded hover:bg-secondary"
            >
              <SearchIcon className="size-4" />
            </button>
          </div>
        </header>

        {mobileSearchOpen && (
          <div className="lg:hidden px-4 py-2 border-b border-border bg-surface">
            <ClientSearch />
          </div>
        )}

        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
