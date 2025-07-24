import React from 'react';
import './ViewData.css';

function ViewData({ posts }) {
  return (
    <div className="view-data">
      <h2>Post Information</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Post Type</th>
            <th>Description</th>
            <th>Image</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={index}>
              <td>{post.title}</td>
              <td>{post.postType}</td>
              <td>{post.description}</td>
              <td>
                <img src={post.image} alt={post.title} className="table-image" />
              </td>
              <td>{post.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewData;
