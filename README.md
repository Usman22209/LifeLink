This is the **LifeLink** project — a modern cross-platform blood donation mobile app built with [**React Native**](https://reactnative.dev), powered by a [**NestJS**](https://nestjs.com) & [**Supabase**](https://supabase.com) backend.
It connects **donors** and **patients** through location-based matching, real-time tracking, push notifications, and 1-on-1 chat.

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

---

## Step 1: Start Metro

LifeLink uses **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

---

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (only required on first setup or after native dependency changes).

```sh
bundle install
bundle exec pod install
```

Then run the app:

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see the **LifeLink** app running in the Android Emulator, iOS Simulator, or your connected device.

---

## Step 3: Configure Environment Variables

Create a `.env` file in your project root and configure your **API Base URL** and **Supabase credentials**:

```env
API_BASE_URL=http://localhost:3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
```

---

# 💡 Features

* 🤝 **Donor & Patient Connection**: Direct connection between blood requesters and potential donors.
* 🩸 **Blood Request Management**: Create, filter, search, track, and fulfill blood requests.
* 🗺 **Location-Based Matching**: Distance calculation and proximity filtering for nearby donors.
* 💬 **1-on-1 In-App Chat**: Direct communication between donors and requesters.
* 🔔 **Instant Push Alerts**: Urgent request notifications via OneSignal.
* 🌐 **Bilingual Interface**: Full Urdu + English support with active RTL dynamic layout.
* 📊 **Donation History & Stats**: Personal donation log, eligibility tracker, and lives saved counter.

---

# 🧩 Tech Stack

| Layer                 | Technology                        |
| --------------------- | --------------------------------- |
| **Frontend (Mobile)** | React Native (0.82)               |
| **Backend**           | NestJS + Supabase (PostgreSQL)    |
| **State Management**  | Redux Toolkit + TanStack Query    |
| **Push Notifications**| OneSignal                         |
| **Maps & Location**   | react-native-maps & Geolocation   |
| **Language**          | TypeScript                        |

---

## 👨‍💻 Contributors

| Name                | Role                                   |
| ------------------- | -------------------------------------- |
| **Usman Shafiq**    | Team Lead & React Native Developer     |
| **Abubakar Khalid** | Backend Developer (Node.js & Supabase) |
| **Hadia Akram**     | UI/UX Designer & Documentation Lead    |

---

# 📄 License

This project is developed as part of the **Final Year Design Project (FYDP)** at
**FCIT, University of the Punjab, Lahore — 2025**.

