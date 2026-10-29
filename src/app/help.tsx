import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { loadTips, SavedTip } from "../data/tips";

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from: string }>();
  const [isListening, setIsListening] = useState(false);
  const [textSize, setTextSize] = useState("medium");
  const [tips, setTips] = useState<SavedTip[]>([]);
  const [openTipId, setOpenTipId] = useState("");
  const [answered, setAnswered] = useState(false);

  let suggestedId = "";
  if (from === "home") suggestedId = "reorder";
  if (from === "product") suggestedId = "addcart";
  if (from === "cart" || from === "payment") suggestedId = "checkout";

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const savedPrefs = await AsyncStorage.getItem("preferences");
    if (savedPrefs) {
      const data = JSON.parse(savedPrefs);
      setTextSize(data.textSize || "medium");
    }

    const savedTips = await loadTips();
    const suggested = savedTips.filter((tip) => tip.id === suggestedId);
    const others = savedTips.filter((tip) => tip.id !== suggestedId);
    setTips([...suggested, ...others]);
  }

  function handleMicPress() {
    if (isListening) {
      setIsListening(false);
      setAnswered(true);
      setOpenTipId(suggestedId);
    } else {
      setIsListening(true);
      setAnswered(false);
    }
  }

  function toggleTip(id: string) {
    setOpenTipId(openTipId === id ? "" : id);
  }

  return (
    <View className="flex-1 bg-white">
      {/* Blue header */}
      <View className="bg-[#99CBF7]" style={{ paddingTop: insets.top }}>
        <View className="h-20 items-center justify-center">
          <Pressable onPress={() => router.back()} className="absolute left-4" hitSlop={10}>
            <Ionicons name="arrow-back-circle-outline" size={48} color="black" />
          </Pressable>
          <Text className="font-bold" style={{ fontSize: textSize === "small" ? 27 : textSize === "large" ? 36 : 32 }}>Help</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-8 pt-6 pb-4">
        {/* Saved tips */}
        <Text className="font-bold" style={{ fontSize: textSize === "small" ? 22 : textSize === "large" ? 30 : 26 }}>Saved tips</Text>
        <Text className="mt-1 mb-4" style={{ fontSize: textSize === "small" ? 16 : textSize === "large" ? 21 : 18 }}>
          {answered && suggestedId !== "" ? "Here is help for this screen. You can also tap any tip." : "Ask me for help, or tap a tip to play it"}
        </Text>

        {tips.length === 0 && (
          <Text className="mb-4" style={{ fontSize: textSize === "small" ? 16 : textSize === "large" ? 21 : 18 }}>
            You have not saved any tips yet. You can add some in Account settings.
          </Text>
        )}

        {tips.map((tip) => (
          <View key={tip.id} className="mb-5">
            <Pressable
              onPress={() => toggleTip(tip.id)}
              className="flex-row items-center justify-between bg-[#B5DAFC] rounded-xl px-9 py-5"
            >
              <Text className="font-semibold text-[#333] flex-1 mr-2" style={{ fontSize: textSize === "small" ? 16 : textSize === "large" ? 21 : 18 }}>{tip.name}</Text>
              <Ionicons
                name={openTipId === tip.id ? "chevron-down" : "chevron-forward"}
                size={24}
                color="black"
              />
            </Pressable>

            {openTipId === tip.id && (
              <View className="bg-[#EAF4FE] rounded-xl px-6 py-4 mt-2">
                <Text style={{ fontSize: textSize === "small" ? 16 : textSize === "large" ? 21 : 18 }}>
                  {tip.steps ? tip.steps : `Playing your ${tip.type} tip: ${tip.name}`}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Mascot */}
        <Image
          source={require("../../assets/images/mascot.png")}
          className="self-center mt-2"
          style={{ width: 120, height: 150 }}
          resizeMode="contain"
        />
      </ScrollView>

      {/* Mic button */}
      <View className="items-center" style={{ paddingBottom: insets.bottom + 24 }}>
        <Pressable
          onPress={handleMicPress}
          className="w-[100px] h-[100px] rounded-full bg-[#F2F2F2] border-2 border-[#BABABA] items-center justify-center"
          style={{ boxShadow: "0px 6px 4px 0px rgba(95, 95, 95, 0.3)" }}
        >
          <Image
            source={
              isListening
                ? require("../../assets/images/mic-active.png")
                : require("../../assets/images/mic-inactive.png")
            }
            style={{ width: 54, height: 54 }}
            resizeMode="contain"
          />
        </Pressable>
        <Text className="font-semibold mt-4" style={{ fontSize: textSize === "small" ? 19 : textSize === "large" ? 26 : 22 }}>
          {isListening ? "I’m listening. Tap when done" : "Tap to speak"}
        </Text>
      </View>
    </View>
  );
}
