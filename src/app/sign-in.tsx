import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
          <Text className="text-[32px] font-bold">Sign in</Text>
        </View>
      </View>

      <View className="flex-1 px-5">
        {/* Greeting row */}
        <View className="flex-row items-center justify-between mt-8 mb-12 pl-4 pr-2">
          <View className="flex-row items-center">
            <Text className="text-3xl font-semibold ml-3">Let’s log in</Text>
          </View>
          <Image
            source={require("../../assets/images/mascot.png")}
            className="w-[90px] h-[110px]"
            resizeMode="contain"
          />
        </View>

                {/* Username */}
        <Text className="text-xl font-semibold mb-2 ml-1">Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          textAlignVertical="center"
          className="h-12 bg-[#F1F5FB] border-[1.5px] border-[#5B8FD9] rounded-2xl px-4 py-0 text-[18px] mb-8"
        />

        {/* Password */}
        <Text className="text-xl font-semibold mb-2 ml-1">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textAlignVertical="center"
          className="h-12 bg-[#F1F5FB] border-[1.5px] border-[#5B8FD9] rounded-2xl px-4 py-0 text-[18px]"
        />
      </View>

      {/* Next button */}
      <View className="items-center px-6" style={{ paddingBottom: insets.bottom + 24 }}>
        <Pressable className="w-full max-w-[280px] bg-[#4CAA45] py-4 rounded-2xl items-center">
          <Text className="text-white text-xl font-semibold">Next</Text>
        </Pressable>
      </View>
    </View>
  );
}