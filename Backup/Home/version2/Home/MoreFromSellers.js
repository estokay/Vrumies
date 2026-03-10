import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import BookmarksPostLayout from "../Bookmarks/BookmarksPostLayout";
import "./MoreFromSellers.css";

function MoreFromSellers() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const allowedTypes = ["market", "directory", "trucks"];

  useEffect(() => {

    const fetchPostsFromCompletedSellers = async () => {

      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setLoading(false);
        return;
      }

      const currentUserId = currentUser.uid;

      try {
        // 1️⃣ Get completed orders for current user
        const ordersRef = collection(db, "Orders");
        const completedOrdersQuery = query(
          ordersRef,
          where("buyerInfo.buyerId", "==", currentUserId),
          where("orderStatus", "==", "completed")
        );

        const ordersSnapshot = await getDocs(completedOrdersQuery);

        const sellerIdsSet = new Set();

        ordersSnapshot.forEach((orderDoc) => {
          const orderData = orderDoc.data();
          if (orderData.sellerId) {
            sellerIdsSet.add(orderData.sellerId);
          }
        });

        const sellerIds = Array.from(sellerIdsSet);

        if (sellerIds.length === 0) {
          setLoading(false);
          return;
        }

        // 2️⃣ Get posts from these sellers
        const postsRef = collection(db, "Posts");
        const postsSnapshot = await getDocs(postsRef);

        const results = [];

        postsSnapshot.forEach((postDoc) => {
          const data = postDoc.data();

          if (
            allowedTypes.includes(data.type) &&
            sellerIds.includes(data.userId)
          ) {
            results.push({
              id: postDoc.id,
              ...data
            });
          }
        });

        // 3️⃣ Sort newest first
        results.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt.seconds - a.createdAt.seconds;
        });

        setPosts(results);

      } catch (error) {
        console.error("Error loading posts from completed sellers:", error);
      }

      setLoading(false);

    };

    fetchPostsFromCompletedSellers();

  }, []);

  return (
    <div className="mfs-panel">

      <div className="mfs-header">
        <h3>🛒 More From Your Sellers</h3>
        <span className="mfs-subtitle">
          Posts from sellers you’ve completed orders with
        </span>
      </div>

      <div className="mfs-scroll">

        {loading && (
          <p className="mfs-loading">Loading posts...</p>
        )}

        {!loading && posts.length === 0 && (
          <p className="mfs-empty">No posts from your sellers yet.</p>
        )}

        {posts.map((post) => (
          <div key={post.id} className="mfs-post-wrapper">
            <BookmarksPostLayout
              id={post.id}
              images={post.images}
              title={post.title}
              createdAt={post.createdAt}
              userId={post.userId}
            />
          </div>
        ))}

      </div>

    </div>
  );
}

export default MoreFromSellers;