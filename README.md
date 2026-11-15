# ShopLearn: Empowering the Elderly for Online Shopping

**Team:** Team 6 — Five Forward
**Course:** CS 4352 — Human-Computer Interactions

## Project Overview

ShopLearn is a mobile shopping application designed to help older adults shop online more easily and independently. The app includes a simplified shopping interface, product categories, a shopping cart, a friendly mascot for assistance, and personalized settings.

Our goal is to make online shopping less confusing for older adults, especially those who struggle with small buttons, crowded screens, or unfamiliar features.

## Requirements

To run ShopLearn, users need:

- A computer running Windows or macOS.
- Node.js and npm installed.
- An internet connection for downloading dependencies.
- A smartphone with Expo Go installed.
- The smartphone and computer connected to the same Wi-Fi network to run the application through Expo Go.

The application is designed for an iPhone in portrait orientation.

## Installation Instructions

### Step 1: Clone the GitHub Repository

1. Open the GitHub repository: https://github.com/mariamsyed421/DP4-ShopLearn
2. Click the green **Code** button.
3. Copy the repository URL under **HTTPS**.
4. Open Visual Studio Code and select **Clone Git Repository** from the welcome screen.
5. Paste the copied URL and choose a folder to save the project.
6. Once cloning is complete, select **Open** to open the project in Visual Studio Code.

### Step 2: Install Dependencies

1. In Visual Studio Code, open **Terminal → New Terminal**.
2. Make sure the terminal is in the `DP4-ShopLearn` project folder.
3. Run this command:
   ```
   npm install
   ```
4. Wait for the required packages to finish installing.

### Step 3 (optional): Add an API Key for Voice Search

Voice search functionality uses ElevenLabs speech-to-text, so it needs a free API key.

1. Create an account on [elevenlabs.io](https://elevenlabs.io), go to **API Keys**, and create a key with **Speech to Text** access.
2. In the project folder, create a `.env` file and add:
   ```
   EXPO_PUBLIC_ELEVENLABS_API_KEY=your_key_here
   ```

Without a key, voice search will say "I didn't catch that," but you can still search by typing.

### Step 4: Start the Application

In the terminal, run:
```
npx expo start
```
The Expo development server will start and display a QR code.

### Step 5: Open ShopLearn in Expo Go

1. Install and open Expo Go on your smartphone.
2. Make sure your smartphone and computer are connected to the same Wi-Fi network.
3. Scan the QR code displayed in the terminal.
4. Wait for the application to load.

Once the app loads, the ShopLearn welcome screen will appear with options to **Create Account** or **Sign In**.

## Test Account Information

- **Username:** `demo`
- **Password:** `demo123`

These fields are already filled in by default on the Sign In screen for demo purposes, so just tap **Sign In**.

## How to Use ShopLearn

### Task 1: Ask the Mascot for Help

1. Open ShopLearn and select **Create Account**, or **Sign In** if you already have an account.
2. Enter a username, password, and confirm the password. Select **Create Account** to continue.
3. On the Account set up screen, customize your settings or select **Skip and use default settings**.
4. Once setup is complete, select **Back to Home** to open the homepage.
5. Tap the mascot that says **Tap for help** below it to open the Help screen.
6. Select a saved tip for guidance on shopping tasks, or tap the microphone to ask for help.
7. When "I'm listening. Tap when done" appears, ask your question and tap the microphone again when finished.

### Task 2: Search for and Purchase a New Item

1. **Create an Account:** On the ShopLearn welcome screen, select **Create Account**, enter a username and password, and tap **Create Account**.
2. **Complete Account Setup:** Choose **Skip and use default settings**. Then, select **Back to Home**.
3. **Search for a Product:** On the homepage, select **Search for something new**.
4. **Use the Search Feature:** Tap the microphone to speak or select **Type instead** to enter a product name.
5. **View Product Suggestions:** The mascot displays suggested products. Select Cheerios from the available options.
6. **View Product Details:** Review the Cheerios image and description, use **+** and **−** to choose quantity, then select **Add to cart**.
7. **Review Your Cart:** Check the product, quantity, and total price. Use **+** or **−** to adjust the quantity, then select **Checkout**.
8. **Review Payment Details:** Check the displayed payment information and delivery address, then select **Confirm**.
9. **Confirm Your Order:** The mascot shows your items and total and asks if it's correct. Select **Yes, place order** or **No, go back**.
10. **View Order Confirmation:** The app displays "Your order is on its way!" and shows the items, total, and delivery date. Select **Back to Home** to return to the homepage.

### Task 3: Create an Account and Personalize Settings

1. **Create an Account:** On the welcome screen, select **Create Account**, enter a username and password, confirm the password, and tap **Create Account**.
2. **Personalize Your Account:** On the Account set up screen, choose **Usual items**, **Preferences**, or **Tips** to customize your experience.
3. **Adjust Preferences:** Select **Preferences** to change the text size, enable or disable Spoken order read back, and choose a companion voice speed (Slow, Normal, or Fast). Tap **Save**.
4. **Set Up Tips:** Select **Tips** to open the Set up tips screen, where you can record audio tips, edit saved tips, or select **Not now**.
5. **Record an Audio Tip:** Select **Record audio**, tap the microphone to record, enter a tip name, and select **Save tip** or **Record again**.
6. **Manage Saved Tips:** Select **Edit my tips** to view saved tips for ordering usual items, adding items to the cart, checking out, and searching. Tap **Done** when finished.
7. **Complete Account Setup:** Return to Account set up and select **Done** to finish, or **Skip and use default settings** to keep the defaults.
8. **Open the Homepage:** Review the setup confirmation and select **Back to Home** to start using ShopLearn.

## Main Features

- **Product Categories:** Products are organized into Grocery, Household, Health, and Other categories, making it easier for users to find items.
- **Usual Items:** Users can select frequently purchased products during account setup and access them directly from the homepage.
- **Shopping Cart:** Users can add products to their cart, adjust quantities, review prices, and proceed to checkout.
- **Shopping Mascot:** A friendly mascot provides access to shopping tips and a microphone feature for asking questions.
- **Account Personalization:** Users can customize their usual items, preferences, and tips during account setup.
- **Saved Tips:** Users can access helpful instructions for common tasks, including searching for products, adding items to the cart, and checking out.
- **Order Confirmation:** Users can review their order and payment details before placing an order and receive a confirmation message afterward.

## Limitations

- This is designed only for iPhones in portrait mode (no landscape or web formatting).
- All data (account, cart, orders, tips) is saved only in AsyncStorage on the phone, not to any database.
- Products, prices, and payments are all mock data. No real orders exist.
- Voice search requires an ElevenLabs API key and internet connection, but you can still search by typing without it.

## Troubleshooting

- If the app is not loading, which can happen on school Wi-Fi, stop the server and run this instead:
  ```
  npx expo start --tunnel
  ```
- If the app is showing incorrect information, clear the cache:
  ```
  npx expo start -c
  ```