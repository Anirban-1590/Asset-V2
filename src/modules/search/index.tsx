import { Button } from "@/components/common/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/format-price";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecommendedCards } from "../home/components/recommended-card";
import { FilterModal } from "./components/modal";
import { useFilterQuery } from "./hooks/use-filter-query";
import { useSearchStore } from "./store/use-search";

//TODO: IMPROVE THE SEARCH EXPERIENCE , THE FILTERS DONT WORK WELL

export function SearchPage() {
  const {
    search,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setSearch,
    setType,
    setBedrooms,
    setMaxPrice,
    setMinPrice,
    filterCount,
  } = useSearchStore();

  const [appliedFilter, setAppliedFilters] = useState<any | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const { data, isLoading, isError } = useFilterQuery({ appliedFilter });

  // const params = useSearchParams();

  const activeFilterCount = filterCount;
  const handleAppliedFilter = ({
    search,
    type,
    bedrooms,
    minPrice,
    maxPrice,
  }: any) => {
    setAppliedFilters((prev: any) => ({
      ...prev,
      search: search,
      type: type,
      bedrooms: bedrooms,
      minPrice: minPrice,
      maxPrice: maxPrice,
    }));
  };

  // console.log(data, "data");

  return (
    <SafeAreaView className="p-5 flex flex-col gap-3 h-full">
      <View>
        <Text className="text-xl font-bold text-primary py-2">
          Find Property
        </Text>
      </View>
      <View className="flex flex-row gap-3 items-center">
        <View
          // onPress={() => {
          //   router.push("/(protected)/(tabs)/search");
          // }}
          className="flex flex-row items-center py-2  flex-1 gap-3 px-3  border border-gray-300 rounded-xl"
        >
          <Ionicons name="search-outline" size={22} color="red" />
          <TextInput
            className=" text-sm "
            placeholder="Search properties, cities..."
            autoCapitalize="none"
            value={search}
            onChangeText={setSearch}
          />
          {search && (
            <Button
              buttonProps={{
                className:
                  "ml-auto bg-slate-400 rounded-full  !px-0 !p-0 !min-h-[0.1rem] mt-0 !h-fit !rounded-full",
                onPress: () => setSearch(""),
              }}
            >
              <Ionicons name="close-outline" color="white" size={18} />
            </Button>
          )}
        </View>
        <Button
          buttonProps={{
            className:
              " !p-4 z-0 bg-primary rounded-lg relative !mt-0 !min-h-[0.1rem]",
            onPress: () => setShowFilters(true),
          }}
          // onPress={() => setShowFilters(true)}
          // className="p-4 z-0 bg-primary rounded-lg relative"
        >
          <Ionicons name="options-outline" color="white" size={22} />
          {activeFilterCount > 0 && (
            <View className=" bg-white border border-primary z-10 absolute -top-1 -right-1 w-6 h-6 flex justify-center items-center rounded-full">
              <Text className=" text-black text-sm">{activeFilterCount}</Text>
            </View>
          )}
        </Button>
      </View>

      {filterCount > 0 && (
        <View className="mt-5 flex flex-row flex-wrap gap-2 w-full">
          {type && (
            <Badge
              badgeButton
              badgeButtonProps={{
                onPress: () => {
                  setType(null);
                  handleAppliedFilter({ type: null });
                },
              }}
              className="px-2"
              variant={"default"}
            >
              <Text className={` capitalize text-white font-semibold`}>
                {type}
              </Text>
            </Badge>
          )}
          {bedrooms && (
            <Badge
              badgeButton
              badgeButtonProps={{
                onPress: () => {
                  setBedrooms(null);
                  handleAppliedFilter({ bedrooms: null });
                },
              }}
              className="px-2 items-center"
              variant={"default"}
            >
              <Ionicons name="bed-outline" size={16} color="white" />
              <Text className={` capitalize text-white font-semibold`}>
                {/* {bedrooms}{" "} */}
                {bedrooms === 4
                  ? "4+ Beds"
                  : `${bedrooms} ${bedrooms > 1 ? "Beds" : "Bed"}`}
              </Text>
            </Badge>
          )}
          {(minPrice || maxPrice) && (
            <Badge
              badgeButton
              badgeButtonProps={{
                onPress: () => {
                  setMinPrice(null);
                  setMaxPrice(null);
                  handleAppliedFilter({ minPrice: null, maxPrice: null });
                },
              }}
              className="px-2 items-center"
              variant={"default"}
              asChild
            >
              {/* <Ionicons name="bed-outline" size={16} color="white" /> */}
              <Text className={` capitalize text-white font-semibold`}>
                {minPrice && maxPrice
                  ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                  : minPrice
                    ? `From ${formatPrice(minPrice)}`
                    : `Up to ${formatPrice(maxPrice as number)}`}
              </Text>
            </Badge>
          )}
        </View>
      )}

      <Text className="my-3 text-gray-400 text-sm">
        {data?.length ?? 0} properties found
      </Text>

      <View className="flex-grow flex justify-center items-center">
        {isLoading && (
          <ActivityIndicator size="large" className=" py-7 text-primary" />
        )}
        {!isLoading && isError && (
          <View>
            <Text>Something went wrong. Please try again!</Text>
          </View>
        )}

        {data && !isLoading && (
          <View className="w-full h-full">
            <FlatList
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return <RecommendedCards property={item} />;
              }}
              contentContainerClassName="px-2 pb-[11rem]"
              data={data}
              ListEmptyComponent={
                <View className="items-center justify-center py-10">
                  <Text className="text-center text-gray-500 text-base">
                    No properties found
                  </Text>
                  <Text className="text-center text-gray-400 text-sm">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </Text>
                </View>
              }
            />
          </View>
        )}
      </View>

      {showFilters && (
        <FilterModal
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          handleAppliedFilter={handleAppliedFilter}
        />
      )}
    </SafeAreaView>
  );
}
