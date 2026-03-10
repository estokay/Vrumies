import React, { useEffect, useState } from "react";
import SignInOverlay from "./SignInOverlay";

const AuthOverlay = ({ isSignedIn }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isSignedIn) return;

    const handleInteraction = (e) => {
      const overlayEl = document.querySelector(".signin-overlay-card");
      if (overlayEl && overlayEl.contains(e.target)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    };

    document.addEventListener("click", handleInteraction, true);
    document.addEventListener("keydown", handleInteraction, true);

    return () => {
      document.removeEventListener("click", handleInteraction, true);
      document.removeEventListener("keydown", handleInteraction, true);
    };
  }, [isSignedIn]);

  if (isSignedIn) return null;

  return <SignInOverlay isOpen={open} />;
};

export default AuthOverlay;