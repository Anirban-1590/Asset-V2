import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

interface IUseFilterQueryProps {
  appliedFilter: any | null;
}

export function useFilterQuery({ appliedFilter }: IUseFilterQueryProps) {
  const handleResults = async (appliedFilter: any | null) => {
    let query = supabase.from("properties").select("*");

    if (!appliedFilter) {
      return query.order("created_at", { ascending: false });
    }

    if (appliedFilter?.search) {
      query = query.or(
        `title.ilike.%${appliedFilter?.search}%, city.ilike.%${appliedFilter?.search}%`,
      );
    }
    if (appliedFilter?.type) {
      query = query.eq("type", appliedFilter?.type);
    }
    if (appliedFilter?.bedrooms) {
      query =
        appliedFilter.bedrooms === 4
          ? query.gte("bedrooms", appliedFilter?.bedrooms)
          : query.eq("bedrooms", appliedFilter?.bedrooms);
    }
    if (appliedFilter?.minPrice) {
      query = query.gte("price", appliedFilter?.minPrice);
    }
    if (appliedFilter?.maxPrice) {
      query = query.lte("price", appliedFilter?.maxPrice);
    }

    return query.order("created_at", { ascending: false });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: [`assets`, appliedFilter],
    queryFn: async () => {
      return await handleResults(appliedFilter);
    },
  });

  return { data: data?.data, isLoading, isError: isError || data?.error };
}
