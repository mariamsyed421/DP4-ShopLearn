from zipfile import ZIP_DEFLATED, ZipFile
import xml.etree.ElementTree as ET

OUTPUT = "ShopLearn_Beginner_Guide.docx"
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
ET.register_namespace("w", W)

# Entries are (Word paragraph style, text). The source code itself is not modified.
CONTENT = [
("Title", "ShopLearn: Beginner's Code Guide"),
("Subtitle", "A detailed tour of the project folders, screens, data, functions, and app flow"),
("Normal", "Prepared from the source code in this workspace. ShopLearn is an Expo app built with React Native and TypeScript. It presents a simple shopping experience designed around readable screens, a mascot companion, saved preferences, and a sample checkout."),
("Heading1", "1. Start with the Big Picture"),
("Normal", "When the app starts, Expo Router reads files under src/app and turns them into screens. Buttons move the user between screens. Product records live separately under src/data. AsyncStorage saves selected values on the device so they remain after the app is closed."),
("Heading2", "Beginner vocabulary"),
("Bullet", "Screen or route: a page in the app. In Expo Router, its file path determines its URL-like route."),
("Bullet", "Component: a piece of user interface. Every screen here is a React function component, such as HomeScreen."),
("Bullet", "Function: named instructions that perform a task, such as loadSettings or handleCheckout. A screen component returns the screen's UI."),
("Bullet", "State: values a screen remembers while open. useState stores these values; changing state makes React draw the screen again."),
("Bullet", "Effect: work done after a screen appears or regains focus, often loading saved data. useEffect and Expo Router's useFocusEffect are used here."),
("Bullet", "Async: an operation that can take time, such as reading storage. async/await lets the code wait without freezing the interface."),
("Bullet", "TypeScript type: a description of an object's fields, such as Product or Payment. It helps catch mistakes during development."),
("Bullet", "Route parameter: a value included in a route. The product detail route receives an id, for example /product/cheerios."),
("Bullet", "JSX: HTML-like syntax used inside React components. React Native uses View, Text, Image, and Pressable instead of browser divs."),
("Heading2", "There are no traditional classes"),
("Normal", "These TypeScript files do not declare object-oriented classes with the class keyword. Their building blocks are function components, helper functions, types, constants, and arrays. When this guide names a component, it names the function that builds a screen."),
("Heading1", "2. Folder and File Map"),
("Bullet", "src/app/: screens and route definitions. Files like home.tsx become routes like /home. The nested product/[id].tsx route accepts a variable product id."),
("Bullet", "src/app/_layout.tsx: shared root navigation layout. It creates the Expo Router Stack and imports the global stylesheet."),
("Bullet", "src/data/: reusable data and storage helpers. products.ts contains product records; payment.ts contains payment types and defaults; tips.ts contains tips and tip-storage functions."),
("Bullet", "assets/images/: images used by screens, including the mascot, product pictures, microphone states, speech bubble, and delivery illustration. assets/images/items/ has additional product pictures."),
("Bullet", "assets/expo.icon/: source material for the iOS app icon."),
("Bullet", "package.json and package-lock.json: dependency list and install/run scripts, plus exact versions locked for npm."),
("Bullet", "app.json: Expo app identity, icons, orientation, plugins, and platform-specific settings."),
("Bullet", "global.css and tailwind.config.js: NativeWind/Tailwind styling setup. Screens use className strings for many visual styles."),
("Bullet", "babel.config.js and metro.config.js: build-tool configuration for Expo and NativeWind."),
("Bullet", "tsconfig.json, expo-env.d.ts, and nativewind-env.d.ts: TypeScript settings and type declarations used by developer tools."),
("Bullet", "README.md: standard Expo starter instructions, not yet a full ShopLearn-specific guide. LICENSE contains the repository license."),
("Heading1", "3. How the Main Flows Connect"),
("Heading2", "Account creation and setup"),
("Normal", "Welcome (/) offers Create Account or Sign In. Create Account stores a username and password locally, then opens Account Setup. Account Setup links to usual items, preferences, and tips, then Setup Complete sends the user to Home. Sign In also allows a built-in demo login."),
("Heading2", "Shopping and checkout"),
("Normal", "Home can open Search, a usual item's product page, or Account Settings. Search displays three cereal choices. A product page adds its product id to the saved cart. Cart groups repeated ids into quantities and totals the prices. Payment saves entered details. Confirm summarizes the order and, when accepted, clears the cart and opens Order Placed."),
("Heading2", "Help and saved tips"),
("Normal", "Home, product, cart, and payment screens can open Help with a from parameter. Help puts a context-relevant tip first, lets the user expand written tip text, and simulates a microphone response by opening that suggested tip."),
("Heading1", "4. Local Storage at a Glance"),
("Normal", "AsyncStorage is device-local key/value storage. Values are strings, so objects and arrays are converted to JSON with JSON.stringify before saving and reconstructed with JSON.parse after loading. This is demo persistence, not a cloud database."),
("Bullet", "account: one locally stored username/password object."),
("Bullet", "preferences: textSize, spokenReadback, and voiceSpeed settings."),
("Bullet", "usualItems: array of product ids selected to show on Home."),
("Bullet", "cart: array of product ids. Repeated ids represent multiple copies of a product."),
("Bullet", "payment: saved Payment object, including card details and delivery address. It uses example data and must not be used for real payment information."),
("Bullet", "customTips: array of saved tip entries. If absent, loadTips supplies the default tips."),
("Heading1", "5. Screen-by-Screen Source Tour"),
("Heading2", "src/app/_layout.tsx - Root navigation"),
("Normal", "RootLayout is the shared wrapper for every route. It returns an Expo Router Stack and hides built-in headers because each screen draws its own. Importing ../../global.css activates Tailwind/NativeWind styles. It has no helper functions."),
("Heading2", "src/app/index.tsx - Welcome route /"),
("Normal", "WelcomeScreen builds the opening page with the ShopLearn name, mascot, and two buttons. Create Account pushes /create-account; Sign In pushes /sign-in. It has no named helper functions or saved state."),
("Heading2", "src/app/create-account.tsx - /create-account"),
("Normal", "CreateAccountScreen keeps username, password, confirmation, password-visibility toggles, and an error message in React state. handleNext validates a nonblank username, a password of at least four characters, and matching passwords. It saves the account JSON in AsyncStorage and opens /account-setup. Show/Hide button callbacks toggle whether each password field is obscured. This is local demo account handling, not secure authentication."),
("Heading2", "src/app/sign-in.tsx - /sign-in"),
("Normal", "SignInScreen stores the typed username/password, error message, and text-size preference. loadTextSize reads preferences when the screen mounts. handleSignIn first accepts demo / demo123; otherwise, it compares entered values with the locally saved account. A match opens /home; a mismatch displays an error. Passwords are stored as ordinary local text in this demo."),
("Heading2", "src/app/account-setup.tsx - /account-setup"),
("Normal", "AccountSetupScreen is the settings hub. loadSettings runs whenever the screen becomes active and reads the text size. Buttons navigate to /usual-items, /preferences, and /tips. Done and Skip both open /setup-complete; Skip does not reset or erase saved values."),
("Heading2", "src/app/usual-items.tsx - /usual-items"),
("Normal", "UsualItemsScreen defines four categories: grocery, household, health, and other. loadTextSize reads the display preference. Selecting a category opens /pick-items with the category id in route parameters. Done returns to the previous screen."),
("Heading2", "src/app/pick-items.tsx - /pick-items"),
("Normal", "PickItemsScreen reads the category route parameter and filters products to that category. loadSettings reads preferences and saved usualItems ids. toggleItem adds an id if it is not selected or removes it if selected, updates React state, and immediately saves the array. The list shows a checkmark for selected products. Done returns to the category list."),
("Heading2", "src/app/preferences.tsx - /preferences"),
("Normal", "PreferencesScreen lets the user choose small, medium, or large text; turn spoken order readback on or off; and choose slow, normal, or fast voice speed. getSavedSettings loads those values and falls back to defaults for missing fields. saveSettings writes the combined preferences object and returns to the previous screen. These settings are stored, but actual speech playback is not implemented."),
("Heading2", "src/app/setup-complete.tsx - /setup-complete"),
("Normal", "SetupCompleteScreen shows which setup areas have stored values. loadSettings reads preferences, usual items, and custom tips; it updates the text size and completion indicators. goHome clears the navigation stack and replaces the route with /home, so Back does not return through setup."),
("Heading2", "src/app/home.tsx - /home"),
("Normal", "HomeScreen is the main shopping hub. loadSettings runs when Home regains focus and reads preferences and usualItems; if no usualItems value exists, all products appear by default. usualProducts filters the catalog by selected ids. Product tiles open /product/{id}; other buttons open Search, Account Settings, or contextual Help. No other named helpers are declared."),
("Heading2", "src/app/search.tsx - /search"),
("Normal", "SearchScreen presents a microphone-style interaction, a text input mode, and three cereal choices. Status is a TypeScript union with idle, listening, and results values. loadTextSize reads preferences. handleMicPress advances idle to listening and listening to results; it does not capture speech. handleTypedSearch ignores a blank query and otherwise shows results. matches filters cereal names using a case-insensitive substring check; if there is no match, shownChoices falls back to all choices. Selecting one opens its product page. Width and height calculations size the speech-bubble image for the device."),
("Heading2", "src/app/product/[id].tsx - /product/{id}"),
("Normal", "ProductScreen gets id from the route and finds the matching entry in products. If there is no match, it displays Product not found. loadTextSize reads preferences. handleAddToCart reads the cart array, appends the current product id, saves it, and opens /cart. The screen shows the title, image, details, and servings. Help opens /help with from=product."),
("Heading2", "src/app/cart.tsx - /cart"),
("Normal", "CartScreen loads preferences and cart ids when mounted. loadTextSize reads display preferences; the nested loadCart function reads the cart array. items counts occurrences of each product id so duplicates become a quantity. total adds each product price multiplied by quantity. addOne appends an id and saves; removeOne removes one matching occurrence and saves. handleCheckout opens /payment. An empty cart displays a message rather than checkout controls."),
("Heading2", "src/app/payment.tsx - /payment"),
("Normal", "PaymentScreen holds a Payment object, initially defaultPayment. loadTextSize reads preferences; the nested load function replaces defaults with previously saved payment details. update accepts a Payment field name and new text, then copies the existing object with only that field changed. handleConfirm saves the full object and opens /confirm. These are sample UI fields: there is no payment validation or processor."),
("Heading2", "src/app/confirm.tsx - /confirm"),
("Normal", "ConfirmScreen loads preferences and, in a nested load function, the cart and payment details. It calculates quantities and total like CartScreen, and derives the last four card digits for display. handlePlaceOrder stops if there are no items; otherwise it removes the cart from storage and replaces the route with /order-placed?id={firstProductId}. The confirmation message summarizes the first item and any additional items. No actual order is submitted."),
("Heading2", "src/app/order-placed.tsx - /order-placed"),
("Normal", "OrderPlacedScreen reads the product id from the route and looks up the product. loadTextSize reads preferences. The Back to Home button dismisses screens until Home is reached. This is a demo confirmation; it does not track delivery."),
("Heading2", "src/app/tips.tsx - /tips"),
("Normal", "TipsScreen is the tip-settings menu. loadTextSize reads preferences. Buttons open /record-tip with type=audio or type=video, open /edit-tips, or return without changes. Recording is simulated rather than captured."),
("Heading2", "src/app/edit-tips.tsx - /edit-tips"),
("Normal", "EditTipsScreen displays saved or default tips. loadSettings reads text-size preference and calls loadTips from src/data/tips.ts. Tapping a tip opens /record-tip with its id and type so it can be renamed or deleted. Done dismisses back to Account Setup."),
("Heading2", "src/app/record-tip.tsx - /record-tip"),
("Normal", "RecordTipScreen reads type and optional id route parameters. isVideo selects video-style UI; an id means editing an existing tip. loadSettings reads preferences and, when editing, loads the matching tip name and marks it done. handleMicPress toggles between recording and done states; it does not access a microphone or camera. handleRecordAgain returns to recording state. handleSave requires a nonblank name and done state; it renames a tip or appends a new one, saves with saveTips, and navigates back. handleDelete removes the current tip and returns. This stores labels and types, not media files."),
("Heading2", "src/app/help.tsx - /help"),
("Normal", "HelpScreen receives a from parameter and chooses a suggested tip id: home suggests reorder; product suggests addcart; cart and payment suggest checkout. loadSettings reads preferences and calls loadTips, then moves the suggested tip first. handleMicPress simulates listening; when tapped a second time it opens the suggested tip and marks the prompt answered. toggleTip opens or closes the tip's written instructions. No speech is recorded or played."),
("Heading1", "6. Shared Data Files"),
("Heading2", "src/data/products.ts"),
("Normal", "Product is a TypeScript type describing id, name, cartName, title, description, servings, numeric price, category, and image. The products array contains the catalog records used throughout the app. A numeric price allows multiplication and totals. require(...) references local images so the bundler can include them. Editing this file changes products in shopping lists and detail pages."),
("Heading2", "src/data/payment.ts"),
("Normal", "Payment describes name, cardNumber, expDate, cvv, and address fields. defaultPayment provides example values used to fill the form the first time. They are placeholders for a prototype and should not be used as real payment data."),
("Heading2", "src/data/tips.ts"),
("Normal", "Tip is the shape for built-in tips: id, label, and written steps. SavedTip is the shape for saved/editable tips: id, name, type, and optional steps. allTips defines four built-in written instructions."),
("Normal", "loadTips reads customTips from AsyncStorage. If that key exists, it parses and returns the saved array; otherwise it converts allTips into SavedTip objects with type=audio and returns them as defaults. saveTips converts its array to JSON and saves it under customTips. These helpers keep storage details out of the Help and tips screens."),
("Heading1", "7. Project Setup and Styling Files"),
("Bullet", "package.json names the app dp4-shoplearn and uses expo-router/entry as its starting point. npm start runs Expo; npm run web starts the web version; npm run android and npm run ios target mobile development. React Native supplies UI primitives, Expo supplies platform features, Expo Router handles navigation, AsyncStorage handles local persistence, and NativeWind enables Tailwind-like className styles."),
("Bullet", "app.json sets app name/slug/version, portrait orientation, icons, web static output, Expo plugins, typed route support, and a React Compiler experiment."),
("Bullet", "babel.config.js configures Expo's Babel preset and NativeWind JSX support."),
("Bullet", "metro.config.js starts with Expo Metro defaults and wraps them with NativeWind using global.css."),
("Bullet", "global.css includes Tailwind base, component, and utility layers. tailwind.config.js scans src files and enables the NativeWind preset."),
("Bullet", "tsconfig.json extends Expo settings, enables strict TypeScript checking, and defines @/* aliases into src/."),
("Bullet", "expo-env.d.ts and nativewind-env.d.ts provide generated/type integration declarations; they are not app screens."),
("Bullet", "README.md is mostly the standard Expo getting-started README."),
("Heading1", "8. React Native Patterns Used Repeatedly"),
("Bullet", "useState(value) creates screen state. Example: const [textSize, setTextSize] = useState('medium'); setTextSize updates it."),
("Bullet", "useEffect(() => { ... }, []) runs setup work after the component first appears. Many screens use it to load saved preferences."),
("Bullet", "useFocusEffect is useful when a screen should refresh every time it becomes visible again, as Home does after changing usual items."),
("Bullet", "router.push('/route') opens a screen; router.back() returns; router.replace() swaps the current route; dismissAll/dismissTo clear or simplify navigation history."),
("Bullet", "Pressable's onPress runs a function after a tap. Short arrow functions such as () => setTyping(true) are inline handlers."),
("Bullet", "map() creates repeated UI from arrays; filter() keeps matching records; reduce() combines values into a total; find() looks up one record."),
("Bullet", "JSON.stringify turns an object/array into a storage-compatible string; JSON.parse turns that string back into data."),
("Bullet", "Text-size checks choose small, medium, or large fonts. Safe-area insets add space around phone notches and system bars."),
("Heading1", "9. Important Prototype Limitations"),
("Bullet", "Accounts and payment details are local demo data. There is no backend, real account security, or payment integration."),
("Bullet", "Microphone, camera, voice readback, and delivery/order screens are visual prototypes. They do not capture recordings, synthesize speech, or submit a real order."),
("Bullet", "Search is limited to three hard-coded cereal choices; there is no speech-to-text or full-catalog search."),
("Bullet", "Cart and preferences are stored on the current device, not synced between devices or users."),
("Bullet", "Some AsyncStorage reads call JSON.parse without handling invalid data. Production code should validate data and handle storage errors."),
("Heading1", "10. A Beginner's Safe Way to Explore"),
("Bullet", "Start with src/data/products.ts and follow a product id such as cheerios into src/app/product/[id].tsx."),
("Bullet", "Follow one button at a time: find its onPress handler, note any router.push call, and open the destination route file."),
("Bullet", "For saved values, search for AsyncStorage.getItem and AsyncStorage.setItem. The string key tells you which feature owns the value."),
("Bullet", "Change one small thing, run the app with npm run web or npx expo start, then check the screen that uses the changed code."),
("Bullet", "Use npm install after cloning. Use npm run web to start the web app. Use Ctrl+C in the terminal to stop the development server."),
("Normal", "A useful mental model: route files decide what screen to show, components describe what it looks like, helper functions handle user actions and data loading, shared data files define reusable records, and AsyncStorage remembers selected values on the device."),
]


