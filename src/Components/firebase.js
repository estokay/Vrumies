import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
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

// ✅ Initialize Firebase app (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Analytics (optional, safe-guarded against SSR errors)
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  analytics = null;
}

// ✅ Core Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// ✅ Google provider
const provider = new GoogleAuthProvider();

// ✅ Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("✅ Signed in as:", user.displayName, user.email);
    return user;
  } catch (error) {
    console.error("❌ Google Sign-In Error:", error);
    throw error;
  }
};

// ✅ Sign out
export const logOut = async () => {
  await signOut(auth);
};

export { app, db, auth, storage };
