//import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
//import dotenv from "dotenv";
//import process from "node:process";

//dotenv.config({ path: ".env.local" });

export const sendRecording = async (uri:string) => {
  const formD = new FormData();
  formD.append("file", {
    uri: uri,
    name: "recording.m4a",
    type: "audio/m4a",
  } as any);
  formD.append("model_id", "scribe_v3");

  const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: {"xi-api-key": process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || ""},
    body: formD,
  });
  const data = await response.json();
  return data.text
  

}

