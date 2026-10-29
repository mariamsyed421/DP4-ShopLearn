import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
            backgroundColor: "#A9C7F2",
            paddingHorizontal: 18,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 48,
              height: 48,
              borderRadius: 30,
              borderWidth: 2,
              borderColor: "black",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 30 }}>←</Text>
          </Pressable>

          <Text style={{ fontSize: titleSize, fontWeight: "bold", marginLeft: 10 }}>
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

          <Text style={{ fontSize: normalSize, marginTop: 15, marginBottom: 25 }}>
            A tip is a short message that plays when you tap for help. A family
            member can record it too.
          </Text>

          <Pressable
            onPress={() => router.push({ pathname: "/record-tip", params: { type: "audio" } })}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#BFD8F8",
              borderRadius: 15,
              paddingVertical: 18,
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <MaterialCommunityIcons name="microphone" size={30} color="black" />
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: buttonSize,
                fontWeight: "bold",
                color: "#4B4B4B",
              }}
            >
              Record audio
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push({ pathname: "/record-tip", params: { type: "video" } })}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#BFD8F8",
              borderRadius: 15,
              paddingVertical: 18,
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <MaterialCommunityIcons name="camera" size={30} color="black" />
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: buttonSize,
                fontWeight: "bold",
                color: "#4B4B4B",
              }}
            >
              Record video
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/edit-tips")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#BFD8F8",
              borderRadius: 15,
              paddingVertical: 18,
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <MaterialCommunityIcons name="pencil" size={30} color="black" />
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: buttonSize,
                fontWeight: "bold",
                color: "#4B4B4B",
              }}
            >
              Edit my tips
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={{
              borderWidth: 3,
              borderColor: "#4A72B0",
              borderRadius: 15,
              paddingVertical: 16,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "#4A72B0", fontSize: buttonSize, fontWeight: "bold" }}>
              Not now
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
