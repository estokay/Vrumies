import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../../Components/firebase"; 
import { doc, onSnapshot } from "firebase/firestore";

const TokenSidePanel = () => {
  const [tokens, setTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [displayTokens, setDisplayTokens] = useState(0);
  const prevTokensRef = useRef(0);

  const animateTokens = (start, end) => {
    const duration = 500; // animation duration in ms
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(start + (end - start) * progress);
      setDisplayTokens(currentValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, "Users", currentUser.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const newTokens = docSnap.data().tokens ?? 0;
        setTokens(newTokens);

        // Initialize prevTokensRef.current on first load
        const startTokens = prevTokensRef.current === 0 ? newTokens : prevTokensRef.current;

        animateTokens(startTokens, newTokens);
        prevTokensRef.current = newTokens;
      } else {
        console.warn("User document not found");
        setTokens(0);
        setDisplayTokens(0);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tokens:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="token-side-panel">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

        .token-side-panel {
          background-color: #000;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 300px;
          min-width: 250px;
          flex-shrink: 0;
          border-right: 1px solid #1a202c;
          box-sizing: border-box;
          text-align: center;
          color: #fff;
        }

        .token-side-panel .logo-icon {
          width: 160px;
          height: 160px;
          margin-bottom: 1.5rem;
        }

        .token-side-panel .logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .token-side-panel h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .token-side-panel p {
          font-family: 'Poppins', sans-serif;
          font-size: 1.2rem;
          color: #00FF00;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }

        .token-side-panel .token-amount {
          font-size: 2rem; /* much bigger */
          font-weight: bold;
          color: #00FF00;
          margin-bottom: 2rem;
        }

        .token-side-panel .conversion-rate {
          font-size: 0.9rem;
          color: #888;
          margin-bottom: 2rem;
        }
      `}</style>

      <div className="logo-icon">
        <img 
          src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1756806527/Tokens-Icon_bhee9s.png" 
          alt="Tokens Icon" 
        />
      </div>

      <h2>Vrumies Bump Tokens</h2>
      <p>You have:</p>

      <p className="token-amount">{loading ? "Loading..." : `${displayTokens} VBT`}</p>

      <span className="conversion-rate">1 VBT = $0.25</span>
    </div>
  );
};

export default TokenSidePanel;
