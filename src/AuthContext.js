// src/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./Components/firebase"; // make sure firebase.js exports auth
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// 1. Create context
const AuthContext = createContext();

// 2. Hook to use context easily
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase listener: runs whenever user signs in or out
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // cleanup on unmount
  }, []);

  // Google Sign-In
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  // Sign out
  const logout = () => {
    return signOut(auth);
  };

  // Everything available to children
  const value = {
    currentUser,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
