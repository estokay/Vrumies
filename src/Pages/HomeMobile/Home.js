import React from "react";
import "./Home.css";

import HomeHeader from "./HomeHeader";
import HomePosts from "./HomePosts";
import HomeSidebar from "./HomeSidebar";
import ExploreCategories from "./ExploreCategories";

export default function Home() {
  return (
    <div className="home-page">
      {/*<ExploreCategories />*/}
      <HomeHeader />
      <div className="home-content">
        <HomeSidebar />
      </div>
    </div>
  );
}