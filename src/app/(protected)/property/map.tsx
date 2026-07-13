import { FullMap } from "@/modules/property-details/components/full-map";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Map() {
  return (
    <SafeAreaView>
      <FullMap />
    </SafeAreaView>
  );
}
