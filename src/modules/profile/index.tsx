import { Button } from "@/components/common/button";
import { GenericBottomSheet } from "@/components/common/generic-bottom-sheet";
import { useAuth, useUser } from "@clerk/expo";
import {
  TextButton as ExpoButton,
  Host,
  RadioButton,
  Spacer,
} from "@expo/ui/jetpack-compose";
import { height, weight } from "@expo/ui/jetpack-compose/modifiers";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Appearance,
  ColorSchemeName,
  Image,
  Linking,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { MenuItem } from "./components/menu-item";
import { useClerkUserImageUpdate } from "./hooks/use-clerk-userimage";

// const defaultimeType = "image/webp" as const;
const themeOptions = ["Dark", "Light", "System Default"] as const;

//TODO: more settings option like delete account or 2FA or Notificaion settings
//TODO: profile image picker has option to take a picture from camera and apply
//TODO: put the supabase user image update into its own mutation
export function ProfileTab() {
  ToastAndroid.BOTTOM;

  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { updateProfileImage, isProfileImageUpdating } =
    useClerkUserImageUpdate({ user: user as any });

  const [theme, setTheme] = useState<ColorSchemeName>("unspecified");

  async function pickImageHandler() {
    if (isProfileImageUpdating) return;
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
        return;
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
      const mimeType = pickedImgResult.assets[0].mimeType;

      if (!base64Data || !mimeType) return;

      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      await updateProfileImage(dataUrl, {
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
              disabled: isProfileImageUpdating,
              accessibilityLabel: "Change profile image",
              accessibilityRole: "button",
            }}
          >
            {isProfileImageUpdating ? (
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
        <MenuItem
          icon="brush-outline"
          label="Themes"
          onPress={() => {
            setOpen(true);
          }}
        />
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

      <GenericBottomSheet
        isPresented={open}
        onDismiss={() => {
          setOpen(false);
        }}
      >
        <Text className="text-text text-xl">Themes</Text>
        {themeOptions.map((option, index) => {
          const optionValue = (
            option == "System Default" ? "unspecified" : option
          ).toLowerCase() as ColorSchemeName;
          return (
            <ExpoButton
              contentPadding={{
                start: 20,
                end: 20,
              }}
              onClick={async () => {
                setTheme(optionValue);
                Appearance.setColorScheme(optionValue);
                // await storage.setItem(THEME_STORAGE_KEY, optionValue);
                setOpen(false);
              }}
              key={index}
            >
              <Text className="text-text">{option}</Text>
              <Spacer modifiers={[weight(1)]} />
              <Host>
                <RadioButton selected={theme == optionValue} />
              </Host>
            </ExpoButton>
          );
        })}
        <Spacer modifiers={[height(20)]} />
      </GenericBottomSheet>
    </View>
  );
}
