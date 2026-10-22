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
          <Text className="text-[32px] font-bold">Your Cart</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-5 pt-12 pb-6">
        {items.length === 0 ? (
          <Text className="text-[20px] text-center">Your cart is empty</Text>
        ) : (
          <>
            {/* Cart items */}
            {items.map((item, index) => (
              <View key={index} className="flex-row bg-[#99CBF7] rounded-2xl p-4 mb-4">
                <View className="w-[90px] h-[90px] bg-white rounded-xl items-center justify-center">
                  <Image source={item.image} className="w-[70px] h-[80px]" resizeMode="contain" />
                </View>
                <View className="flex-1 ml-4 justify-between">
                  <Text className="text-[20px] font-semibold">{item.cartName}</Text>
                  <Text className="text-[22px] font-bold text-[#333] self-end">
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}

            {/* Total and checkout */}
            <Text className="text-[30px] font-bold self-end mt-4">total: ${total.toFixed(2)}</Text>
            <Pressable
              onPress={handleCheckout}
              className="bg-[#4CAA45] px-6 py-2 rounded-full self-end mt-6"
            >
              <Text className="text-white text-[24px] font-semibold">Checkout</Text>
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
          <Text className="text-[18px] font-semibold">Tap for help</Text>
        </View>
      </Pressable>
    </View>
  );
}