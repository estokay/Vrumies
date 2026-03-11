import React, { useState } from "react";
import { db } from "../../Components/firebase";
import { collection, getDocs, writeBatch, doc, query, where } from "firebase/firestore";

const categoriesToDelete = [
  { key: "video", label: "Delete All Video Posts" },
  { key: "blog", label: "Delete All Blog Posts" },
  { key: "request", label: "Delete All Request Posts" },
  { key: "vehicle", label: "Delete All Vehicle Posts" },
  { key: "market", label: "Delete All Market Posts" },
  { key: "event", label: "Delete All Event Posts" },
  { key: "directory", label: "Delete All Directory Posts" },
  { key: "trucks", label: "Delete All Truck Posts" },
  { key: "loads", label: "Delete All Load Posts" },
  { key: "offer", label: "Delete All Offer Posts" },
];

export default function DeleteCategories() {
  const [loading, setLoading] = useState(null); // holds key of collection deleting or null
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function deleteCategory(categoryName) {

    if (!window.confirm(`Delete ALL ${categoryName} posts? This cannot be undone.`)) {
        return;
    }

    setLoading(categoryName);
    setError(null);
    setSuccess(null);

    try {
      const postsRef = collection(db, "Posts");
      const q = query(postsRef, where("type", "==", categoryName));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setSuccess(`No ${categoryName} posts found.`);
        setLoading(null);
        return;
      }

      const batch = writeBatch(db);
      snapshot.docs.forEach((docSnap) => {
        batch.delete(doc(db, "Posts", docSnap.id));
      });

      await batch.commit();
      setSuccess(`Deleted all ${categoryName} posts`);
    } catch (err) {
      console.error(err);
      setError(`Failed to delete ${categoryName}: ${err.message}`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ padding: 20, backgroundColor: "#222", color: "white" }}>
      <h2>Delete Entire Firestore Post Categories</h2>
      {categoriesToDelete.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => deleteCategory(key)}
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
