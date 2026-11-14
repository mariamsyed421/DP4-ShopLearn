import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "../data/products";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  // Cart is a list of ids
  const [cartIds, setCartIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadCart() {
      const saved = await AsyncStorage.getItem("cart");
      setCartIds(saved ? JSON.parse(saved) : []);
    }
    loadCart();
  }, []);

  // Turn the id list into entries
  const items = products
    .map((product) => ({
      product: product,
      quantity: cartIds.filter((id) => id === product.id).length,
    }))
    .filter((item) => item.quantity > 0);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Saves the new cart to the screen and to storage
  async function saveCart(newCart: string[]) {
    setCartIds(newCart);
    await AsyncStorage.setItem("cart", JSON.stringify(newCart));
  }

  // + button: add the id one more time
  function addOne(id: string) {
    saveCart([...cartIds, id]);
  }

  // - button
  function removeOne(id: string) {
    const position = cartIds.indexOf(id);
    saveCart(cartIds.filter((_, index) => index !== position));
  }

  // Remove button: remove every copy of the id
  function removeAll(id: string) {
    saveCart(cartIds.filter((cartId) => cartId !== id));
  }

  const isEmpty = items.length === 0;

  return (
    <View className="flex-1 bg-white">
      {/* Headerft */}
      <View
        className="items-center justify-center"
        style={{ paddingTop: insets.top + 16, height: insets.top + 16 + 44 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="absolute left-6 flex-row items-center h-[44px] px-3 rounded-full gap-1 bg-[#DCEFD8]"
          style={{ top: insets.top + 16 }}
        >
          <Ionicons name="chevron-back" size={20} color="#173F27" />
          <Text className="text-[18px] font-bold text-[#173F27]">Back</Text>
        </Pressable>
        <Text className="text-[32px] font-bold text-[#173F27]">Your Cart</Text>
      </View>

      {isEmpty ? (
        // Empty state
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cart-outline" size={200} color="#2F7A3A" />
          <Text className="text-[38px] font-bold text-[#173F27] mt-6">Your cart is empty!</Text>
          <Text className="text-[22px] font-semibold text-[#2F7A3A] mt-2">
            You haven't added any items yet.
          </Text>
          <Pressable
            onPress={() => router.replace("/home")}
            className="w-full max-w-[300px] h-[60px] rounded-3xl items-center justify-center bg-[#2F7A3A] mt-12"
          >
            <Text className="text-[22px] font-bold text-white">Continue Shopping</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerClassName="px-6 pt-8 pb-6">
          {/* Cart items */}
          {items.map((item) => (
            <View
              key={item.product.id}
              className="flex-row bg-[#DCEFD8] border-2 border-[#8BC585] rounded-2xl p-3 mb-4"
            >
              {/* Product picture */}
              <View className="w-[84px] h-[96px] bg-white rounded-xl items-center justify-center">
                <Image source={item.product.image} style={{ width: 68, height: 84 }} resizeMode="contain" />
              </View>

              <View className="flex-1 ml-4">
                <Text className="text-[18px] font-bold text-[#173F27]">{item.product.cartName}</Text>
                <Text className="text-[16px] text-[#173F27] mt-1">
                  ${item.product.price.toFixed(2)} each
                </Text>

                {/* -  + and remove */}
                <View className="flex-row items-center mt-3">
                  <Pressable
                    onPress={() => removeOne(item.product.id)}
                    className="w-[40px] h-[40px] bg-white border-2 border-[#173F27] rounded-full items-center justify-center"
                  >
                    <Text className="text-[24px] leading-[26px] font-bold text-[#173F27]">−</Text>
                  </Pressable>
                  <Text className="text-[20px] font-bold text-[#173F27] mx-4">{item.quantity}</Text>
                  <Pressable
                    onPress={() => addOne(item.product.id)}
                    className="w-[40px] h-[40px] bg-white border-2 border-[#173F27] rounded-full items-center justify-center"
                  >
                    <Text className="text-[24px] leading-[26px] font-bold text-[#173F27]">+</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => removeAll(item.product.id)}
                    className="flex-row items-center h-[40px] px-3 rounded-full gap-1 bg-white border-2 border-[#E5534B] ml-auto"
                  >
                    <Ionicons name="trash-outline" size={18} color="#E5534B" />
                    <Text className="text-[16px] font-bold text-[#E5534B]">Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}

          {/* Total and checkout */}
          <Text className="text-[28px] font-bold text-[#173F27] self-end mt-2">
            Total: ${total.toFixed(2)}
          </Text>
          <Pressable
            onPress={() => router.push("/payment")}
            className="w-full h-[60px] rounded-2xl items-center justify-center bg-[#2F7A3A] mt-6"
          >
            <Text className="text-[22px] font-bold text-white">Checkout</Text>
          </Pressable>
        </ScrollView>
      )}

      {/* Mascot + help */}
      <Pressable
        onPress={() => router.push({ pathname: "/help", params: { from: "cart" } })}
        className="flex-row items-end px-6"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Image
          source={require("../../assets/images/mascot.png")}
          style={{ width: 90, height: 105 }}
          resizeMode="contain"
        />
        <View className="flex-1 ml-3 mb-2 bg-[#DCEFD8] border-2 border-[#97CB91] rounded-2xl px-4 py-4">
          <Text className="text-[18px] font-medium text-center text-[#173F27]">
            {isEmpty ? "Need help finding items?" : "Need help with your cart?"}
            {"\n"}Tap here!
          </Text>
        </View>
      </Pressable>
    </View>
  );
}