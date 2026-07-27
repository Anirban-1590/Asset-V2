import Saved from "@/modules/saved";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SavedPage() {
  return (
    <SafeAreaView className="px-5 flex-1">
      <Saved />
    </SafeAreaView>
  );
}
