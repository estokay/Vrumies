// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAtCkrmxQ0pu78XMkkKuHIIM9AsNMOx8vQ",
  authDomain: "vrumies-github.firebaseapp.com",
  projectId: "vrumies-github",
  storageBucket: "vrumies-github.appspot.com",
  messagingSenderId: "884036346105",
  appId: "1:884036346105:web:0fe8428593fa77f5494228",
  measurementId: "G-76VZ3HR687"
};

// Initialize Firebase app instance
const app = initializeApp(firebaseConfig);

// Initialize optional Analytics
const analytics = getAnalytics(app);

// Initialize Firestore database instance
const db = getFirestore(app);

// Export the Firestore instance for use in other modules
export { db };
