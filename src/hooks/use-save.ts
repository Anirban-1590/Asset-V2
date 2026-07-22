import { useAuth } from "@clerk/expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthSupabase } from "./use-supabase";

export interface ISaveProperty {
  isPropertySaved: boolean;
  propertySaveFetchError: boolean;
  saveLoading: boolean;
  toggleSave: () => void;
  saveError: boolean;
}

export const useSaveProperty = (
  propertyId: string,
  onSave?: () => void,
): ISaveProperty => {
  const { userId } = useAuth();
  const supabase = useAuthSupabase();
  const queryClient = useQueryClient();

  const {
    data: isPropertySaved,
    isLoading,
    isError: propertySaveFetchError,
  } = useQuery({
    queryKey: ["fetch-saved-property", propertyId],
    queryFn: async () => {
      return await supabase
        .from("saved_properties")
        .select("id")
        .eq("user_clerk_id", userId!)
        .eq("property_id", propertyId)
        .single();
    },
    enabled: !!userId,
  });

  const {
    mutate: saveProperty,
    isPending: isSavingProperty,
    data: savePropertyData,
    isError: isSavingPropertyError,
  } = useMutation({
    mutationKey: ["save-property", propertyId],
    mutationFn: async () => {
      if (!userId) return;
      return await supabase.from("saved_properties").insert({
        user_clerk_id: userId,
        property_id: propertyId,
      });
    },
    onSettled: async (data, error) => {
      if (data?.error || error) return;

      await queryClient.invalidateQueries({
        queryKey: ["fetch-saved-property", propertyId],
      });
    },
  });
  const {
    mutate: removeSavedProperty,
    isPending: isRemovingSavedProperty,
    data,
    isError,
  } = useMutation({
    mutationKey: ["remove-save-property", propertyId],
    mutationFn: async () => {
      if (!userId) return;
      return await supabase
        .from("saved_properties")
        .delete()
        .eq("user_clerk_id", userId!)
        .eq("property_id", propertyId);
    },
    onSettled: async (data, error) => {
      if (data?.error || error) return;

      await queryClient.invalidateQueries({
        queryKey: ["fetch-saved-property", propertyId],
      });
    },
  });

  const toggleSave = () => {
    if (!userId) return;

    if (isPropertySaved?.data) {
      removeSavedProperty();
    } else {
      saveProperty();
    }
  };

  const saveLoading = isSavingProperty || isRemovingSavedProperty;
  const saveError =
    !!data?.error ||
    isError ||
    isSavingPropertyError ||
    !!savePropertyData?.error;

  return {
    isPropertySaved: !!isPropertySaved?.data,
    propertySaveFetchError,
    saveLoading,
    toggleSave,
    saveError,
  };
};
