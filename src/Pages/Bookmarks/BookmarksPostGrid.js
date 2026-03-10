import './BookmarksPostGrid.css';
import PostRenderer from '../../Components/PostLayouts/PostRenderer';

function BookmarksPostGrid({ posts = [] }) {
  const displayedPosts = posts.slice(0, 16);

  return (
    <div className="bookmarks-post-grid">
      {displayedPosts.length > 0 ? (
        displayedPosts.map((post, index) => (
          <div key={post.id || index}>
              <PostRenderer post={post} />
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
