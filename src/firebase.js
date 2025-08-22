import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';

// Firebase configuration
// Note: You'll need to replace these with your actual Firebase config values
// For development/testing, set DEV_MODE to true to skip Firebase
const DEV_MODE = true; // Set to false when you have Firebase configured

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Development mode mock user
const mockUser = {
  uid: 'dev-user-123',
  displayName: 'Development User',
  email: 'dev@example.com',
  photoURL: 'https://via.placeholder.com/40x40/007AFF/ffffff?text=DU'
};

// Initialize Firebase
let app, auth, db, googleProvider;

if (DEV_MODE) {
  // Development mode - no Firebase initialization needed
  console.log('Running in development mode - Firebase disabled');
} else {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
}

export { auth, db, googleProvider };

// Authentication functions
export const signInWithGoogle = async () => {
  if (DEV_MODE) {
    // Development mode - return mock user immediately
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUser), 500); // Simulate network delay
    });
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  if (DEV_MODE) {
    // Development mode - just log out locally
    return Promise.resolve();
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Firestore data functions
export const saveUserData = async (userId, data) => {
  if (DEV_MODE) {
    // Development mode - use localStorage
    localStorage.setItem(`userData_${userId}`, JSON.stringify(data));
    return Promise.resolve();
  }
  
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, data, { merge: true });
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

export const getUserData = async (userId) => {
  if (DEV_MODE) {
    // Development mode - use localStorage
    const data = localStorage.getItem(`userData_${userId}`);
    return Promise.resolve(data ? JSON.parse(data) : null);
  }
  
  try {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

export const saveTasks = async (userId, tasks, activeTaskId) => {
  if (DEV_MODE) {
    // Development mode - use localStorage
    localStorage.setItem(`tasks_${userId}`, JSON.stringify({ tasks, activeTaskId }));
    return Promise.resolve();
  }
  
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      tasks,
      activeTaskId,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw error;
  }
};

export const saveSettings = async (userId, settings) => {
  if (DEV_MODE) {
    // Development mode - use localStorage
    localStorage.setItem(`settings_${userId}`, JSON.stringify(settings));
    return Promise.resolve();
  }
  
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      settings,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const saveStats = async (userId, stats) => {
  if (DEV_MODE) {
    // Development mode - use localStorage
    localStorage.setItem(`stats_${userId}`, JSON.stringify(stats));
    return Promise.resolve();
  }
  
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      stats,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving stats:', error);
    throw error;
  }
};

export const saveDailyStats = async (userId, dailyStats) => {
  if (DEV_MODE) {
    // Development mode - use localStorage
    localStorage.setItem(`dailyStats_${userId}`, JSON.stringify(dailyStats));
    return Promise.resolve();
  }
  
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      dailyStats,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving daily stats:', error);
    throw error;
  }
};

export const getDailyStats = async (userId) => {
  if (DEV_MODE) {
    // Development mode - use localStorage
    const data = localStorage.getItem(`dailyStats_${userId}`);
    return Promise.resolve(data ? JSON.parse(data) : {});
  }
  
  try {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.dailyStats || {};
    }
    return {};
  } catch (error) {
    console.error('Error getting daily stats:', error);
    return {};
  }
};

// Listen for auth state changes
export const onAuthStateChange = (callback) => {
  if (DEV_MODE) {
    // Development mode - simulate auth state
    const isLoggedIn = localStorage.getItem('dev_logged_in') === 'true';
    setTimeout(() => {
      callback(isLoggedIn ? mockUser : null);
    }, 100);
    
    // Return a dummy unsubscribe function
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};