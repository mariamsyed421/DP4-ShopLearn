import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

  async function handleSignIn() {
    if (username.trim() === "demo" && password === "demo123") {
      router.push("/home");
      return;
    }

    const saved = await AsyncStorage.getItem("account");
    if (saved) {
      const account = JSON.parse(saved);
      if (account.username === username.trim() && account.password === password) {
        router.push("/home");
        return;
      }
    }

    setError("That username or password is not right. Please try again.");
  }

  const labelSize = textSize === "small" ? 18 : textSize === "large" ? 24 : 20;
  const inputSize = textSize === "small" ? 16 : textSize === "large" ? 22 : 18;

  return (
    <View className="flex-1 bg-white">
      {/* Blue header */}
      <View className="bg-[#99CBF7]" style={{ paddingTop: insets.top }}>
        <View className="h-20 items-center justify-center">
          <Pressable
            onPress={() => router.back()}
            className="absolute left-4"
            hitSlop={10}
          >
            <Ionicons name="arrow-back-circle-outline" size={48} color="black" />
          </Pressable>
          <Text
            className="font-bold"
            style={{ fontSize: textSize === "small" ? 27 : textSize === "large" ? 36 : 32 }}
          >
            Sign in
          </Text>
        </View>
      </View>

      <View className="flex-1 px-5">
        {/* Greeting row */}
        <View className="flex-row items-center justify-between mt-8 mb-12 pl-4 pr-2">
          <View className="flex-row items-center">
            <Text
              className="font-semibold ml-3"
              style={{ fontSize: textSize === "small" ? 26 : textSize === "large" ? 34 : 30 }}
            >
              Let’s log in
            </Text>
          </View>
          <Image
            source={require("../../assets/images/mascot.png")}
            style={{ width: 90, height: 110 }}
            resizeMode="contain"
          />
        </View>

        {/* Username */}
        <Text className="font-semibold mb-2 ml-1" style={{ fontSize: labelSize }}>
          Username
        </Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          textAlignVertical="center"
          className="h-12 bg-[#F1F5FB] border-[1.5px] border-[#5B8FD9] rounded-2xl px-4 py-0 mb-8"
          style={{ fontSize: inputSize }}
        />

        {/* Password */}
        <Text className="font-semibold mb-2 ml-1" style={{ fontSize: labelSize }}>
          Password
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textAlignVertical="center"
          className="h-12 bg-[#F1F5FB] border-[1.5px] border-[#5B8FD9] rounded-2xl px-4 py-0"
          style={{ fontSize: inputSize }}
        />

        {error !== "" && (
          <Text className="text-[#C0392B] font-semibold text-center mt-6" style={{ fontSize: labelSize - 2 }}>
            {error}
          </Text>
        )}
      </View>

      {/* Next button */}
      <View className="items-center px-6" style={{ paddingBottom: insets.bottom + 24 }}>
        <Pressable
          onPress={handleSignIn}
          className="w-full max-w-[280px] bg-[#4CAA45] py-4 rounded-2xl items-center"
        >
          <Text className="text-white text-xl font-semibold">Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
