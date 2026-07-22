import { Property } from "@/modules/property-details";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PropertyPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView>
      <Property id={id} />
    </SafeAreaView>
  );
}
