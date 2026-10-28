import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "../../data/products";

export default function ProductScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
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

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Product not found</Text>
      </View>
    );
  }

  async function handleAddToCart() {
    const saved = await AsyncStorage.getItem("cart");
    const cart = saved ? JSON.parse(saved) : [];
    await AsyncStorage.setItem("cart", JSON.stringify([...cart, product!.id]));
    router.push("/cart");
  }

  return (
    <View className="flex-1 bg-white">
      {/* Blue header */}
      <View className="bg-[#99CBF7]" style={{ paddingTop: insets.top }}>
        <View className="h-20 items-center justify-center">
        <Pressable onPress={() => router.back()} className="absolute left-4" hitSlop={10}>
            <Ionicons name="arrow-back-circle-outline" size={48} color="black" />
        </Pressable>
        <Text className="font-bold" style={{ fontSize: textSize === "small" ? 22 : textSize === "large" ? 28 : 26, marginLeft: 40 }}>Product Details</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-5 pt-6 pb-4">
        <Text className="font-semibold" style={{ fontSize: textSize === "small" ? 19 : textSize === "large" ? 25 : 22 }}>{product.title}</Text>

        {/* Product image */}
        <View className="h-[225px] border-[1.5px] border-[#99CBF7] rounded-2xl items-center justify-center mt-6">
          <Image source={product.image} style={{ width: 150, height: 190 }} resizeMode="contain" />
        </View>

        <Text className="font-medium mt-8" style={{ fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20 }}>{product.description}</Text>
        <Text className="font-medium mt-6" style={{ fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20 }}>{product.servings}</Text>
      </ScrollView>

      {/* Bottom row */}
      <View
        className="flex-row items-center justify-between px-5"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable onPress={() => router.push("/help")} className="items-center">
          <Image
            source={require("../../../assets/images/mascot.png")}
            style={{ width: 80, height: 95 }}
            resizeMode="contain"
          />
          <Text className="font-semibold" style={{ fontSize: textSize === "small" ? 16 : textSize === "large" ? 21 : 18 }}>Tap for help</Text>
        </Pressable>

        <Pressable onPress={handleAddToCart} className="bg-[#4CAA45] px-4 py-2 rounded-full">
          <Text className="text-white font-semibold" style={{ fontSize: textSize === "small" ? 20 : textSize === "large" ? 28 : 24 }}>Add to cart</Text>
        </Pressable>
      </View>
    </View>
  );
}
