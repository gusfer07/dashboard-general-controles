import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react, r as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as clientsQueryOptions } from "./use-dashboard-data-pGMcfYq6.mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Moon, c as Landmark, i as Receipt, l as BookOpen, n as Sun, o as Menu, r as Search, s as LayoutDashboard, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-table-Dfh8gz8U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "theme";
function getInitialTheme() {
	if (typeof window === "undefined") return "light";
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "dark" || stored === "light") return stored;
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function ThemeToggle() {
	const [theme, setTheme] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
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
		} catch {}
	};
	if (theme === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground transition-colors",
		"aria-label": "Cambiar tema",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-4 opacity-70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex-1 text-left",
			children: "Tema"
		})]
	});
	const Icon = theme === "dark" ? Sun : Moon;
	const label = theme === "dark" ? "Modo claro" : "Modo oscuro";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: toggle,
		className: "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors",
		"aria-label": label,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 opacity-70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex-1 text-left",
			children: label
		})]
	});
}
function ClientSearch() {
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)("");
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [selectedIndex, setSelectedIndex] = (0, import_react.useState)(-1);
	const inputRef = (0, import_react.useRef)(null);
	const dropdownRef = (0, import_react.useRef)(null);
	const { data: clients } = useQuery(clientsQueryOptions);
	const visible = (query.trim() ? (clients || []).filter((c) => c.name.toLowerCase().includes(query.toLowerCase())) : []).slice(0, 8);
	function handleSelect(c) {
		setQuery("");
		setIsOpen(false);
		navigate({
			to: "/cliente/$rif",
			params: { rif: c.rif }
		});
	}
	function handleKeyDown(e) {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((i) => Math.min(i + 1, visible.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((i) => Math.max(i - 1, 0));
		} else if (e.key === "Enter" && selectedIndex >= 0 && visible[selectedIndex]) handleSelect(visible[selectedIndex]);
		else if (e.key === "Escape") setIsOpen(false);
	}
	(0, import_react.useEffect)(() => {
		function handleClick(e) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target) && inputRef.current && !inputRef.current.contains(e.target)) setIsOpen(false);
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "text",
				placeholder: "Buscar cliente...",
				value: query,
				onChange: (e) => {
					setQuery(e.target.value);
					setIsOpen(true);
					setSelectedIndex(-1);
				},
				onFocus: () => query.trim() && setIsOpen(true),
				onKeyDown: handleKeyDown,
				className: "bg-surface border border-border rounded-md pl-8 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
			}),
			isOpen && visible.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: dropdownRef,
				className: "absolute top-full mt-1 left-0 right-0 bg-surface border border-border rounded-md shadow-lg z-50 overflow-hidden",
				children: visible.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handleSelect(c),
					onMouseEnter: () => setSelectedIndex(i),
					className: `w-full text-left px-3 py-2 text-sm transition-colors ${i === selectedIndex ? "bg-secondary" : "hover:bg-secondary/50"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: c.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground font-mono",
						children: c.rif
					})]
				}, c.rif))
			})
		]
	});
}
var navItems = [
	{
		to: "/",
		label: "Dashboard General",
		icon: LayoutDashboard,
		group: null,
		disabled: false
	},
	{
		to: "/tributarias",
		label: "Obligaciones Tributarias",
		icon: Receipt,
		group: "Operaciones",
		disabled: false
	},
	{
		to: "/parafiscales",
		label: "Parafiscales",
		icon: Landmark,
		group: "Operaciones",
		disabled: true
	},
	{
		to: "/libros",
		label: "Libros Legales",
		icon: BookOpen,
		group: "Operaciones",
		disabled: true
	}
];
function AppShell({ title, children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	const [mobileSearchOpen, setMobileSearchOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background font-display text-foreground",
		children: [
			sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-30 bg-black/40 lg:hidden",
				onClick: () => setSidebarOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `
          fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-border bg-surface flex flex-col
          transition-transform duration-300 lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex lg:hidden items-center justify-end px-4 pt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSidebarOpen(false),
							className: "size-7 flex items-center justify-center rounded hover:bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 p-4 space-y-1",
						children: navItems.map((item, i) => {
							const active = pathname === item.to;
							const prevGroup = i > 0 ? navItems[i - 1].group : null;
							const showGroup = item.group && item.group !== prevGroup;
							const Icon = item.icon;
							if (item.disabled) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "opacity-40 cursor-not-allowed select-none",
								children: [showGroup && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-4 pb-2 px-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest",
										children: item.group
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 opacity-70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
								})]
							}, item.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [showGroup && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-4 pb-2 px-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest",
									children: item.group
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								onClick: () => setSidebarOpen(false),
								className: "flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-colors " + (active ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"),
								children: [active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 bg-primary rounded-full" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 opacity-70" }), item.label]
							})] }, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[8px] lg:text-[9px] text-muted-foreground font-mono tracking-wider px-4 pt-3 pb-2 pl-7",
								children: "Dashboard General de Controles v0.1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSidebarOpen(true),
								className: "lg:hidden size-8 flex items-center justify-center rounded hover:bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-base lg:text-lg font-bold tracking-tight truncate",
								children: title
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden lg:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientSearch, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMobileSearchOpen(!mobileSearchOpen),
								className: "lg:hidden size-8 flex items-center justify-center rounded hover:bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
							})]
						})]
					}),
					mobileSearchOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:hidden px-4 py-2 border-b border-border bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientSearch, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in",
						children
					})
				]
			})
		]
	});
}
var responsables = {
	AM: {
		initials: "AM",
		name: "A. Machado"
	},
	RM: {
		initials: "RM",
		name: "R. Marín"
	},
	JV: {
		initials: "JV",
		name: "J. Vargas"
	},
	LP: {
		initials: "LP",
		name: "L. Peña"
	},
	CG: {
		initials: "CG",
		name: "C. Guédez"
	}
};
var clientes = [
	{
		name: "Inversiones Caracas C.A.",
		rif: "J-30492811-0"
	},
	{
		name: "Distribuidora Los Roques",
		rif: "J-41223904-1"
	},
	{
		name: "Manufacturas El Ávila",
		rif: "J-00219483-2"
	},
	{
		name: "Tecnología Orinoco S.A.",
		rif: "J-29503314-5"
	},
	{
		name: "Corporación Guayana C.A.",
		rif: "J-31558702-4"
	},
	{
		name: "Agroindustrial Portuguesa",
		rif: "J-40012287-7"
	},
	{
		name: "Servicios Marítimos La Guaira",
		rif: "J-29881143-9"
	},
	{
		name: "Constructora Andes 2000",
		rif: "J-30776612-3"
	}
];
clientes[0], clientes[1], clientes[2], clientes[3], clientes[4], clientes[5], clientes[6], clientes[7];
clientes[0], clientes[1], clientes[2], clientes[3], clientes[4], clientes[5], clientes[6], clientes[7];
clientes[0], clientes[1], clientes[2], clientes[3], clientes[4], clientes[5], clientes[6], clientes[7];
var conceptosPorTab = {
	tributarias: [
		"IVA SPE",
		"IVA SPO",
		"DPP",
		"RET ISLR",
		"Alcaldía"
	],
	parafiscales: [
		"FAOV",
		"IVSS",
		"INCES",
		"FONACIT SPE",
		"FONACIT SPO",
		"RUPDAE"
	],
	libros: [
		"Libro de Actas",
		"Libro de Accionistas",
		"Libro de Inventario",
		"Libro Mayor",
		"Libro Diario"
	]
};
var MONTHS_ES = {
	ENE: 0,
	FEB: 1,
	MAR: 2,
	ABR: 3,
	MAY: 4,
	JUN: 5,
	JUL: 6,
	AGO: 7,
	SEP: 8,
	OCT: 9,
	NOV: 10,
	DIC: 11
};
var estadoStyles = {
	"Al día": {
		dot: "bg-success",
		text: "text-success"
	},
	Pendiente: {
		dot: "bg-warning",
		text: "text-warning"
	},
	"En proceso": {
		dot: "bg-warning",
		text: "text-warning"
	},
	Vencido: {
		dot: "bg-danger",
		text: "text-danger"
	},
	"N/A": {
		dot: "bg-muted-foreground/40",
		text: "text-muted-foreground"
	}
};
var ESTADO_ORDER = {
	Vencido: 0,
	Pendiente: 1,
	"En proceso": 2,
	"Al día": 3,
	"N/A": 4
};
function estadoSortKey(estado) {
	return ESTADO_ORDER[estado] ?? 4;
}
function dateSortKey(vencimiento) {
	if (vencimiento === "N/A") return Infinity;
	const parts = vencimiento.split("-");
	if (parts.length === 3 && parts[0].length <= 2) {
		const year = parseInt(parts[2], 10);
		const month = MONTHS_ES[parts[1]] ?? 0;
		const day = parseInt(parts[0], 10);
		if (!isNaN(year) && !isNaN(day)) return year * 1e4 + month * 100 + day;
	}
	return Infinity;
}
function sortRows(rows) {
	return [...rows].sort((a, b) => {
		const ea = estadoSortKey(a.estado);
		const eb = estadoSortKey(b.estado);
		if (ea !== eb) return ea - eb;
		return dateSortKey(a.vencimiento) - dateSortKey(b.vencimiento);
	});
}
var PAGE_SIZE = 10;
function DataTable({ rows, totalClientes = 103, hideClient }) {
	const sorted = (0, import_react.useMemo)(() => sortRows(rows), [rows]);
	const [page, setPage] = (0, import_react.useState)(1);
	const [expandedId, setExpandedId] = (0, import_react.useState)(null);
	const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const start = (safePage - 1) * PAGE_SIZE;
	const visible = sorted.slice(start, start + PAGE_SIZE);
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [sorted.length]);
	function goTo(p) {
		setPage(Math.max(1, Math.min(p, totalPages)));
	}
	const windowStart = Math.max(1, Math.min(safePage, totalPages - 1));
	const windowPages = [];
	for (let i = windowStart; i <= Math.min(windowStart + 1, totalPages); i++) windowPages.push(i);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-x-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: `px-3 lg:px-6 py-3 font-semibold ${hideClient ? "hidden" : ""}`,
						children: "Cliente / Empresa"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 lg:px-6 py-3 font-semibold",
						children: "Concepto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 lg:px-6 py-3 font-semibold",
						children: "Estado"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 lg:px-6 py-3 font-semibold",
						children: "Vencimiento"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 lg:px-6 py-3 font-semibold",
						children: "Responsable"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-border",
				children: visible.map((r, i) => {
					const s = estadoStyles[r.estado] || {
						dot: "bg-muted-foreground/40",
						text: "text-muted-foreground"
					};
					const resp = typeof r.responsable === "object" && r.responsable !== null ? r.responsable : responsables[r.responsable] || {
						initials: String(r.responsable || ""),
						name: String(r.responsable || "")
					};
					const vencidoText = r.estado === "Vencido";
					const isExpanded = r.id && expandedId === r.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						onClick: () => setExpandedId(isExpanded ? null : r.id ?? null),
						className: "group hover:bg-secondary/50 transition-colors cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: `px-3 lg:px-6 py-3 lg:py-4 ${hideClient ? "hidden" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-xs lg:text-sm",
									children: r.cliente.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] font-mono text-muted-foreground",
									children: ["RIF: ", r.cliente.rif]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 lg:px-6 py-3 lg:py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] lg:text-xs font-medium px-1.5 lg:px-2 py-0.5 bg-secondary rounded",
									children: r.concepto
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 lg:px-6 py-3 lg:py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 lg:gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full " + s.dot }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] lg:text-xs font-bold uppercase tracking-wider " + s.text,
										children: r.estado
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 lg:px-6 py-3 lg:py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] lg:text-xs font-mono " + (vencidoText ? "text-danger font-bold" : ""),
									children: r.vencimiento
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 lg:px-6 py-3 lg:py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 lg:gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-5 lg:size-6 rounded bg-secondary flex items-center justify-center text-[9px] lg:text-[10px] font-bold",
										children: resp.initials
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] lg:text-xs",
										children: resp.name
									})]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: `bg-secondary/30 transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "px-3 lg:px-6 py-0 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `transition-all duration-300 ${isExpanded ? "max-h-[100px] py-2 lg:py-3" : "max-h-0 py-0"}`,
								children: r.checksPendientes && r.checksPendientes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Pendiente por realizar:"
									}), r.checksPendientes.map((check) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-xs text-danger",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1 rounded-full bg-danger" }), check]
									}, check))]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-success",
									children: "Todo completado"
								})
							})
						})
					})] }, i);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-3 lg:px-6 py-3 lg:py-4 border-t border-border bg-secondary/40 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[10px] lg:text-xs text-muted-foreground shrink-0",
				children: [
					"Página ",
					safePage,
					" de ",
					totalPages,
					" — ",
					visible.length,
					" de ",
					sorted.length,
					" registros"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => goTo(safePage - 1),
						disabled: safePage <= 1,
						className: "size-8 border border-border rounded flex items-center justify-center text-xs bg-surface hover:bg-secondary disabled:opacity-30",
						children: "←"
					}),
					windowPages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => goTo(p),
						className: "size-8 border rounded flex items-center justify-center text-xs " + (p === safePage ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:bg-secondary"),
						children: p
					}, p)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => goTo(safePage + 1),
						disabled: safePage >= totalPages,
						className: "size-8 border border-border rounded flex items-center justify-center text-xs bg-surface hover:bg-secondary disabled:opacity-30",
						children: "→"
					})
				]
			})]
		})]
	});
}
function SectionCard({ title, actions, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "bg-surface border border-border rounded-sm overflow-x-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-border bg-secondary/40 px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs lg:text-sm font-bold shrink-0",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1.5 lg:gap-2 shrink-0",
				children: actions
			})]
		}), children]
	});
}
function TableToolbar({ chips, activeChip, onChipClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-surface px-4 lg:px-6 py-2 lg:py-3 flex items-center justify-between flex-wrap gap-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-1.5 lg:gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onChipClick(null),
				className: `text-[10px] font-bold uppercase tracking-wider px-2 lg:px-3 py-1 rounded border transition-all ${activeChip === null ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-surface text-muted-foreground hover:text-foreground"}`,
				children: "Todos"
			}), chips.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onChipClick(c),
				className: `text-[10px] font-bold uppercase tracking-wider px-2 lg:px-3 py-1 rounded border transition-all ${activeChip === c ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-surface text-muted-foreground hover:text-foreground"}`,
				children: c
			}, c))]
		})
	});
}
//#endregion
export { conceptosPorTab as a, TableToolbar as i, DataTable as n, SectionCard as r, AppShell as t };
