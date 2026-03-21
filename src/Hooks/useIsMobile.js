import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isMobileOnly } from 'react-device-detect';

export function useIsMobile() {
  useEffect(() => {
    // This is where the magic happens
    console.log(isMobileOnly ? "You are on a phone" : "You are on a tablet or desktop");
  }, []);
  // Get the user's view mode
  const viewMode = localStorage.getItem("viewMode") || "auto";
  const location = useLocation();

  // Decide if mobile layout should be used
  if (viewMode === "mobile") return true;
  if (viewMode === "desktop") return false;

  if (isMobileOnly) return true;

  // "auto" mode: fallback to URL or window width check
  // Example using URL as you had
  return location.pathname.includes('mobile');
}