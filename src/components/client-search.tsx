import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Search, X, Building2, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { clientsQueryOptions, responsiblesQueryOptions } from "@/hooks/use-dashboard-data";

type Result =
  | { type: "client"; name: string; rif: string }
  | { type: "responsable"; name: string; id: string; initials: string };

export function ClientSearch({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: clients } = useQuery(clientsQueryOptions);
  const { data: responsibles } = useQuery(responsiblesQueryOptions);

  const filteredClients = query.trim()
    ? (clients || []).filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredResps = query.trim()
    ? (responsibles || []).filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const results: Result[] = [
    ...filteredClients.slice(0, 8).map((c) => ({ type: "client" as const, name: c.name, rif: c.rif })),
    ...filteredResps.slice(0, 4).map((r) => ({ type: "responsable" as const, name: r.name, id: r.id, initials: r.initials })),
  ];

  const hasClients = filteredClients.length > 0;
  const hasResps = filteredResps.length > 0;

  function handleSelect(item: Result) {
    setQuery("");
    setIsOpen(false);
    if (item.type === "client") {
      navigate({ to: "/cliente/$rif", params: { rif: item.rif } });
    } else {
      navigate({ to: "/responsable/$id", params: { id: item.id } });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    if (onClose && inputRef.current) inputRef.current.focus();
  }, [onClose]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar cliente o responsable..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setSelectedIndex(-1);
        }}
        onFocus={() => query.trim() && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="bg-surface border border-border rounded-md pl-8 pr-4 py-1.5 text-base w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center rounded hover:bg-secondary transition-colors"
        >
          <X className="size-4" />
        </button>
      )}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 left-0 right-0 bg-surface border border-border rounded-md shadow-lg z-50 overflow-hidden"
        >
          {hasClients && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Building2 className="size-3" />
              Clientes
            </div>
          )}
          {filteredClients.slice(0, 8).map((c, i) => (
            <button
              key={`c-${c.rif}`}
              onClick={() => handleSelect({ type: "client", name: c.name, rif: c.rif })}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                selectedIndex === i ? "bg-secondary" : "hover:bg-secondary/50"
              }`}
            >
              <p className="font-medium">{c.name}</p>
              <p className="text-[10px] text-muted-foreground font-mono">{c.rif}</p>
            </button>
          ))}
          {hasResps && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 border-t border-border/50 mt-1">
              <User className="size-3" />
              Responsables
            </div>
          )}
          {filteredResps.slice(0, 4).map((r, i) => {
            const idx = filteredClients.slice(0, 8).length + i;
            return (
              <button
                key={`r-${r.id}`}
                onClick={() => handleSelect({ type: "responsable", name: r.name, id: r.id, initials: r.initials })}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  selectedIndex === idx ? "bg-secondary" : "hover:bg-secondary/50"
                }`}
              >
                <p className="font-medium">{r.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{r.initials}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
