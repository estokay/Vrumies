import { Link } from "react-router-dom";
import "./SearchDropDown.css"

const postRouteMap = {
  video: 'videopost',
  blog: 'blogpost',
  vehicle: 'vehiclepost',
  event: 'eventpost',
  market: 'marketpost',
  directory: 'directorypost',
  request: 'requestpost',
  loads: 'loadpost',
  trucks: 'truckpost',
};

function SearchDropDown({ results }) {

  if (!results.length) return null;

  return (
    <div className="search-dropdown">
      {results.map(post => {
        const postType = post.type;
        const postId = post.id;
        const linkTo = `/${postRouteMap[postType] || `${postType}post`}/${postId}`;

        return (
          <Link
            key={postId}
            to={linkTo}
            className="search-item"
          >
            <div className="search-text">
              <div className="search-title">{post.title}</div>
              <div className="search-description">
                {post.description?.slice(0, 60)}
              </div>
            </div>

            <div className="search-type">{postType}</div>
          </Link>
        );
      })}
    </div>
  );
}

export default SearchDropDown;