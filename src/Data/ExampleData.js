import React from 'react';
import ViewData from '../Testing/ViewData'; // This is the correct import

const posts = [
  {
    title: "Future of Jumpstarters",
    postType: "Video",
    description: "Preview of the next-gen jumpstarter tech.",
    image: process.env.PUBLIC_URL + "/jumpstart.jpg",
    username: "GryanDum"
  },
  {
    title: "Market Update",
    postType: "Blog",
    description: "Automotive trends in 2025.",
    image: process.env.PUBLIC_URL + "/market.jpg",
    username: "AutoTrader"
  }
];

function ExampleData() {
  return (
    <div className="example-data">
      <ViewData posts={posts} />
    </div>
  );
}

export default ExampleData;
