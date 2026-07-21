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

        <div className="flex flex-col items-center pt-6 pb-6 px-4 border-b border-border">
          <Link to="/">
            <img
              src="/LOGO CARRASCO SIN LETRAS.png"
              alt="Carrasco"
              className="h-20 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>
          <span className="mt-3 text-base font-bold tracking-tight text-primary-dark">CARRASCO & ASOCIADOS</span>
          <span className="mt-0.5 text-xs text-muted-foreground font-mono">J-50478211-4</span>
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
                    "flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-all duration-200 hover:translate-x-0.5 " +
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

        <div className="border-t border-border py-3 flex justify-center">
          <ThemeToggle />
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between gap-2">
          {mobileSearchOpen ? (
            <div className="flex-1 flex lg:hidden">
              <ClientSearch onClose={() => setMobileSearchOpen(false)} />
            </div>
          ) : (
            <>
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
                  onClick={() => setMobileSearchOpen(true)}
                  className="lg:hidden size-8 flex items-center justify-center rounded hover:bg-secondary"
                >
                  <SearchIcon className="size-4" />
                </button>
              </div>
            </>
          )}
        </header>

        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
