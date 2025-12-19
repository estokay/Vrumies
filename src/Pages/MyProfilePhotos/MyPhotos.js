import '../../App.css';
import './Photos.css';

import MyProfileSidePanel from '../MyProfile/MyProfileSidePanel';
import MyPhotosCategories from "./MyPhotosCategories";
import MyPhotosBody from "./MyPhotosBody";
import { Link } from "react-router-dom";

const MyPhotos = () => {

  return (
    <div className="content-page">
      <div className="my-profile">
        {/* Left side panel */}
        <div className="my-profile-sidepanel">
          <MyProfileSidePanel />
        </div>

        {/* Right side (categories + body stacked) */}
        <div className="my-profile-right">
          <div className="my-profile-section">
            {/* Top sub-navigation above categories */}
            <div className="profile-top-nav">
              <Link to="/myprofile" className="myreviews-top-nav-item">Posts</Link>
              <span className="top-nav-item selected">Photos</span>
              <Link to="/myreviews" className="myreviews-top-nav-item">Reviews</Link>
            </div>

            {/* Categories grid */}
            <MyPhotosCategories />
          </div>

          <div className="my-profile-section">
            <MyPhotosBody />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPhotos;
