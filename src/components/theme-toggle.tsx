import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  if (theme === null) {
    // Avoid hydration mismatch: render a neutral placeholder until the client theme is known.
    return (
      <button
        type="button"
        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground transition-colors"
        aria-label="Cambiar tema"
      >
        <span className="size-4 opacity-70" />
        <span className="flex-1 text-left">Tema</span>
      </button>
    );
  }

  const Icon = theme === "dark" ? Sun : Moon;
  const label = theme === "dark" ? "Modo claro" : "Modo oscuro";

  return (
    <button
      type="button"
      onClick={toggle}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
      aria-label={label}
    >
      <Icon className="size-4 opacity-70" />
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}
