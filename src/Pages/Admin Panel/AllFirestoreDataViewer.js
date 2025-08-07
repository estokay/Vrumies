import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import { collection, getDocs } from "firebase/firestore";

async function getAllCollectionsManually() {
  const collectionNames = ["forumPosts", "videoPosts", "blogPosts", "requestPosts"];
  const data = {};

  for (const name of collectionNames) {
    const colRef = collection(db, name);
    const snapshot = await getDocs(colRef);
    data[name] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
  return data;
}

function AllFirestoreDataViewer() {
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

export default AllFirestoreDataViewer;
