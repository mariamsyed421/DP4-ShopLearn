import { Ionicons } from "@expo/vector-icons";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { loadTips, SavedTip } from "../data/tips";

// recorded audio clip
const tipAudio: Record<string, any> = {
  search: require("../../assets/audio/tip-search.m4a"),
  addcart: require("../../assets/audio/tip-addcart.m4a"),
  checkout: require("../../assets/audio/tip-checkout.m4a"),
  reorder: require("../../assets/audio/tip-reorder.m4a"),
};

// Built-in tips
const builtInTips = [
  {
    id: "search",
    name: "Searching for an item",
    steps: "1. On Home, tap Search for something new.\n2. Tap the microphone and say what you want, like \"cereal\".\n3. Tap the microphone again when you are done.\n4. Tap View on the item you want.",
  },
  {
    id: "addcart",
    name: "Adding an item to your cart",
    steps: "1. Use the - and + buttons to pick how many you want.\n2. Tap Add to cart.\n3. A message at the bottom tells you it was added.",
  },
  {
    id: "checkout",
    name: "Checking out",
    steps: "1. Tap Cart at the top of the screen.\n2. Check your items and tap Checkout.\n3. Check your card and address, then tap Confirm.\n4. Tap Yes, place order.",
  },
  {
    id: "reorder",
    name: "Buying your usual items",
    steps: "1. On Home, find Your usual items.\n2. Tap Add next to the item you want.\n3. Tap Cart at the top when you are ready to check out.",
  },
];

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from: string }>();
  const [isListening, setIsListening] = useState(false);
  const [tips, setTips] = useState<{ id: string; name: string; steps?: string; type?: string }[]>([]);
  const [openTipId, setOpenTipId] = useState("");
  const [answered, setAnswered] = useState(false);
  const [playingId, setPlayingId] = useState(""); // which tip is playing

  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  let suggestedId = "";
  if (from === "home") suggestedId = "reorder";
  if (from === "product") suggestedId = "addcart";
  if (from === "cart" || from === "payment") suggestedId = "checkout";

  useEffect(() => {
    loadSettings();
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  // clip ended
  useEffect(() => {
    if (status.didJustFinish) setPlayingId("");
  }, [status.didJustFinish]);

  async function loadSettings() {
    // recorded tips
    const savedTips: SavedTip[] = await loadTips();
    const savedIds = savedTips.map((tip) => tip.id);
    const allTips = [...savedTips, ...builtInTips.filter((tip) => !savedIds.includes(tip.id))];

    const suggested = allTips.filter((tip) => tip.id === suggestedId);
    const others = allTips.filter((tip) => tip.id !== suggestedId);
    setTips([...suggested, ...others]);
  }

  function handleMicPress() {
    if (isListening) {
      setIsListening(false);
      setAnswered(true);
      if (suggestedId !== "") playTip(suggestedId);
    } else {
      setIsListening(true);
      setAnswered(false);
    }
  }

  // open or close a tip. closing it stops the audio
  function toggleTip(id: string) {
    if (openTipId === id) {
      if (playingId === id) stopTip();
      setOpenTipId("");
    } else {
      setOpenTipId(id);
    }
  }

  function stopTip() {
    player.pause();
    setPlayingId("");
  }

  // play button inside the drop down. tap again: stop
  function playTip(id: string) {
    if (playingId === id) {
      stopTip();
      return;
    }
    setOpenTipId(id);
    if (tipAudio[id]) {
      player.replace(tipAudio[id]);
      player.seekTo(0);
      player.play();
      setPlayingId(id);
    }
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6" style={{ paddingTop: insets.top + 16 }}>
        <Pressable
          onPress={() => router.back()}
          className="self-start flex-row items-center h-[44px] px-3 rounded-full gap-1 bg-[#DCEFD8]"
        >
          <Ionicons name="chevron-back" size={20} color="#173F27" />
          <Text className="text-[18px] font-bold text-[#173F27]">Back</Text>
        </Pressable>
        <Text className="text-[32px] font-bold text-center text-[#173F27] mt-1">Help</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-8 pb-4">
        {/* Tips */}
        <Text className="text-[26px] font-bold text-[#173F27]">Saved tips</Text>
        <Text className="text-[20px] text-[#173F27] mb-4">
          {answered && suggestedId !== "" ? "Here is help for this screen. You can also tap any tip." : "Tap to play"}
        </Text>

        {tips.map((tip) => (
          <View key={tip.id} className="mb-4">
            <Pressable
              onPress={() => toggleTip(tip.id)}
              className="flex-row items-center justify-between bg-[#2F7A3A] rounded-2xl px-6 min-h-[72px] py-3"
            >
              <Text className="flex-1 mr-2 text-[20px] font-bold text-white">{tip.name}</Text>
              <Ionicons
                name={openTipId === tip.id ? "chevron-down" : "chevron-forward"}
                size={26}
                color="white"
              />
            </Pressable>

            {openTipId === tip.id && (
              <View className="bg-white border-2 border-[#8BC585] rounded-2xl px-5 py-4 mt-2">
                {/* play button */}
                {tipAudio[tip.id] && (
                  <Pressable
                    onPress={() => playTip(tip.id)}
                    className="flex-row items-center self-start gap-2 mb-3"
                  >
                    <Ionicons
                      name={playingId === tip.id ? "pause-circle" : "play-circle"}
                      size={32}
                      color="#2F7A3A"
                    />
                    <Text className="text-[18px] font-bold text-[#173F27]">
                      {playingId === tip.id ? "Playing... tap to stop" : "Play recorded tip"}
                    </Text>
                  </Pressable>
                )}
                <Text className="text-[18px] text-[#173F27] leading-[28px]">
                  {tip.steps ? tip.steps : `Playing your ${tip.type} tip: ${tip.name}`}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Mascot */}
        <Image
          source={require("../../assets/images/mascot.png")}
          className="self-center mt-4"
          style={{ width: 150, height: 180 }}
          resizeMode="contain"
        />
      </ScrollView>

      {/* Mic button */}
      <View className="items-center pt-2" style={{ paddingBottom: insets.bottom + 24 }}>
        <Pressable onPress={handleMicPress}>
          <Image
            source={
              isListening
                ? require("../../assets/images/mic-green-active.png")
                : require("../../assets/images/mic-green-inactive.png")
            }
            style={{ width: 130, height: 130 }}
            resizeMode="contain"
          />
        </Pressable>
        <Text className="text-[24px] font-bold text-[#173F27] mt-3">
          {isListening ? "I’m listening. Tap when done" : "Ask me for help!"}
        </Text>
      </View>
    </View>
  );
}