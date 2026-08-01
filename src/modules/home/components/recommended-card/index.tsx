import SavePropertyButton from "@/components/common/save-property-button";
import { useSaveProperty } from "@/hooks/use-save";
import { Property } from "@/types";
import { formatPrice } from "@/utils/format-price";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

export function RecommendedCards({ property }: { property: Property }) {
  const router = useRouter();
  const {
    isPropertySaved,
    propertySaveFetchError,
    saveLoading,
    toggleSave,
    saveError,
  } = useSaveProperty(property.id);
  useEffect(() => {
    ToastAndroid.BOTTOM;

    if (saveError) {
      ToastAndroid.show("Failed to save property. Please try again!", 500);
    }
  }, [saveError]);

  return (
    <View className="mb-7 rounded-lg overflow-hidden relative ">
      <TouchableOpacity
        onPress={() => router.push(`/(protected)/property/${property.id}`)}
      >
        <Image
          className="w-full h-[10rem]"
          source={{ uri: property?.images?.[0] || " " }}
          resizeMode="cover"
          alt={property.title}
        />

        <View className="bg-card px-4 py-2">
          <View className="pb-5 ">
            <Text className="font-semibold text-lg text-text ">
              {property.title}
            </Text>

            <View className="flex items-center flex-row gap-1">
              <Ionicons
                name="location-outline"
                className="text-text"
                size={16}
              />
              <Text numberOfLines={1} className="text-sm text-gray-400">
                {property.city}
              </Text>
            </View>
          </View>
          <View className="flex flex-row">
            <Text className="text-lg font-bold text-primary mr-auto">
              {formatPrice(property.price)}
            </Text>

            {property.is_sold ? (
              <View>
                <Text className="text-lg text-primary font-bold">SOLD</Text>
              </View>
            ) : (
              <View className="flex flex-row items-center gap-2">
                <View className="flex flex-row items-center gap-1">
                  <Ionicons
                    className="text-text"
                    name="bed-outline"
                    size={15}
                  />
                  <Text className="text-text">{property.bedrooms}</Text>
                </View>
                <View className="flex flex-row items-center gap-1">
                  <Ionicons
                    name="expand-outline"
                    className="text-text"
                    size={15}
                  />
                  <Text className="text-text">{property.area_sqft} ft²</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <SavePropertyButton
        isPropertySaved={isPropertySaved}
        saveError={saveError}
        saveLoading={saveLoading}
        toggleSave={toggleSave}
        propertySaveFetchError={propertySaveFetchError}
      />
    </View>
  );
}
