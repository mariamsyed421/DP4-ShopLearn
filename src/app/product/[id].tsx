import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "../../data/products";

export default function ProductScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1); 
  const [toast, setToast] = useState(""); // Added to cart message
  const [cartCount, setCartCount] = useState(0);

  // cart count stays current
  useFocusEffect(
    useCallback(() => {
      loadCartCount();
    }, [])
  );

  async function loadCartCount() {
    const saved = await AsyncStorage.getItem("cart");
    const cart: string[] = saved ? JSON.parse(saved) : [];
    setCartCount(cart.length);
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-[20px] font-bold text-[#173F27]">Product not found</Text>
      </View>
    );
  }

  // Cart is a list of ids
  async function handleAddToCart() {
    const saved = await AsyncStorage.getItem("cart");
    const cart: string[] = saved ? JSON.parse(saved) : [];
    const newItems = Array(quantity).fill(product!.id);
    await AsyncStorage.setItem("cart", JSON.stringify([...cart, ...newItems]));
    setCartCount(cart.length + newItems.length);

    // Show the confirmation for 3 seconds
    setToast(`${quantity} ${product!.name} added to cart`);
    setTimeout(() => setToast(""), 3000);
    setQuantity(1);
  }

  const total = product.price * quantity;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6" style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center h-[44px] px-3 rounded-full gap-1 bg-[#DCEFD8]"
          >
            <Ionicons name="chevron-back" size={20} color="#173F27" />
            <Text className="text-[18px] font-bold text-[#173F27]">Back</Text>
          </Pressable>

          {/* Cart*/}
          <Pressable
            onPress={() => router.push("/cart")}
            className="flex-row items-center h-[44px] px-4 rounded-full gap-2 bg-[#DCEFD8]"
          >
            <Ionicons name="cart-outline" size={22} color="#173F27" />
            <Text className="text-[18px] font-bold text-[#173F27]">Cart</Text>
            {cartCount > 0 && (
              <View className="w-8 h-9 rounded-full items-center justify-center bg-[#2F7A3A]">
              <Text className="text-[20px] font-semibold text-white">{cartCount}</Text>
            </View>
            )}
          </Pressable>
        </View>

        <Text className="text-[26px] font-bold text-center text-[#173F27] mt-3">Product Details</Text>
      </View>

      {/* details */}
      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-6 pb-6">
        <Text className="text-[22px] font-bold text-[#173F27]">{product.title}</Text>

        {/* Product image */}
        <View className="h-[240px] bg-white border-2 border-[#8BC585] rounded-2xl items-center justify-center mt-5">
          <Image source={product.image} style={{ width: 150, height: 190 }} resizeMode="contain" />

        </View>

        <Text className="text-[18px] font-semibold text-[#173F27] mt-6">{product.description}</Text>
        <Text className="text-[18px] font-semibold text-[#173F27] mt-4">{product.servings}</Text>

        {/* Mascot */}
        <Pressable
          onPress={() => router.push({ pathname: "/help", params: { from: "product" } })}
          className="flex-row items-center mt-8"
        >
          <Image
            source={require("../../../assets/images/mascot.png")}
            style={{ width: 80, height: 95 }}
            resizeMode="contain"
          />
          <View className="flex-1 ml-4 bg-[#DCEFD8] border-2 border-[#97CB91] rounded-2xl px-4 py-4">
            <Text className="text-[18px] font-semibold text-[#173F27]">
        
              Questions about this item?{"\n"}Tap me for help
            </Text>
          </View>
        </Pressable>

      </ScrollView>

      {/* Bottom bar, quantity and add to cart */}
      <View
        className="flex-row items-center justify-between px-6 pt-4 bg-white border-t-2 border-[#DCEFD8]"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* - + */}
        <View className="flex-row items-center">
          <Pressable
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-[44px] h-[44px] bg-white border-2 border-[#173F27] rounded-full items-center justify-center"
          >
            <Text className="text-[24px] leading-[26px] font-extrabold text-[#173F27]">−</Text>
          </Pressable>
          <Text className="text-[22px] font-bold text-[#173F27] mx-4">{quantity}</Text>
          <Pressable
            onPress={() => setQuantity(quantity + 1)}
            className="w-[44px] h-[44px] bg-white border-2 border-[#173F27] rounded-full items-center justify-center"
          >
            <Text className="text-[24px] leading-[26px] font-extrabold text-[#173F27]">+</Text>
          </Pressable>
        </View>

        {/* Price inside button */}
        <Pressable
          onPress={handleAddToCart}
          className="flex-1 ml-5 h-[60px] rounded-2xl items-center justify-center bg-[#2F7A3A]"
        >
          <Text className="text-[20px] font-bold text-white">Add to cart · ${total.toFixed(2)}</Text>
        </Pressable>
      </View>

      {/* Added to cart confirmation */}
      {toast !== "" && (
        <View
          className="absolute left-6 right-6 flex-row items-center justify-center rounded-2xl px-4 py-4 bg-[#173F27]"
          style={{ bottom: insets.bottom + 96 }}
        >
          <Ionicons name="checkmark" size={24} color="white" />
          <Text className="text-[18px] font-bold text-white ml-2">{toast}</Text>
        </View>
      )}
    </View>
  );
}