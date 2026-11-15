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

    (router.canGoBack() ? router.back() : router.replace("/account-setup"));
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
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 18,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            //onPress={() => (router.canGoBack() ? router.back() : router.replace("/account-setup"))}
             onPress={() => router.back()}
            style={{
               backgroundColor: "#DCEFD9",
               paddingHorizontal: 16,
               paddingVertical: 5,
               borderRadius: 25,
               alignItems: "center",
               justifyContent: "center",
              //width: 48,
              //height: 48,
              //borderRadius: 30,
              //borderWidth: 2,
              //borderColor: "black",
              //alignItems: "center",
              //justifyContent: "center",
            }}
          >
             <Text style={{ color: "#173F27" }}>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>‹</Text>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}> Back</Text>
            </Text>
          </Pressable>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              marginLeft: 10,
              color: "#173F27",
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
              You can change{"\n"}
              this anytime!
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
              fontSize: headingSize,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 12,
              color: "#173F27",
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
                borderColor: "#173F27",
                alignItems: "center",
                marginLeft: 5,
                borderTopLeftRadius: 25,
                borderBottomLeftRadius: 25,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                backgroundColor: textSize === "small" ? "#DCEFD8" : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  color: "#173F27",
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
                borderColor: "#173F27",
                alignItems: "center",
                marginLeft: 5,
                borderRadius: 0,
                backgroundColor: textSize === "medium" ? "#DCEFD8" : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  color: "#173F27",
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
                borderColor: "#173F27",
                alignItems: "center",
                marginLeft: 5,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderTopRightRadius: 25,
                borderBottomRightRadius: 25,
                backgroundColor: textSize === "large" ? "#DCEFD8" : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  color: "#173F27",
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
              color: "#173F27",
            }}
          >
            Spoken order read back
          </Text>

          <Text
            style={{
              fontSize: normalSize,
              marginTop: 5,
              color: "#173F27",
            }}
          >
            Hear your order read aloud{"\n"}
            before checkout
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
                backgroundColor: spokenReadback ? "#2F7A3A" : "#C7C7C7",
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
              color: "#173F27",
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
                borderColor: "#173F27",
                alignItems: "center",
                marginLeft: 0,
                borderTopLeftRadius: 25,
                borderBottomLeftRadius: 25,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                backgroundColor: voiceSpeed === "slow" ? "#DCEFD8" : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: normalSize,
                  color: "#173F27",
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
                borderColor: "#173F27",
                alignItems: "center",
                marginLeft: -2,
                borderRadius: 0,
                backgroundColor: voiceSpeed === "normal" ? "#DCEFD8" : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: normalSize,
                  color: "#173F27",
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
                borderColor: "#173F27",
                alignItems: "center",
                marginLeft: -2,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderTopRightRadius: 25,
                borderBottomRightRadius: 25,
                backgroundColor: voiceSpeed === "fast" ? "#DCEFD8" : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: normalSize,
                  color: "#173F27",
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
              backgroundColor: "#2F7A3A",
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
