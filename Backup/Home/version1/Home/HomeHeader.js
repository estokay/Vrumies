import React from "react";
import "./HomeHeader.css";
import { FaSearch, FaArrowRight } from "react-icons/fa";

const HomeHeader = () => {
  return (
    <div className="hh-home-header">

      <video
        className="hh-header-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={`${process.env.PUBLIC_URL}/videos/automotive-bg.mp4`} type="video/mp4" />
      </video>

      <div className="hh-header-overlay" />

      <div className="hh-header-content">

        <h1 className="hh-header-title">
          Everything automotive in one marketplace
        </h1>

        <div className="hh-header-search">
          <input
            type="text"
            placeholder="Search for any service..."
          />
          <button>
            <FaSearch />
          </button>
        </div>

        <div className="hh-header-categories">

          <button>
            Engine Repair <FaArrowRight />
          </button>

          <button>
            Transmission <FaArrowRight />
          </button>

          <button>
            Diagnostics <FaArrowRight />
          </button>

          <button>
            Detailing <FaArrowRight />
          </button>

          <button>
            Performance Mods <FaArrowRight />
          </button>

        </div>

      </div>

    </div>
  );
};

export default HomeHeader;