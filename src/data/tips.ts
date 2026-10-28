import AsyncStorage from "@react-native-async-storage/async-storage";

export type Tip = {
  id: string;
  label: string;
  steps: string;
};

export type SavedTip = {
  id: string;
  name: string;
  type: string;
  steps?: string;
};

export const allTips: Tip[] = [
  {
    id: "checkout",
    label: "Checking out",
    steps:
      "1. In your cart, tap Checkout.\n2. Check your card and address, then tap Confirm.\n3. Listen to your order, then tap Yes, place order.",
  },
  {
    id: "search",
    label: "Searching for an item",
    steps:
      "1. On the Home screen, tap Search for something new.\n2. Tap the microphone and say what you want, or tap Or type instead.\n3. Tap the picture of the item you want.",
  },
];

export async function loadTips(): Promise<SavedTip[]> {
  const saved = await AsyncStorage.getItem("customTips");
  if (saved) {
    return JSON.parse(saved);
  }

  return allTips.map((tip) => ({
    id: tip.id,
    name: tip.label,
    type: "audio",
    steps: tip.steps,
  }));
}

export async function saveTips(tips: SavedTip[]) {
  await AsyncStorage.setItem("customTips", JSON.stringify(tips));
}
