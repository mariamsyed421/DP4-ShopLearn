import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    // changed bg to green
    <SafeAreaView style={{ flex: 1, backgroundColor: "#8BC585" }}>
      <View className="flex-1 items-center justify-evenly px-6">
        {/* Title + mascot grouped so they stay close together */}
        <View className="items-center gap-4">
          <View className="items-center">
            <Text className="text-6xl font-bold text-[#173F27]">ShopLearn</Text>
            <Text className="text-3xl font-bold text-[#173F27] mt-2">
              Shopping made simpler
            </Text>
          </View>

          {/* mascot in bubble */}
          <Image
            source={require("../../assets/images/mascotinbubble.png")}
            style={{ width: 350, height: 320}}
            resizeMode="contain"
          />
        </View>

        {/* Buttons */}
        <View className="w-full max-w-[280px] gap-6">
          <Pressable
            className="bg-white h-[60px] rounded-2xl items-center justify-center"
            onPress={() => router.push("/create-account")}
          >
            <Text className="text-[#2F7A3A] text-[24px] font-bold">
              Create Account
            </Text>
          </Pressable>
          <Pressable
            className="bg-[#2F7A3A] h-[60px] rounded-2xl items-center justify-center"
            onPress={() => router.push("/sign-in")}
          >
            <Text className="text-white text-[24px] font-bold">
              Sign In
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}