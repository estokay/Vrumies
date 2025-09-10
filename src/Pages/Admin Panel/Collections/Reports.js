// Reports.js
import React, { useEffect, useState } from "react";
import { db } from "../../../Components/firebase";
import { collection, getDocs } from "firebase/firestore";

// Fetch all Posts and filter to only include posts with 1+ reports
async function getAllCollectionsManually() {
  const collectionNames = ["Posts"];
  const data = {};

  for (const name of collectionNames) {
    const colRef = collection(db, name);
    const snapshot = await getDocs(colRef); // fetch all posts, no type filter

    // Filter posts with at least one userId in 'report'
    const filteredPosts = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(post => Array.isArray(post.report) && post.report.length > 0);

    data[name] = filteredPosts;
  }

  return data;
}

function Reports() {
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllCollectionsManually();
        setAllData(data);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Loading Firestore data...</p>;

  return (
    <div style={{ padding: 20, color: "white", background: "#222" }}>
      <h1>Reported Posts</h1>
      <pre
        style={{
          background: "#111",
          padding: 10,
          borderRadius: 5,
          maxHeight: "80vh",
          overflowY: "scroll",
        }}
      >
        {JSON.stringify(allData, null, 2)}
      </pre>
    </div>
  );
}

export default Reports;
