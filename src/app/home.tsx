import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "../data/products";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [textSize, setTextSize] = useState("medium");
  const [usualIds, setUsualIds] = useState<string[]>(products.map((p) => p.id));

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  async function loadSettings() {
    const savedPrefs = await AsyncStorage.getItem("preferences");
    if (savedPrefs) {
      const data = JSON.parse(savedPrefs);
      setTextSize(data.textSize || "medium");
    }

    const savedUsual = await AsyncStorage.getItem("usualItems");
    if (savedUsual) {
      setUsualIds(JSON.parse(savedUsual));
    }
  }

  const usualProducts = products.filter((p) => usualIds.includes(p.id));

  return (
    <View className="flex-1 bg-white">
      {/* Blue header */}
      <View className="bg-[#99CBF7]" style={{ paddingTop: insets.top }}>
        <View className="h-20 items-center justify-center">
          <Pressable
            onPress={() => router.replace("/sign-in")}
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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between", paddingBottom: insets.bottom + 24 }}
      >
       <View className="px-6">
        {/* Greeting row */}
        <View className="flex-row items-center justify-between mt-2">
          <Text
            className="flex-1 font-semibold text-center mr-2"
            style={{ fontSize: textSize === "small" ? 19 : textSize === "large" ? 26 : 22 }}
          >
            What would you like to shop for today?
          </Text>
          <Pressable
            onPress={() => router.push({ pathname: "/help", params: { from: "home" } })}
            className="items-center"
          >
            <Image
              source={require("../../assets/images/mascot.png")}
              style={{ width: 90, height: 110 }}
              resizeMode="contain"
            />
            <Text className="font-semibold" style={{ fontSize: textSize === "small" ? 14 : textSize === "large" ? 19 : 16 }}>Tap for help</Text>
          </Pressable>
        </View>

        {/* Usual items */}
        <Text className="font-bold mt-3" style={{ fontSize: textSize === "small" ? 24 : textSize === "large" ? 32 : 28 }}>Your usual items</Text>
        <Text className="mt-1" style={{ fontSize: textSize === "small" ? 16 : textSize === "large" ? 21 : 18 }}>Tap to add to cart</Text>

        {usualProducts.length === 0 ? (
          <Text className="mt-4" style={{ fontSize: textSize === "small" ? 16 : textSize === "large" ? 21 : 18 }}>
            You have not picked any usual items yet. You can pick them in Account settings.
          </Text>
        ) : (
          <View className={usualProducts.length === 3 ? "flex-row justify-between mt-4" : "flex-row gap-4 mt-4"}>
            {usualProducts.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/product/${item.id}`)}
                accessibilityLabel={`Add ${item.name} to cart`}
                className="bg-[#99CBF7] rounded-lg p-1.5"
              >
                <Image
                  source={item.image}
                  style={{ width: 86, height: 136 }}
                  resizeMode="contain"
                />
              </Pressable>
            ))}
          </View>
        )}
       </View>

        {/* Bottom buttons */}
        <View className="items-center px-6 gap-5 mt-6">
        <Pressable
          onPress={() => router.push("/search")}
          className="w-full max-w-[300px] bg-[#4CAA45] py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-semibold text-center" style={{ fontSize: textSize === "small" ? 20 : textSize === "large" ? 28 : 24 }}>
            Search for{"\n"}something new
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/account-setup")}
          className="w-full max-w-[290px] border-2 border-[#4CAA45] py-3 rounded-2xl items-center"
        >
          <Text className="text-[#4CAA45] font-semibold" style={{ fontSize: textSize === "small" ? 19 : textSize === "large" ? 26 : 22 }}>
            Account settings
          </Text>
        </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
