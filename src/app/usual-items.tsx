import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const colors = {
  heading: "#173F27",
  card: "#97CB91",
  back: "#DCEFD8",
  button: "#2F7A3A",

};


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
  const descriptionSize = textSize === "small" ? 16 : textSize === "large" ? 20 : 18;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 18, paddingTop: 8 }}>

        <Pressable
  onPress={() =>
    router.canGoBack() ? router.back() : router.replace("/account-setup")
  }
  style={{
    alignSelf: "flex-start",
    backgroundColor: colors.back,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
  }}
>
  <Text style={{ color: colors.heading, fontWeight: "bold" }}>
    ‹ Back
  </Text>
</Pressable>

<Text
  style={{
    fontSize: titleSize,
    fontWeight: "bold",
    color: colors.heading,
    textAlign: "center",
    marginTop: 14,
  }}
>
  Add usual items
</Text>

<Text
  style={{
    fontSize: descriptionSize,
    color: colors.button,
    textAlign: "center",
    marginTop: 16,
  }}
>
  Choose a category to add{"\n"}your favorite items.
</Text>
</View>

<View style={{ flex: 1, paddingHorizontal: 30, paddingTop: 30 }}>
  {categories.map((category) => (
    <Pressable
      key={category.id}
      onPress={() =>
        router.push({
          pathname: "/pick-items",
          params: { category: category.id },
        })
    } 
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 15,
      paddingVertical: 18,
      paddingHorizontal: 20,
      marginBottom: 14,
    }}
  >
    <MaterialCommunityIcons
                name={category.icon}
                size={34}
                color={colors.heading}
              />

              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: labelSize,
                  fontWeight: "bold",
                  color: colors.heading,
                }}
              >
                {category.label}
              </Text>

              <MaterialCommunityIcons
                name="chevron-right"
                size={30}
                color={colors.heading}
              />
            </Pressable>
          ))}
        </View>

        <View style={{ paddingHorizontal: 30, paddingBottom: 30 }}>
          <Pressable
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/account-setup")
            }
            style={{
              backgroundColor: colors.button,
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
