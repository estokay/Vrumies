import React from "react";
import "./MyProfileBody.css";
import PostGrid from "../MainCategories/Videos/PostGrid"; // adjust path if needed
import { examplePosts } from "../../Data/VideoDummyData"; // or your posts source

export default function MyProfileBody() {
  // Take first 9 posts for the 3x3 grid
  const postsToShow = examplePosts.slice(0, 9);

  return (
    <div className="my-profile-body">
      <PostGrid posts={postsToShow} />
    </div>
  );
}
