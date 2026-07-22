import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { RecommendedCards } from "../home/components/recommended-card";
import { useAllSaveProperties } from "./hooks/use-all-save-properties";

export default function Saved() {
  const { isLoading, savePropertiesError, savedProperties } =
    useAllSaveProperties();

  if (isLoading) {
    return (
      <View className="items-center justify-center  w-full h-full">
        <ActivityIndicator size="large" className=" text-primary" />
      </View>
    );
  }
  if (!savedProperties && !isLoading) {
    return (
      <View className="items-center justify-center  w-full h-full">
        <Text className="text-center text-gray-500 text-base">
          No saved properties found
        </Text>
        <Text className="text-center text-gray-400 text-sm">
          Save a property by clicking on the ❤ icon.
        </Text>
      </View>
    );
  }
  if (!isLoading && savePropertiesError) {
    <View className="items-center justify-center  w-full h-full">
      <Text>Something went wrong. Please try again!</Text>
    </View>;
  }

  return (
    savedProperties?.length && (
      <View className=" gap-10">
        <View className="pt-4">
          <Text className="text-xl font-bold text-primary">Saved</Text>
          {!isLoading && (
            <Text className="my-1 text-gray-400 text-sm">
              {savedProperties.length}
              {savedProperties.length === 1 ? " property" : " properties"} found
            </Text>
          )}
        </View>
        <FlatList
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return <RecommendedCards property={item.properties} />;
          }}
          contentContainerClassName="px-2 pb-[11rem]"
          showsVerticalScrollIndicator={false}
          data={savedProperties}
        />
      </View>
    )
  );
}
