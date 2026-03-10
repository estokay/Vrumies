import React from "react";
import BlogPostLayout from "../../Pages/MainCategories/Blogs/BlogPostLayout";
import DirectoryPostLayout from "../../Pages/MainCategories/Directory/DirectoryPostLayout";
import EventsPostLayout from "../../Pages/MainCategories/Events/EventsPostLayout";
import MarketPostLayout from "../../Pages/MainCategories/Market/MarketPostLayout";
import RequestPostLayout from "../../Pages/MainCategories/Requests/RequestPostLayout";
import TruckPostLayout from "../../Pages/MainCategories/Trucks/TruckPostLayout";
import VehiclePostLayout from "../../Pages/MainCategories/Vehicles/VehiclePostLayout";
import LoadPostLayout from "../../Pages/MainCategories/Loads/LoadPostLayout";
import VideosPostLayout from "../../Pages/MainCategories/Videos/VideosPostLayout";

const PostLayouts = {
  video: VideosPostLayout,
  blog: BlogPostLayout,
  event: EventsPostLayout,
  request: RequestPostLayout,
  market: MarketPostLayout,
  directory: DirectoryPostLayout,
  trucks: TruckPostLayout,
  vehicle: VehiclePostLayout,
  loads: LoadPostLayout,
};

function PostRenderer({ post }) {

  if (!post || !post.type) return null;

  const LayoutComponent = PostLayouts[post.type];

  if (!LayoutComponent) return null;

  return <LayoutComponent {...post} />;

}

export default PostRenderer;