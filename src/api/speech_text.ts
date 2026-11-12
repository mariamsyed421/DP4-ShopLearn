//import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
//import dotenv from "dotenv";
//import process from "node:process";

//dotenv.config({ path: ".env.local" });

export const sendRecording = async (uri:string) => {
  const fileRes = await fetch(uri);
  const audioBlob = await fileRes.blob();
  const formD = new FormData();
  formD.append("file", audioBlob, "recording.m4a");
  formD.append("model_id", "scribe_v3");
  const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: {"xi-api-key": process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || ""},
    body: formD,
  });
  const data = await response.json();
  console.log(data);
  return data.text
  

}

