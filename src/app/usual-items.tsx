import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = [
  { id: "grocery", label: "Grocery", icon: "food-apple-outline" },
  { id: "household", label: "Household", icon: "home-heart" },
  { id: "health", label: "Health", icon: "plus-box-outline" },
  { id: "other", label: "Other", icon: "dots-horizontal" },
] as const;

export default function UsualItemsScreen() {
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
  const labelSize = textSize === "small" ? 18 : textSize === "large" ? 24 : 20;

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
            Add usual items
          </Text>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 30, paddingTop: 30 }}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() =>
                router.push({ pathname: "/pick-items", params: { category: category.id } })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#BFD8F8",
                borderRadius: 15,
                paddingVertical: 18,
                paddingHorizontal: 20,
                marginBottom: 14,
              }}
            >
              <MaterialCommunityIcons name={category.icon} size={34} color="#3B5FC0" />

              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: labelSize,
                  fontWeight: "bold",
                  color: "#4B4B4B",
                }}
              >
                {category.label}
              </Text>

              <MaterialCommunityIcons name="chevron-right" size={30} color="black" />
            </Pressable>
          ))}
        </View>

        <View style={{ paddingHorizontal: 30, paddingBottom: 30 }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              backgroundColor: "#6AAA50",
              paddingVertical: 15,
              borderRadius: 15,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: labelSize + 2, fontWeight: "bold" }}>
              Done
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
