import { ISaveProperty } from "@/hooks/use-save";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ActivityIndicator } from "react-native";
import { Button } from "./button";

export default function SavePropertyButton({
  isPropertySaved,
  saveLoading,
  toggleSave,
  propertySaveFetchError,
  saveError,
}: ISaveProperty) {
  return (
    <Button
      buttonProps={{
        style: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,

          elevation: 6,
        },
        disabled: saveLoading,
        onPress: toggleSave,
        accessibilityLabel: "Save Property",
        className:
          "absolute top-5 right-5 p-2  bg-white rounded-full mt-0 min-h-fit",
      }}
    >
      {saveLoading ? (
        <ActivityIndicator size={20} className=" text-primary" />
      ) : (
        <Ionicons
          name={isPropertySaved ? "heart" : "heart-outline"}
          color="#F5004F"
          size={20}
        />
      )}
    </Button>
  );
}
