import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PreferencesScreen() {
  const [textSize, setTextSize] = useState("medium");
  const [spokenReadback, setSpokenReadback] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState("normal");

  useEffect(() => {
    getSavedSettings();
  }, []);

  async function getSavedSettings() {
    const saved = await AsyncStorage.getItem("preferences");

    if (saved) {
      const data = JSON.parse(saved);

      setTextSize(data.textSize || "medium");
      setSpokenReadback(data.spokenReadback !== false);
      setVoiceSpeed(data.voiceSpeed || "normal");
    }
  }

  async function saveSettings() {
    const settings = {
      textSize: textSize,
      spokenReadback: spokenReadback,
      voiceSpeed: voiceSpeed,
    };

    await AsyncStorage.setItem("preferences", JSON.stringify(settings));

    router.back();
  }

  let headingSize = 23;
  let normalSize = 18;

  if (textSize === "small") {
    headingSize = 20;
    normalSize = 16;
  }

  if (textSize === "large") {
    headingSize = 27;
    normalSize = 21;
  }

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

          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            Preferences
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
              You can change{"\n"}
              this anytime
            </Text>

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
              fontSize: headingSize,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 12,
            }}
          >
            Text size
          </Text>

          <View style={{ flexDirection: "row" }}>
            <Pressable
              onPress={() => setTextSize("small")}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderWidth: 2,
                borderColor: "#7194E8",
                alignItems: "center",
                backgroundColor: textSize === "small" ? "#D9E6FA" : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "#3F577E",
                  fontWeight: "600",
                }}
              >
                Aa
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setTextSize("medium")}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderWidth: 2,
                borderColor: "#7194E8",
                alignItems: "center",
                marginLeft: 5,
                backgroundColor: textSize === "medium" ? "#D9E6FA" : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: 23,
                  color: "#3F577E",
                  fontWeight: "600",
                }}
              >
                Aa
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setTextSize("large")}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderWidth: 2,
                borderColor: "#7194E8",
                alignItems: "center",
                marginLeft: 5,
                backgroundColor: textSize === "large" ? "#D9E6FA" : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  color: "#3F577E",
                  fontWeight: "600",
                }}
              >
                Aa
              </Text>
            </Pressable>
          </View>

          <Text
            style={{
              fontSize: headingSize,
              fontWeight: "bold",
              marginTop: 20,
            }}
          >
            Spoken order read back
          </Text>

          <Text
            style={{
              fontSize: normalSize,
              marginTop: 5,
            }}
          >
            The app will read your order{"\n"}
            out loud before checkout
          </Text>

          <View
            style={{
              alignItems: "flex-end",
              marginTop: 10,
            }}
          >
            <Pressable
              onPress={() => setSpokenReadback(!spokenReadback)}
              style={{
                width: 60,
                height: 36,
                borderRadius: 30,
                justifyContent: "center",
                backgroundColor: spokenReadback ? "#405A86" : "#C7C7C7",
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 20,
                  backgroundColor: "#fff",
                  marginLeft: spokenReadback ? 28 : 4,
                }}
              />
            </Pressable>
          </View>

          <Text
            style={{
              fontSize: headingSize,
              fontWeight: "bold",
              marginTop: 20,
            }}
          >
            Companion voice speed
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
            }}
          >
            <Pressable
              onPress={() => setVoiceSpeed("slow")}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderWidth: 2,
                borderColor: "#7194E8",
                alignItems: "center",
                backgroundColor: voiceSpeed === "slow" ? "#D9E6FA" : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: normalSize,
                  color: "#3F577E",
                  fontWeight: "600",
                }}
              >
                Slow
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setVoiceSpeed("normal")}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderWidth: 2,
                borderColor: "#7194E8",
                alignItems: "center",
                marginLeft: 5,
                backgroundColor: voiceSpeed === "normal" ? "#D9E6FA" : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: normalSize,
                  color: "#3F577E",
                  fontWeight: "600",
                }}
              >
                Normal
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setVoiceSpeed("fast")}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderWidth: 2,
                borderColor: "#7194E8",
                alignItems: "center",
                marginLeft: 5,
                backgroundColor: voiceSpeed === "fast" ? "#D9E6FA" : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: normalSize,
                  color: "#3F577E",
                  fontWeight: "600",
                }}
              >
                Fast
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={saveSettings}
            style={{
              backgroundColor: "#6AAA50",
              paddingVertical: 15,
              borderRadius: 15,
              alignItems: "center",
              marginTop: 25,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Save
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
