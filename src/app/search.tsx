import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const choices = [
  { id: "cheerios", name: "Cheerios", image: require("../../assets/images/cheerios.png") },
  { id: "ctc", name: "Cinnamon Toast Crunch", image: require("../../assets/images/cinnamon-toast-crunch.png") },
  { id: "chex", name: "Rice Chex", image: require("../../assets/images/rice-chex.png") },
];

type Status = "idle" | "listening" | "results";

const bubbleText: Record<Status, string> = {
  idle: "What are you looking for today?",
  listening: "I’m listening",
  results: "Here are a few choices based on what you usually buy",
};

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [status, setStatus] = useState<Status>("idle");
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

  const bubbleWidth = width + 40;
  const bubbleHeight = bubbleWidth * (963 / 1398);
  const tailHeight = bubbleHeight * 0.2;

  function handleMicPress() {
    if (status === "idle") setStatus("listening");
    else if (status === "listening") setStatus("results");
  }

  return (
    <View className="flex-1 bg-white overflow-hidden">
      {/* Speech bubble with text inside */}
      <View className="justify-end" style={{ height: insets.top + 200 }}>
        <Image
          source={require("../../assets/images/bubble.png")}
          style={{ position: "absolute", bottom: 0, left: -20, width: bubbleWidth, height: bubbleHeight }}
          resizeMode="stretch"
        />
        <Text
          className="font-semibold text-center px-10"
          style={{ fontSize: textSize === "small" ? 22 : textSize === "large" ? 30 : 26 }}
          style={{ marginBottom: tailHeight + 30 }}
        >
          {bubbleText[status]}
        </Text>
      </View>

      {/* Mascot */}
      <Image
        source={require("../../assets/images/mascot.png")}
        className="w-[260px] h-[310px] self-center"
        resizeMode="contain"
      />

      {status === "results" ? (
        /* Results panel */
        <View
          className="flex-1 bg-[#99CBF7] items-center justify-between pt-8 px-6"
          style={{ paddingBottom: insets.bottom + 16 }}
        >  
          {/* cereal choices */}
          <View className="flex-row justify-between w-full">
            {choices.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/product/${item.id}`)}
                className="bg-white rounded-xl p-2"
              >
                <Image source={item.image} className="w-[86px] h-[136px]" resizeMode="contain" />
              </Pressable>
            ))}
          </View>
          <Text className="font-semibold" style={{ fontSize: textSize === "small" ? 22 : textSize === "large" ? 30 : 26 }}>Select an item</Text>
        </View>
      ) : (
        /* Mic button */
        <View className="flex-1 items-center justify-end" style={{ paddingBottom: insets.bottom + 40 }}>
          <Pressable
            onPress={handleMicPress}
            className="w-[120px] h-[120px] rounded-full bg-[#F2F2F2] border-2 border-[#BABABA] items-center justify-center"
            style={{ boxShadow: "0px 6px 4px 0px rgba(95, 95, 95, 0.3)" }}
          >
            <Image
              source={
                status === "listening"
                  ? require("../../assets/images/mic-active.png")
                  : require("../../assets/images/mic-inactive.png")
              }
              className="w-[64px] h-[64px]"
              resizeMode="contain"
            />
          </Pressable>
          <Text className="font-semibold mt-6" style={{ fontSize: textSize === "small" ? 22 : textSize === "large" ? 30 : 26 }}>
            {status === "listening" ? "Tap when done" : "Tap to speak"}
          </Text>
        </View>
      )}
    </View>
  );
}