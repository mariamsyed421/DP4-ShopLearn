import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { defaultPayment, Payment } from "../data/payment";
import { products } from "../data/products";

export default function ConfirmScreen() {
  const insets = useSafeAreaInsets();
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [payment, setPayment] = useState<Payment>(defaultPayment);

  // Load cart and payment info
  useEffect(() => {
    async function load() {
      const savedCart = await AsyncStorage.getItem("cart");
      const savedPayment = await AsyncStorage.getItem("payment");
      setCartIds(savedCart ? JSON.parse(savedCart) : []);
      if (savedPayment) setPayment(JSON.parse(savedPayment));
    }
    load();
  }, []);

  const items = products
    .map((product) => ({
      product: product,
      quantity: cartIds.filter((id) => id === product.id).length,
    }))
    .filter((item) => item.quantity > 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = cartIds.length;
  const lastFour = payment.cardNumber.replace(/\s/g, "").slice(-4);

  async function handlePlaceOrder() {
    if (items.length === 0) return;
    // save the order so the next screen can show the summary
    await AsyncStorage.setItem("lastOrder", JSON.stringify({ cartIds, total }));
    // add this order to the past orders list
    const savedOrders = await AsyncStorage.getItem("orders");
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    const newOrder = { date: new Date().toISOString(), cartIds, total };
    await AsyncStorage.setItem("orders", JSON.stringify([newOrder, ...orders]));
    await AsyncStorage.removeItem("cart");
    router.replace(`/order-placed?id=${items[0].product.id}`);
  }

  return (
    <View className="flex-1 bg-white">
      {/* Readback + mascot at the top */}
      <View className="flex-row items-center px-6" style={{ paddingTop: insets.top + 16, paddingBottom: 12 }}>
        <View className="flex-1 mr-2">
          {items.length > 0 && (
            <Text className="text-[24px] text-center text-[#173F27]">
              You are ordering{" "}
              {items.length === 1 ? (
                <>
                  {items[0].quantity} {items[0].quantity === 1 ? "box" : "boxes"} of{" "}
                  <Text className="font-bold">{items[0].product.name}</Text>
                </>
              ) : (
                <Text className="font-bold">{itemCount} items</Text>
              )}{" "}
              for <Text className="font-bold">${total.toFixed(2)}</Text>. Is that correct?
            </Text>
          )}
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
          {/* Order summary */}
          <View className="flex-1 bg-white rounded-2xl p-4" style={{ minHeight: 150 }}>
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

          {/* Card and address */}
          <Text className="text-[18px] text-[#173F27] mt-4">
            <Text className="font-bold">Card:</Text> Ending in {lastFour}
          </Text>
          <Text className="text-[18px] text-[#173F27] mt-2">
            <Text className="font-bold">Delivery address:</Text> {payment.address}
          </Text>
        </View>

        {/* Buttons */}
        <View className="items-center gap-3 px-6 pt-4" style={{ paddingBottom: insets.bottom + 16 }}>
          <Pressable
            onPress={handlePlaceOrder}
            className="w-full max-w-[300px] h-[60px] rounded-2xl items-center justify-center bg-[#2F7A3A]"
          >
            <Text className="text-[22px] font-bold text-white">Yes, place order</Text>
          </Pressable>
          {/* goes back to the cart, not payment */}
          <Pressable
            onPress={() => router.dismissTo("/cart")}
            className="w-full max-w-[300px] h-[60px] rounded-2xl items-center justify-center bg-white border-2 border-[#2F7A3A]"
          >
            <Text className="text-[22px] font-bold text-[#2F7A3A]">No, go back</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
