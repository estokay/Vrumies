import React, { useState } from "react";
import { db } from "../../Components/firebase";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";

const collectionsToDelete = [
  { key: "videoPosts", label: "Delete VideoCollection" },
  { key: "blogPosts", label: "Delete BlogCollection" },
  { key: "forumPosts", label: "Delete ForumCollection" },
  { key: "requestPosts", label: "Delete RequestCollection" },
];

export default function DeleteCollections() {
  const [loading, setLoading] = useState(null); // holds key of collection deleting or null
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function deleteCollection(collectionName) {
    setLoading(collectionName);
    setError(null);
    setSuccess(null);

    try {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);

      if (snapshot.empty) {
        setSuccess(`${collectionName} is already empty!`);
        setLoading(null);
        return;
      }

      const batch = writeBatch(db);
      snapshot.docs.forEach((docSnap) => {
        batch.delete(doc(db, collectionName, docSnap.id));
      });

      await batch.commit();
      setSuccess(`Deleted all documents in ${collectionName}`);
    } catch (err) {
      console.error(err);
      setError(`Failed to delete ${collectionName}: ${err.message}`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ padding: 20, backgroundColor: "#222", color: "white" }}>
      <h2>Delete Firestore Collections</h2>
      {collectionsToDelete.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => deleteCollection(key)}
          disabled={loading === key}
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px 20px",
            margin: "10px",
            border: "none",
            cursor: "pointer",
            opacity: loading === key ? 0.6 : 1,
          }}
        >
          {loading === key ? `Deleting ${label}...` : label}
        </button>
      ))}
      {error && (
        <p style={{ color: "orange", marginTop: 20 }}>
          <strong>Error:</strong> {error}
        </p>
      )}
      {success && (
        <p style={{ color: "lightgreen", marginTop: 20 }}>
          <strong>Success:</strong> {success}
        </p>
      )}
    </div>
  );
}
