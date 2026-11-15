# ShopLearn

ShopLearn is a shopping app built for older adults who feel unsure about buying things online. It uses big buttons, plain words, and a friendly helper that can listen to you and talk back, so nobody has to figure things out alone.

This is our DP4 prototype for CS 4352 (Human-Computer Interaction), made by Team 06, "Five Forward."

**Demo video:** <! YOUTUBE !>

## What you can do in the app

We built the app around three tasks:

1. **Simple task: buy a usual item again.** Tap one of your usual items on Home and add it to your cart.
2. **Moderate task: find something new.** Search by voice or by typing, look at the item, and add it to your cart.
3. **Complex task: set up your account.** Sign up, add your card and address, and pick your preferences, like text size and voice speed.

Other things you will find along the way:

- **Check out with a spoken summary.** The app reads your order out loud, including the total, before you place it. You can turn this off or change the speed in Preferences.
- **Help page.** Say something like "help with checkout" and the app finds the right tip and plays it. If there is no recorded tip, it still tells you the answer.
- **Record your own tips.** A family member can record a tip, save it, and play it back later from the Help page.
- **Past orders.** Look at old orders, cancel one, or reorder it with one tap.

## How to run it

You need Node.js and the Expo Go app on your iPhone. We tested on iPhone in portrait mode.

1. Download or clone this project and open the folder in a terminal.
2. Install everything:

   ```bash
   npm install --legacy-peer-deps
   ```

   On Windows PowerShell, use `npm.cmd` instead of `npm`.

3. The voice search needs an ElevenLabs key. Make a file named `.env` in the main folder and put this on one line, with no quotes or spaces:

   ```
   EXPO_PUBLIC_ELEVENLABS_API_KEY=your_key_here
   ```

   The app still runs without a key. Only speaking to search or ask for help will not work, and typing still does.

4. Start the app:

   ```bash
   npx expo start --clear
   ```

   On Windows PowerShell, use `npx.cmd`.

5. Scan the QR code with your iPhone camera to open it in Expo Go.

If you change the `.env` file, stop the app and start it again with `--clear`.

## What it is built with

- Expo and React Native with Expo Router
- TypeScript and NativeWind (Tailwind styling)
- AsyncStorage to remember your cart, orders, and settings
- expo-audio to record and play audio
- ElevenLabs speech-to-text so you can talk to the app
- expo-speech so the app can read things out loud

All the products are made up and stored in the app, so nothing real is ever bought.

## Who did what

- **Ayesha and Aamena:** redesigned the account setup pages (the complex task)
- **Mariam:** redesigned the simple and moderate task pages
- **Divya:** speech-to-text and text-to-speech
- **Zaid and Ammarah:** merged everyone's code, fixed conflicts, and added the Help page, reorder, and read-aloud order summary

## Team

Team 06, Five Forward. CS 4352, The University of Texas at Dallas.
