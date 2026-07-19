import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const ERR_PREFIX = "[Supabase]";

function getClientEnv() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

  const missing: string[] = [];
  if (!url) missing.push("VITE_SUPABASE_URL");
  if (!key) missing.push("VITE_SUPABASE_PUBLISHABLE_KEY / VITE_SUPABASE_ANON_KEY");

  if (missing.length > 0) {
    const msg = `${ERR_PREFIX} Variable(s) faltante(s): ${missing.join(", ")}. Las consultas devolverán datos vacíos.`;
    if (typeof window !== "undefined") {
      console.error(msg);
    } else {
      console.error(msg);
    }
    return { url: "", key: "" };
  }

  return { url, key };
}

const { url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY } = getClientEnv();

function createClientOrDummy() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return createClient<Database>("https://placeholder.supabase.co", "placeholder-key", {
      auth: { persistSession: false },
    });
  }

  try {
    return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.error(`${ERR_PREFIX} Error al inicializar createClient:`, err);
    return createClient<Database>("https://placeholder.supabase.co", "placeholder-key", {
      auth: { persistSession: false },
    });
  }
}

export const supabase = createClientOrDummy();
