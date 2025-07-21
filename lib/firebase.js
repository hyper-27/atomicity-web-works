// lib/firebase.js

// Import the functions we need from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Removed signInWithCustomToken and signInAnonymously from here for cleaner logic
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// --- YOUR FIREBASE CONFIGURATION HERE ---
// (Your hardcoded firebaseConfig should be here)
const firebaseConfig = {
  apiKey: "AIzaSyBoIgR3S75Wg46i8-MfFxjUrzDkN6He12U",
  authDomain: "atomicity-web-works-admin.firebaseapp.com",
  projectId: "atomicity-web-works-admin",
  storageBucket: "atomicity-web-works-admin.firebasestorage.app",
  messagingSenderId: "177745871895",
  appId: "1:177745871895:web:b1409e40f1cbfc3bc50852"
};
// --- END OF YOUR FIREBASE CONFIGURATION ---


// IMPORTANT: Use the appId from the Canvas environment if available,
// otherwise use the one from your firebaseConfig.
const canvasAppId = typeof __app_id !== 'undefined' ? __app_id : firebaseConfig.appId;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Services
const db = getFirestore(app);
const auth = getAuth(app);

// Optional: Listen for auth state changes for general debugging (can be removed later)
// This listener is now the primary way we track authentication status globally.
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Firebase auth state changed: User is logged in.', user.uid, user.email);
  } else {
    console.log('Firebase auth state changed: User is logged out.');
  }
});


// Export Services
export { db, auth, canvasAppId as appId };