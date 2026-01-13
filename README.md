# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
---

## Appendix: GPX file support 🔧

**What this covers:** how to activate the GPX loader, where to put GPX files, required dependencies, and commands to run the app.

### Where the code lives
- The bearing helper is in `app/comp/GPXfunction.ts` (used to compute bearings).
- GPX upload / parsing UI lives in:
  - `app/admin_page/gpx.tsx` (Load GPX File button and map view)
  - `app/admin_page/newfileloader.tsx` (picker + backend upload)

### Quick setup & commands ✅
1. Install project dependencies:

   ```bash
   npm install
   ```

2. (Optional) Ensure native deps are installed (recommended via Expo):

   ```bash
   npx expo install expo-document-picker fast-xml-parser react-native-maps
   ```

3. Start the dev server:

   ```bash
   npx expo start
   ```

4. Run on Android (Windows):

   ```bash
   npm run android
   ```

5. Run on iOS (macOS only):

   ```bash
   npm run ios
   ```

### How to load a GPX file in the app
- Open the app and navigate to the **Admin / GPX** screen.
- Tap **Load GPX File** and select a `.gpx` file from your device.
- The app parses the file (`fast-xml-parser`) and displays the track (Polyline) and waypoints on the map.
- `GPXfunction.ts` is used by the UI to compute bearings to the next waypoint.

### Pushing a GPX to an Android emulator/device
- Push a file to the device (requires Android platform-tools / adb):

   ```bash
   adb push path/to/your-file.gpx /sdcard/Download/
   ```

- Then pick it from the Document Picker in the app.

### Backend / upload notes ⚠️
- `app/admin_page/newfileloader.tsx` defines a `BASE_URL` constant — set this to your backend (or a ngrok URL).
- The admin screens POST GPX files to the backend (look for `/gpx-upload` or `/upload-gpx` in the code). Ensure your backend accepts `multipart/form-data` and returns valid JSON when required.

### Helpful tips 💡
- A sample GPX file is included at `assets/balaton.gpx` for quick testing.
- If parsing fails, check the GPX file for validity and confirm `fast-xml-parser` can parse it.

---