import React from "react";
import "./HomeHeader.css";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

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
            placeholder="Search products, services, vehicles..."
          />
          <button>
            <FaSearch />
          </button>
        </div>

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