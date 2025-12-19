import '../../App.css';
import '../MyProfilePhotos/Photos.css';

import ViewProfileSidePanel from '../ViewProfile/ViewProfileSidePanel';
import ViewPhotosCategories from "./ViewPhotosCategories";
import ViewPhotosBody from "./ViewPhotosBody";
import { useParams, Link } from "react-router-dom";

const MyPhotos = () => {
  const { userId } = useParams();

  return (
    <div className="content-page">
      <div className="my-profile">
        {/* Left side panel */}
        <div className="my-profile-sidepanel">
          <ViewProfileSidePanel />
        </div>

        {/* Right side (categories + body stacked) */}
        <div className="my-profile-right">
          <div className="my-profile-section">
            {/* Top sub-navigation above categories */}
            <div className="profile-top-nav">
              <Link to={`/viewprofile/${userId}`} className="myreviews-top-nav-item">Posts</Link>
              <span className="top-nav-item selected">Photos</span>
              <Link to={`/viewreviews/${userId}`} className="myreviews-top-nav-item">Reviews</Link>
            </div>

            {/* Categories grid */}
            <ViewPhotosCategories />
          </div>

          <div className="my-profile-section">
            <ViewPhotosBody />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPhotos;
