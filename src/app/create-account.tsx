import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateAccountScreen() {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  // one error per field, "" means no error
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  async function handleCreateAccount() {
    const userErr = username.trim() === "" ? "Please type a username." : "";
    const passErr =
      password === "" ? "Please type a password." :
      password.length < 4 ? "Your password needs at least 4 characters." : "";
    const confirmErr =
      confirmPassword === "" ? "Please type your password again." :
      password !== confirmPassword ? "The passwords don't match. Please try again." : "";

    setUsernameError(userErr);
    setPasswordError(passErr);
    setConfirmError(confirmErr);
    if (userErr || passErr || confirmErr) return;

    const account = { username: username.trim(), password: password };
    await AsyncStorage.setItem("account", JSON.stringify(account));
    router.push("/account-setup");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Header */}
        <View className="px-6" style={{ paddingTop: insets.top + 16 }}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
            className="self-start flex-row items-center h-[44px] px-3 rounded-full gap-1 bg-[#DCEFD8]"
          >
            <Ionicons name="chevron-back" size={20} color="#173F27" />
            <Text className="text-[18px] font-bold text-[#173F27]">Back</Text>
          </Pressable>
          <Text className="text-[28px] font-bold text-center text-[#173F27] mt-3">Create Account</Text>
        </View>

        {/* Greeting + mascot */}
        <View className="flex-row items-end mt-4 px-6" style={{ zIndex: 0 }}>
          <View className="flex-1 items-center mb-24">
            <Text className="text-[24px] font-bold text-center text-[#173F27]">
              Let’s set up{"\n"}your account!
            </Text>
          </View>
          <Image
            source={require("../../assets/images/mascot.png")}
            style={{ width: 140, height: 170 }}
            resizeMode="contain"
          />
        </View>

        {/* Green card */}
        <View
          className="flex-1 rounded-t-[32px] px-6 pt-8 bg-[#8BC585] justify-evenly"
          style={{ marginTop: -48, zIndex: 1, elevation: 1, paddingBottom: insets.bottom + 32 }}
        >
          <View>
            {/* Username */}
            <Text className="text-[20px] font-bold mb-2 ml-1 text-[#173F27]">Username</Text>
            <TextInput
              value={username}
              onChangeText={(t) => {
                setUsername(t);
                setUsernameError("");
              }}
              autoCapitalize="none"
              autoCorrect={false}
              className={`h-[56px] text-[18px] text-[#173F27] bg-white rounded-full px-5 border-2 ${
                usernameError ? "border-[#7A1712]" : "border-[#2F7A3A]"
              }`}
            />
            {usernameError !== "" && (
              <Text className="text-[16px] font-bold mt-2 ml-1 text-[#7A1712]">{usernameError}</Text>
            )}

            {/* Password */}
            <Text className="text-[20px] font-bold mb-2 ml-1 mt-6 text-[#173F27]">Password</Text>
            <TextInput
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setPasswordError("");
              }}
              secureTextEntry={!showPasswords}
              autoCapitalize="none"
              autoCorrect={false}
              className={`h-[56px] text-[18px] text-[#173F27] bg-white rounded-full px-5 border-2 ${
                passwordError ? "border-[#7A1712]" : "border-[#2F7A3A]"
              }`}
            />
            {passwordError !== "" && (
              <Text className="text-[16px] font-bold mt-2 ml-1 text-[#7A1712]">{passwordError}</Text>
            )}

            {/* Confirm password */}
            <Text className="text-[20px] font-bold mb-2 ml-1 mt-6 text-[#173F27]">Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                setConfirmError("");
              }}
              secureTextEntry={!showPasswords}
              autoCapitalize="none"
              autoCorrect={false}
              className={`h-[56px] text-[18px] text-[#173F27] bg-white rounded-full px-5 border-2 ${
                confirmError ? "border-[#7A1712]" : "border-[#2F7A3A]"
              }`}
            />
            {confirmError !== "" && (
              <Text className="text-[16px] font-bold mt-2 ml-1 text-[#7A1712]">{confirmError}</Text>
            )}

            {/* Show passwords  */}
            <Pressable
              onPress={() => setShowPasswords(!showPasswords)}
              className="flex-row items-center gap-3 mt-5 ml-1 self-start"
            >
              <View
                className={`w-6 h-6 rounded-md border-2 border-[#173F27] items-center justify-center ${
                  showPasswords ? "bg-[#2F7A3A]" : "bg-white"
                }`}
              >
                {showPasswords && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text className="text-[18px] font-semibold text-[#173F27]">Show passwords</Text>
            </Pressable>
          </View>

          {/* Button + sign in link */}
          <View className="items-center mt-8">
            <Pressable
              onPress={handleCreateAccount}
              className="w-full max-w-[280px] h-[60px] rounded-2xl items-center justify-center bg-[#2F7A3A]"
            >
              <Text className="text-[22px] text-white font-bold">Create Account</Text>
            </Pressable>

            <Text className="text-[18px] font-bold mt-4 text-[#173F27]">Already have an account?</Text>
            <Pressable onPress={() => router.replace("/sign-in")}>
              <Text className="text-[18px] font-bold underline text-[#173F27]">Sign in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}