# Firebase Setup Instructions

## 🚧 Development Mode (Quick Start)

**Good news!** Your app is currently running in **Development Mode** so you can test it immediately without setting up Firebase!

### What Development Mode Does:
- ✅ **No Firebase setup required** - works immediately
- ✅ **Mock Google authentication** - simulates real login
- ✅ **Local data storage** - uses localStorage for persistence
- ✅ **Full app functionality** - all features work as expected
- ✅ **Apple-style UI** - complete with login/logout flow

### To Use Development Mode:
1. Just refresh your browser and click "Continue with Google"
2. You'll be logged in as a development user
3. All your tasks and settings will be saved locally
4. Perfect for testing and development!

---

## 🔥 Production Mode (Firebase Setup)

When you're ready for real Google authentication and cross-device sync, follow these steps:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `pomodoro-tracker` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication** in the sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click on **Google** provider
5. Toggle **Enable**
6. Add your project's domain to authorized domains (localhost is already there)
7. Click **Save**

### 3. Enable Firestore Database

1. In your Firebase project, go to **Firestore Database** in the sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location close to your users
5. Click **Done**

### 4. Get Your Firebase Configuration

1. In your Firebase project, click the **Settings** gear icon
2. Click **Project settings**
3. Scroll down to **Your apps** section
4. Click **Add app** and select **Web** (</> icon)
5. Register your app with name like "Pomodoro Tracker"
6. Copy the Firebase configuration object

### 5. Update Your Project

Replace the placeholder configuration in `src/firebase.js`:

1. **Set DEV_MODE to false:**
```javascript
const DEV_MODE = false; // Changed from true to false
```

2. **Replace the Firebase config:**
```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 6. Security Rules (Optional but Recommended)

For production, update Firestore security rules to only allow authenticated users to access their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎉 You're All Set!

Once you've completed these steps:

1. Start your development server: `npm run dev`
2. You'll see the login screen
3. Click "Continue with Google" to authenticate
4. Your tasks and settings will now sync across devices!

## 📱 Cross-Device Sync

Your Pomodoro tracker now supports:
- ✅ Google Authentication
- ✅ Cloud storage of tasks, settings, and statistics
- ✅ Real-time sync across devices
- ✅ Offline fallback to localStorage
- ✅ Secure user data isolation

## 🔒 Privacy & Security

- Only basic profile information (name, email, avatar) is accessed
- Your task data is stored securely in Firestore
- Each user can only access their own data
- All data is encrypted in transit and at rest