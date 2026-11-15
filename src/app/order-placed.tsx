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
      {/* Heading + mascot at the top */}
      <View className="flex-row items-center px-6" style={{ paddingTop: insets.top + 16, paddingBottom: 12 }}>
        <View className="flex-1 mr-2">
          <Text className="text-[30px] font-bold text-center text-[#173F27]">Your order is on its way!</Text>
        </View>
        <Image
          source={require("../../assets/images/mascot-thumbsup.png")}
          style={{ width: 100, height: 130 }}
          resizeMode="contain"
        />
      </View>

      {/* Light green card that fills the rest of the page */}
      <View className="flex-1 rounded-t-[32px] bg-[#DCEFD8]">
        <View className="flex-1 px-6 pt-6">
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
          <View className="flex-1 bg-white rounded-2xl p-4 mt-4" style={{ minHeight: 150 }}>
            <View className="flex-row items-baseline mb-2">
              <Text className="text-[20px] font-bold text-[#173F27]">Order summary</Text>
              {items.length > 2 && (
                <Text className="text-[16px] text-[#173F27] ml-2">(scroll to see more)</Text>
              )}
            </View>

            {/* the list uses the space that is left and scrolls if there are a lot of items */}
            <ScrollView style={{ flex: 1 }} nestedScrollEnabled>
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
            <View className="flex-row justify-between border-t-2 border-[#8BC585] pt-3 mt-2">
              <Text className="text-[20px] font-bold text-[#173F27]">Total</Text>
              <Text className="text-[20px] font-bold text-[#173F27]">${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Back to home */}
        <View className="items-center px-6 pt-4" style={{ paddingBottom: insets.bottom + 16 }}>
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
