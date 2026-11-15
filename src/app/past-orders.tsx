import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "../data/products";

type Order = { date: string; cartIds: string[]; total: number };

export default function PastOrdersScreen() {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);

  // Load past orders
  useEffect(() => {
    async function load() {
      const saved = await AsyncStorage.getItem("orders");
      setOrders(saved ? JSON.parse(saved) : []);
    }
    load();
  }, []);

  // ask before cancelling, then remove the order from the list
  function cancelOrder(index: number) {
    Alert.alert("Cancel order?", "Are you sure you want to cancel this order?", [
      { text: "Keep order", style: "cancel" },
      {
        text: "Cancel order",
        style: "destructive",
        onPress: async () => {
          const newOrders = orders.filter((_, i) => i !== index);
          setOrders(newOrders);
          await AsyncStorage.setItem("orders", JSON.stringify(newOrders));
        },
      },
    ]);
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6" style={{ paddingTop: insets.top + 16 }}>
        <Pressable
          onPress={() => router.back()}
          className="self-start flex-row items-center h-[44px] px-3 rounded-full gap-1 bg-[#DCEFD8]"
        >
          <Ionicons name="chevron-back" size={20} color="#173F27" />
          <Text className="text-[18px] font-bold text-[#173F27]">Back</Text>
        </Pressable>
        <Text className="text-[32px] font-bold text-center text-[#173F27] mt-3">Past Orders</Text>
      </View>

      {orders.length === 0 ? (
        // Empty state
        <View className="flex-1 items-center pt-12 px-6">
          <Image
            source={require("../../assets/images/mascot.png")}
            style={{ width: 140, height: 170 }}
            resizeMode="contain"
          />
          <Text className="text-[34px] font-bold text-[#173F27] mt-4">No orders yet</Text>
          <Text className="text-[22px] font-semibold text-[#2F7A3A] mt-2">
            Your orders will show up here.
          </Text>
          <Pressable
            onPress={() => router.replace("/home")}
            className="w-full max-w-[300px] h-[60px] rounded-2xl items-center justify-center bg-[#2F7A3A] mt-10"
          >
            <Text className="text-[22px] font-bold text-white">Start Shopping</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerClassName="px-6 pt-6" contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
          {orders.map((order, index) => {
            // turn the id list into items with quantities
            const items = products
              .map((product) => ({
                product: product,
                quantity: order.cartIds.filter((id) => id === product.id).length,
              }))
              .filter((item) => item.quantity > 0);

            const date = new Date(order.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            });

            return (
              <View key={index} className="bg-[#DCEFD8] rounded-2xl p-4 mb-4">
                <Text className="text-[20px] font-bold text-[#173F27]">{date}</Text>

                {/* Items */}
                {items.map((item) => (
                  <View key={item.product.id} className="flex-row items-center mt-3">
                    <View className="w-[48px] h-[56px] bg-white rounded-lg items-center justify-center">
                      <Image source={item.product.image} style={{ width: 36, height: 48 }} resizeMode="contain" />
                    </View>
                    <Text className="flex-1 text-[18px] font-semibold text-[#173F27] ml-3">
                      {item.quantity} x {item.product.name}
                    </Text>
                  </View>
                ))}

                {/* Total + cancel */}
                <View className="flex-row items-center justify-between mt-4">
                  <Text className="text-[20px] font-bold text-[#173F27]">Total: ${order.total.toFixed(2)}</Text>
                  <Pressable
                    onPress={() => cancelOrder(index)}
                    className="h-[44px] px-4 rounded-full items-center justify-center bg-white border-2 border-[#E5534B]"
                  >
                    <Text className="text-[18px] font-bold text-[#E5534B]">Cancel</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

    </View>
  );
}