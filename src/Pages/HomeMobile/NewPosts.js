import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import { collection, getDocs } from "firebase/firestore";
import PostRenderer from "../../Components/PostLayouts/PostRenderer";
import "./NewPosts.css";

function NewPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCity, setUserCity] = useState("");
  const [userState, setUserState] = useState("");

  const allowedTypes = [
    "video","blog","event","request","market","directory","trucks","vehicle","loads"
  ];

  // Mobile-first geolocation
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        setUserCity(data.address.city || data.address.town || data.address.village || "");
        setUserState(data.address.state || "");
      } catch (err) { console.error(err); }
    });
  }, []);

  useEffect(() => {
    const fetchNewPosts = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "Posts"));
        const allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => allowedTypes.includes(p.type));

        let filtered = [];
        if (userCity) filtered = allPosts.filter(p => p.location?.toLowerCase().includes(userCity.toLowerCase()));
        if (!filtered.length && userState) filtered = allPosts.filter(p => p.location?.toLowerCase().includes(userState.toLowerCase()));
        if (!filtered.length) filtered = allPosts;

        filtered.sort((a,b)=> (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setPosts(filtered.slice(0,20));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchNewPosts();
  }, [userCity, userState]);

  return (
    <div className="newposts-panel">
      <div className="newposts-header">
        <h3>✨ Latest posts on Vrumies</h3>
        <span className="newposts-subtitle">Most recent posts near you</span>
      </div>
      <div className="newposts-scroll">
        {loading && <p className="newposts-loading">Loading posts...</p>}
        {!loading && !posts.length && <p className="newposts-empty">No new posts available.</p>}
        {posts.map(post=>(
          <div key={post.id} className="newposts-post-wrapper">
            <PostRenderer post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewPosts;