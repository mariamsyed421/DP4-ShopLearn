import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "../data/products";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      {/* Blue header */}
      <View className="bg-[#99CBF7]" style={{ paddingTop: insets.top }}>
        <View className="h-20 items-center justify-center">
          <Pressable onPress={() => router.back()} className="absolute left-4" hitSlop={10}>
            <Ionicons name="arrow-back-circle-outline" size={48} color="black" />
          </Pressable>
          <Text className="text-[32px] font-bold">Home</Text>
        </View>
      </View>

      <View className="flex-1 px-6">
        {/* Greeting row */}
        <View className="flex-row items-center justify-between mt-6">
          <Text className="flex-1 text-[22px] font-semibold text-center mr-2">
            What would you like to shop for today?
          </Text>
          <Image
            source={require("../../assets/images/mascot.png")}
            className="w-[90px] h-[110px]"
            resizeMode="contain"
          />
        </View>

        {/* Usual items */}
        <Text className="text-[28px] font-bold mt-6">Your usual items</Text>
        <Text className="text-lg mt-1">Tap to add to cart</Text>

        <View className="flex-row justify-between mt-4">
          {products.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/product/${item.id}`)}
              accessibilityLabel={`Add ${item.name} to cart`}
              className="bg-[#99CBF7] rounded-lg p-1.5"
            >
              <Image source={item.image} className="w-[86px] h-[136px]" resizeMode="contain" />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Bottom buttons */}
      <View className="items-center px-6 gap-5" style={{ paddingBottom: insets.bottom + 24 }}>
        <Pressable 
            onPress={() => router.push("/search")}
            className="w-full max-w-[300px] bg-[#4CAA45] py-4 rounded-2xl items-center"
        >
          <Text className="text-white text-[24px] font-semibold text-center">
            Search for{"\n"}something new
          </Text>
        </Pressable>
        <Pressable className="w-full max-w-[290px] border-2 border-[#4CAA45] py-3 rounded-2xl items-center">
          <Text className="text-[#4CAA45] text-[22px] font-semibold">Account settings</Text>
        </Pressable>
      </View>
    </View>
  );
}