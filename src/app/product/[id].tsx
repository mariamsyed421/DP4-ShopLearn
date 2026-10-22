import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "../../data/products";

export default function ProductScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

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
        <Text className="text-[32px] font-bold">Product Details</Text>
        </View>
      </View>

      <View className="flex-1 px-5 pt-6">
        <Text className="text-[22px] font-semibold">{product.title}</Text>

        {/* Product image */}
        <View className="h-[225px] border-[1.5px] border-[#99CBF7] rounded-2xl items-center justify-center mt-6">
          <Image source={product.image} className="w-[150px] h-[190px]" resizeMode="contain" />
        </View>

        <Text className="text-[20px] font-medium mt-8">{product.description}</Text>
        <Text className="text-[20px] font-medium mt-6">{product.servings}</Text>
      </View>

      {/* Bottom row */}
      <View
        className="flex-row items-center justify-between px-5"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable onPress={() => router.push("/help")}className="items-center">
          <Image
            source={require("../../../assets/images/mascot.png")}
            className="w-[80px] h-[95px]"
            resizeMode="contain"
          />
          <Text className="text-[18px] font-semibold">Tap for help</Text>
        </Pressable>

        <Pressable onPress={handleAddToCart} className="bg-[#4CAA45] px-4 py-2 rounded-full">
          <Text className="text-white text-[24px] font-semibold">Add to cart</Text>
        </Pressable>
      </View>
    </View>
  );
}