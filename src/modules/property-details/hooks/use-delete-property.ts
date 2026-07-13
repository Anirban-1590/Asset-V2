import { useAuthSupabase } from "@/hooks/use-supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ToastAndroid } from "react-native";

export const useDeleteProperty = (propertyId: string) => {
  const authSupabase = useAuthSupabase();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    mutate: deleteProperty,
    isPending: isDeletePropertyPending,
    isError,
    data,
  } = useMutation({
    mutationKey: ["delete-property", propertyId],
    mutationFn: async () => {
      return await authSupabase
        .from("properties")
        .delete()
        .eq("id", propertyId);
    },
    onSettled: async (data, error) => {
      ToastAndroid.BOTTOM;

      if (error || data?.error) {
        ToastAndroid.show("Failed to remove property. Please try again!", 500);
      }

      ToastAndroid.show("Property Removed", 300);

      router.back();
    },
  });

  return {
    deleteProperty,
    isDeletePropertyPending,
    isError: isError || !!data?.error,
  };
};
