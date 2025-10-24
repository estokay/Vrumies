import React from 'react';
import { Link } from 'react-router-dom'; // ✅ import Link for routing
import './VehiclePostGrid.css';
import VehiclePostLayout from './VehiclePostLayout';

function VehiclePostGrid({ posts }) {
  if (!posts || posts.length === 0) {
    return <p>No Data Found.</p>;
  }

  const displayedPosts = posts.slice(0, 16);

  return (
    <div className="events-post-grid">
      {displayedPosts.map((post, index) => (
        <div key={post.id || index}>
          <Link
            to={`/vehiclepost/${post.id}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
              height: '100%',
              width: '100%',
            }}
          >
            <VehiclePostLayout {...post} />
          </Link>
        </div>
      ))}
    </div>
  );
}

export default VehiclePostGrid;
