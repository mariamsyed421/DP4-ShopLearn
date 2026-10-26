import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountSetupScreen() {
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

          <Text className="text-3xl font-bold ml-3">Account set up</Text>
        </View>

        <View className="flex-1 px-6 pt-8">
          <View className="items-center">
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-center">
                Set up what you{"\n"}like, or skip and use{"\n"}the default
                settings
              </Text>

              <Image
                source={require("../../assets/images/mascot.png")}
                className="w-[105px] h-[105px] ml-2"
                resizeMode="contain"
              />
            </View>
          </View>

          <View className="mt-12 gap-4">
            <Pressable className="bg-[#B9D3F7] py-5 rounded-2xl items-center">
              <Text className="text-2xl font-bold text-gray-700">
                Usual items
              </Text>
            </Pressable>

            <Pressable className="bg-[#B9D3F7] py-5 rounded-2xl items-center">
              <Text className="text-2xl font-bold text-gray-700">
                Preferences
              </Text>
            </Pressable>

            <Pressable className="bg-[#B9D3F7] py-5 rounded-2xl items-center">
              <Text className="text-2xl font-bold text-gray-700">Tips</Text>
            </Pressable>
          </View>

          <View className="flex-1 justify-end pb-8 gap-3">
            <Pressable className="bg-[#6AAA50] py-4 rounded-2xl items-center">
              <Text className="text-white text-xl font-bold">Done</Text>
            </Pressable>

            <Pressable className="border-2 border-[#6AAA50] py-3 rounded-2xl items-center">
              <Text className="text-[#5C9F4B] text-lg font-bold text-center">
                Skip and use default{"\n"}settings
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
