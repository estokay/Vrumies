import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../Components/firebase"; // adjust path if needed

const TokenHistory = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    const currentUserId = user.uid;

    const historyRef = collection(
      db,
      "Users",
      currentUserId,
      "TokenPurchaseHistory"
    );

    const q = query(historyRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          tokens: data.vbt || 0,
          amount: `$${data.price || 0}`,
          date: data.createdAt
            ? data.createdAt.toDate().toLocaleDateString()
            : "No date",
        };
      });

      setPurchaseHistory(history);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="token-history-panel">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

        .token-history-panel {
          background-color: #000;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 300px;
          min-width: 250px;
          flex-shrink: 0;
          border-left: 1px solid #1a202c; 
          box-sizing: border-box;
          color: #fff;
          overflow-y: auto; 
        }

        .token-history-panel h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
          font-weight: bold;
        }

        .history-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 1rem 0;
          border-bottom: 1px solid #333; 
        }

        .history-item:last-child {
          border-bottom: none; 
        }

        .item-icon {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          margin-right: 1rem;
        }

        .item-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .item-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .item-details p {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          font-size: 0.95rem;
        }

        .item-date {
          color: #888;
          font-size: 0.8rem;
        }

        .item-values {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          font-family: 'Poppins', sans-serif;
        }

        .item-tokens {
          color: #00FF00;
          font-weight: bold;
          font-size: 0.95rem;
        }

        .item-amount {
          font-size: 0.8rem;
        }
      `}</style>

      <h2>Token Purchase History</h2>

      {loading && <p>Loading...</p>}

      {!loading && purchaseHistory.length === 0 && (
        <p>No purchases yet.</p>
      )}

      {purchaseHistory.map((item, index) => (
        <div key={item.id} className="history-item">
          <div className="item-icon">
            <img
              src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1756806527/Tokens-Icon_bhee9s.png"
              alt="Tokens Icon"
            />
          </div>

          <div className="item-details">
            <p>Purchase #{purchaseHistory.length - index}</p>
            <p className="item-date">{item.date}</p>
          </div>

          <div className="item-values">
            <span className="item-tokens">{item.tokens} VBT</span>
            <span className="item-amount">{item.amount}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokenHistory;