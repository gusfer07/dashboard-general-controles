import { createClient } from '@supabase/supabase-js';

const url = "https://sfajjsgmlsdarnihnrjo.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmYWpqc2dtbHNkYXJuaWhucmpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzYwNzYwNiwiZXhwIjoyMDk5MTgzNjA2fQ.PCDu53Ic-gQZ_W0NVHYnKO7qRmcDtdlZLCohZNsvji4";

async function run() {
  console.log("Fetching OpenAPI paths (RPCs)...");
  try {
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    const spec = await response.json();
    console.log("Exposed paths:");
    for (const path of Object.keys(spec.paths)) {
      if (path.startsWith('/rpc/')) {
        console.log(`- ${path}`);
      }
    }
  } catch (e) {
    console.error("Failed to fetch OpenAPI spec:", e);
  }
}

run();
