import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SetupCompleteScreen() {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              alignItems: "center",
              paddingTop: 30,
            }}
          >
            <Text
              style={{
                fontSize: textSize === "small" ? 24 : textSize === "large" ? 32 : 28,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Set up is complete!
            </Text>

            <Text
              style={{
                fontSize: textSize === "small" ? 24 : textSize === "large" ? 32 : 28,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              all set
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Image
              source={require("../../assets/images/mascot.png")}
              style={{
                width: 240,
                height: 230,
              }}
              resizeMode="contain"
            />
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#A9C7F2",
              paddingHorizontal: 30,
              paddingTop: 30,
              minHeight: 300,
            }}
          >
            <Text
              style={{
                fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20,
                fontWeight: "600",
                marginBottom: 14,
              }}
            >
              ✓ Account created
            </Text>

            <Text
              style={{
                fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20,
                fontWeight: "600",
                marginBottom: 14,
              }}
            >
              ✓ Preferences set
            </Text>

            <Text
              style={{
                fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20,
                fontWeight: "600",
                marginBottom: 14,
              }}
            >
              ✓ Preferred items set
            </Text>

            <Text
              style={{
                fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20,
                fontWeight: "600",
              }}
            >
              ✓ Tips set
            </Text>

            <View
              style={{
                marginTop: 40,
                paddingBottom: 25,
              }}
            >
              <Pressable
                onPress={() => router.push("/home")}
                style={{
                  backgroundColor: "#6AAA50",
                  paddingVertical: 15,
                  borderRadius: 15,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: textSize === "small" ? 17 : textSize === "large" ? 23 : 20,
                    fontWeight: "bold",
                  }}
                >
                  Back to Home
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
