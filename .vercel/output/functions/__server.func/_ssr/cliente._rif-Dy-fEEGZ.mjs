import { a as ivaSpoQueryOptions, i as ivaSpeQueryOptions, n as clientsQueryOptions, o as responsiblesQueryOptions, r as dppQueryOptions, s as retislrQueryOptions, t as alcaldiaQueryOptions } from "./use-dashboard-data-pGMcfYq6.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cliente._rif-Dy-fEEGZ.js
var $$splitComponentImporter = () => import("./cliente._rif-DY5o1jLX.mjs");
var Route = createFileRoute("/cliente/$rif")({
	head: ({ params }) => ({ meta: [{ title: `Cliente ${params.rif} — Dashboard General de Controles` }] }),
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
//#endregion
export { Route as t };
