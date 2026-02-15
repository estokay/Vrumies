import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import "./PostDropMenu.css";

export default function PostDropMenu({ onDelete, canDelete = false, canBlock = true, onBlock }) {
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
        <div className="post-options-dropdown">

          {canDelete && (
            <div className="delete-option" onClick={onDelete}>
              Delete Post
            </div>
          )}

          {canBlock && (
            <div className="block-option" onClick={onBlock}>
              Block User
            </div>
          )}

        </div>
      )}
    </div>
  );
}