import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import PostRenderer from "../../Components/PostLayouts/PostRenderer";
import "./MoreFromSellers.css";

function MoreFromSellers() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const allowedTypes = ["market","directory","trucks"];

  useEffect(() => {
    const fetchPostsFromCompletedSellers = async () => {
      setLoading(true);
      try {
        // Get completed orders
        const ordersSnapshot = await getDocs(
          query(collection(db,"Orders"), where("orderStatus","==","completed"))
        );
        const sellerIdsSet = new Set();
        ordersSnapshot.forEach(order => { if(order.data().sellerId) sellerIdsSet.add(order.data().sellerId); });
        const sellerIds = Array.from(sellerIdsSet);
        if(!sellerIds.length){ setLoading(false); return; }

        // Get posts from sellers
        const postsSnapshot = await getDocs(collection(db,"Posts"));
        const results = postsSnapshot.docs
          .map(doc=>({ id: doc.id, ...doc.data() }))
          .filter(p=>allowedTypes.includes(p.type) && sellerIds.includes(p.userId));

        results.sort((a,b)=> (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setPosts(results.slice(0,20));
      } catch(err){ console.error(err); }
      finally{ setLoading(false); }
    };
    fetchPostsFromCompletedSellers();
  }, []);

  return (
    <div className="mfs-panel">
      <div className="mfs-header">
        <h3>🛒 More From Your Sellers</h3>
        <span className="mfs-subtitle">Posts from sellers you’ve completed orders with</span>
      </div>
      <div className="mfs-scroll">
        {loading && <p className="mfs-loading">Loading posts...</p>}
        {!loading && !posts.length && <p className="mfs-empty">No posts from your sellers yet.</p>}
        {posts.map(post=>(
          <div key={post.id} className="mfs-post-wrapper">
            <PostRenderer post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoreFromSellers;