import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
            backgroundColor: "#ffffff",
            height: 80,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={() => 
               router.canGoBack()
                ? router.back()
                : router.replace("/tips")
                }
            style={{
                position: "absolute",
                left: 16,
                top: 10,
                backgroundColor: "#DCEFD9",
               paddingHorizontal: 16,
               paddingVertical: 5,
               borderRadius: 25,
               alignItems: "center",
               justifyContent: "center",
            }}
          >
             <Text style={{ color: "#173F27" }}>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>‹</Text>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}> Back</Text>
            </Text>
          </Pressable>

          <Text style={{ fontSize: titleSize, fontWeight: "bold", color: "#173F27" }}>Edit my tips</Text>
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
            {/* Decorative lines */}
            <View
              style={{
                width: 30,
                height: 60,
                marginRight: 5,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 2,
                  height: 9,
                  backgroundColor: "#173F27",
                  marginLeft: 20,
                  marginBottom: 8,
                  transform: [{ rotate: "-20deg" }],
                }}
              />

              <View
                style={{
                  width: 9,
                  height: 2,
                  backgroundColor: "#173F27",
                  marginLeft: 5,
                  marginBottom: 12,
                  transform: [{ rotate: "25deg" }],
                }}
              />

              <View
                style={{
                  width: 10,
                  height: 2,
                  backgroundColor: "#173F27",
                  marginLeft: 2,
                  marginBottom: 12,
                }}
              />

              <View
                style={{
                  width: 9,
                  height: 2,
                  backgroundColor: "#173F27",
                  marginLeft: 8,
                  transform: [{ rotate: "-25deg" }],
                }}
              />
            </View>

            {/* Heading */}
            <Text
              style={{
                fontSize: headingSize,
                fontWeight: "bold",
                textAlign: "left",
                flexShrink: 1,
                color: "#173F27",
              }}
            >
              Want to add tips{"\n"}
              for when you{"\n"}
              need help?
            </Text>

            {/* Mascot */}
            <Image
              source={require("../../assets/images/mascot.png")}
              style={{
                width: 90,
                height: 90,
                marginLeft: 8,
              }}
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
              color: "#173F27",
            }}
          >
            Saved tips
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
                backgroundColor: "#DCEFD8",
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
              backgroundColor: "#2F7A3A",
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
