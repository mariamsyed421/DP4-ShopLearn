//import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
//import dotenv from "dotenv";
//import process from "node:process";

//dotenv.config({ path: ".env.local" });

/*export async function sendRecording(recording:string) {
  const client = new ElevenLabsClient({
    apiKey: process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY,
  });
  const rec = await fetch(recording);
  const audBlob = new Blob([await rec.arrayBuffer()],  {type: "audio/m4a"});
  const response = await client.speechToText.convert({   
        file: audBlob,
        modelId: "scribe_v2" 
  });
  console.log(response);
  return response.text;
}*/

