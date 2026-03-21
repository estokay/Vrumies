import React from "react";
import MobileNavbarTop from "./MobileNavbarTop";
import MobileNavbarBottom from "./MobileNavbarBottom";
import MobileNavbarTopProfile from "./MobileNavbarTopProfile";

// map string → component
const TOP_NAV_MAP = {
  profile: MobileNavbarTopProfile,
};

const MobileLayout = ({ children, topNav }) => {
  // pick component based on string
  const TopNavComponent = TOP_NAV_MAP[topNav] || MobileNavbarTop;

  return (
    <>
      {/* Top navbar */}
      <TopNavComponent />

      {/* Main content */}
      <main style={{ paddingTop: "50px", paddingBottom: "60px" }}>
        {children}
      </main>

      {/* Bottom navbar */}
      <MobileNavbarBottom />
    </>
  );
};

export default MobileLayout;