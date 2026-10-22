import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tips = [
  { id: "checkout", label: "Checking out" },
  { id: "search", label: "Searching for an item" },
];

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const [isListening, setIsListening] = useState(false);

  return (
    <View className="flex-1 bg-white">
      {/* Blue header */}
      <View className="bg-[#99CBF7]" style={{ paddingTop: insets.top }}>
        <View className="h-20 items-center justify-center">
          <Pressable onPress={() => router.back()} className="absolute left-4" hitSlop={10}>
            <Ionicons name="arrow-back-circle-outline" size={48} color="black" />
          </Pressable>
          <Text className="text-[32px] font-bold">Help</Text>
        </View>
      </View>

      <View className="flex-1 px-8 pt-6">
        {/* Saved tips */}
        <Text className="text-[26px] font-bold">Saved tips</Text>
        <Text className="text-[18px] mt-1 mb-4">Tap to play</Text>

        {tips.map((tip) => (
          <Pressable
            key={tip.id}
            onPress={() => {}}
            className="flex-row items-center justify-between bg-[#B5DAFC] rounded-xl px-9 py-5 mb-5"
          >
            <Text className="text-[18px] font-semibold text-[#333]">{tip.label}</Text>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </Pressable>
        ))}

        {/* Mascot */}
        <Image
          source={require("../../assets/images/mascot.png")}
          className="w-[170px] h-[210px] self-center mt-2"
          resizeMode="contain"
        />
      </View>

      {/* Mic button */}
      <View className="items-center" style={{ paddingBottom: insets.bottom + 24 }}>
        <Pressable
          onPress={() => setIsListening(!isListening)}
          className="w-[100px] h-[100px] rounded-full bg-[#F2F2F2] border-2 border-[#BABABA] items-center justify-center"
          style={{ boxShadow: "0px 6px 4px 0px rgba(95, 95, 95, 0.3)" }}
        >
          <Image
            source={
              isListening
                ? require("../../assets/images/mic-active.png")
                : require("../../assets/images/mic-inactive.png")
            }
            className="w-[54px] h-[54px]"
            resizeMode="contain"
          />
        </Pressable>
        <Text className="text-[22px] font-semibold mt-4">
          {isListening ? "Tap when done" : "Tap to speak"}
        </Text>
      </View>
    </View>
  );
}