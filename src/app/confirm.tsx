import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { defaultPayment, Payment } from "../data/payment";
import { products } from "../data/products";

export default function ConfirmScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const smallPhone = height < 750;
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [payment, setPayment] = useState<Payment>(defaultPayment);
  const [textSize, setTextSize] = useState("medium");

  const bubbleWidth = width + 40;
  const bubbleHeight = bubbleWidth * (963 / 1398);
  const tailHeight = bubbleHeight * 0.2;

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
  const others = items.length - 1;
  const lastFour = payment.cardNumber.replace(/\s/g, "").slice(-4);

  async function handlePlaceOrder() {
    if (items.length === 0) return;
    await AsyncStorage.removeItem("cart");
    router.replace(`/order-placed?id=${items[0].product.id}`);
   }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }}>
      {/* Speech bubble with order summary */}
      <View className="justify-end overflow-hidden" style={{ minHeight: insets.top + (smallPhone ? 240 : 250) }}>
        <Image
          source={require("../../assets/images/bubble.png")}
          style={{ position: "absolute", bottom: 0, left: -20, width: bubbleWidth, height: bubbleHeight }}
          resizeMode="stretch"
        />
        {items.length > 0 && (
          <Text className="text-center px-10"
          style={{ fontSize: textSize === "small" ? 24 : textSize === "large" ? 32 : 28, marginBottom: tailHeight + 30 }} >
            You are ordering{" "}
            {items.length === 1 ? (
              <>
                {items[0].quantity} Family Size {items[0].quantity === 1 ? "box" : "boxes"} of{" "}
                <Text className="font-bold">{items[0].product.name}</Text>
              </>
            ) : (
              <>
                <Text className="font-bold">
                  {items[0].product.name} x {items[0].quantity}
                </Text>{" "}
                and {others} other{" "}
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
        className="self-center" style={smallPhone ? { width: 130, height: 150 } : { width: 220, height: 240 }}
        resizeMode="contain"
      />

      {/* Order info and buttons */}
      <View className="bg-[#99CBF7] px-8 pt-6" style={{ flexGrow: 1, justifyContent: "space-between", paddingBottom: insets.bottom + 16 }}>
       <View>
        <Text className="" style={{ fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20 }}>
          <Text className="font-bold">Card</Text>: Ending in {lastFour}
        </Text>
        <Text className="mt-5" style={{ fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20 }}>
          <Text className="font-bold">Delivery address:</Text> {payment.address}
        </Text>

       </View>
        <View className="items-center gap-4 mt-6">
          <Pressable
            onPress={handlePlaceOrder}
            className="w-full max-w-[290px] bg-[#4CAA45] py-3 rounded-2xl items-center"
          >
            <Text className="text-white font-semibold" style={{ fontSize: textSize === "small" ? 19 : textSize === "large" ? 26 : 22 }}>Yes, place order</Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            className="w-full max-w-[290px] bg-white border-2 border-[#4CAA45] py-3 rounded-2xl items-center"
          >
            <Text className="text-[#4CAA45] font-semibold" style={{ fontSize: textSize === "small" ? 19 : textSize === "large" ? 26 : 22 }}>No, go back</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}