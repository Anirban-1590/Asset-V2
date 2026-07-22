import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";
import { IMapProps } from "../../type";

export function CompactMap({
  latitude,
  longitude,
  title,
  address,
}: IMapProps<number>) {
  const router = useRouter();

  return (
    <View className="w-full h-[18rem] flex-1">
      <TouchableOpacity
        onPress={() => {
          router.push(
            `/property/map?latitude=${latitude}&longitude=${longitude}&title=${title}&address=${address}`,
          );
        }}
        className="w-full h-full overflow-hidden rounded-2xl relative"
      >
        <WebView
          source={{
            uri: `https://www.openstreetmap.org/export/embed.html?bbox=${longitude! - 0.01},${latitude! - 0.01},${longitude! + 0.01},${latitude! + 0.01}&marker=${latitude},${longitude}`,
          }}
          scrollEnabled={false}
          pointerEvents="none"
        />
        <View className="flex flex-row gap-2 items-center absolute bottom-3 right-2 z-10 px-3 py-2 rounded-xl bg-white">
          <Ionicons color={"#F5004F"} size={20} name="expand-outline" />
          <Text className=" text-primary">Tap to expand</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
