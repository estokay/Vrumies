import React, { useState } from "react";
import "./HomeHeader.css";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const HomeHeader = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div 
      className="hh-home-header"
      style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/HeaderImages/HomeBackground.jpg)`
        }}
    >
      <video
        className={`hh-header-video ${loaded ? "loaded" : ""}`}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setLoaded(true)}
      >
        <source src="https://res.cloudinary.com/dmjvngk3o/video/upload/v1773078049/automotive-bg_hbuofy.mp4" type="video/mp4" />
      </video>

      <div className="hh-header-overlay" />

      <div className="hh-header-content">

        <h1 className="hh-header-title">
          Everything automotive in one marketplace
        </h1>

        
        <SearchBar />
        

        <div className="hh-header-categories">

          <Link to="/market">
            <button>
              Market <FaArrowRight />
            </button>
          </Link>

          <Link to="/directory">
            <button>
              Directory <FaArrowRight />
            </button>
          </Link>

          <Link to="/request">
            <button>
              Requests <FaArrowRight />
            </button>
          </Link>

          <Link to="/vehicles">
            <button>
              Vehicles <FaArrowRight />
            </button>
          </Link>

          <Link to="/trucks">
            <button>
              Freight Truck Services <FaArrowRight />
            </button>
          </Link>

          <Link to="/events">
            <button>
              Events <FaArrowRight />
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
};

export default HomeHeader;