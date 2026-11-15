import { Ionicons } from "@expo/vector-icons";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
} from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sendRecording } from "../api/speech_text";
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

// Words that point to each tip. Whichever tip has the most matching words wins.
const tipWords: Record<string, string[]> = {
  checkout: ["checkout", "check out", "pay", "payment", "place order", "place my order", "confirm"],
  addcart: ["add to cart", "add to my cart", "add an item", "adding", "add", "quantity"],
  search: ["search", "find", "look for", "looking for"],
  reorder: ["usual", "reorder", "re-order", "again", "favorite", "regular"],
};

// Questions that do not have a recorded tip, but we still know the answer
const otherAnswers = [
  {
    title: "Signing out",
    words: ["sign out", "log out", "logout"],
    answer: "On Home, tap Sign out at the bottom. Then tap Sign out again to confirm.",
  },
  {
    title: "Past orders",
    words: ["past order", "old order", "previous order", "cancel"],
    answer: "On Home, tap Orders at the top left. There you can tap Reorder to buy the same things again, or Cancel to cancel an order.",
  },
  {
    title: "Changing the text size",
    words: ["text size", "bigger", "larger", "font", "too small"],
    answer: "On Home, tap Account settings. Tap Preferences, then pick the text size you like.",
  },
];

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from: string }>();
  const [isListening, setIsListening] = useState(false);
  const [tips, setTips] = useState<{ id: string; name: string; steps?: string; type?: string; audioUri?: string }[]>([]);
  const [openTipId, setOpenTipId] = useState("");
  const [answered, setAnswered] = useState(false);
  const [playingId, setPlayingId] = useState(""); // which tip is playing
  const [matchedId, setMatchedId] = useState(""); // the tip we found for what the person asked
  const [helpMessage, setHelpMessage] = useState(""); // what the mascot tells the person
  const [otherAnswer, setOtherAnswer] = useState<{ title: string; answer: string } | null>(null);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

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

  async function handleMicPress() {
    if (!isListening) {
      // start recording
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Microphone is off", "Please allow the microphone, or tap a tip below.");
        return;
      }
      stopTip();
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsListening(true);
      setAnswered(false);
      setHelpMessage("");
      setOtherAnswer(null);
      setMatchedId("");
    } else {
      // stop recording and find out what was said
      setIsListening(false);
      setHelpMessage("One moment...");
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });

      let heard = "";
      try {
        heard = (await sendRecording(recorder.uri!)) || "";
      } catch (e) {
        heard = "";
      }
      answerQuestion(heard.toLowerCase());
    }
  }

  // Look at the words that were said and show the right tip
  function answerQuestion(words: string) {
    setAnswered(true);

    // nothing heard: help for the screen they came from, or ask again
    if (words.trim() === "") {
      if (suggestedId !== "") {
        setHelpMessage("I did not hear you clearly, so here is help for the screen you were on.");
        showTip(suggestedId);
      } else {
        setHelpMessage("Sorry, I did not catch that. Tap the microphone and try again.");
      }
      return;
    }

    // 1. one of the tips?
    let bestId = "";
    let bestScore = 0;
    for (const tip of tips) {
      let score = 0;
      for (const word of tipWords[tip.id] || []) {
        if (words.includes(word)) score = score + 1;
      }
      // tips people recorded themselves: match words in the tip name
      for (const word of tip.name.toLowerCase().split(" ")) {
        if (word.length > 4 && words.includes(word)) score = score + 1;
      }
      if (score > bestScore) {
        bestScore = score;
        bestId = tip.id;
      }
    }

    if (bestId !== "") {
      const tip = tips.find((t) => t.id === bestId);
      if (tip && (tipAudio[bestId] || tip.audioUri)) {
        setHelpMessage(`Here is the tip for: ${tip.name}`);
      } else if (tip) {
        setHelpMessage("A tip is not recorded for that yet, but the answer is:");
      }
      showTip(bestId);
      return;
    }

    // 2. a question we know the answer to, but there is no recorded tip
    for (const other of otherAnswers) {
      if (other.words.some((word) => words.includes(word))) {
        setHelpMessage("A tip is not recorded for that yet, but the answer is:");
        setOtherAnswer({ title: other.title, answer: other.answer });
        return;
      }
    }

    // 3. no answer at all
    setHelpMessage("A tip is not recorded for that, and I do not have an answer yet. You can tap any tip below.");
  }

  // Pick a tip: move it to the top, open it, highlight it and play it
  function showTip(id: string) {
    setMatchedId(id);
    stopTip();
    playTip(id);
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
    // a tip someone recorded themselves, or one of the built in clips
    const tip = tips.find((t) => t.id === id);
    const clip = tip?.audioUri || tipAudio[id];
    if (clip) {
      player.replace(clip);
      player.seekTo(0);
      player.play();
      setPlayingId(id);
    }
  }

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
          {/* Small mascot on top */}
          <Image
            source={require("../../assets/images/mascot.png")}
            style={{ width: 70, height: 84 }}
            resizeMode="contain"
          />
        </View>
        <Text className="text-[32px] font-bold text-center text-[#173F27] -mt-2">Help</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-8 pb-4">
        {/* Tips */}
        <Text className="text-[26px] font-bold text-[#173F27]">Saved tips</Text>
        <Text className="text-[20px] font-semibold text-[#173F27] mb-4">
          {helpMessage !== "" ? helpMessage : "Tap a tip to play it, or tap the microphone and ask me."}
        </Text>

        {/* An answer that does not have a recorded tip */}
        {otherAnswer && (
          <View className="bg-[#DCEFD8] border-2 border-[#F2C94C] rounded-2xl px-5 py-4 mb-4">
            <Text className="text-[20px] font-bold text-[#173F27] mb-1">{otherAnswer.title}</Text>
            <Text className="text-[18px] text-[#173F27] leading-[28px]">{otherAnswer.answer}</Text>
          </View>
        )}

        {[...tips]
          .sort((a, b) => (b.id === matchedId ? 1 : 0) - (a.id === matchedId ? 1 : 0))
          .map((tip) => (
          <View key={tip.id} className="mb-4">
            <Pressable
              onPress={() => toggleTip(tip.id)}
              className={`flex-row items-center justify-between rounded-2xl px-6 min-h-[72px] py-3 border-4 ${
                openTipId === tip.id ? "bg-[#173F27] border-[#F2C94C]" : "bg-[#2F7A3A] border-[#2F7A3A]"
              }`}
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
                {(tip.audioUri || tipAudio[tip.id]) && (
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
                  {tip.steps ? tip.steps : tip.audioUri ? "Tap play to hear this tip." : "This tip does not have a recording yet."}
                </Text>
              </View>
            )}
          </View>
        ))}

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