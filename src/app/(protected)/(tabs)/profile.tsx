import { ProfileTab } from "@/modules/profile";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView className="px-5 flex-1">
      <ProfileTab />
    </SafeAreaView>
  );
}
