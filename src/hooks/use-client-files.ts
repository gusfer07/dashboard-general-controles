import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ClientFile = {
  id: string;
  client_id: string;
  filename: string;
  storage_path: string;
  uploaded_at: string;
};

export function useClientFiles(clientId: string | undefined) {
  return useQuery({
    queryKey: ["client_files", clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data, error } = await supabase
        .from("client_files")
        .select("*")
        .eq("client_id", clientId)
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ClientFile[];
    },
    enabled: !!clientId,
  });
}

export function getFileDownloadUrl(storagePath: string): string {
  const { data } = supabase.storage.from("client-files").getPublicUrl(storagePath);
  return data.publicUrl;
}
