## Video Diary App

A React Native + Expo **Video Diary** application.  
Users can:

- Import videos from their device,
- Crop an exact **5‑second segment**,
- Add a **name** and **description**,
- Save cropped videos to a persistent list and watch them later.

The app uses Expo Router, Zustand, and TanStack Query to stay simple, performant, and scalable.

---

## Features

- **Main Screen (Home)**

  - Displays a list of previously cropped videos
  - Videos are persisted with **Zustand + AsyncStorage**
  - Each card shows a small preview player and metadata (name, description, date)
  - Tapping the text area of a card navigates to the **Details Page**

- **Details Page**

  - Large video player (almost fullscreen, minimal UI)
  - Shows video **name** and **description**
  - Edit icon in the top‑right corner opens the Edit page

- **Crop Flow (3 Steps)**

  1. **Video Selection**
     - Select a video from the gallery with `expo-image-picker`
  2. **Video Cropping**
     - Preview the video with `expo-video`
     - Sliders to pick start and end times
     - Segment is constrained to **exactly 5 seconds**; “Next” is disabled until it’s 5s
  3. **Add Metadata**
     - Simple form with:
       - **Name** (required)
       - **Description** (optional)
     - “Crop Video” button triggers the cropping operation

- **Video Cropping**

  - Uses `expo-trim-video` for actual trimming
  - Cropping logic is wrapped in a **TanStack Query `useMutation`**:
    - Calls `trimVideo`
    - Copies the temporary file to a permanent directory via `expo-file-system`
    - Adds the new video entry to the Zustand store

- **Edit Page (Bonus)**
  - Lets the user edit **Name** and **Description** of a cropped video
  - Persists updates via `updateVideo` in the store (and AsyncStorage)

---

## Tech Stack

- **Core**

  - `expo` (SDK 54)
  - `expo-router` – file‑based navigation
  - `expo-video` – video playback
  - `expo-image-picker` – gallery integration
  - `expo-trim-video` – video trimming
  - `zustand` + `@react-native-async-storage/async-storage` – persistent state
  - `@tanstack/react-query` – async flow management (cropping)
  - `nativewind` – Tailwind‑style utility‑first styling

- **Additional**
  - `react-native-reanimated` – animation engine (available for enhancements)
  - `expo-sqlite` – optional structured storage (not required for core flow)
  - `zod` – available for schema‑based validation (currently using simple checks)

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Prebuild native projects (first run)

Because `expo-trim-video` includes native code, you must run the app in a **development build** (not Expo Go).

```bash
npx expo prebuild
```

This generates the `ios/` and `android/` directories.

### 3. Run the development build

- **iOS (simulator or device)**:

```bash
npm run ios
# or
npx expo run:ios
```

- **Android (emulator or device)**:

```bash
npm run android
# or
npx expo run:android
```

These commands build the native dev client and start Metro, so native modules like `expo-trim-video` work correctly.

---

## Usage Flow

### Home → Crop → Save

1. On **Home**, tap **“Add Video”**
   - The gallery opens and you select a video.
2. On the **Crop screen**
   - Preview the video and use the sliders to select a 5‑second segment.
   - When the segment is exactly 5 seconds, “Next” becomes enabled.
3. On the **Metadata screen**
   - Enter Name (required) and Description (optional).
   - When you tap **“Crop Video”**:
     - `trimVideo` runs,
     - The cropped file is copied to a persistent directory,
     - A new entry is stored in Zustand and you are navigated back to Home.

### Home → Detail → Edit

1. On Home, tap the text area of a video card
   - Opens the **Detail Page** with a large player and metadata.
2. Tap the square‑and‑pencil icon in the top‑right
   - Opens the **Edit Page** where you can adjust name and description.
3. Tap **Save**
   - The store entry is updated; both Home and Detail reflect the new values.

---

## Key Files / Structure

- `app/index.tsx` – Home screen, video list + fixed “Add Video” button
- `app/crop.tsx` – Crop step 2 (5‑second segment selection)
- `app/crop/metadata.tsx` – Crop step 3 (metadata form + cropping mutation)
- `app/video/detailPage.tsx` – Detail page (video + metadata + edit icon)
- `app/video/editPage.tsx` – Edit page (update Name / Description)
- `store/videoStore.ts` – Zustand store (videos array, add/update/delete/get)
- `lib/videoStorage.ts` – Helper functions to persist/delete video files
- `hooks/useVideoPlayback.ts` – Shared video playback hook (player + isPlaying)
- `components/video/VideoCard.tsx` – Video card component used on Home
- `components/video/VideoMetadataFields.tsx` – Reusable Name/Description fields
- `components/video/VideoNotFound.tsx` – Shared “video not found / deleted” screen

---

## Notes / Possible Extensions

- **Validation**: Currently the Name field is validated with a simple `if (!name.trim())`.  
  You can add `zod` schemas if you want more robust input validation.
- **SQLite Integration**: Videos are persisted via AsyncStorage today.  
  For larger datasets or complex queries, you can switch the backing store to `expo-sqlite`.
- **Animations**: List transitions, crop interactions, and buttons can be enhanced with `react-native-reanimated`.
