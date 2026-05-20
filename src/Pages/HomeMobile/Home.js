import React, { useEffect, useState } from "react";
import "./Home.css";

import HomeHeader from "./HomeHeader";
import HomeSidebar from "./HomeSidebar";
import AuthOverlay from "../../Portal/AuthOverlay";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Components/firebase";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="home-page">
      <AuthOverlay isSignedIn={isSignedIn} />
      <HomeHeader />
      <div className="home-content">
        <HomeSidebar />
      </div>
    </div>
  );
}