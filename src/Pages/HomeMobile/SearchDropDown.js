import React from "react";
import { Link } from "react-router-dom";
import "./SearchDropDown.css";

const postRouteMap = {
  video:'videopost', blog:'blogpost', vehicle:'vehiclepost', event:'eventpost',
  market:'marketpost', directory:'directorypost', request:'requestpost',
  loads:'loadpost', trucks:'truckpost'
};

export default function SearchDropDown({ results }) {
  if (!results.length) return null;
  return (
    <div className="search-dropdown">
      {results.map(post => (
        <Link key={post.id} to={`/${postRouteMap[post.type]||post.type+"post"}/${post.id}`} className="search-item">
          <div className="search-text">
            <div className="search-title">{post.title}</div>
            <div className="search-description">{post.description?.slice(0,60)}</div>
          </div>
          <div className="search-type">{post.type}</div>
        </Link>
      ))}
    </div>
  );
}