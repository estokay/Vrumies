import React from 'react';
import { Link } from 'react-router-dom'; // ✅ import Link for routing
import './BlogPostGrid.css';
import BlogPostLayout from './BlogPostLayout';

function BlogPostGrid({ posts }) {
  if (!posts || posts.length === 0) {
    return <p>No Data Found.</p>;
  }

  const displayedPosts = posts.slice(0, 16);

  return (
    <div className="blog-post-grid">
      {displayedPosts.map((post, index) => (
        <div key={post.id || index}>
          <Link
            to={`/blogpost/${post.id}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
              height: '100%',
              width: '100%',
            }}
          >
            <BlogPostLayout {...post} />
          </Link>
        </div>
      ))}
    </div>
  );
}

export default BlogPostGrid;