def tag(name):
    return "{%s}%s" % (W, name)


def make_paragraph(style, text):
    p = ET.Element(tag("p"))
    ppr = ET.SubElement(p, tag("pPr"))
    if style in ("Title", "Subtitle", "Heading1", "Heading2"):
        ET.SubElement(ppr, tag("pStyle"), {tag("val"): style})
    if style == "Bullet":
        ET.SubElement(ppr, tag("ind"), {tag("left"): "360", tag("hanging"): "180"})
        text = "- " + text
    run = ET.SubElement(p, tag("r"))
    if style in ("Title", "Heading1", "Heading2"):
        ET.SubElement(ET.SubElement(run, tag("rPr")), tag("b"))
    node = ET.SubElement(run, tag("t"))
    node.text = text
    node.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    return p


def make_document():
    root = ET.Element(tag("document"))
    body = ET.SubElement(root, tag("body"))
    for style, text in CONTENT:
        body.append(make_paragraph(style, text))
    sect = ET.SubElement(body, tag("sectPr"))
    ET.SubElement(sect, tag("pgSz"), {tag("w"): "12240", tag("h"): "15840"})
    ET.SubElement(sect, tag("pgMar"), {tag("top"): "1080", tag("right"): "1080", tag("bottom"): "1080", tag("left"): "1080", tag("header"): "540", tag("footer"): "540", tag("gutter"): "0"})
    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


STYLES = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:rPr><w:sz w:val="36"/><w:color w:val="245A44"/></w:rPr><w:pPr><w:spacing w:after="200"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:rPr><w:sz w:val="24"/><w:color w:val="4472C4"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:rPr><w:b/><w:sz w:val="30"/><w:color w:val="245A44"/></w:rPr><w:pPr><w:keepNext/><w:spacing w:before="300" w:after="140"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="4472C4"/></w:rPr><w:pPr><w:keepNext/><w:spacing w:before="220" w:after="100"/></w:pPr></w:style>
</w:styles>'''


def main():
    content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>'''
    rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'''
    document_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'''
    with ZipFile(OUTPUT, "w", ZIP_DEFLATED) as docx:
        docx.writestr("[Content_Types].xml", content_types)
        docx.writestr("_rels/.rels", rels)
        docx.writestr("word/document.xml", make_document())
        docx.writestr("word/styles.xml", STYLES)
        docx.writestr("word/_rels/document.xml.rels", document_rels)
    print("Created %s with %d paragraphs." % (OUTPUT, len(CONTENT)))


if __name__ == "__main__":
    main()
