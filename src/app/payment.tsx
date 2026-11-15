import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { defaultPayment, Payment } from "../data/payment";

// light green when locked
function inputClass(editing: boolean) {
  return editing
    ? "h-[56px] bg-white border-2 border-[#97CB91] rounded-full px-5 text-[18px] text-[#173F27]"
    : "h-[56px] bg-[#EEF3ED] border-2 border-[#EEF3ED] rounded-full px-5 text-[18px] text-[#173F27]";
}

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const [payment, setPayment] = useState<Payment>(defaultPayment);
  const [editingCard, setEditingCard] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

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
      {/* Header */}
      <View className="flex-row items-center px-6 gap-4 mb-10" style={{ paddingTop: insets.top + 16 }}>
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center h-[44px] px-3 rounded-full gap-1 bg-[#DCEFD8]"
        >
          <Ionicons name="chevron-back" size={20} color="#173F27" />
          <Text className="text-[18px] font-bold text-[#173F27]">Back</Text>
        </Pressable>
        <Text className="text-[28px] font-bold text-[#173F27]">Payment details</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-8 pb-6"
        automaticallyAdjustKeyboardInsets
      >
        {/* Card holder */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-[20px] font-bold text-[#173F27]">Card Holder Name</Text>
          <Pressable
            onPress={() => setEditingCard(!editingCard)}
            className="flex-row items-center h-[40px] px-4 rounded-full gap-1 bg-[#DCEFD8]"
          >
            <MaterialIcons name={editingCard ? "check" : "edit"} size={20} color="#173F27" />
            <Text className="text-[16px] font-bold text-[#173F27]">{editingCard ? "Done" : "Edit"}</Text>
          </Pressable>
        </View>
        <TextInput
          value={payment.name}
          onChangeText={(text) => update("name", text)}
          editable={editingCard}
          className={inputClass(editingCard)}
        />

        {/* Card number */}
        <Text className="text-[20px] font-bold text-[#173F27] mt-5 mb-2">Card Number</Text>
        <TextInput
          value={payment.cardNumber}
          onChangeText={(text) => update("cardNumber", text)}
          keyboardType="number-pad"
          editable={editingCard}
          className={inputClass(editingCard)}
        />

        {/* Exp date and CVV */}
        <View className="flex-row gap-5 mt-5">
          <View className="flex-1">
            <Text className="text-[20px] font-bold text-[#173F27] mb-2">Exp. Date</Text>
            <TextInput
              value={payment.expDate}
              onChangeText={(text) => update("expDate", text)}
              editable={editingCard}
              className={inputClass(editingCard)}
            />
          </View>
          <View className="flex-1">
            <Text className="text-[20px] font-bold text-[#173F27] mb-2">CVV</Text>
            <TextInput
              value={payment.cvv}
              onChangeText={(text) => update("cvv", text)}
              keyboardType="number-pad"
              secureTextEntry
              editable={editingCard}
              className={inputClass(editingCard)}
            />
          </View>
        </View>

        {/* Delivery address */}
        <View className="flex-row items-center justify-between mt-12 mb-2">
          <Text className="text-[20px] font-bold text-[#173F27]">Delivery Address</Text>
          <Pressable
            onPress={() => setEditingAddress(!editingAddress)}
            className="flex-row items-center h-[40px] px-4 rounded-full gap-1 bg-[#DCEFD8]"
          >
            <MaterialIcons name={editingAddress ? "check" : "edit"} size={20} color="#173F27" />
            <Text className="text-[16px] font-bold text-[#173F27]">{editingAddress ? "Done" : "Edit"}</Text>
          </Pressable>
        </View>
        <TextInput
          value={payment.address}
          onChangeText={(text) => update("address", text)}
          editable={editingAddress}
          className={inputClass(editingAddress)}
        />
      </ScrollView>

      {/* Bottom row */}
      <View
        className="flex-row items-center justify-between px-6"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable onPress={() => router.push({ pathname: "/help", params: { from: "payment" } })} className="items-center">
          <Image
            source={require("../../assets/images/mascot.png")}
            style={{ width: 80, height: 95 }}
            resizeMode="contain"
          />
          <Text className="text-[18px] font-bold text-[#173F27]">Tap for help</Text>
        </Pressable>

        <Pressable onPress={handleConfirm} className="h-[60px] px-12 rounded-2xl items-center justify-center bg-[#2F7A3A]">
          <Text className="text-[22px] font-bold text-white">Confirm</Text>
        </Pressable>
      </View>
    </View>
  );
}