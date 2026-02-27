import React, { useEffect, useState } from "react";
import { auth, db } from "../../Components/firebase"; 
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const TokenSidePanel = () => {
  const [tokens, setTokens] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTokens = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Query the Users collection where "id" matches the UID of logged-in user
        const usersRef = collection(db, "Users");
        const q = query(usersRef, where("id", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setTokens(userData.tokens ?? 0);
        } else {
          console.warn("User not found in Users collection.");
        }
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }

      setLoading(false);
    };

    fetchUserTokens();
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

      <p>{loading ? "Loading..." : `${tokens} VBT`}</p>

      <span className="conversion-rate">1 VBT = $0.25</span>
    </div>
  );
};

export default TokenSidePanel;
