import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

export function DetailItem({
  icon,
  value,
  label,
}: {
  icon: keyof (typeof Ionicons)["glyphMap"];
  value: string;
  label: string;
}) {
  return (
    <View className="flex gap-1 items-center">
      <Ionicons className="text-primary" size={20} name={icon} />
      <Text className="font-bold text-text">{value}</Text>
      <Text className=" text-gray-400 font-light">{label}</Text>
    </View>
  );
}
