import React from "react";
import "./MyProfileBody.css";
import PostGrid from "../MainCategories/Videos/PostGrid";
import BlogPostGrid from "../MainCategories/Blogs/BlogPostGrid";
import ForumPostGrid from "../MainCategories/Forums/ForumPostGrid";
import VehiclePostGrid from "../MainCategories/Vehicles/VehiclePostGrid";
import MarketPostGrid from "../MainCategories/Market/MarketPostGrid";
import EventsPostGrid from "../MainCategories/Events/EventsPostGrid";
import DirectoryPostGrid from "../MainCategories/Directory/DirectoryPostGrid";

// import all post sources
import { examplePosts as videoPosts } from "../../Data/VideoDummyData";
import { examplePosts as requestPosts } from "../../Data/RequestDummyData";
import { examplePosts as marketPosts } from "../../Data/MarketDummyData";
import { examplePosts as eventPosts } from "../../Data/EventsDummyData";
import { examplePosts as directoryPosts } from "../../Data/DirectoryDummyData";

const categoryLabels = {
  content: "My Content Posts",
  request: "My Request Posts",
  market: "My Market Posts",
  event: "My Event Posts",
  directory: "My Directory Posts",
};

export default function MyProfileBody({ selectedCategory }) {
  let postsToShow = [];

  switch (selectedCategory) {
    case "content":
      postsToShow = videoPosts;
      break;
    case "request":
      postsToShow = requestPosts;
      break;
    case "market":
      postsToShow = marketPosts;
      break;
    case "event":
      postsToShow = eventPosts;
      break;
    case "directory":
      postsToShow = directoryPosts;
      break;
    default:
      postsToShow = [];
  }

  postsToShow = postsToShow.slice(0, 9);

  return (
    <div className="my-profile-body">
      {/* Dynamic title */}
      <h2 className="profile-body-title">{categoryLabels[selectedCategory]}</h2>

      <PostGrid posts={postsToShow} />
    </div>
  );
}
