import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { products } from "../data/products";

const colors = {
  heading: "#173F27",
  card: "#97CB91",
  back: "#DCEFD8",
  button: "#2F7A3A",
};

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
  const [showSummary, setShowSummary] = useState(false);

const categoryProducts = products.filter(
    (product) => product.category === category
  ); 

const visibleProducts = showSummary
    ? products.filter((product) => picked.includes(product.id))
    : categoryProducts;


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

  function returnToCategories() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/usual-items");
    }
  }

  const titleSize = textSize === "small" ? 25 : textSize === "large" ? 32 : 28;
  const normalSize = textSize === "small" ? 16 : textSize === "large" ? 21 : 18;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingHorizontal: 18, paddingTop: 8 }}>
        <Pressable
          onPress={() =>
            showSummary ? setShowSummary(false) : returnToCategories()
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
          {showSummary ? "Your usual items" : "Add usual items"}
        </Text>
      
        <View
          style={{
           flexDirection: "row",
           alignItems: "center",
           justifyContent: "center",
           marginTop: 16,
          }}
        >
          <Text
            style={{
              flexShrink: 1,
              fontSize: normalSize,
              color: colors.button,
              textAlign: "center",
            }}
          >
            {showSummary
              ? "These items will appear on your homepage."
              : "Select the products you buy often."}
          </Text>

          {!showSummary && (
            <Image
              source={require("../../assets/images/mascot.png")}
              style={{ width: 64, height: 64, marginLeft: 12 }}
              resizeMode="contain"
            />
          )}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
      >
        {visibleProducts.length === 0 && (
          <Text style={{ fontSize: normalSize, textAlign: "center" }}>
            {showSummary ? "No usual items selected." : "There are no items here yet."}
          </Text>
        )}

        {visibleProducts.map((item) => {
          const checked = picked.includes(item.id);

          return (
            <Pressable
              key={item.id}
              disabled={showSummary}
              onPress={() => toggleItem(item.id)}
              accessibilityRole={showSummary ? undefined : "checkbox"}
              accessibilityState={showSummary ? undefined : { checked }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              {!showSummary && (
                <View
                  style={{
                    width: 26,
                    height: 26,
                    marginRight: 12,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: checked ? "#303030" : colors.heading,
                    backgroundColor: checked ? "#303030" : "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    {checked ? "✓" : ""}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  padding: 10,
                }}
              >
                <Image
                  source={item.image}
                  style={{
                    width: 62,
                    height: 66,
                    backgroundColor: "#fff",
                    borderRadius: 8,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: normalSize, fontWeight: "bold" }}>
                    {item.cartName}
                  </Text>
                  <Text
                    style={{
                      fontSize: normalSize - 2,
                      fontWeight: "bold",
                      textAlign: "right",
                      marginTop: 4,
                    }}
                  >
                    {`$${item.price.toFixed(2)}`}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        onPress={() =>
          showSummary ? returnToCategories() : setShowSummary(true)
        }
        style={{
          backgroundColor: colors.button,
          paddingVertical: 15,
          borderRadius: 15,
          alignItems: "center",
          marginHorizontal: 30,
          marginBottom: 30,
        }}
      >
        <Text style={{ color: "#fff", fontSize: normalSize + 3, fontWeight: "bold" }}>
          {showSummary ? "Done" : "Next"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
           



