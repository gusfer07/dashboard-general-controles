import { r as __toESM } from "../_runtime.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as require_jsx_runtime, i as QueryClientProvider, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as ivaSpoQueryOptions, i as ivaSpeQueryOptions, n as clientsQueryOptions, o as responsiblesQueryOptions, r as dppQueryOptions, s as retislrQueryOptions, t as alcaldiaQueryOptions } from "./use-dashboard-data-Cida7o6X.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$5 } from "./cliente._rif-BMU1gnrf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CeMLnIEC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BwBy8Sks.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$4 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Dashboard General de Controles" },
			{
				name: "description",
				content: "Panel interno de control de declaraciones, parafiscales y libros legales de la cartera de clientes."
			},
			{
				name: "author",
				content: "Cortés & Asoc."
			},
			{
				property: "og:title",
				content: "Dashboard General de Controles"
			},
			{
				property: "og:description",
				content: "Estado consolidado de obligaciones tributarias, parafiscales y libros legales por cliente."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.svg",
			type: "image/svg+xml"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "es",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            ` } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$4.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$3 = () => import("./tributarias-BE8EaOvN.mjs");
var Route$3 = createFileRoute("/tributarias")({
	head: () => ({ meta: [{ title: "Obligaciones Tributarias" }, {
		name: "description",
		content: "Control de IVA SPE, IVA SPO, DPP, RET ISLR y Alcaldía por cliente."
	}] }),
	loader: async ({ context: { queryClient } }) => {
		await Promise.all([
			queryClient.ensureQueryData(clientsQueryOptions),
			queryClient.ensureQueryData(responsiblesQueryOptions),
			queryClient.ensureQueryData(ivaSpeQueryOptions),
			queryClient.ensureQueryData(ivaSpoQueryOptions),
			queryClient.ensureQueryData(alcaldiaQueryOptions),
			queryClient.ensureQueryData(dppQueryOptions),
			queryClient.ensureQueryData(retislrQueryOptions)
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./parafiscales-CBH2eaVl.mjs");
var Route$2 = createFileRoute("/parafiscales")({
	head: () => ({ meta: [{ title: "Parafiscales" }, {
		name: "description",
		content: "Seguimiento de FAOV, IVSS, INCES, FONACIT SPE, FONACIT SPO y RUPDAE por cliente."
	}] }),
	loader: async ({ context: { queryClient } }) => {
		await Promise.all([
			queryClient.ensureQueryData(clientsQueryOptions),
			queryClient.ensureQueryData(responsiblesQueryOptions),
			queryClient.ensureQueryData(ivaSpeQueryOptions),
			queryClient.ensureQueryData(ivaSpoQueryOptions)
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./libros-BKxkNOAZ.mjs");
var Route$1 = createFileRoute("/libros")({
	head: () => ({ meta: [{ title: "Libros" }, {
		name: "description",
		content: "Estado de los libros de Actas, Accionistas, Inventario, Mayor y Diario por cliente."
	}] }),
	loader: async ({ context: { queryClient } }) => {
		await Promise.all([
			queryClient.ensureQueryData(clientsQueryOptions),
			queryClient.ensureQueryData(responsiblesQueryOptions),
			queryClient.ensureQueryData(ivaSpeQueryOptions),
			queryClient.ensureQueryData(ivaSpoQueryOptions)
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./routes-UE4YCqeh.mjs");
var Route = createFileRoute("/")({
	loader: async ({ context: { queryClient } }) => {
		await Promise.all([
			queryClient.ensureQueryData(clientsQueryOptions),
			queryClient.ensureQueryData(responsiblesQueryOptions),
			queryClient.ensureQueryData(ivaSpeQueryOptions),
			queryClient.ensureQueryData(ivaSpoQueryOptions),
			queryClient.ensureQueryData(alcaldiaQueryOptions),
			queryClient.ensureQueryData(dppQueryOptions),
			queryClient.ensureQueryData(retislrQueryOptions)
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var TributariasRoute = Route$3.update({
	id: "/tributarias",
	path: "/tributarias",
	getParentRoute: () => Route$4
});
var ParafiscalesRoute = Route$2.update({
	id: "/parafiscales",
	path: "/parafiscales",
	getParentRoute: () => Route$4
});
var LibrosRoute = Route$1.update({
	id: "/libros",
	path: "/libros",
	getParentRoute: () => Route$4
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	LibrosRoute,
	ParafiscalesRoute,
	TributariasRoute,
	ClienteRifRoute: Route$5.update({
		id: "/cliente/$rif",
		path: "/cliente/$rif",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
