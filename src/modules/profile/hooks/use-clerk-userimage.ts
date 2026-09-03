import { useAuthSupabase } from "@/hooks/use-supabase";
import type { UserResource } from "@clerk/types";

import { useMutation } from "@tanstack/react-query";

export const useClerkUserImageUpdate = ({
  user,
}: {
  user?: UserResource | null;
}) => {
  const supabaseAuthClient = useAuthSupabase();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["image-upload"],
    mutationFn: async (dataUrl: string) => {
      return await user?.setProfileImage({ file: dataUrl });
    },
    onSuccess: async () => {
      await supabaseAuthClient
        .from("users")
        .update({ avatar_url: user?.imageUrl })
        .eq("clerk_id", user?.id!);
    },
  });

  return {
    updateProfileImage: mutateAsync,
    isProfileImageUpdating: isPending,
  };
};
