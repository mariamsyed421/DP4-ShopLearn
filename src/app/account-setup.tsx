import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountSetupScreen() {
  const [textSize, setTextSize] = useState("medium");

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  async function loadSettings() {
    const saved = await AsyncStorage.getItem("preferences");
    if (saved) {
      const data = JSON.parse(saved);
      setTextSize(data.textSize || "medium");
    }
  }

  const headingSize = textSize === "small" ? 18 : textSize === "large" ? 23 : 20;
  const buttonSize = textSize === "small" ? 19 : textSize === "large" ? 24 : 21;

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
              fontSize: textSize === "small" ? 25 : textSize === "large" ? 32 : 28,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            Account set up
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 25,
            paddingTop: 25,
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
              Set up what you{"\n"}
              like, or skip and use{"\n"}
              the default settings
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

          <View style={{ marginTop: 30 }}>
            <Pressable
              onPress={() => router.push("/usual-items")}
              style={{
                backgroundColor: "#B9D3F7",
                width: "100%",
                paddingVertical: 16,
                borderRadius: 15,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: buttonSize,
                  fontWeight: "bold",
                  color: "#4B4B4B",
                }}
              >
                Usual items
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/preferences")}
              style={{
                backgroundColor: "#B9D3F7",
                width: "100%",
                paddingVertical: 16,
                borderRadius: 15,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: buttonSize,
                  fontWeight: "bold",
                  color: "#4B4B4B",
                }}
              >
                Preferences
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/tips")}
              style={{
                backgroundColor: "#B9D3F7",
                width: "100%",
                paddingVertical: 16,
                borderRadius: 15,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: buttonSize,
                  fontWeight: "bold",
                  color: "#4B4B4B",
                }}
              >
                Tips
              </Text>
            </Pressable>
          </View>

          <View style={{ marginTop: 25 }}>
            <Pressable
              onPress={() => router.push("/setup-complete")}
              style={{
                backgroundColor: "#6AAA50",
                width: "100%",
                paddingVertical: 15,
                borderRadius: 15,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: headingSize,
                  fontWeight: "bold",
                }}
              >
                Done
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/setup-complete")}
              style={{
                borderWidth: 2,
                borderColor: "#6AAA50",
                width: "100%",
                paddingVertical: 12,
                borderRadius: 15,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#5C9F4B",
                  fontSize: textSize === "small" ? 15 : textSize === "large" ? 19 : 17,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Skip and use default{"\n"}
                settings
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
