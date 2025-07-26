import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtCkrmxQ0pu78XMkkKuHIIM9AsNMOx8vQ",
  authDomain: "vrumies-github.firebaseapp.com",
  projectId: "vrumies-github",
  storageBucket: "vrumies-github.appspot.com",
  messagingSenderId: "884036346105",
  appId: "1:884036346105:web:0fe8428593fa77f5494228",
  measurementId: "G-76VZ3HR687"
};

// Initialize Firebase app (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics (optional, wrapped to avoid SSR errors)
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // Analytics not supported or error occurred
  analytics = null;
}

// Initialize Firestore, Auth and Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
