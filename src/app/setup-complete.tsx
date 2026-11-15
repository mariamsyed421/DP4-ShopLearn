import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SetupCompleteScreen() {
  const [textSize, setTextSize] = useState("medium");
  const [prefsDone, setPrefsDone] = useState(false);
  const [usualDone, setUsualDone] = useState(false);
  const [tipsDone, setTipsDone] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const savedPrefs = await AsyncStorage.getItem("preferences");
    const savedUsual = await AsyncStorage.getItem("usualItems");
    const savedTips = await AsyncStorage.getItem("customTips");

    if (savedPrefs) {
      const data = JSON.parse(savedPrefs);
      setTextSize(data.textSize || "medium");
    }

    setPrefsDone(savedPrefs !== null);
    setUsualDone(savedUsual !== null);
    setTipsDone(savedTips !== null && JSON.parse(savedTips).length > 0);
  }

  function goHome() {
    router.dismissAll();
    router.replace("/home");
  }

  const titleSize = textSize === "small" ? 24 : textSize === "large" ? 32 : 28;
  const lineSize = textSize === "small" ? 17 : textSize === "large" ? 23 : 20;

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
            <Text style={{ fontSize: titleSize, fontWeight: "bold", textAlign: "center", color: "#173F27" }}>
              Set up is complete!
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
              backgroundColor: "#ffffff",
              paddingHorizontal: 30,
              paddingTop: 30,
              minHeight: 300,
            }}
          >
            <View
              style={{
                backgroundColor: "#DCEFD8",
                borderRadius: 12,
                paddingHorizontal: 15,
                paddingVertical: 20,
              }}
            >
            <Text style={{ fontSize: lineSize, fontWeight: "600", marginBottom: 14, color: "#173F27" }}>
              ✓ Account created
            </Text>

            <Text style={{ fontSize: lineSize, fontWeight: "600", marginBottom: 14, color: "#173F27" }}>
              {prefsDone ? "✓ Preferences set" : " ✓ Preferences set"}
            </Text>

            <Text style={{ fontSize: lineSize, fontWeight: "600", marginBottom: 14, color: "#173F27" }}>
              {usualDone ? "✓ Usual items set" : " ✓ Prefered items set"}
            </Text>

            <Text style={{ fontSize: lineSize, fontWeight: "600", color: "#173F27"}}>
              {tipsDone ? "✓ Tips set" : " ✓ Tips set"}
            </Text>
          </View>
            <View
              style={{
                marginTop: 40,
                paddingBottom: 25,
              }}
            >
              <Pressable
                onPress={goHome}
                style={{
                  backgroundColor: "#2F7A3A",
                  paddingVertical: 15,
                  borderRadius: 15,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontSize: lineSize, fontWeight: "bold" }}>
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
