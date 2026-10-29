import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
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
  const { width, height } = useWindowDimensions();
  const smallPhone = height < 750;
  const [status, setStatus] = useState<Status>("idle");
  const [textSize, setTextSize] = useState("medium");
  const [typing, setTyping] = useState(false);
  const [query, setQuery] = useState("");

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

  const bigText = textSize === "small" ? 22 : textSize === "large" ? 30 : 26;

  function handleMicPress() {
    if (status === "idle") setStatus("listening");
    else if (status === "listening") setStatus("results");
  }

  function handleTypedSearch() {
    if (query.trim() === "") return;
    setStatus("results");
  }

  const matches = choices.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  const shownChoices = matches.length > 0 ? matches : choices;

  let bubbleMessage = bubbleText[status];
  if (typing && status === "idle") bubbleMessage = "Type what you are looking for";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white overflow-hidden"
    >
      {/* Speech bubble with text inside */}
      <View className="justify-end" style={{ minHeight: insets.top + 240 }}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          className="absolute left-4"
          style={{ top: insets.top + 8, zIndex: 10 }}
        >
          <Ionicons name="arrow-back-circle-outline" size={48} color="black" />
        </Pressable>
        <Image
          source={require("../../assets/images/bubble.png")}
          style={{ position: "absolute", bottom: 0, left: -20, width: bubbleWidth, height: bubbleHeight }}
          resizeMode="stretch"
        />
        <Text
          className="font-semibold text-center px-10"
          style={{ fontSize: bigText, marginBottom: tailHeight + 30 }}
        >
          {bubbleMessage}
        </Text>
      </View>

      <Image
        source={require("../../assets/images/mascot.png")}
        className="self-center"
        style={typing && status === "idle" ? { width: 120, height: 140 } : smallPhone ? { width: 140, height: 165 } : { width: 200, height: 235 }}
        resizeMode="contain"
      />

      {status === "results" ? (
        /* Results panel */
        <View
          className="flex-1 bg-[#99CBF7] items-center justify-between pt-8 px-6"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          {/* cereal choices */}
          <View className={shownChoices.length === 3 ? "flex-row justify-between w-full" : "flex-row justify-center gap-4 w-full"}>
            {shownChoices.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/product/${item.id}`)}
                className="bg-white rounded-xl p-2"
              >
                <Image source={item.image} style={{ width: 86, height: 136 }} resizeMode="contain" />
              </Pressable>
            ))}
          </View>
          <Text className="font-semibold" style={{ fontSize: bigText }}>Select an item</Text>
        </View>
      ) : typing ? (
        /* Typing option */
        <View className="flex-1 items-center px-6 pt-4" style={{ paddingBottom: insets.bottom + 16 }}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="For example: cereal"
            returnKeyType="search"
            onSubmitEditing={handleTypedSearch}
            autoCapitalize="none"
            autoCorrect={false}
            textAlignVertical="center"
            className="w-full h-14 bg-[#F1F5FB] border-[1.5px] border-[#5B8FD9] rounded-2xl px-5 py-0"
            style={{ fontSize: textSize === "small" ? 18 : textSize === "large" ? 24 : 20 }}
          />

          <Pressable
            onPress={handleTypedSearch}
            className="w-full max-w-[290px] bg-[#4CAA45] py-3 rounded-2xl items-center mt-4"
          >
            <Text className="text-white font-semibold" style={{ fontSize: textSize === "small" ? 19 : textSize === "large" ? 26 : 22 }}>Search</Text>
          </Pressable>

          <Pressable onPress={() => setTyping(false)} className="mt-4 py-2">
            <Text className="text-[#2F6FB5] font-semibold underline" style={{ fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20 }}>
              Use the microphone instead
            </Text>
          </Pressable>
        </View>
      ) : (
        /* Mic button */
        <View className="flex-1 items-center justify-end" style={{ paddingBottom: insets.bottom + 16 }}>
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
              style={{ width: 64, height: 64 }}
              resizeMode="contain"
            />
          </Pressable>
          <Text className="font-semibold mt-4" style={{ fontSize: bigText }}>
            {status === "listening" ? "Tap when done" : "Tap to speak"}
          </Text>

          {status === "idle" && (
            <Pressable onPress={() => setTyping(true)} className="mt-2 py-2">
              <Text className="text-[#2F6FB5] font-semibold underline" style={{ fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20 }}>
                Or type instead
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
