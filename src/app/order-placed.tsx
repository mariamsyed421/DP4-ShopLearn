import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "../data/products";

export default function OrderPlacedScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  const bubbleWidth = width + 40;
  const bubbleHeight = bubbleWidth * (963 / 1398);
  const tailHeight = bubbleHeight * 0.2;

  return (
    <View className="flex-1 bg-white overflow-hidden">
      {/* Speech bubble */}
      <View className="justify-end" style={{ height: insets.top + 200 }}>
        <Image
          source={require("../../assets/images/bubble.png")}
          style={{ position: "absolute", bottom: 0, left: -20, width: bubbleWidth, height: bubbleHeight }}
          resizeMode="stretch"
        />
        <Text
          className="text-[28px] font-semibold text-center px-10"
          style={{ marginBottom: tailHeight + 30 }}
        >
          Your usual cereal is on its way!
        </Text>
      </View>

      {/* Mascot */}
      <Image
        source={require("../../assets/images/mascot.png")}
        className="w-[220px] h-[240px] self-center"
        resizeMode="contain"
      />

      {/* Blue panel */}
      <View
        className="flex-1 bg-[#99CBF7] px-8 pt-8 justify-between"
        style={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="flex-row items-center justify-between">
          {product && (
            <View className="bg-white rounded-xl p-2">
              <Image source={product.image} className="w-[120px] h-[180px]" resizeMode="contain" />
            </View>
          )}
          <Image
            source={require("../../assets/images/delivery.png")}
            className="w-[140px] h-[170px]"
            resizeMode="contain"
          />
        </View>

        <Pressable
          onPress={() => router.dismissTo("/home")}
          className="w-full max-w-[290px] self-center bg-[#4CAA45] py-3 rounded-2xl items-center"
        >
          <Text className="text-white text-[22px] font-semibold">Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}