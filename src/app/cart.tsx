import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "../data/products";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const [cartIds, setCartIds] = useState<string[]>([]);
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

  // Load the saved cart 
  useEffect(() => {
    async function loadCart() {
      const saved = await AsyncStorage.getItem("cart");
      setCartIds(saved ? JSON.parse(saved) : []);
    }
    loadCart();
  }, []);

  // Turn ids into full product info
  const items = cartIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p !== undefined);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  function handleCheckout() {
    router.push("/payment");
   }

  return (
    <View className="flex-1 bg-white">
      {/* Blue header */}
      <View className="bg-[#99CBF7]" style={{ paddingTop: insets.top }}>
        <View className="h-20 items-center justify-center">
          <Pressable onPress={() => router.back()} className="absolute left-4" hitSlop={10}>
            <Ionicons name="arrow-back-circle-outline" size={48} color="black" />
          </Pressable>
          <Text className="font-bold" style={{ fontSize: textSize === "small" ? 27 : textSize === "large" ? 36 : 32 }}>Your Cart</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-5 pt-12 pb-6">
        {items.length === 0 ? (
          <Text className="text-center" style={{ fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20 }}>Your cart is empty</Text>
        ) : (
          <>
            {/* Cart items */}
            {items.map((item, index) => (
              <View key={index} className="flex-row bg-[#99CBF7] rounded-2xl p-4 mb-4">
                <View className="w-[90px] h-[90px] bg-white rounded-xl items-center justify-center">
                  <Image source={item.image} className="w-[70px] h-[80px]" resizeMode="contain" />
                </View>
                <View className="flex-1 ml-4 justify-between">
                  <Text className="font-semibold" style={{ fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20 }}>{item.cartName}</Text>
                  <Text className="font-bold text-[#333] self-end" style={{ fontSize: textSize === "small" ? 19 : textSize === "large" ? 26 : 22 }}>
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}

            {/* Total and checkout */}
            <Text className="font-bold self-end mt-4" style={{ fontSize: textSize === "small" ? 26 : textSize === "large" ? 35 : 30 }}>total: ${total.toFixed(2)}</Text>
            <Pressable
              onPress={handleCheckout}
              className="bg-[#4CAA45] px-6 py-2 rounded-full self-end mt-6"
            >
              <Text className="text-white font-semibold" style={{ fontSize: textSize === "small" ? 20 : textSize === "large" ? 28 : 24 }}>Checkout</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      {/*  mascot */}
      <Pressable
        onPress={() => router.push("/help")}
        className="items-start px-5"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="items-center">
          <Image
            source={require("../../assets/images/mascot.png")}
            className="w-[80px] h-[95px]"
            resizeMode="contain"
          />
          <Text className="font-semibold" style={{ fontSize: textSize === "small" ? 16 : textSize === "large" ? 21 : 18 }}>Tap for help</Text>
        </View>
      </Pressable>
    </View>
  );
}