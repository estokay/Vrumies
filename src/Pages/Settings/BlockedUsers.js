import React, { useState, useEffect } from "react";
import "./BlockedUsers.css";
import BlockedUserCard from "./BlockedUserCard";
import useGetBlockedList from "../../Hooks/useGetBlockedList";
import { useAuth } from "../../AuthContext";

export default function BlockedUsers() {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  // Use your hook to get the blocked users
  const { blockedList: fetchedBlockedList, loading, error } = useGetBlockedList(userId);

  // Local state to update UI immediately
  const [blockedList, setBlockedList] = useState([]);

  // Sync local state with fetched data
  useEffect(() => {
    if (fetchedBlockedList) setBlockedList(fetchedBlockedList);
  }, [fetchedBlockedList]);

  // Handler to remove a user from the local list after unblocking
  const handleUnblocked = (unblockedUserId) => {
    setBlockedList((prev) => prev.filter((u) => u.id !== unblockedUserId));
  };

  return (
    <div className="blocked-users-container">
      <h2 className="blocked-title">Blocked Users</h2>

      {/* Conditional messages */}
      {!currentUser && <p style={{ color: "white" }}>Please log in to see blocked users.</p>}
      {currentUser && loading && <p style={{ color: "white" }}>Loading blocked users...</p>}
      {currentUser && error && <p style={{ color: "white" }}>Error loading blocked users: {error.message}</p>}
      {currentUser && !loading && !error && blockedList.length === 0 && (
        <p style={{ color: "white" }}>You have not blocked any users.</p>
      )}

      {/* Render blocked users */}
      {currentUser && !loading && !error && blockedList.length > 0 &&
        blockedList.map((user) => (
          <BlockedUserCard
            key={user.id}
            user={user}
            onUnblocked={handleUnblocked} // Pass callback to child
          />
        ))
      }
    </div>
  );
}