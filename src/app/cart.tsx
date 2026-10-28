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

  useEffect(() => {
    async function loadCart() {
      const saved = await AsyncStorage.getItem("cart");
      setCartIds(saved ? JSON.parse(saved) : []);
    }
    loadCart();
  }, []);

  const items = products
    .map((product) => ({
      product: product,
      quantity: cartIds.filter((id) => id === product.id).length,
    }))
    .filter((item) => item.quantity > 0);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  async function addOne(id: string) {
    const newCart = [...cartIds, id];
    setCartIds(newCart);
    await AsyncStorage.setItem("cart", JSON.stringify(newCart));
  }

  async function removeOne(id: string) {
    const position = cartIds.indexOf(id);
    const newCart = cartIds.filter((_, index) => index !== position);
    setCartIds(newCart);
    await AsyncStorage.setItem("cart", JSON.stringify(newCart));
  }

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
            {items.map((item) => (
              <View key={item.product.id} className="bg-[#99CBF7] rounded-2xl p-4 mb-4">
                <View className="flex-row">
                  <View className="w-[90px] h-[90px] bg-white rounded-xl items-center justify-center">
                    <Image source={item.product.image} style={{ width: 70, height: 80 }} resizeMode="contain" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="font-semibold" style={{ fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20 }}>{item.product.cartName}</Text>
                    <Text className="font-bold text-[#333] mt-2" style={{ fontSize: textSize === "small" ? 19 : textSize === "large" ? 26 : 22 }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-center mt-4">
                  <Pressable
                    onPress={() => removeOne(item.product.id)}
                    className="w-[44px] h-[44px] bg-white rounded-full items-center justify-center"
                  >
                    <Text className="font-bold" style={{ fontSize: 28 }}>-</Text>
                  </Pressable>
                  <Text className="font-bold mx-6" style={{ fontSize: textSize === "small" ? 22 : textSize === "large" ? 30 : 26 }}>
                    x {item.quantity}
                  </Text>
                  <Pressable
                    onPress={() => addOne(item.product.id)}
                    className="w-[44px] h-[44px] bg-white rounded-full items-center justify-center"
                  >
                    <Text className="font-bold" style={{ fontSize: 28 }}>+</Text>
                  </Pressable>
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
            style={{ width: 80, height: 95 }}
            resizeMode="contain"
          />
          <Text className="font-semibold" style={{ fontSize: textSize === "small" ? 16 : textSize === "large" ? 21 : 18 }}>Tap for help</Text>
        </View>
      </Pressable>
    </View>
  );
}