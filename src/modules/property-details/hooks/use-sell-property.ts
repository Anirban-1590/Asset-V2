import { useAuthSupabase } from "@/hooks/use-supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastAndroid } from "react-native";

export const useSellProperty = (propertyId: string) => {
  const authSupabase = useAuthSupabase();
  const queryClient = useQueryClient();
  const {
    mutate: markPropertyAsSold,
    isPending: isMarkingPropertyAsSoldPending,
    isError,
    data,
  } = useMutation({
    mutationKey: ["sell-property", propertyId],
    mutationFn: async () => {
      return await authSupabase
        .from("properties")
        .update({ is_sold: true })
        .eq("id", propertyId);
    },
    onSettled: async (data, error) => {
      ToastAndroid.BOTTOM;

      if (error || data?.error) {
        ToastAndroid.show("Failed to sell property. Please try again!", 500);
      }

      ToastAndroid.show("Property Sold", 300);

      await queryClient.invalidateQueries({
        queryKey: ["property", propertyId],
      });
    },
  });

  return {
    markPropertyAsSold,
    isMarkingPropertyAsSoldPending,
    isError: isError || !!data?.error,
  };
};
