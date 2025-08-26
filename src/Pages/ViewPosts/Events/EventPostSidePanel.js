import React from 'react';
import './EventPostSidePanel.css';
import EventPostLayout from '../../MainCategories/Events/EventsPostLayout'; // ✅ Import the styled card

// Example data — replace with real props later
const examplePosts = [
  {
    id: 1,
    title: "How to Edit Events Like a Pro",
    thumbnail: "https://via.placeholder.com/300x200?text=Thumbnail+1",
    creator: "EditorJoe",
    profilePic: "https://via.placeholder.com/36",
    date: "2025-08-01",
    duration: "10:45",
    points: 87,
    likes: 120,
    comments: 14,
  },
  {
    id: 2,
    title: "Top 5 Animation Tools",
    thumbnail: "https://via.placeholder.com/300x200?text=Thumbnail+2",
    creator: "AnimatorSue",
    profilePic: "https://via.placeholder.com/36",
    date: "2025-07-28",
    duration: "08:22",
    points: 92,
    likes: 140,
    comments: 18,
  },
  {
    id: 3,
    title: "Creative Process Behind the Scenes",
    thumbnail: "https://via.placeholder.com/300x200?text=Thumbnail+3",
    creator: "BehindScenes",
    profilePic: "https://via.placeholder.com/36",
    date: "2025-07-25",
    duration: "12:12",
    points: 75,
    likes: 98,
    comments: 10,
  },
];

const EventPostSidePanel = () => {
  return (
    <div className="event-post-side-panel">
      <div className="panel-title">Related Events</div>
      <div className="panel-posts">
        {examplePosts.map((post) => (
          <EventPostLayout key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default EventPostSidePanel;
