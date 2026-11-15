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
        <View style={{ paddingHorizontal: 18, paddingTop: 8 }}>
         <Pressable
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/home")
          }
          style={{
            alignSelf: "flex-start",
            backgroundColor: "#DCEFD8",
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
         <Text style={{ color: "#173F27", fontWeight: "bold" }}>‹ Back</Text>
       </Pressable>

       <Text
         style={{
           fontSize: textSize === "small" ? 25 : textSize === "large" ? 32 : 28,
           fontWeight: "bold",
           color: "#173F27",
           textAlign: "center",
           marginTop: 14,
         }}
       >
         Account set up
       </Text>
     </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
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
                color: "#2F7A3A",
              }}
            >
              Set up what you would like, or skip and use the default settings.
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
                backgroundColor: "#97CB91",
                flexDirection: "row",
                paddingHorizontal: 16,
                width: "100%",
                paddingVertical: 16,
                borderRadius: 15,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1 }}>
               <Text style={{ fontSize: buttonSize, fontWeight: "bold", color: "#173F27" }}>
                 Usual Items
               </Text>
               <Text style={{ fontSize: headingSize - 6, color: "#173F27" }}>
                 Choose products you buy often
               </Text>
             </View>
             <Text style={{ fontSize: 24, color: "#173F27" }}>›</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/preferences")}
              style={{
                backgroundColor: "#97CB91",
                flexDirection: "row",
                paddingHorizontal: 16,
                width: "100%",
                paddingVertical: 16,
                borderRadius: 15,
                alignItems: "center",
                marginBottom: 12,
              }}
             >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: buttonSize, fontWeight: "bold", color: "#173F27" }}>
                  Preferences
                </Text>
                <Text style={{ fontSize: headingSize - 6, color: "#173F27" }}>
                  Adjust text size and voice settings
                </Text>
              </View>
              <Text style={{ fontSize: 24, color: "#173F27" }}>›</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/tips")}
              style={{
                backgroundColor: "#97CB91",
                flexDirection: "row",
                paddingHorizontal: 16,
                width: "100%",
                paddingVertical: 16,
                borderRadius: 15,
                alignItems: "center",
              }}
            >
             <View style={{ flex: 1 }}>
              <Text style={{ fontSize: buttonSize, fontWeight: "bold", color: "#173F27" }}>
                 Tips
              </Text>
              <Text style={{ fontSize: headingSize - 6, color: "#173F27" }}>
                Set up shopping help
             </Text>
           </View>
           <Text style={{ fontSize: 24, color: "#173F27" }}>›</Text>
         </Pressable>
          </View>

          <View style={{ marginTop: "auto", paddingTop: 25 }}>
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


