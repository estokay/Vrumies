// MainPostGrid.js
import React from 'react';
import { Link } from 'react-router-dom';
import VideosPostLayout from '../Pages/MainCategories/Videos/VideosPostLayout';
import BlogPostLayout from '../Pages/MainCategories/Blogs/BlogPostLayout';
import VehiclePostLayout from '../Pages/MainCategories/Vehicles/VehiclePostLayout';
import EventsPostLayout from '../Pages/MainCategories/Events/EventsPostLayout';
import MarketPostLayout from '../Pages/MainCategories/Market/MarketPostLayout';
import DirectoryPostLayout from '../Pages/MainCategories/Directory/DirectoryPostLayout';
import RequestPostLayout from '../Pages/MainCategories/Requests/RequestPostLayout';
import LoadPostLayout from '../Pages/MainCategories/Loads/LoadPostLayout';
import TruckPostLayout from '../Pages/MainCategories/Trucks/TruckPostLayout';

import './MainPostGrid.css';

const postTypeMap = {
  video: VideosPostLayout,
  blog: BlogPostLayout,
  vehicle: VehiclePostLayout,
  event: EventsPostLayout,
  market: MarketPostLayout,
  directory: DirectoryPostLayout,
  request: RequestPostLayout,
  loads: LoadPostLayout,
  trucks: TruckPostLayout
};

function MainPostGrid({ posts }) {
  const displayedPosts = posts?.slice(0, 16) || [];

  return (
    <div className="main-post-grid">
      {displayedPosts.length === 0 ? (
        <div className="no-post-block">
          <p>No posts found.</p>
        </div>
      ) : (
        displayedPosts.map((post, index) => {
          const LayoutComponent = postTypeMap[post.type] || EventsPostLayout;

          return (
            <div key={post.id || index}>
              <Link
                to={post.type === 'video' ? `/videopost/${post.id}` : '#'}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  width: '100%',
                  height: '100%',
                }}
              >
                <LayoutComponent {...post} />
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MainPostGrid;
