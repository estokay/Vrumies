import React, { useState } from "react";
import { db } from "../../Components/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import "./DeletePost.css";

export default function DeletePost() {
  const [postId, setPostId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleDelete = async () => {
    if (!postId.trim()) {
      setError("Please enter a Post ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const postRef = doc(db, "Posts", postId);
      const snap = await getDoc(postRef);

      if (!snap.exists()) {
        setError("No post found with that ID.");
        return;
      }

      await deleteDoc(postRef);
      setSuccess(`Post ${postId} deleted successfully.`);
    } catch (err) {
      console.error(err);
      setError("Failed to delete post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-post-container">
      <h2>Delete Post by ID</h2>

      <input
        type="text"
        placeholder="Enter Post ID"
        value={postId}
        onChange={(e) => setPostId(e.target.value)}
        className="delete-post-input"
      />

      <button
        onClick={handleDelete}
        disabled={loading}
        className="delete-post-button"
      >
        {loading ? "Deleting..." : "Delete Post"}
      </button>

      {error && <p className="delete-post-error">{error}</p>}
      {success && <p className="delete-post-success">{success}</p>}
    </div>
  );
}
