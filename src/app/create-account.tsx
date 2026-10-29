import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateAccountScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  async function handleNext() {
    if (username.trim() === "") {
      setError("Please type a username.");
      return;
    }

    if (password.length < 4) {
      setError("Your password needs at least 4 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The two passwords do not match. Please try again.");
      return;
    }

    const account = { username: username.trim(), password: password };
    await AsyncStorage.setItem("account", JSON.stringify(account));

    setError("");
    router.push("/account-setup");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View className="flex-1">
        <View className="bg-[#A9C7F2] px-5 py-5 flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-12 h-12 rounded-full border-2 border-black items-center justify-center"
          >
            <Text className="text-3xl">←</Text>
          </Pressable>

          <Text className="text-3xl font-bold ml-3">Create Account</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-8 pb-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-7">
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-center">
                Let’s set up{"\n"}your account!
              </Text>

              <Image
                source={require("../../assets/images/mascot.png")}
                className="ml-3" style={{ width: 105, height: 105 }}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text className="text-xl font-semibold mb-2">Username</Text>

          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            autoCapitalize="none"
            autoCorrect={false}
            className="border-2 border-[#7194E8] rounded-2xl px-4 py-3 text-lg mb-5 bg-[#F5F7FC]"
          />

          <Text className="text-xl font-semibold mb-2">Password</Text>

          <View className="relative mb-5">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              className="border-2 border-[#7194E8] rounded-2xl px-4 py-3 pr-16 text-lg bg-[#F5F7FC]"
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3"
            >
              <Text className="text-base font-semibold text-gray-600">
                {showPassword ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>

          <Text className="text-xl font-semibold mb-2">Confirm Password</Text>

          <View className="relative">
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              secureTextEntry={!showConfirmPassword}
              className="border-2 border-[#7194E8] rounded-2xl px-4 py-3 pr-16 text-lg bg-[#F5F7FC]"
            />

            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3"
            >
              <Text className="text-base font-semibold text-gray-600">
                {showConfirmPassword ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>

          {error !== "" && (
            <Text className="text-[#C0392B] text-lg font-semibold text-center mt-4">
              {error}
            </Text>
          )}

          <Pressable
            onPress={handleNext}
            className="bg-[#6AAA50] py-4 rounded-2xl items-center mt-6"
          >
            <Text className="text-white text-xl font-bold">Next</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
