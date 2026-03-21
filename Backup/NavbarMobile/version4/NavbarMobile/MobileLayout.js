import React from "react";
import MobileNavbarTop from "./MobileNavbarTop";
import MobileNavbarBottom from "./MobileNavbarBottom";

const MobileLayout = ({ children }) => (
  <>
    {/* Top navbar */}
    <MobileNavbarTop />

    {/* Main content with padding so it doesn't go under the fixed navbars */}
    <main style={{ paddingTop: "50px", paddingBottom: "60px" }}>
      {children}
    </main>

    {/* Bottom navbar */}
    <MobileNavbarBottom />
  </>
);

export default MobileLayout;