import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "../data/products";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [textSize, setTextSize] = useState("medium");

  useEffect(() => {
    loadTextSize();
  }, []);

  async function loadTextSize() {
    const saved = await AsyncStorage.getItem("preferences");

    if (saved) {
      const data = JSON.parse(saved);
      setTextSize(data.textSize || "medium");
    }
  }


  return (
    <View className="flex-1 bg-white">
      {/* Blue header */}
      <View className="bg-[#99CBF7]" style={{ paddingTop: insets.top }}>
        <View className="h-20 items-center justify-center">
          <Pressable
            onPress={() => router.back()}
            className="absolute left-4"
            hitSlop={10}
          >
            <Ionicons
              name="arrow-back-circle-outline"
              size={48}
              color="black"
            />
          </Pressable>
          <Text
            className="font-bold"
            style={{ fontSize: textSize === "small" ? 27 : textSize === "large" ? 36 : 32 }}
          >Home</Text>
        </View>
      </View>

      <View className="flex-1 px-6">
        {/* Greeting row */}
        <View className="flex-row items-center justify-between mt-6">
          <Text
            className="flex-1 font-semibold text-center mr-2"
            style={{ fontSize: textSize === "small" ? 19 : textSize === "large" ? 26 : 22 }}
          >
            What would you like to shop for today?
          </Text>
          <Image
            source={require("../../assets/images/mascot.png")}
            className="w-[90px] h-[110px]"
            resizeMode="contain"
          />
        </View>

        {/* Usual items */}
        <Text className="font-bold mt-6" style={{ fontSize: textSize === "small" ? 24 : textSize === "large" ? 32 : 28 }}>Your usual items</Text>
        <Text className="mt-1" style={{ fontSize: textSize === "small" ? 16 : textSize === "large" ? 21 : 18 }}>Tap to add to cart</Text>

        <View className="flex-row justify-between mt-4">
          {products.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/product/${item.id}`)}
              accessibilityLabel={`Add ${item.name} to cart`}
              className="bg-[#99CBF7] rounded-lg p-1.5"
            >
              <Image
                source={item.image}
                className="w-[86px] h-[136px]"
                resizeMode="contain"
              />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Bottom buttons */}
      <View
        className="items-center px-6 gap-5"
        style={{ paddingBottom: insets.bottom + 24 }}
      >
        <Pressable
          onPress={() => router.push("/search")}
          className="w-full max-w-[300px] bg-[#4CAA45] py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-semibold text-center" style={{ fontSize: textSize === "small" ? 20 : textSize === "large" ? 28 : 24 }}>
            Search for{"\n"}something new
          </Text>
        </Pressable>
        <Pressable className="w-full max-w-[290px] border-2 border-[#4CAA45] py-3 rounded-2xl items-center">
          <Text className="text-[#4CAA45] font-semibold" style={{ fontSize: textSize === "small" ? 19 : textSize === "large" ? 26 : 22 }}>
            Account settings
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
