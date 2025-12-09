// src/YourPath/PageHeader.js
import React from "react";
import "./PageHeader.css";

const PageHeader = ({ title = "Page Title", backgroundUrl }) => {
  return (
    <div
      className="page-header-wrapper"
      style={{
        backgroundImage: `url(${backgroundUrl || "https://images.squarespace-cdn.com/content/v1/6598c8e83ff0af0197ff19f9/a05c7d5e-3711-48bb-a4c8-f3ce0f076355/JCCI-2024-Banner.jpg"})`
      }}
    >
      <h1 className="page-header-title">{title}</h1>
    </div>
  );
};

export default PageHeader;
