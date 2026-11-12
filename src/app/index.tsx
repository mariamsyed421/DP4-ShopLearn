import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View className="flex-1 items-center justify-evenly px-6">
        <View className="items-center">
          <Text className="text-[44px] font-bold pb-2">ShopLearn</Text>
          <Text className="text-[28px] font-semibold text-center mt-1">
            Shopping made{"\n"}simpler
          </Text>
        </View>

        <Image
          source={require("../../assets/images/mascot.png")}
          style={{ width: 200, height: 230 }}
          resizeMode="contain"
        />

        <View className="w-full max-w-[280px] gap-6">
          <Pressable
            className="bg-[#4CAA45] py-4 rounded-2xl items-center"
            onPress={() => router.push("/create-account")}
          >
            <Text className="text-white text-xl font-semibold">
              Create Account
            </Text>
          </Pressable>

          <Pressable
            className="bg-[#4CAA45] py-4 rounded-2xl items-center"
            onPress={() => router.push("/sign-in")}
          >
            <Text className="text-white text-xl font-semibold">Sign In</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
