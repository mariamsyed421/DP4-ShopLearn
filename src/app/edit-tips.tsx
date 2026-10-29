import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loadTips, SavedTip } from "../data/tips";

export default function EditTipsScreen() {
  const [textSize, setTextSize] = useState("medium");
  const [tips, setTips] = useState<SavedTip[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  async function loadSettings() {
    const savedPrefs = await AsyncStorage.getItem("preferences");
    if (savedPrefs) {
      const data = JSON.parse(savedPrefs);
      setTextSize(data.textSize || "medium");
    }

    setTips(await loadTips());
  }

  const titleSize = textSize === "small" ? 27 : textSize === "large" ? 36 : 32;
  const headingSize = textSize === "small" ? 17 : textSize === "large" ? 23 : 20;
  const sectionSize = textSize === "small" ? 22 : textSize === "large" ? 30 : 26;
  const rowSize = textSize === "small" ? 16 : textSize === "large" ? 21 : 18;
  const buttonSize = textSize === "small" ? 19 : textSize === "large" ? 26 : 22;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "#A9C7F2",
            height: 80,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={{ position: "absolute", left: 16 }}
          >
            <Ionicons name="arrow-back-circle-outline" size={48} color="black" />
          </Pressable>

          <Text style={{ fontSize: titleSize, fontWeight: "bold" }}>Saved tips</Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 30,
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: headingSize,
                fontWeight: "bold",
                textAlign: "center",
                flexShrink: 1,
              }}
            >
              Want to add tips{"\n"}
              for when you{"\n"}
              need help?
            </Text>

            <Image
              source={require("../../assets/images/mascot.png")}
              style={{ width: 90, height: 90, marginLeft: 8 }}
              resizeMode="contain"
            />
          </View>

          <Text
            style={{
              fontSize: sectionSize,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 30,
              marginBottom: 16,
            }}
          >
            Edit my tips
          </Text>

          {tips.map((tip) => (
            <Pressable
              key={tip.id}
              onPress={() =>
                router.push({ pathname: "/record-tip", params: { id: tip.id, type: tip.type } })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#BFD8F8",
                borderRadius: 12,
                paddingVertical: 18,
                paddingHorizontal: 24,
                marginBottom: 14,
              }}
            >
              <Text style={{ flex: 1, fontSize: rowSize, fontWeight: "600", color: "#333" }}>
                {tip.name}
              </Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: 50, paddingBottom: 24 }}>
          <Pressable
            onPress={() => router.dismissTo("/account-setup")}
            style={{
              backgroundColor: "#6AAA50",
              paddingVertical: 14,
              borderRadius: 15,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: buttonSize, fontWeight: "bold" }}>Done</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
