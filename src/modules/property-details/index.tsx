import { Button } from "@/components/common/button";
import { Badge } from "@/components/ui/badge";
import { useSaveProperty } from "@/hooks/use-save";
import { useAdmin } from "@/store/use-admin";
import { formatPrice } from "@/utils/format-price";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import SavePropertyButton from "@/components/common/save-property-button";
import { useState } from "react";
import Swiper from "react-native-swiper";
import { CompactMap } from "./components/compact-map";
import { DetailItem } from "./components/detail-item";
import { useDeleteProperty } from "./hooks/use-delete-property";
import { usePropertyDetails } from "./hooks/use-property-details";
import { useSellProperty } from "./hooks/use-sell-property";

const { width } = Dimensions.get("window");

//TODO: add full image viewer

export function Property({ id }: { id: string }) {
  const [showExpandedDescription, setShowExpandedDescription] = useState(false);
  const router = useRouter();
  const { data: propertyData, isLoading, error } = usePropertyDetails(id);
  const { isAdmin } = useAdmin();
  const {
    isPropertySaved,
    propertySaveFetchError,
    saveLoading,
    toggleSave,
    saveError,
  } = useSaveProperty(id);
  const { markPropertyAsSold, isMarkingPropertyAsSoldPending, isError } =
    useSellProperty(id);
  const {
    deleteProperty,
    isDeletePropertyPending,
    isError: isDeletePropertyError,
  } = useDeleteProperty(id);

  const handleWhatsAppContact = async () => {
    const text = `Hello! I am interested in this Property - ${propertyData?.title}. Can you share more details`;
    const url = `whatsapp://send?text=${text}&phone=${919083170040}`;

    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    } else {
      ToastAndroid.BOTTOM;
      ToastAndroid.show("Failed to open whatsapp", 200);
    }
  };
  const handleMarkSold = () => {
    Alert.alert("Mark as Sold", "Do you want to mark this property as Sold ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Mark Sold",
        onPress: () => {
          markPropertyAsSold();
        },
      },
    ]);
  };
  const handleDeleteProperty = () => {
    Alert.alert("Delete Property", "Do you want to delete this property ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteProperty();
        },
      },
    ]);
  };

  if (!propertyData && !isLoading) {
    return (
      <View className="items-center justify-center  w-full h-full">
        <Text className="text-center text-gray-500 text-base">
          No properties found
        </Text>
      </View>
    );
  }
  if (isLoading) {
    return (
      <View className="items-center justify-center  w-full h-full">
        <ActivityIndicator size="large" className=" text-primary" />
      </View>
    );
  }

  return (
    <View className="">
      <ScrollView
        contentContainerClassName="gap-5 pb-[2rem]"
        showsVerticalScrollIndicator={false}
      >
        <View className="relative">
          <Swiper
            className="h-fit"
            contentContainerClassName="h-[20rem]"
            showsPagination
            scrollEventThrottle={16}
          >
            {propertyData?.images?.map((img, index) => {
              return (
                <TouchableOpacity
                  accessibilityLabel={`property image ${index}`}
                >
                  <Image
                    source={{ uri: img }}
                    className="h-[20rem]"
                    width={width}
                  />
                </TouchableOpacity>
              );
            })}
          </Swiper>
          <Button
            buttonProps={{
              style: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,

                elevation: 6,
              },
              onPress: () => {
                router.back();
              },
              className:
                "absolute top-5 left-5 p-2  bg-white rounded-full mt-0 min-h-fit",
            }}
          >
            <Ionicons
              // name={isSaved ? "heart" : "heart-outline"}
              color="#F5004F"
              size={22}
              name="arrow-back"
            />
          </Button>
          <SavePropertyButton
            isPropertySaved={isPropertySaved}
            saveError={saveError}
            saveLoading={saveLoading}
            toggleSave={toggleSave}
            propertySaveFetchError={propertySaveFetchError}
          />
        </View>
        <View className="px-3 flex gap-3">
          <View className="flex flex-row gap-3">
            <Badge className="px-3" variant={"outline"}>
              <Text className={` capitalize text-primary font-semibold`}>
                {propertyData?.type}
              </Text>
            </Badge>

            {propertyData?.is_featured && (
              <Badge className="px-3" variant={"default"}>
                <Text className={` capitalize text-white font-semibold`}>
                  Featured
                </Text>
              </Badge>
            )}
            {propertyData?.is_sold && (
              <Badge className="px-3" variant={"default"}>
                <Text className={` capitalize text-white font-semibold`}>
                  Sold
                </Text>
              </Badge>
            )}
          </View>
          <Text className="text-2xl font-bold">{propertyData?.title}</Text>
          <Text className="text-lg text-primary font-bold">
            {formatPrice(propertyData?.price as number)}
          </Text>
          <View className="flex flex-row justify-between">
            <DetailItem
              icon="bed-outline"
              label="Beds"
              value={`${propertyData?.bedrooms}`}
            />
            <DetailItem
              icon="water-outline"
              label="Baths"
              value={`${propertyData?.bathrooms}`}
            />
            <DetailItem
              icon="expand-outline"
              label="Area"
              value={`${propertyData?.area_sqft} ft²`}
            />
            <DetailItem
              icon="home-outline"
              label="Type"
              value={`${propertyData?.type} `}
            />
          </View>
          <Text className="mt-5 font-bold">Description</Text>
          <View>
            <Text className="text-gray-400 text-start ">
              {showExpandedDescription
                ? propertyData?.description
                : `${propertyData?.description?.slice(0, 100)}...`}
            </Text>
            <Button
              varient="ghost"
              buttonProps={{
                className: "w-fit min-h-fit p-0 mt-0",
                onPress: () => {
                  setShowExpandedDescription((prev) => !prev);
                },
              }}
              textProps={{ className: "text-sm !text-primary" }}
              text="Show more"
            />
          </View>

          <Text className="mt-5 font-bold">Location</Text>
          <View className="flex items-center flex-row gap-1">
            <Ionicons name="location-outline" size={20} />
            <Text numberOfLines={1} className="text-sm text-gray-400">
              {propertyData?.address}, {propertyData?.city}
            </Text>
          </View>
          <CompactMap
            title={propertyData?.title ?? ""}
            address={propertyData?.address ?? ""}
            latitude={propertyData?.latitude ?? 0}
            longitude={propertyData?.longitude ?? 0}
          />

          <Button
            buttonProps={{
              className: "min-h-[3.5rem] gap-2 bg-green-500",
              onPress: handleWhatsAppContact,
            }}
            varient="primary"
          >
            <Ionicons color={"white"} size={20} name="logo-whatsapp" />
            <Text className="text-lg text-white font-medium">
              Contact Agent
            </Text>
          </Button>

          {isAdmin && (
            <View className="flex flex-row gap-3">
              {!propertyData?.is_sold && (
                <Button
                  buttonProps={{
                    onPress: handleMarkSold,
                    className: "min-h-[3rem] gap-2 bg-amber-600 w-[14rem]",
                  }}
                  varient="primary"
                >
                  {isMarkingPropertyAsSoldPending ? (
                    <ActivityIndicator className="text-white" />
                  ) : (
                    <>
                      <Ionicons
                        color={"white"}
                        size={20}
                        name="checkmark-circle-outline"
                      />
                      <Text className="text-lg text-white font-medium">
                        Mark Sold
                      </Text>
                    </>
                  )}
                </Button>
              )}
              <Button
                buttonProps={{
                  className: "min-h-[3rem] gap-2 min-w-[9rem] flex-grow",
                  onPress: handleDeleteProperty,
                }}
                varient="primary"
              >
                {isDeletePropertyPending ? (
                  <ActivityIndicator className="text-white" />
                ) : (
                  <>
                    <Ionicons color={"white"} size={20} name="trash-bin" />
                    <Text className="text-lg text-white font-medium">
                      Delete
                    </Text>
                  </>
                )}
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
