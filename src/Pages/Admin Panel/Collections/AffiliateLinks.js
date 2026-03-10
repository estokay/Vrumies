import React, { useEffect, useState } from "react";
import { db } from "../../../Components/firebase";
import { collection, getDocs } from "firebase/firestore";

function AffiliateLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAffiliateLinks() {
      try {
        const colRef = collection(db, "AffiliateLinks"); // updated collection
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLinks(data);
      } catch (err) {
        console.error("Error fetching affiliate links:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAffiliateLinks();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Loading Affiliate Links...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: 20, color: "white", background: "#222" }}>
      <h1>Affiliate Links</h1>
      <pre
        style={{
          background: "#111",
          padding: 10,
          borderRadius: 5,
          maxHeight: "80vh",
          overflowY: "scroll",
        }}
      >
        {JSON.stringify(links, null, 2)}
      </pre>
    </div>
  );
}

export default AffiliateLinks;