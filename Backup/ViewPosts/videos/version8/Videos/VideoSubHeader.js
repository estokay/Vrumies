import React, { useEffect, useState } from "react";
import "./VideoSubHeader.css";
import { Share2, Bookmark, Flag } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Components/firebase";

function VideoSubHeader({ postId }) {
  const [postTitle, setPostTitle] = useState("Loading...");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Fetch post
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) return;

        const postData = postSnap.data();
        setPostTitle(postData.title || "Untitled Video");
      } catch (err) {
        console.error("Error fetching post info:", err);
      }
    };

    fetchPostData();
  }, [postId]);

  return (
    <div className="video-sub-header">
      {/* Post Title */}
      <div className="video-post-title">{postTitle}</div>

      {/* Right: Actions */}
      <div className="video-actions">
        <button className="video-action-btn">
          <Share2 size={16} color="#00ff00" />
          SHARE
        </button>
        <button className="video-action-btn">
          <Bookmark size={16} color="#00ff00" />
          BOOKMARK
        </button>
        <button className="video-action-btn">
          <Flag size={16} color="#00ff00" />
          REPORT
        </button>
      </div>
    </div>
  );
}

export default VideoSubHeader;
