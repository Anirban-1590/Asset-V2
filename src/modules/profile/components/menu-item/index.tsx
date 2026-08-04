import { Button } from "@/components/common/button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "react-native";

export function MenuItem({
  icon,
  onPress,
  label,
}: {
  icon: keyof (typeof Ionicons)["glyphMap"];
  onPress: () => void;
  label: string;
}) {
  return (
    <Button
      buttonProps={{
        className: "w-full gap-3 px-2",
        onPress: onPress,
      }}
      varient="ghost"
    >
      <Ionicons name={icon} className="text-primary" size={22} />
      <Text className=" font-medium text-base text-text">{label}</Text>
      <Ionicons
        className="ml-auto text-primary"
        name={"chevron-forward-outline"}
        size={22}
      />
    </Button>
  );
}
