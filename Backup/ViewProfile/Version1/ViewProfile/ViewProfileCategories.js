import React, { useState } from "react";
import "./ViewProfileCategories.css";

const categories = [
  {
    id: "content",
    label: "My Content Posts",
    icon: "https://res.cloudinary.com/dmjvngk3o/image/upload/v1755164529/Content_fbid4j.png",
    iconSelected: "https://res.cloudinary.com/dmjvngk3o/image/upload/v1755164521/Content-Selected_qoroo3.png",
  },
  {
    id: "request",
    label: "My Request Posts",
    icon: "https://res.cloudinary.com/dmjvngk3o/image/upload/v1755164530/Request_jvwi6g.png",
    iconSelected: "https://res.cloudinary.com/dmjvngk3o/image/upload/v1755164520/Request-Selected_xbnyfs.png",
  },
  {
    id: "market",
    label: "My Market Posts",
    icon: "https://res.cloudinary.com/dmjvngk3o/image/upload/v1755164523/Market-Selected_q99jmx.png",
    iconSelected: "https://res.cloudinary.com/dmjvngk3o/image/upload/v1755164523/Market-Selected_q99jmx.png",
  },
  {
    id: "event",
    label: "My Event Posts",
    icon: "https://res.cloudinary.com/dmjvngk3o/image/upload/v1755164532/Event_ytzll2.png",
    iconSelected: "https://res.cloudinary.com/dmjvngk3o/image/upload/v1755164522/Event-Selected_igrcff.png",
  },
  {
    id: "directory",
    label: "My Directory Posts",
    icon: "https://res.cloudinary.com/dmjvngk3o/image/upload/v1755164531/Directory_gchfhm.png",
    iconSelected: "https://res.cloudinary.com/dmjvngk3o/image/upload/v1755164521/Directory-Selected_ae5jpp.png",
  },
];

export default function ViewProfileCategories() {
  const [selected, setSelected] = useState("content");

  return (
    <div className="vpc-profile-categories">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className={`vpc-category-card ${selected === cat.id ? "vpc-selected" : ""}`}
          onClick={() => setSelected(cat.id)}
        >
          <img
            src={selected === cat.id ? cat.iconSelected : cat.icon}
            alt={cat.label}
          />
          <span>{cat.label}</span>
        </div>
      ))}
    </div>
  );
}
