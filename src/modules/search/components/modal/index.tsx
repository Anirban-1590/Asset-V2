import { Button } from "@/components/common/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Property } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSearchStore } from "../../store/use-search";

interface IFilterModalProps {
  visible: boolean;
  onClose: () => void;
  handleAppliedFilter: (value: any) => void;
}
const TYPES: { label: string; value: Property["type"] | null }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];

const BEDS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
  { label: "Under ₹50L", min: null, max: 5000000 },
  { label: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr – ₹2Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2Cr", min: 20000000, max: null },
];

export function FilterModal({
  visible,
  onClose,
  handleAppliedFilter,
}: IFilterModalProps) {
  const {
    resetFilter,
    maxPrice,
    minPrice,
    setMinPrice,
    setMaxPrice,
    setType,
    type: typeOfProperty,
    bedrooms,
    setBedrooms,
    filterCount,
  } = useSearchStore();

  const [locMaxPrice, setLocMaxPrice] = useState(
    maxPrice ? String(maxPrice) : "",
  );
  const [locMinPrice, setLocMinPrice] = useState(
    minPrice ? String(minPrice) : "",
  );

  const handleapply = () => {
    const newMinPrice = locMinPrice ? Number(locMinPrice) : null;
    const newMaxPrice = locMaxPrice ? Number(locMaxPrice) : null;

    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
    handleAppliedFilter({
      minPrice: newMinPrice,
      maxPrice: newMaxPrice,
      type: typeOfProperty,
      bedrooms: bedrooms,
    });
    onClose();
  };

  return (
    <Modal
      presentationStyle="pageSheet"
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className=" flex flex-row items-center justify-between  py-3 border-b border-primary">
        <Button
          buttonProps={{
            onPress: () => {
              resetFilter();
              setLocMaxPrice("");
              setLocMinPrice("");
            },
            className: "!mt-0 !min-h-[0.1rem]",
          }}
          varient="ghost"
        >
          <Text className="text-primary text-md font-semibold">Reset</Text>
        </Button>
        <Text className="text-xl font-bold">Filters</Text>
        <Button
          buttonProps={{
            onPress: onClose,
            className: "!mt-0 !min-h-[0.1rem]",
          }}
          varient="ghost"
        >
          <Ionicons name="close-outline" size={25} />
        </Button>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 50,
          height: "100%",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex flex-col gap-8 h-full">
          <View>
            <Text className="text-base font-semibold mb-3">Property Type</Text>
            <View className="flex flex-row gap-3 flex-wrap">
              {TYPES.map((t) => {
                const isActive = typeOfProperty === t.value;

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setType(t.value);
                    }}
                    key={t.value as string}
                  >
                    <Badge variant={isActive ? "default" : "outline"}>
                      <Text
                        className={` ${isActive ? "text-white" : "text-primary"} font-semibold`}
                      >
                        {t.label}
                      </Text>
                    </Badge>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View>
            <Text className="text-base font-semibold mb-3">Bedrooms</Text>
            <View className="flex flex-row gap-3 flex-wrap">
              {BEDS.map((bed) => {
                const isActive = bedrooms === bed.value;

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setBedrooms(bed.value);
                    }}
                    key={String(bed.value)}
                    className="w-fit h-fit"
                  >
                    <Badge
                      className="px-6"
                      variant={isActive ? "default" : "outline"}
                    >
                      <Text
                        className={` ${isActive ? "text-white" : "text-primary"} font-semibold`}
                      >
                        {bed.label}
                      </Text>
                    </Badge>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View>
            <Text className="text-base font-semibold mb-3">
              Price Range (₹)
            </Text>

            <View className="flex flex-row justify-between gap-5 h-fit">
              {[
                {
                  label: "Min Price",
                  value: locMinPrice,
                  onChange: setLocMinPrice,
                  placeholder: "0",
                },
                {
                  label: "Max Price",
                  value: locMaxPrice,
                  onChange: setLocMaxPrice,
                  placeholder: "Any",
                },
              ].map(({ label, value, onChange, placeholder }) => {
                return (
                  <View className="flex-1" key={label}>
                    <Label
                      htmlFor={label}
                      nativeID={label}
                      className="text-gray-500 mb-1"
                    >
                      {label}
                    </Label>
                    <View className="flex flex-row items-center   gap-2 px-3  border border-primary rounded-xl">
                      <Text className="text-sm text-gray-500">₹</Text>
                      <TextInput
                        value={value}
                        placeholder={placeholder}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        className=" py-2 flex-1"
                        id={label}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
            <View className="flex flex-row gap-3 flex-wrap mt-5">
              {PRICE_PRESETS.map((preset) => {
                const isActive =
                  preset.max === maxPrice && preset.min === minPrice;

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setMinPrice(preset.min);
                      setMaxPrice(preset.max);
                      setLocMinPrice(preset.min ? String(preset.min) : "");
                      setLocMaxPrice(preset.max ? String(preset.max) : "");
                    }}
                    key={preset.label}
                  >
                    <Badge
                      className="px-3"
                      variant={isActive ? "default" : "outline"}
                    >
                      <Text
                        className={` text-sm ${isActive ? "text-white" : "text-primary"} font-semibold`}
                      >
                        {preset.label}
                      </Text>
                    </Badge>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View className="mt-auto">
            <Button
              text={`Apply Filters ${filterCount > 0 ? `(${filterCount})` : ""}`}
              buttonProps={{ className: "min-h-[3rem]", onPress: handleapply }}
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}
