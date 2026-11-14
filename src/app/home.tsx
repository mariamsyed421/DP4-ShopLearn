import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { products } from "../data/products";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  // Mock default
  const [usualIds, setUsualIds] = useState<string[]>(["cheerios", "ctc", "chex"]);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState(""); // "Added to cart" message, "" means hidden

  // cart count stays current
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    const savedUsual = await AsyncStorage.getItem("usualItems");
    if (savedUsual) {
      const ids = JSON.parse(savedUsual);
      if (ids.length > 0) setUsualIds(ids);
    }

    // cart is saved as a list like
    const savedCart = await AsyncStorage.getItem("cart");
    const cart: string[] = savedCart ? JSON.parse(savedCart) : [];
    setCartCount(cart.length);
  }

  async function addToCart(id: string, name: string) {
    const savedCart = await AsyncStorage.getItem("cart");
    const cart: string[] = savedCart ? JSON.parse(savedCart) : [];

    cart.push(id);

    await AsyncStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);

    // Show the confirmation for 2 seconds
    setToast(`${name} added to cart`);
    setTimeout(() => setToast(""), 2000);
  }

  // ask before signing out
  function handleSignOut() {
    Alert.alert("Sign out?", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: () => router.replace("/") },
    ]);
  }

  const usualProducts = products.filter((p) => usualIds.includes(p.id));

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View>
          {/* Header */}
          <View className="h-[44px] items-center justify-center">
            <Text className="text-[32px] font-bold text-[#173F27]">Home</Text>
            {/* Past orders */}
            <Pressable
              onPress={() => router.push("/past-orders")}
              className="absolute left-6 flex-row items-center h-[44px] px-4 rounded-full gap-2 bg-[#DCEFD8]"
            >
              <Ionicons name="receipt-outline" size={22} color="#173F27" />
              <Text className="text-[18px] font-bold text-[#173F27]">Orders</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/cart")}
              className="absolute right-6 flex-row items-center h-[44px] px-4 rounded-full gap-2 bg-[#DCEFD8]"
              hitSlop={8}
            >
              <Ionicons name="cart-outline" size={22} color="#173F27" />
              <Text className="text-[18px] font-bold text-[#173F27]">Cart</Text>
              {/* Count badge  */}
              {cartCount > 0 && (
                <View className="w-6 h-6 rounded-full items-center justify-center bg-[#2F7A3A]">
                  <Text className="text-[14px] font-bold text-white">{cartCount}</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Greeting + mascot */}
          <View className="flex-row items-center px-6 mt-4">
            <Text className="flex-1 text-[24px] font-bold text-center text-[#2F7A3A] mr-2">
              What would you like to shop for today?
            </Text>
            <Pressable
              onPress={() => router.push({ pathname: "/help", params: { from: "home" } })}
              accessibilityLabel="Tap for help"
            >
              <Image
                source={require("../../assets/images/mascot.png")}
                style={{ width: 120, height: 140 }}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {/* Usual items */}
          <View className="px-6 mt-4">
            <Text className="text-[28px] font-bold text-[#173F27]">Your usual items</Text>
            <Text className="text-[18px] mt-1 text-[#173F27]">Tap Add to put it in your cart</Text>

            {/* Green box*/}
            <View className="bg-[#8BC585] rounded-3xl p-4 mt-4" style={{ height: 250 }}>
              {usualProducts.length === 0 ? (
                // Empty state
                <View className="flex-1 items-center justify-center">
                  <Text className="text-[18px] font-semibold text-center text-[#173F27]">
                    You have not picked any usual items yet. You can pick them in Account settings.
                  </Text>
                </View>
              ) : (
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
                  <View className="gap-3">
                    {usualProducts.map((item) => {
                      // maybe go back and change name
                      const title = item.name;
                      const size = item.cartName.replace(item.name, "").trim();

                      return (
                        <Pressable
                          key={item.id}
                          //  opens Product details
                          onPress={() => router.push(`/product/${item.id}`)}
                          className="flex-row items-center bg-white rounded-2xl p-3"
                        >
                          <Image
                            source={item.image}
                            style={{ width: 60, height: 76 }}
                            resizeMode="contain"
                          />
                          <View className="flex-1 ml-3">
                            <Text className="text-[18px] font-bold text-[#173F27]">{title}</Text>
                            {size !== "" && (
                              <Text className="text-[16px] font-semibold text-[#173F27]">{size}</Text>
                            )}
                            <Text className="text-[18px] font-bold text-[#173F27]">
                              ${item.price.toFixed(2)}
                            </Text>
                          </View>
                          <Pressable
                            onPress={() => addToCart(item.id, title)}
                            accessibilityLabel={`Add ${title} to cart`}
                            className="h-[44px] px-4 rounded-full items-center justify-center bg-[#2F7A3A] ml-3"
                          >
                            <Text className="text-[18px] font-bold text-white">Add</Text>
                          </Pressable>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </View>

        {/* Bottom buttons */}
        <View className="items-center px-6 gap-5 mt-8">
          <Pressable
            onPress={() => router.push("/search")}
            className="w-full max-w-[300px] h-[60px] rounded-2xl items-center justify-center bg-[#2F7A3A]"
          >
            <Text className="text-[20px] font-bold text-white">Search for something new</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/account-setup")}
            className="w-full max-w-[300px] h-[60px] rounded-2xl items-center justify-center bg-white border-2 border-[#2F7A3A]"
          >
            <Text className="text-[20px] font-bold text-[#2F7A3A]">Account settings</Text>
          </Pressable>

          <Pressable onPress={handleSignOut} hitSlop={8}>
            <Text className="text-[18px] font-bold underline text-[#2F7A3A]">Sign out</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Added to cart confirmation */}
      {toast !== "" && (
        <View
          className="absolute left-6 right-6 flex-row items-center justify-center gap-2 rounded-2xl py-4 bg-[#173F27]"
          style={{ bottom: insets.bottom + 24 }}
        >
          <Ionicons name="checkmark" size={24} color="white" />
          <Text className="text-[18px] font-bold text-white">{toast}</Text>
        </View>
      )}
    </View>
  );
}