import SavePropertyButton from "@/components/common/save-property-button";
import { useSaveProperty } from "@/hooks/use-save";
import { Property } from "@/types";
import { formatPrice } from "@/utils/format-price";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export function RecommendedCards({ property }: { property: Property }) {
  const router = useRouter();
  const {
    isPropertySaved,
    propertySaveFetchError,
    saveLoading,
    toggleSave,
    saveError,
  } = useSaveProperty(property.id);

  return (
    <View className="mb-7 rounded-lg overflow-hidden relative">
      <TouchableOpacity
        onPress={() => router.push(`/(protected)/property/${property.id}`)}
      >
        <Image
          className="w-full h-[10rem]"
          source={{ uri: property?.images?.[0] || " " }}
          resizeMode="cover"
          alt={property.title}
        />

        <View className="py-5 px-2">
          <Text className="font-semibold text-lg">{property.title}</Text>

          <View className="flex items-center flex-row gap-1">
            <Ionicons name="location-outline" size={16} />
            <Text numberOfLines={1} className="text-sm text-gray-400">
              {property.city}
            </Text>
          </View>
        </View>
        <View className="flex flex-row px-2">
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
                <Ionicons name="bed-outline" size={15} />
                <Text>{property.bedrooms}</Text>
              </View>
              <View className="flex flex-row items-center gap-1">
                <Ionicons name="expand-outline" size={15} />
                <Text>{property.area_sqft} ft²</Text>
              </View>
            </View>
          )}
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
