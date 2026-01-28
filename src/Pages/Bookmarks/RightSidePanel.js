import BookmarksPostLayout from './BookmarksPostLayout';
import '../../Components/Css/RightSidePanel.css';

function RightSidePanel({ posts = [] }) {
  const sortedPosts = [...posts].sort((a, b) => (b.tokens || 0) - (a.tokens || 0));

  return (
    <div className="events-main-right-side-panel scrollable-panel">
      <h3 className="events-main-panel-title">Promoted Bookmarks</h3>
      <div className="events-main-panel-posts">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post, index) => (
            <BookmarksPostLayout key={post.id || index} {...post} compact />
          ))
        ) : (
          <p style={{ color: '#ffffff', textAlign: 'center' }}>
            No promoted bookmarks yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default RightSidePanel;
