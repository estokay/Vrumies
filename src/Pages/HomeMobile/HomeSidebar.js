import React from "react";
import Following from "./Following";
import Popular from "./Popular";
import PromotedPosts from "./PromotedPosts";
import ViewTopRatedSellers from "./ViewTopRatedSellers";
import MoreFromSellers from "./MoreFromSellers";
import NewPosts from "./NewPosts";
import "./HomeSidebar.css";

export default function HomeSidebar() {
  return (
    <div className="home-sidebar">
      <NewPosts />
      <Popular />
      <PromotedPosts />
      <ViewTopRatedSellers />
      <Following />
      <MoreFromSellers />
    </div>
  );
}