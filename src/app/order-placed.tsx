import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "../data/products";

export default function OrderPlacedScreen() {
  const insets = useSafeAreaInsets();
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  // Load the order saved on the confirm screen
  useEffect(() => {
    async function load() {
      const saved = await AsyncStorage.getItem("lastOrder");
      if (saved) {
        const order = JSON.parse(saved);
        setCartIds(order.cartIds);
        setTotal(order.total);
      }
    }
    load();
  }, []);

  const items = products
    .map((product) => ({
      product: product,
      quantity: cartIds.filter((id) => id === product.id).length,
    }))
    .filter((item) => item.quantity > 0);

  // Delivery estimate
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const deliveryDay = tomorrow.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <View className="flex-1 bg-white">
      {/* Heading + mascot */}
      <View className="flex-1 flex-row items-end px-6" style={{ paddingTop: insets.top + 24, zIndex: 0 }}>
        <View className="flex-1 mb-24 mr-2">
          <Text className="text-[32px] font-bold text-center text-[#173F27]">Your order is on its way!</Text>
        </View>
        <Image
          source={require("../../assets/images/mascot-thumbsup.png")}
          style={{ width: 120, height: 160 }}
          resizeMode="contain"
        />
      </View>

      {/* Green card */}
      <View
        className="rounded-t-[32px] bg-[#8BC585]"
        style={{ marginTop: -24, zIndex: 1, elevation: 1 }}
      >
        <View className="px-6 pt-10 pb-10">
          {/* Delivery estimate */}
          <View className="flex-row items-center bg-white rounded-2xl p-4">
            <Image
              source={require("../../assets/images/delivery.png")}
              style={{ width: 60, height: 76 }}
              resizeMode="contain"
            />
            <View className="flex-1 ml-4">
              <Text className="text-[18px] font-bold text-[#173F27]">Arriving tomorrow</Text>
              <Text className="text-[18px] text-[#173F27]">{deliveryDay}</Text>
              <Text className="text-[18px] text-[#173F27]">Between 2 and 4 PM</Text>
            </View>
          </View>

          {/* Order summary */}
          <View className="bg-white rounded-2xl p-4 mt-6">
            <View className="flex-row items-baseline mb-2">
              <Text className="text-[20px] font-bold text-[#173F27]">Order summary</Text>
              {items.length > 2 && (
                <Text className="text-[16px] text-[#173F27] ml-2">(scroll to see more)</Text>
              )}
            </View>

            {/* scrolls if more than 2*/}
            <ScrollView style={{ height: 140 }} nestedScrollEnabled>
              {items.map((item) => (
                <View key={item.product.id} className="flex-row items-center py-2">
                  <Image source={item.product.image} style={{ width: 40, height: 52 }} resizeMode="contain" />
                  <View className="flex-1 ml-3">
                    <Text className="text-[18px] font-semibold text-[#173F27]">{item.product.name}</Text>
                    <Text className="text-[16px] text-[#173F27]">
                      {item.quantity} x ${item.product.price.toFixed(2)}
                    </Text>
                  </View>
                  <Text className="text-[18px] font-bold text-[#173F27]">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Total */}
            <View className="flex-row justify-between border-t-2 border-[#DCEFD8] pt-3 mt-2">
              <Text className="text-[20px] font-bold text-[#173F27]">Total</Text>
              <Text className="text-[20px] font-bold text-[#173F27]">${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Back to home */}
        <View className="items-center px-6" style={{ paddingBottom: insets.bottom + 32 }}>
          <Pressable
            onPress={() => router.dismissTo("/home")}
            className="w-full max-w-[300px] h-[60px] rounded-2xl items-center justify-center bg-[#2F7A3A]"
          >
            <Text className="text-[22px] font-bold text-white">Back to Home</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}