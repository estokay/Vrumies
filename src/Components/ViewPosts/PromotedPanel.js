import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./PromotedPanel.css";

// Layout imports
import BlogPostLayout from "../../Pages/MainCategories/Blogs/BlogPostLayout";
import DirectoryPostLayout from "../../Pages/MainCategories/Directory/DirectoryPostLayout";
import EventsPostLayout from "../../Pages/MainCategories/Events/EventsPostLayout";
import LoadPostLayout from "../../Pages/MainCategories/Loads/LoadPostLayout";
import TruckPostLayout from "../../Pages/MainCategories/Trucks/TruckPostLayout";
import MarketPostLayout from "../../Pages/MainCategories/Market/MarketPostLayout";
import RequestPostLayout from "../../Pages/MainCategories/Requests/RequestPostLayout";
import VehiclePostLayout from "../../Pages/MainCategories/Vehicles/VehiclePostLayout";
import VideosPostLayout from "../../Pages/MainCategories/Videos/VideosPostLayout";
import OfferPostLayout from "../../Custom Offers/OfferPostLayout";

// Category Config Map
const CATEGORY_MAP = {
  blog: {
    type: "blog",
    title: "Promoted Blogs",
    Layout: BlogPostLayout,
  },
  directory: {
    type: "directory",
    title: "Promoted Directory",
    Layout: DirectoryPostLayout,
  },
  event: {
    type: "event",
    title: "Promoted Events",
    Layout: EventsPostLayout,
  },
  loads: {
    type: "loads",
    title: "Promoted Loads",
    Layout: LoadPostLayout,
  },
  trucks: {
    type: "trucks",
    title: "Promoted Trucks",
    Layout: TruckPostLayout,
  },
  market: {
    type: "market",
    title: "Promoted Market",
    Layout: MarketPostLayout,
  },
  request: {
    type: "request",
    title: "Promoted Requests",
    Layout: RequestPostLayout,
  },
  vehicle: {
    type: "vehicle",
    title: "Promoted Vehicles",
    Layout: VehiclePostLayout,
  },
  video: {
    type: "video",
    title: "Promoted Videos",
    Layout: VideosPostLayout,
  },
  offer: {
    type: "offer",
    title: "Promoted Offers",
    Layout: OfferPostLayout,
  },
};

export default function PromotedPanel({ category }) {
  const config = CATEGORY_MAP[category];
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const title = config?.title || "Promoted Posts";
  const Layout = config?.Layout;

  useEffect(() => {
    if (!config) return;

    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "Posts");
        const q = query(postsRef, where("type", "==", config.type));
        const snap = await getDocs(q);

        const loaded = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(loaded);
      } catch (err) {
        console.error("PromotedPanel load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  // Filter + sort promoted posts
  const filteredPosts = posts
    .filter((p) => typeof p.tokens === "number")
    .sort((a, b) => b.tokens - a.tokens);

  return (
    <div className="view-main-right-side-panel scrollable-panel">
      <h3 className="view-main-panel-title">{title}</h3>

      <div className="view-main-panel-posts">
        {/* Invalid category */}
        {!config && <p className="no-promoted">Invalid promoted category.</p>}

        {/* Loading state */}
        {loading && <p className="no-promoted">Loading promoted posts...</p>}

        {/* No promoted posts */}
        {!loading && config && filteredPosts.length === 0 && (
          <p className="no-promoted">No promoted posts found.</p>
        )}

        {/* Render posts */}
        {filteredPosts.map((post) =>
          Layout ? <Layout key={post.id} {...post} compact /> : null
        )}
      </div>
    </div>
  );
}