import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

export const usePropertyDetails = (id: string) => {
  const fetchPropertyDetails = async (id: string) => {
    return supabase.from("properties").select("*").eq("id", id).single();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => await fetchPropertyDetails(id),
  });

  const error = isError || !!data?.error;

  return { data: data?.data, isLoading, error };
};
