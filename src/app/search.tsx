import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "../data/products";

// statuses
type Status = "idle" | "listening" | "searching" | "results";

// heading text for each state
const headingText: Record<Status, string> = {
  idle: "What are you looking for today?",
  listening: "I’m listening",
  searching: "Searching...",
  results: "Here are a few choices based on what you usually buy",
};

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState<Status>("idle");
  const [typing, setTyping] = useState(false);
  const [query, setQuery] = useState("");

  // show searching for 1.5 seconds
  function showResults() {
    setStatus("searching");
    setTimeout(() => setStatus("results"), 1500);
  }

  function handleMicPress() {
    if (status === "idle") setStatus("listening");
    else if (status === "listening") showResults();
  }

  function handleTypedSearch() {
    if (query.trim() === "") return;
    setTyping(false);
    showResults();
  }

  // 3 closest matches
  const matches = products.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  const shownProducts = (matches.length > 0 ? matches : products).slice(0, 3);

  let heading = headingText[status];
  if (typing && status === "idle") heading = "Type what you are looking for";

  // Searching + results
  if (status === "searching" || status === "results") {
    return (
      <View className="flex-1 bg-white">
        {/* Back  */}
        <View className="px-6" style={{ paddingTop: insets.top + 16 }}>
          <Pressable
            onPress={() => setStatus("idle")}
            className="self-start flex-row items-center h-[44px] px-3 rounded-full gap-1 bg-[#DCEFD8]"
          >
            <Ionicons name="chevron-back" size={20} color="#173F27" />
            <Text className="text-[18px] font-bold text-[#173F27]">Back</Text>
          </Pressable>
        </View>

        {/* Heading + mascot*/}
        <View className="flex-row items-end px-6 mt-12" style={{ zIndex: 0 }}>
          <View className="flex-1 items-center mb-24">
            <Text className="text-[26px] font-bold text-center text-[#173F27]">{heading}</Text>
          </View>
          <Image
            source={require("../../assets/images/mascot.png")}
            style={{ width: 120, height: 160 }}
            resizeMode="contain"
          />
        </View>

        {/* Green card */}
        <View
          className="flex-1 rounded-t-[32px] px-6 pt-10 bg-[#8BC585]"
          style={{ marginTop: -40, zIndex: 1, elevation: 1, paddingBottom: insets.bottom + 24 }}
        >
          {status === "searching" ? (
            // grey placeholder
            <View className="gap-4">
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  className="flex-row items-center bg-white rounded-2xl p-3 animate-pulse"
                >
                  <View className="w-[60px] h-[76px] rounded-lg bg-[#E3E3E3]" />
                  <View className="flex-1 ml-3 gap-2">
                    <View className="h-4 w-3/4 rounded-full bg-[#E3E3E3]" />
                    <View className="h-4 w-1/2 rounded-full bg-[#E3E3E3]" />
                    <View className="h-4 w-1/4 rounded-full bg-[#E3E3E3]" />
                  </View>
                  <View className="w-[64px] h-[44px] rounded-full bg-[#E3E3E3] ml-3" />
                </View>
              ))}
            </View>
          ) : (
            <ScrollView
              contentContainerClassName="gap-4 pb-4"
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            >
              {/* Result rows */}
              {shownProducts.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(`/product/${item.id}`)}
                  className="flex-row items-center bg-white rounded-2xl p-3"
                >
                  <Image source={item.image} style={{ width: 60, height: 76 }} resizeMode="contain" />
                  <View className="flex-1 ml-3">
                    <Text className="text-[18px] font-bold text-[#173F27]">{item.name}</Text>
                    <Text className="text-[16px] font-semibold text-[#173F27]">
                      {item.cartName.replace(item.name, "").trim()}
                    </Text>
                    <Text className="text-[18px] font-bold text-[#173F27]">${item.price.toFixed(2)}</Text>
                  </View>
                  <View className="h-[44px] px-4 rounded-full items-center justify-center bg-[#2F7A3A] ml-3">
                    <Text className="text-[18px] font-bold text-white">View</Text>
                  </View>
                </Pressable>
              ))}

              <Pressable
                onPress={() => {
                  setQuery("");
                  setStatus("idle");
                }}
                className="self-center w-full max-w-[280px] h-[60px] rounded-2xl items-center justify-center bg-white mt-6"
              >
                <Text className="text-[22px] font-bold text-[#2F7A3A]">Search again</Text>
              </Pressable>
            </ScrollView>
          )}
        </View>
      </View>
    );
  }

 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#8BC585]"
    >
      <View className="flex-1 px-6" style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}>
        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          className="self-start flex-row items-center h-[44px] px-3 rounded-full gap-1 bg-white"
        >
          <Ionicons name="chevron-back" size={20} color="#173F27" />
          <Text className="text-[18px] font-bold text-[#173F27]">Back</Text>
        </Pressable>

        {/* Heading*/}
        <View className="h-[76px] justify-center mt-10">
          <Text className="text-[28px] font-bold text-center text-[#173F27]">{heading}</Text>
        </View>

        {/* Mascot */}
        <Image
          source={
            status === "listening"
              ? require("../../assets/images/mascotlisteningbubble.png")
              : require("../../assets/images/mascotinbubble.png")
          }
          className="self-center -mt-4"
          style={typing ? { width: 200, height: 150 } : { width: 340, height: 280 }}
          resizeMode="contain"
        />

        {typing ? (
          /* Typing option */
          <View className="flex-1 items-center pt-6">
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="For example: cereal"
              returnKeyType="search"
              onSubmitEditing={handleTypedSearch}
              autoCapitalize="none"
              autoCorrect={false}
              className="w-full h-[56px] text-[18px] bg-white border-2 border-[#2F7A3A] rounded-full px-5"
            />
            <Pressable
              onPress={handleTypedSearch}
              className="w-full max-w-[300px] h-[60px] rounded-2xl items-center justify-center bg-[#2F7A3A] mt-5"
            >
              <Text className="text-[20px] font-bold text-white">Search</Text>
            </Pressable>
            <Pressable onPress={() => setTyping(false)} className="mt-4 py-2">
              <Text className="text-[18px] font-bold underline text-[#173F27]">
                Use the microphone instead
              </Text>
            </Pressable>
          </View>
        ) : (
          /* Mic button */
          <View className="flex-1 items-center justify-center pt-4">
            <Pressable onPress={handleMicPress}>
              <Image
                source={
                  status === "listening"
                    ? require("../../assets/images/mic-green-active.png")
                    : require("../../assets/images/mic-green-inactive.png")
                }
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
              />
            </Pressable>

            <Text className="text-[26px] font-bold text-[#173F27] mt-5">
              {status === "listening" ? "Tap when done" : "Tap to speak"}
            </Text>

            <Pressable
              onPress={() => (status === "listening" ? setStatus("idle") : setTyping(true))}
              className="mt-1 py-2"
            >
              <Text className="text-[18px] font-bold underline text-[#173F27]">
                {status === "listening" ? "Cancel" : "Type instead"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}