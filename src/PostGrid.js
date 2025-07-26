import React from 'react';
import './PostGrid.css';
import VideoPost from './VideoPost';

function PostGrid({ post }) {
  if (!post) {
    return <p>No post data provided.</p>;
  }

  const posts = Array.from({ length: 16 }, (_, i) => ({
    ...post,
    id: i,
    title: `${post.title} #${i + 1}`,
    views: (post.views || 0) + i * 10,
    likes: (post.likes || 0) + i,
    comments: (post.comments || 0) + i,
  }));

  return (
    <div className="post-grid">
      {posts.map(p => (
        <VideoPost key={p.id} {...p} />
      ))}
    </div>
  );
}

export default PostGrid;
