import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { defaultPayment, Payment } from "../data/payment";
import { products } from "../data/products";

export default function ConfirmScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [payment, setPayment] = useState<Payment>(defaultPayment);

  const bubbleWidth = width + 40;
  const bubbleHeight = bubbleWidth * (963 / 1398);
  const tailHeight = bubbleHeight * 0.2;

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

  const items = cartIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p !== undefined);
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const others = items.length - 1;
  const lastFour = payment.cardNumber.replace(/\s/g, "").slice(-4);

  async function handlePlaceOrder() {
    await AsyncStorage.removeItem("cart");
    router.replace(`/order-placed?id=${items[0].id}`);
   }

  return (
    <View className="flex-1 bg-white overflow-hidden">
      {/* Speech bubble with order summary */}
      <View className="justify-end" style={{ height: insets.top + 220 }}>
        <Image
          source={require("../../assets/images/bubble.png")}
          style={{ position: "absolute", bottom: 0, left: -20, width: bubbleWidth, height: bubbleHeight }}
          resizeMode="stretch"
        />
        {items.length > 0 && (
          <Text className="text-[28px] text-center px-10" style={{ marginBottom: tailHeight + 30 }}>
            You are ordering{" "}
            {items.length === 1 ? (
              <>
                1 Family Size box of <Text className="font-bold">{items[0].name}</Text>
              </>
            ) : (
              <>
                <Text className="font-bold">{items[0].name}</Text> and {others} other{" "}
                {others === 1 ? "item" : "items"}
              </>
            )}{" "}
            for <Text className="font-bold">${total.toFixed(2)}</Text>. Is that correct?
          </Text>
        )}
      </View>

      {/* Mascot */}
      <Image
        source={require("../../assets/images/mascot.png")}
        className="w-[220px] h-[240px] self-center"
        resizeMode="contain"
      />

      {/* Order info and buttons */}
      <View className="flex-1 bg-[#99CBF7] px-8 pt-6" style={{ paddingBottom: insets.bottom + 16 }}>
        <Text className="text-[20px]">
          <Text className="font-bold">Card</Text>: Ending in {lastFour}
        </Text>
        <Text className="text-[20px] mt-5">
          <Text className="font-bold">Delivery address:</Text> {payment.address}
        </Text>

        <View className="flex-1 items-center justify-end gap-4">
          <Pressable
            onPress={handlePlaceOrder}
            className="w-full max-w-[290px] bg-[#4CAA45] py-3 rounded-2xl items-center"
          >
            <Text className="text-white text-[22px] font-semibold">Yes, place order</Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            className="w-full max-w-[290px] bg-white border-2 border-[#4CAA45] py-3 rounded-2xl items-center"
          >
            <Text className="text-[#4CAA45] text-[22px] font-semibold">No, go back</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}