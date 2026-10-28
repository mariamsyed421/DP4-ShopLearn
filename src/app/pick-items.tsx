import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { products } from "../data/products";

const categoryNames: Record<string, string> = {
  grocery: "Grocery",
  household: "Household",
  health: "Health",
  other: "Other",
};

export default function PickItemsScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [textSize, setTextSize] = useState("medium");
  const [picked, setPicked] = useState<string[]>([]);

  const categoryProducts = category === "grocery" ? products : [];

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const savedPrefs = await AsyncStorage.getItem("preferences");
    if (savedPrefs) {
      const data = JSON.parse(savedPrefs);
      setTextSize(data.textSize || "medium");
    }

    const savedUsual = await AsyncStorage.getItem("usualItems");
    if (savedUsual) {
      setPicked(JSON.parse(savedUsual));
    }
  }

  async function toggleItem(id: string) {
    let newPicked = [...picked, id];
    if (picked.includes(id)) {
      newPicked = picked.filter((p) => p !== id);
    }
    setPicked(newPicked);
    await AsyncStorage.setItem("usualItems", JSON.stringify(newPicked));
  }

  const titleSize = textSize === "small" ? 25 : textSize === "large" ? 32 : 28;
  const normalSize = textSize === "small" ? 16 : textSize === "large" ? 21 : 18;

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
            {categoryNames[category] || "Items"}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 25,
            paddingTop: 20,
            paddingBottom: 25,
          }}
        >
          {categoryProducts.length === 0 ? (
            <Text style={{ fontSize: normalSize + 2, textAlign: "center", marginTop: 40 }}>
              There are no items here yet.
            </Text>
          ) : (
            <Text style={{ fontSize: normalSize, marginBottom: 15 }}>
              Tap the things you buy a lot. They will show up on your Home screen.
            </Text>
          )}

          {categoryProducts.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => toggleItem(item.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: picked.includes(item.id) ? "#D9E6FA" : "#fff",
                borderWidth: 2,
                borderColor: "#7194E8",
                borderRadius: 15,
                padding: 10,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 100,
                  backgroundColor: "#99CBF7",
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={item.image}
                  style={{ width: 60, height: 90 }}
                  resizeMode="contain"
                />
              </View>

              <Text
                style={{
                  flex: 1,
                  fontSize: normalSize + 2,
                  fontWeight: "600",
                  marginLeft: 12,
                }}
              >
                {item.name}
              </Text>

              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#4CAA45",
                  width: 40,
                  textAlign: "center",
                }}
              >
                {picked.includes(item.id) ? "✓" : ""}
              </Text>
            </Pressable>
          ))}

          <Pressable
            onPress={() => router.back()}
            style={{
              backgroundColor: "#6AAA50",
              paddingVertical: 15,
              borderRadius: 15,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: normalSize + 3, fontWeight: "bold" }}>
              Done
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
