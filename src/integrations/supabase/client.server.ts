// Server-side Supabase client with service role key - bypasses RLS.
// Use this for admin operations in server functions and server routes only.
// For user-authenticated queries (with RLS), use the auth middleware instead.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const ERR_PREFIX = "[Supabase:server]";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function getServerEnv() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const missing: string[] = [];
  if (!url) missing.push("SUPABASE_URL");
  if (!key) missing.push("SUPABASE_SERVICE_ROLE_KEY");

  if (missing.length > 0) {
    const msg = `${ERR_PREFIX} Variable(s) faltante(s): ${missing.join(", ")}. El cliente admin no estará disponible.`;
    console.error(msg);
    return { url: "", key: "" };
  }

  return { url, key };
}

const { url: SUPABASE_URL, key: SUPABASE_SERVICE_ROLE_KEY } = getServerEnv();

function createSupabaseAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  try {
    return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      global: {
        fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY),
      },
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (err) {
    console.error(`${ERR_PREFIX} Error al inicializar createClient:`, err);
    return null;
  }
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | null | undefined;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (_supabaseAdmin === undefined) _supabaseAdmin = createSupabaseAdminClient();
    if (!_supabaseAdmin) {
      console.warn(`${ERR_PREFIX} Cliente no disponible (env vars faltantes).`);
      return undefined;
    }
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
