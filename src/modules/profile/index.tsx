import { Button } from "@/components/common/button";
import { useAuth, useUser } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation } from "@tanstack/react-query";
import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { MenuItem } from "./components/menu-item";

const mimeType = "image/webp" as const;

export function ProfileTab() {
  ToastAndroid.BOTTOM;

  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["image-upload"],
    mutationFn: async (dataUrl: string) => {
      return await user?.setProfileImage({ file: dataUrl });
    },
  });

  async function pickImageHandler() {
    if (isPending) return;
    try {
      const permissionResult = await requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        if (!permissionResult.canAskAgain) {
          Alert.alert(
            "Permission Required",
            "You've previously denied gallery permissions. Please enable them in your device settings to select an image.",
            [
              { text: "Not Now", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
            ],
          );
        }
      }

      const pickedImgResult = await launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: "images",
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (pickedImgResult.canceled) return;

      const base64Data = pickedImgResult.assets[0].base64;

      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      await mutateAsync(dataUrl, {
        onSuccess: () => {
          ToastAndroid.show("Profile picture updated!", 500);
        },
        onError: () => {
          ToastAndroid.show("Failed to update Picture. Please try again!", 500);
        },
      });
    } catch (error) {
      ToastAndroid.show("Failed to update. Please try again!", 500);
    }
  }
  async function handleSignout() {
    ToastAndroid.BOTTOM;
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      ToastAndroid.show("Failed to sign out. Please try again!", 500);
    }
  }

  if (!isLoaded) {
    return (
      <View className="items-center justify-center  w-full h-full">
        <ActivityIndicator size="large" className=" text-primary" />
      </View>
    );
  }

  return (
    <View className={`gap-10 items-center mt-[5rem] h-full pb-14 `}>
      {/* <View className="pt-5">
        <Text className="text-xl font-bold text-primary pt-2">Profile</Text>
      </View> */}
      <View>
        <View className="relative mb-4 w-20 h-20 mx-auto">
          <Image
            source={{
              uri: user?.imageUrl,
            }}
            className=" w-full h-full rounded-full relative"
          />
          <Button
            varient="primary"
            buttonProps={{
              className:
                "absolute bottom-0 right-0 w-fit h-fit rounded-full px-1.5 py-1.5 min-h-fit",
              onPress: pickImageHandler,
              disabled: isPending,
            }}
          >
            {isPending ? (
              <ActivityIndicator size={16} className=" text-white" />
            ) : (
              <Ionicons name="camera-outline" color="white" size={16} />
            )}
          </Button>
        </View>
        <View>
          <Text className=" text-gray-500">
            {user?.emailAddresses[0].emailAddress}
          </Text>
        </View>
      </View>
      <View className="w-full ">
        <MenuItem icon="settings-outline" label="Settings" onPress={() => {}} />
        <MenuItem
          icon="help-circle-outline"
          label="Contact Support"
          onPress={() => {}}
        />
        <MenuItem icon="brush-outline" label="Themes" onPress={() => {}} />
      </View>
      <View className="w-full mt-auto">
        <Button
          buttonProps={{
            className: "gap-2 min-h-[3rem]",
            onPress: handleSignout,
          }}
        >
          <Ionicons name="log-out-outline" color="white" size={22} />
          <Text className="text-white">Sign Out</Text>
        </Button>
      </View>
    </View>
  );
}
