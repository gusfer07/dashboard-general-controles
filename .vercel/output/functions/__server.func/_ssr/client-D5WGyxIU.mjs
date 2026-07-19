import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-D5WGyxIU.js
var supabase = createClient("https://sfajjsgmlsdarnihnrjo.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmYWpqc2dtbHNkYXJuaWhucmpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzYwNzYwNiwiZXhwIjoyMDk5MTgzNjA2fQ.PCDu53Ic-gQZ_W0NVHYnKO7qRmcDtdlZLCohZNsvji4", { auth: {
	storage: typeof window !== "undefined" ? window.localStorage : void 0,
	persistSession: true,
	autoRefreshToken: true
} });
//#endregion
export { supabase as t };
