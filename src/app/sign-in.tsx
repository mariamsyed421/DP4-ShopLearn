import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  // demo
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  // One error message per field ("" means no error)
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleSignIn() {
    // Empty fields
    const noUser = username.trim() === "";
    const noPass = password === "";
    setUsernameError(noUser ? "Please enter your username." : "");
    setPasswordError(noPass ? "Please enter your password." : "");
    if (noUser || noPass) return;

    // Demo account 
    if (username.trim() === "demo" && password === "demo123") {
      router.push("/home");
      return;
    }

    // Account saved from Create Account
    const saved = await AsyncStorage.getItem("account");
    if (saved) {
      const account = JSON.parse(saved);
      if (account.username === username.trim() && account.password === password) {
        router.push("/home");
        return;
      }
    }

    // Wrong password
    setPasswordError(
      "That username or password isn't right. Please try again. (demo: demo / demo123)"
    );
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
        <View
          className="items-center justify-center"
          style={{ paddingTop: insets.top + 16, height: insets.top + 16 + 44 }}
        >
          <Pressable
            onPress={() => router.back()}
            className="absolute left-6 flex-row items-center h-[44px] px-3 rounded-full gap-1 bg-[#DCEFD8]"
            style={{ top: insets.top + 16 }}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={20} color="#173F27" />
            <Text className="text-[18px] font-bold text-[#173F27]">Back</Text>
          </Pressable>
          <Text className="text-[32px] font-bold text-[#173F27]">Sign in</Text>
        </View>

        {/* Greeting + mascot */}
        <View className="flex-row items-end mt-12 px-6" style={{ zIndex: 0 }}>
          <View className="flex-1 items-center mb-24">
            <Text className="text-[26px] font-extrabold text-center text-[#173F27]">
              Welcome{"\n"}back!
            </Text>
          </View>
          <Image
            source={require("../../assets/images/mascot.png")}
            style={{ width: 160, height: 200 }}
            resizeMode="contain"
          />
        </View>

        {/* Green card */}
        <View
          className="flex-1 rounded-t-[32px] px-6 pt-10 bg-[#8BC585] justify-evenly"
          style={{
            marginTop: -48,
            zIndex: 1,
            elevation: 1,
            paddingBottom: insets.bottom + 40,
          }}
        >
          {/* form */}
          <View>
            {/* Username */}
            <Text className="text-[20px] font-bold mb-3 ml-1 text-[#173F27]">Username</Text>
            <TextInput
              value={username}
              onChangeText={(t) => {
                setUsername(t);
                setUsernameError(""); // clear the error
              }}
              autoCapitalize="none"
              autoCorrect={false}
              className={`h-[56px] text-[18px] text-[#173F27] bg-white rounded-full px-5 border-2 ${
                usernameError ? "border-[#7A1712]" : "border-[#2F7A3A]"
              }`}
            />
            {usernameError !== "" && (
              <Text className="text-[16px] font-bold mt-2 ml-1 text-[#7A1712]">
                {usernameError}
              </Text>
            )}

            {/* Password */}
            <Text className="text-[20px] font-bold mb-3 ml-1 mt-8 text-[#173F27]">Password</Text>
            <TextInput
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setPasswordError("");
              }}
              secureTextEntry={!showPassword} // hidden unless box is checked
              autoCapitalize="none"
              autoCorrect={false}
              className={`h-[56px] text-[18px] text-[#173F27] bg-white rounded-full px-5 border-2 ${
                passwordError ? "border-[#7A1712]" : "border-[#2F7A3A]"
              }`}
            />
            {passwordError !== "" && (
              <Text className="text-[16px] font-bold mt-2 ml-1 text-[#7A1712]">
                {passwordError}
              </Text>
            )}

            {/* Show password  */}
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="flex-row items-center gap-3 mt-5 ml-1 self-start"
              hitSlop={8}
            >
              <View
                className={`w-6 h-6 rounded-md border-2 border-[#173F27] items-center justify-center ${
                  showPassword ? "bg-[#2F7A3A]" : "bg-white"
                }`}
              >
                {showPassword && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text className="text-[18px] font-semibold text-[#173F27]">Show password</Text>
            </Pressable>
          </View>

          {/* Bottom buttons*/}
          <View className="items-center mt-10">
            <Pressable
              onPress={handleSignIn}
              className="w-full max-w-[280px] h-[60px] rounded-2xl items-center justify-center bg-[#2F7A3A]"
            >
              <Text className="text-[20px] text-white font-bold">Sign In</Text>
            </Pressable>

            <View className="flex-row items-center mt-4">
              <Text className="text-[18px] font-bold text-[#173F27]">Don't have an account? </Text>
              <Pressable onPress={() => router.push("/create-account")} hitSlop={8}>
                <Text className="text-[18px] font-bold underline text-[#173F27]">Create one</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}