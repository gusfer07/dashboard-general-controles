import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-Bk9sLGIo.js
var ERR_PREFIX = "[Supabase]";
function getClientEnv() {
	const url = void 0;
	const key = void 0;
	const missing = [];
	missing.push("VITE_SUPABASE_URL");
	missing.push("VITE_SUPABASE_PUBLISHABLE_KEY");
	if (missing.length > 0) {
		const msg = `${ERR_PREFIX} Variable(s) faltante(s): ${missing.join(", ")}. Las consultas devolverán datos vacíos.`;
		if (typeof window !== "undefined") console.error(msg);
		else console.error(msg);
		return {
			url: "",
			key: ""
		};
	}
	return {
		url,
		key
	};
}
var { url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY } = getClientEnv();
function createClientOrDummy() {
	if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return createClient("https://placeholder.supabase.co", "placeholder-key", { auth: { persistSession: false } });
	try {
		return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: {
			storage: typeof window !== "undefined" ? window.localStorage : void 0,
			persistSession: true,
			autoRefreshToken: true
		} });
	} catch (err) {
		console.error(`${ERR_PREFIX} Error al inicializar createClient:`, err);
		return createClient("https://placeholder.supabase.co", "placeholder-key", { auth: { persistSession: false } });
	}
}
var supabase = createClientOrDummy();
//#endregion
export { supabase as t };
