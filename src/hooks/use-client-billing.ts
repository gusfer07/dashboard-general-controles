import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ClientBilling = {
  id: string;
  client_id: string | null;
  acumulado: string | null;
  mensualidad: string | null;
  monto_mensualidad: string | null;
  moneda: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export function useClientBilling(clientId: string | undefined) {
  return useQuery({
    queryKey: ["clients_billing", clientId],
    queryFn: async () => {
      if (!clientId) return null;
      const { data, error } = await supabase
        .from("clients_billing")
        .select("*")
        .eq("client_id", clientId)
        .maybeSingle();
      if (error) throw error;
      return data as ClientBilling | null;
    },
    enabled: !!clientId,
  });
}
