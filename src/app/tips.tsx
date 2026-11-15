import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TipsScreen() {
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

  const titleSize = textSize === "small" ? 25 : textSize === "large" ? 32 : 28;
  const headingSize = textSize === "small" ? 17 : textSize === "large" ? 23 : 20;
  const normalSize = textSize === "small" ? 16 : textSize === "large" ? 21 : 18;
  const buttonSize = textSize === "small" ? 18 : textSize === "large" ? 24 : 20;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 18,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
          onPress={() => router.back()}
            style={{
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

          <Text style={{ fontSize: titleSize, fontWeight: "bold", marginLeft: 10, color: "#173F27" }}>
            Set up tips
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 25,
            paddingTop: 20,
            paddingBottom: 25,
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

          <Text style={{ fontSize: normalSize, marginTop: 15, marginBottom: 65, color: "#173F27" }}>
            A tip is a short message that plays when you tap for help. A family
            member can record it too.
          </Text>

          <Pressable
            onPress={() => router.push({ pathname: "/record-tip", params: { type: "audio" } })}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#DCEFD8",
              borderRadius: 15,
              paddingVertical: 18,
              paddingHorizontal: 20,
              marginBottom: 30,
            }}
          >
            <MaterialCommunityIcons name="microphone" size={30} color="#173F27" />
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: buttonSize,
                fontWeight: "bold",
                color: "#173F27",
              }}
            >
              Record audio
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/edit-tips")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#DCEFD8",
              borderRadius: 15,
              paddingVertical: 18,
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <MaterialCommunityIcons name="pencil" size={30} color="#173F27" />
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: buttonSize,
                fontWeight: "bold",
                color: "#173F27",
              }}
            >
              Edit my tips
            </Text>
          </Pressable>

          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/account-setup"))}
            style={{
              borderWidth: 3,
              borderColor: "#2F7A3A",
              borderRadius: 15,
              paddingVertical: 16,
              alignItems: "center",
              marginTop: 90,
            }}
          >
            <Text style={{ color: "#2F7A3A", fontSize: buttonSize, fontWeight: "bold" }}>
              Not now
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
