import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import { collection, getDocs } from "firebase/firestore";
import BookmarksPostLayout from "../Bookmarks/BookmarksPostLayout";
import "./NewPosts.css";

function NewPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCity, setUserCity] = useState("");
  const [userState, setUserState] = useState("");

  const allowedTypes = [
    "video",
    "blog",
    "event",
    "request",
    "market",
    "directory",
    "trucks",
    "vehicle",
    "loads",
  ];

  // Get user location from browser
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Use a free geolocation API (like OpenStreetMap / Nominatim)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || "";
          const state = data.address.state || "";
          setUserCity(city);
          setUserState(state);
        } catch (err) {
          console.error("Error fetching user location:", err);
        }
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, []);

  useEffect(() => {
    const fetchNewPosts = async () => {
      setLoading(true);
      try {
        const postsRef = collection(db, "Posts");
        const snapshot = await getDocs(postsRef);
        const allPosts = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (allowedTypes.includes(data.type)) {
            allPosts.push({
              id: docSnap.id,
              createdAt: data.createdAt,
              location: data.location || "",
              ...data,
            });
          }
        });

        // Filter by location: city > state > all
        let filteredPosts = [];

        if (userCity) {
          filteredPosts = allPosts.filter((p) =>
            p.location.toLowerCase().includes(userCity.toLowerCase())
          );
        }

        if (filteredPosts.length === 0 && userState) {
          filteredPosts = allPosts.filter((p) =>
            p.location.toLowerCase().includes(userState.toLowerCase())
          );
        }

        if (filteredPosts.length === 0) {
          filteredPosts = allPosts;
        }

        // Sort by newest first
        filteredPosts.sort((a, b) => {
          const aTime = a.createdAt?.seconds ? a.createdAt.seconds : 0;
          const bTime = b.createdAt?.seconds ? b.createdAt.seconds : 0;
          return bTime - aTime;
        });

        // Limit top 20
        setPosts(filteredPosts.slice(0, 20));
      } catch (err) {
        console.error("Error fetching new posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewPosts();
  }, [userCity, userState]);

  return (
    <div className="newposts-panel">
      <div className="newposts-header">
        <h3>✨ Latest posts on Vrumies.</h3>
        <span className="newposts-subtitle">
          Most recent posts near you
        </span>
      </div>

      <div className="newposts-scroll">
        {loading && <p className="newposts-loading">Loading posts...</p>}

        {!loading && posts.length === 0 && (
          <p className="newposts-empty">No new posts available.</p>
        )}

        {posts.map((post) => (
          <div key={post.id} className="newposts-post-wrapper">
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

export default NewPosts;