import React, { useEffect, useState } from "react";
import { db } from "../../../Components/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

async function getAllCollectionsManually() {
  const collectionNames = ["Posts"];
  const data = {};

  for (const name of collectionNames) {
    const colRef = collection(db, name);
    const q = query(colRef, where("type", "==", "directory"));
    const snapshot = await getDocs(q);
    data[name] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
  return data;
}

function Directory() {
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
      <h1>Firestore Database Contents</h1>
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

export default Directory;
