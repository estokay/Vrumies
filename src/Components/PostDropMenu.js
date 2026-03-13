import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import "./PostDropMenu.css";

export default function PostDropMenu({ onDelete, canDelete = false, canReport = true, onReport, reported = false, canBlock = true, onBlock, canAffiliate = false, onAffiliate }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="post-options-menu" ref={menuRef}>
      <FaEllipsisH
        className="post-options-btn"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="post-drop-menu-dropdown">

          {canAffiliate && (
            <div className="pdm-affiliate-option" onClick={onAffiliate}>
              Affiliate Link
            </div>
          )}

          {canDelete && (
            <div className="pdm-delete-option" onClick={onDelete}>
              Delete Post
            </div>
          )}

          {canReport && (
            <div className={`pdm-report-option ${reported ? "reported" : ""}`} onClick={onReport}>
              {reported ? "⚠ Remove Report" : "Report Post"}
            </div>
          )}

          {canBlock && (
            <div className="pdm-block-option" onClick={onBlock}>
              Block User
            </div>
          )}

        </div>
      )}
    </div>
  );
}