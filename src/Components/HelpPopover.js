import { useState, useRef, useEffect } from "react";
import "./HelpPopover.css";

const HelpPopover = ({ text }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      className="help-wrapper"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
    >
      <img
        src={process.env.PUBLIC_URL + '/question.png'}
        alt="Help"
        className="help-icon"
        onError={() => console.log("❌ image failed to load")}
        onLoad={() => console.log("✅ image loaded")}
       />

      {open && (
        <div className="help-popover">
          <button className="close-help-btn" onClick={() => setOpen(false)}>
            ✕
          </button>
          {text}
        </div>
      )}
    </div>
  );
};

export default HelpPopover;
