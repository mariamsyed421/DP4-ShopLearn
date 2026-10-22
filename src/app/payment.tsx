import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { defaultPayment, Payment } from "../data/payment";

const inputClass =
  "h-12 bg-[#F1F5FB] border-[1.5px] border-[#5B8FD9] rounded-2xl px-5 py-0 text-[18px]";

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const [payment, setPayment] = useState<Payment>(defaultPayment);

  // Load saved payment info 
  useEffect(() => {
    async function load() {
      const saved = await AsyncStorage.getItem("payment");
      if (saved) setPayment(JSON.parse(saved));
    }
    load();
  }, []);

  // Update one field, keep the rest the same
  function update(field: keyof Payment, value: string) {
    setPayment({ ...payment, [field]: value });
  }

  async function handleConfirm() {
    await AsyncStorage.setItem("payment", JSON.stringify(payment));
    router.push("/confirm");
  }

  return (
    <View className="flex-1 bg-white">
      {/* Blue header */}
      <View className="bg-[#99CBF7]" style={{ paddingTop: insets.top }}>
        <View className="h-20 items-center justify-center">
          <Pressable onPress={() => router.back()} className="absolute left-4" hitSlop={10}>
            <Ionicons name="arrow-back-circle-outline" size={48} color="black" />
          </Pressable>
          <Text className="text-[30px] font-bold">Payment details</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-6 pb-6"
        automaticallyAdjustKeyboardInsets
      >
        {/* Card holder */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-[20px] font-semibold">Card Holder Name</Text>
          <MaterialIcons name="edit" size={26} color="black" />
        </View>
        <TextInput
          value={payment.name}
          onChangeText={(text) => update("name", text)}
          className={inputClass}
          textAlignVertical="center"
        />

        {/* Card number */}
        <Text className="text-[20px] font-semibold mt-4 mb-2">Card Number</Text>
        <TextInput
          value={payment.cardNumber}
          onChangeText={(text) => update("cardNumber", text)}
          keyboardType="number-pad"
          className={inputClass}
          textAlignVertical="center"
        />

        {/* Exp date and CVV side by side */}
        <View className="flex-row gap-5 mt-6">
          <View className="flex-1">
            <Text className="text-[20px] font-semibold mb-2">Exp. Date</Text>
            <TextInput
              value={payment.expDate}
              onChangeText={(text) => update("expDate", text)}
              className={inputClass}
              textAlignVertical="center"
            />
          </View>
          <View className="flex-1">
            <Text className="text-[20px] font-semibold mb-2">CVV</Text>
            <TextInput
              value={payment.cvv}
              onChangeText={(text) => update("cvv", text)}
              keyboardType="number-pad"
              secureTextEntry
              className={inputClass}
              textAlignVertical="center"
            />
          </View>
        </View>

        {/* Delivery address */}
        <View className="flex-row items-center justify-between mt-16 mb-2">
          <Text className="text-[20px] font-semibold">Delivery Address</Text>
          <MaterialIcons name="edit" size={26} color="black" />
        </View>
        <TextInput
          value={payment.address}
          onChangeText={(text) => update("address", text)}
          className={inputClass}
          textAlignVertical="center"
        />
      </ScrollView>

      {/* Bottom row */}
      <View
        className="flex-row items-center justify-between px-5"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable onPress={() => router.push("/help")} className="items-center">
          <Image
            source={require("../../assets/images/mascot.png")}
            className="w-[80px] h-[95px]"
            resizeMode="contain"
          />
          <Text className="text-[18px] font-semibold">Tap for help</Text>
        </Pressable>

        <Pressable onPress={handleConfirm} className="bg-[#4CAA45] px-12 py-2 rounded-full">
          <Text className="text-white text-[24px] font-semibold">Confirm</Text>
        </Pressable>
      </View>
    </View>
  );
}