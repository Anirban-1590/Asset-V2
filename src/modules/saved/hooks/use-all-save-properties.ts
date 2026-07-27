import { useAuthSupabase } from "@/hooks/use-supabase";
import { useAuth } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";

export function useAllSaveProperties() {
  const { userId } = useAuth();
  const supabase = useAuthSupabase();
  //   const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetch-saved-properties", userId],
    queryFn: async () => {
      return await supabase
        .from("saved_properties")
        .select("id, property_id, properties(*)")
        .eq("user_clerk_id", userId!)
        .order("id", { ascending: false });
    },
    enabled: !!userId,
  });

  return {
    isLoading,
    savePropertiesError: isError || !!data?.error,
    savedProperties: data?.data,
  };
}
