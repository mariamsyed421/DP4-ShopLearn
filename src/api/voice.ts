// This file makes the mascot talk out loud.
// It uses expo-speech, which is the phone's own voice, so we do not need a key.
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";

// How fast each choice talks. 1 is the normal speed.
// We kept slow and fast close to normal so nothing sounds too slow or too rushed.
const speeds: Record<string, number> = {
  slow: 0.75,
  normal: 1.0,
  fast: 1.25,
};

// These voices sound the most natural on iPhones, so we try them first
const nicestVoices = ["Ava", "Samantha", "Allison", "Nicky", "Zoe", "Evan"];

// We only search for the nicest voice one time, then remember it
let chosenVoice: string | undefined = undefined;

// Looks through the voices on the phone and picks the nicest English one.
// "Enhanced" voices sound much less like a robot. If the phone does not have one, we use the normal voice.
async function findNicestVoice() {
  if (chosenVoice !== undefined) return chosenVoice;
  chosenVoice = "";

  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const english = voices.filter((voice) => voice.language === "en-US");

    // 1. an enhanced voice from our list
    for (const name of nicestVoices) {
      const found = english.find(
        (voice) => voice.name.includes(name) && voice.quality === Speech.VoiceQuality.Enhanced
      );
      if (found) {
        chosenVoice = found.identifier;
        return chosenVoice;
      }
    }

    // 2. any other enhanced voice
    const enhanced = english.find((voice) => voice.quality === Speech.VoiceQuality.Enhanced);
    if (enhanced) {
      chosenVoice = enhanced.identifier;
      return chosenVoice;
    }

    // 3. a voice from our list, even if it is not enhanced
    for (const name of nicestVoices) {
      const found = english.find((voice) => voice.name.includes(name));
      if (found) {
        chosenVoice = found.identifier;
        return chosenVoice;
      }
    }
  } catch (e) {
    // if the phone will not tell us its voices, we just use the normal one
  }
  return chosenVoice;
}

// Looks up the speed the person picked in Preferences (slow, normal or fast)
async function getSpeed() {
  const saved = await AsyncStorage.getItem("preferences");
  if (saved) {
    const data = JSON.parse(saved);
    if (data.voiceSpeed && speeds[data.voiceSpeed]) {
      return speeds[data.voiceSpeed];
    }
  }
  return speeds.normal;
}

// Checks the "Spoken order read back" switch in Preferences.
// It is on unless the person turned it off.
export async function readbackIsOn() {
  const saved = await AsyncStorage.getItem("preferences");
  if (saved) {
    const data = JSON.parse(saved);
    return data.spokenReadback !== false;
  }
  return true;
}

// Every time we start talking, we count up. That way, if someone taps a button
// or leaves the page, the old sentences stop and do not keep going.
let talkNumber = 0;

// How long to wait between sentences, in milliseconds (1000 = one second)
const pauseBetweenSentences = 700;

// Reads out loud. Give it one sentence, or a list of sentences.
// With a list, it says one sentence, takes a short breath, then says the next one.
export async function speak(sentences: string | string[]) {
  const list = Array.isArray(sentences) ? sentences : [sentences];
  const rate = await getSpeed();
  const voice = await findNicestVoice();

  talkNumber = talkNumber + 1;
  const myNumber = talkNumber;
  Speech.stop();

  // says sentence number "i", then waits a moment and says the next one
  function sayOne(i: number) {
    // stop if we reached the end, or if someone else started talking
    if (i >= list.length || myNumber !== talkNumber) return;

    Speech.speak(list[i], {
      language: "en-US",
      voice: voice !== "" ? voice : undefined,
      rate: rate,
      pitch: 1.0,
      onDone: () => {
        setTimeout(() => sayOne(i + 1), pauseBetweenSentences);
      },
    });
  }

  sayOne(0);
}

// Stops talking (we use this when someone leaves the page)
export function stopSpeaking() {
  talkNumber = talkNumber + 1;
  Speech.stop();
}

// Turns 13.06 into "13 dollars and 6 cents" so it sounds natural out loud
export function moneyToWords(amount: number) {
  const totalCents = Math.round(amount * 100);
  const dollars = Math.floor(totalCents / 100);
  const cents = totalCents % 100;

  const dollarWord = dollars === 1 ? "dollar" : "dollars";
  const centWord = cents === 1 ? "cent" : "cents";

  if (cents === 0) return `${dollars} ${dollarWord}`;
  if (dollars === 0) return `${cents} ${centWord}`;
  return `${dollars} ${dollarWord} and ${cents} ${centWord}`;
}
