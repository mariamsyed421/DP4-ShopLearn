import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loadTips, saveTips } from "../data/tips";

export default function RecordTipScreen() {
  const params = useLocalSearchParams<{ type: string; id: string }>();
  const tipId = params.id;
  const isVideo = params.type === "video";

  const [textSize, setTextSize] = useState("medium");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const savedPrefs = await AsyncStorage.getItem("preferences");
    if (savedPrefs) {
      const data = JSON.parse(savedPrefs);
      setTextSize(data.textSize || "medium");
    }

    if (tipId) {
      const tips = await loadTips();
      const tip = tips.find((t) => t.id === tipId);
      if (tip) {
        setName(tip.name);
        setStatus("done");
      }
    }
  }

  function handleMicPress() {
    if (status === "recording") {
      setStatus("done");
    } else {
      setStatus("recording");
    }
    setError("");
  }

  function handleRecordAgain() {
    setStatus("recording");
    setError("");
  }

  async function handleSave() {
    if (name.trim() === "") {
      setError("Please give your tip a name.");
      return;
    }

    if (status !== "done") {
      setError("Please record your tip first.");
      return;
    }

    const tips = await loadTips();

    if (tipId) {
      const updated = tips.map((t) => (t.id === tipId ? { ...t, name: name.trim() } : t));
      await saveTips(updated);
    } else {
      tips.push({
        id: Date.now().toString(),
        name: name.trim(),
        type: isVideo ? "video" : "audio",
      });
      await saveTips(tips);
    }

    if (tipId) {
      router.back();
    } else {
      router.replace("/edit-tips");
    }
  }

  async function handleDelete() {
    const tips = await loadTips();
    await saveTips(tips.filter((t) => t.id !== tipId));
    router.back();
  }

  const titleSize = textSize === "small" ? 25 : textSize === "large" ? 32 : 28;
  const labelSize = textSize === "small" ? 18 : textSize === "large" ? 24 : 20;
  const normalSize = textSize === "small" ? 16 : textSize === "large" ? 21 : 18;
  const nameSize = textSize === "small" ? 22 : textSize === "large" ? 30 : 26;

  let message = isVideo ? "Tap to start filming" : "Tap to start recording";
  if (status === "recording") message = "Recording... tap when done";
  if (status === "done") message = "Recorded!";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "#A9C7F2",
            paddingHorizontal: 18,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 48,
              height: 48,
              borderRadius: 30,
              borderWidth: 2,
              borderColor: "black",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 30 }}>←</Text>
          </Pressable>

          <Text style={{ fontSize: titleSize, fontWeight: "bold", marginLeft: 10 }}>
            {isVideo ? "Record Video" : "Record Audio"}
          </Text>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            paddingHorizontal: 25,
            paddingTop: 35,
            paddingBottom: 25,
          }}
        >
          <Pressable onPress={handleMicPress} style={{ alignItems: "center" }}>
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "#F2F2F2",
                borderWidth: 2,
                borderColor: "#BABABA",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 6px 4px 0px rgba(95, 95, 95, 0.3)",
              }}
            >
              {isVideo ? (
                <MaterialCommunityIcons
                  name="video"
                  size={64}
                  color={status === "recording" ? "#C0392B" : "#7A7A7A"}
                />
              ) : (
                <Image
                  source={
                    status === "recording"
                      ? require("../../assets/images/mic-active.png")
                      : require("../../assets/images/mic-inactive.png")
                  }
                  style={{ width: 64, height: 64 }}
                  resizeMode="contain"
                />
              )}
            </View>

            <Text style={{ fontSize: normalSize, fontWeight: "600", marginTop: 14 }}>
              {message}
            </Text>
          </Pressable>

          <View style={{ alignItems: "center", marginVertical: 30 }}>
            <Text style={{ fontSize: nameSize, fontWeight: "bold" }}>Tip name:</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Type a name"
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: nameSize - 2,
                marginTop: 12,
                paddingVertical: 8,
                borderBottomWidth: 2,
                borderBottomColor: "#C9D6EE",
              }}
            />
          </View>

          <View>
            {error !== "" && (
              <Text
                style={{
                  color: "#C0392B",
                  fontSize: normalSize + 1,
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                {error}
              </Text>
            )}

            <Pressable
              onPress={handleSave}
              style={{
                backgroundColor: "#6AAA50",
                paddingVertical: 15,
                borderRadius: 15,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#fff", fontSize: labelSize, fontWeight: "bold" }}>
                Save tip
              </Text>
            </Pressable>

            <Pressable
              onPress={handleRecordAgain}
              style={{
                borderWidth: 2,
                borderColor: "#6AAA50",
                paddingVertical: 13,
                borderRadius: 15,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#5C9F4B", fontSize: labelSize, fontWeight: "bold" }}>
                Record again
              </Text>
            </Pressable>

            {tipId && (
              <Pressable onPress={handleDelete} style={{ alignSelf: "center", marginTop: 16, padding: 8 }}>
                <Text style={{ color: "#C0392B", fontSize: normalSize, fontWeight: "bold" }}>
                  Delete this tip
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
