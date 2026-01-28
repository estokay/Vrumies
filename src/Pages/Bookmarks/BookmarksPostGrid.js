import { Link } from 'react-router-dom';
import './BookmarksPostGrid.css';
import BookmarksPostLayout from './BookmarksPostLayout';

function BookmarksPostGrid({ posts = [] }) {
  const displayedPosts = posts.slice(0, 16);

  return (
    <div className="bookmarks-post-grid">
      {displayedPosts.length > 0 ? (
        displayedPosts.map((post, index) => (
          <div key={post.id || index}>
            <Link
              to={`/bookmarkpost/${post.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                height: '100%',
                width: '100%',
              }}
            >
              <BookmarksPostLayout {...post} />
            </Link>
          </div>
        ))
      ) : (
        <p style={{ color: 'white', textAlign: 'center', width: '100%' }}>
          No Bookmarked Posts Found.
        </p>
      )}
    </div>
  );
}

export default BookmarksPostGrid;
