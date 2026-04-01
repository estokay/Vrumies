import React, { useEffect, useRef, useState } from "react";
import "./PostLocationMultiSelect.css";
import { FaChevronDown } from "react-icons/fa";
import { useIsMobile } from "../../Hooks/useIsMobile";

const PostLocationMultiSelect = ({
  options = [],
  selected = [],
  onChange
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const isMobile = useIsMobile();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="plms-container" ref={ref}>

      {/* Input */}
      <div
        className={`${isMobile ? "plms-input" : "plms-input-desktop"} ${open ? "open" : ""}`}
        onClick={() => setOpen(prev => !prev)}
      >
        <div className="plms-input-inner">
          {selected.length === 0 ? (
            <span className={isMobile ? "plms-placeholder" : "plms-placeholder-desktop"}>Show All</span>
          ) : (
            <span className="plms-values">
              {selected.slice(0, 2).join(", ")}
              {selected.length > 2 && ` (+${selected.length - 2})`}
            </span>
          )}

          <FaChevronDown className={`plms-arrow ${open ? "rotate" : ""}`} />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="plms-dropdown">

          {/* Search */}
          <input
            type="text"
            placeholder="Search locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="plms-search"
          />

          {/* Options */}
          <div className="plms-options">

            {/* Show All */}
            <div
              className={`plms-option ${selected.length === 0 ? "active" : ""}`}
              onClick={() => {
                onChange([]);
                setSearch("");
              }}
            >
              Show All
            </div>

            {filteredOptions.map(opt => (
              <div
                key={opt}
                className={`plms-option ${selected.includes(opt) ? "active" : ""}`}
                onClick={() => toggleOption(opt)}
              >
                {opt}
              </div>
            ))}

            {filteredOptions.length === 0 && (
              <div className="plms-empty">No locations found</div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default PostLocationMultiSelect;