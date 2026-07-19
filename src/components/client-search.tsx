import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { clientsQueryOptions } from "@/hooks/use-dashboard-data";

export function ClientSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: clients } = useQuery(clientsQueryOptions);

  const filtered = query.trim()
    ? (clients || []).filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const visible = filtered.slice(0, 8);

  function handleSelect(c: { name: string; rif: string }) {
    setQuery("");
    setIsOpen(false);
    navigate({ to: "/cliente/$rif", params: { rif: c.rif } });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, visible.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0 && visible[selectedIndex]) {
      handleSelect(visible[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

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
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar cliente..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setSelectedIndex(-1);
        }}
        onFocus={() => query.trim() && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="bg-surface border border-border rounded-md pl-8 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {isOpen && visible.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 left-0 right-0 bg-surface border border-border rounded-md shadow-lg z-50 overflow-hidden"
        >
          {visible.map((c, i) => (
            <button
              key={c.rif}
              onClick={() => handleSelect(c)}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                i === selectedIndex ? "bg-secondary" : "hover:bg-secondary/50"
              }`}
            >
              <p className="font-medium">{c.name}</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                {c.rif}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
