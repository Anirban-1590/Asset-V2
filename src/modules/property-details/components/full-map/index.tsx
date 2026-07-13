import { Button } from "@/components/common/button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Linking, Text, View } from "react-native";
import WebView from "react-native-webview";
import { IMapProps } from "../../type";

export function FullMap() {
  const { latitude, longitude, title, address } =
    useLocalSearchParams() as unknown as IMapProps;
  const router = useRouter();

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  return (
    <View className="w-full h-full flex gap-7 px-4">
      <View className="flex flex-row gap-2 items-center mt-10">
        <Button
          buttonProps={{
            style: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,

              elevation: 6,
            },
            onPress: () => {
              router.back();
            },
            className: " p-2  bg-white rounded-full mt-0 min-h-fit",
          }}
        >
          <Ionicons
            // name={isSaved ? "heart" : "heart-outline"}
            color="#F5004F"
            size={22}
            name="arrow-back"
          />
        </Button>
        <View className="mr-auto">
          <Text className="text-sm font-bold">{title}</Text>
          <Text className="text-xs text-gray-400">{address}</Text>
        </View>
        <Button
          buttonProps={{
            className: "gap-1 px-1",
            onPress: async () => {
              const googleURL = `https://www.google.com/maps?q=${lat},${lng}`;
              const canOpen = await Linking.canOpenURL(googleURL);
              if (canOpen) {
                Linking.openURL(googleURL);
              }
            },
          }}
          varient="ghost"
        >
          <Ionicons
            // name={isSaved ? "heart" : "heart-outline"}
            color="#F5004F"
            size={20}
            name="navigate-outline"
          />
          <Text className="text-primary">Google Maps</Text>
        </Button>
      </View>
      <WebView
        source={{
          uri: `https://www.openstreetmap.org/export/embed.html?bbox=${lng! - 0.01},${lat! - 0.01},${lng! + 0.01},${lat! + 0.01}&marker=${lat},${lng}`,
        }}
        scrollEnabled={false}
        pointerEvents="none"
      />
    </View>
  );
}
